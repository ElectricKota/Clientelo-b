// Sdílená logika pro příjem leadů. Používá ji Vercel Function (api/lead.js)
// i lokální dev server (scripts/lead-dev-api.mjs).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500;

const TRACKED_FIELDS = [
  'variant',
  'placement',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'calc_amount',
  'calc_monthly',
  'calc_years',
  'calc_diff',
  'landing_path',
  'referrer',
];

async function readBody(request) {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    return await request.json();
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

function clean(value, max = 200) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Trvalé uložení: privátní Vercel Blob store. Po připojení storu k projektu Vercel doplní
// BLOB_STORE_ID a OIDC token sám; mimo Vercel lze použít BLOB_READ_WRITE_TOKEN.
async function saveToBlob(lead) {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) return false;
  const { put } = await import('@vercel/blob');
  const stamp = lead.receivedAt.replace(/[:.]/g, '-');
  const pathname = `leads/${lead.receivedAt.slice(0, 10)}/${stamp}-${crypto.randomUUID().slice(0, 8)}.json`;
  await put(pathname, JSON.stringify(lead, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
  return true;
}

async function sendToEcomail(lead) {
  const { ECOMAIL_API_KEY, ECOMAIL_LIST_ID } = process.env;
  if (!ECOMAIL_API_KEY || !ECOMAIL_LIST_ID) return false;

  const res = await fetch(`https://api2.ecomailapp.cz/lists/${ECOMAIL_LIST_ID}/subscribe`, {
    method: 'POST',
    headers: { key: ECOMAIL_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscriber_data: {
        email: lead.email,
        source: lead.meta.utm_source || 'landing',
        tags: ['etf-tahak', `varianta-${lead.meta.variant || 'a'}`],
        custom_fields: lead.meta,
      },
      trigger_autoresponders: true,
      update_existing: true,
      skip_confirmation: false,
    }),
  });
  if (!res.ok) throw new Error(`Ecomail ${res.status}`);
  return true;
}

async function sendToWebhook(lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return true;
}

function respond(request, status, payload) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  if (wantsJson) {
    return Response.json(payload, { status });
  }
  // Fallback bez JavaScriptu: klasický redirect.
  const location = payload.ok ? payload.redirect : '/?error=email#guide';
  return new Response(null, { status: 303, headers: { Location: location } });
}

export async function handleLead(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  let body;
  try {
    body = await readBody(request);
  } catch {
    return respond(request, 400, { ok: false, error: 'body' });
  }

  const email = clean(body.email, 254).toLowerCase();
  const success = { ok: true, redirect: '/dekujeme' };

  // Antispam: vyplněný honeypot nebo podezřele rychlé odeslání tiše „projde“, ale nic se neuloží.
  const startedAt = Number(body.ts);
  const isBot = clean(body.website) !== '' || (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS);
  if (isBot) return respond(request, 200, success);

  if (!EMAIL_RE.test(email)) {
    return respond(request, 422, { ok: false, error: 'email' });
  }

  const meta = Object.fromEntries(TRACKED_FIELDS.map((key) => [key, clean(body[key])]).filter(([, v]) => v));
  const lead = { email, meta, receivedAt: new Date().toISOString() };

  // Každý kanál zvlášť: selhání Ecomailu nesmí zahodit lead, který se už uložil do Blobu.
  const [stored, ecomail, webhook] = await Promise.allSettled([saveToBlob(lead), sendToEcomail(lead), sendToWebhook(lead)]);
  const results = { stored, ecomail, webhook };
  const ok = Object.values(results).some((r) => r.status === 'fulfilled' && r.value === true);
  const errors = Object.entries(results)
    .filter(([, r]) => r.status === 'rejected')
    .map(([name, r]) => `${name}: ${r.reason}`);

  if (ok) {
    // Do logu jen metadata, e-mail zůstává v úložišti.
    const flags = Object.fromEntries(Object.entries(results).map(([k, r]) => [k, r.status === 'fulfilled' && r.value === true]));
    console.log(JSON.stringify({ type: 'lead', ...flags, errors, placement: lead.meta.placement, variant: lead.meta.variant }));
  } else if (errors.length) {
    // Nikam se neuložil: zapíšeme ho do logu, aby se neztratil, a uživateli vrátíme chybu.
    console.error(JSON.stringify({ type: 'lead_error', errors, ...lead }));
    return respond(request, 502, { ok: false, error: 'upstream' });
  } else {
    // Žádné úložiště není nastavené (lokální vývoj): lead se aspoň zapíše do logu.
    console.log(JSON.stringify({ type: 'lead', stored: false, ...lead }));
  }

  return respond(request, 200, success);
}
