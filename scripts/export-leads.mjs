// Export leadů z privátního Vercel Blob storu do CSV.
// Použití: BLOB_READ_WRITE_TOKEN=... node scripts/export-leads.mjs > leads.csv
// (token najdete ve Vercelu: Storage → váš Blob store → .env.local, nebo přes `vercel env pull`).
import { list, get } from '@vercel/blob';

const columns = ['receivedAt', 'email', 'variant', 'placement', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'calc_amount', 'calc_monthly', 'calc_years', 'calc_diff', 'landing_path'];
const csv = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;

const rows = [];
let cursor;
do {
  const page = await list({ prefix: 'leads/', cursor });
  for (const blob of page.blobs) {
    const result = await get(blob.pathname, { access: 'private' });
    if (result?.statusCode !== 200) continue;
    const lead = JSON.parse(await new Response(result.stream).text());
    rows.push({ receivedAt: lead.receivedAt, email: lead.email, ...lead.meta });
  }
  cursor = page.cursor;
} while (cursor);

rows.sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
console.log(columns.join(','));
for (const row of rows) console.log(columns.map((c) => csv(row[c])).join(','));
console.error(`Exportováno ${rows.length} leadů.`);
