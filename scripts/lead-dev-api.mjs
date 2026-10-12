// Astro integrace, která v `astro dev` obslouží POST /api/lead stejnou logikou
// jako Vercel Function, takže formulář jde otestovat lokálně.
import { handleLead } from '../api/_lead-core.js';

export function leadDevApi() {
  return {
    name: 'lead-dev-api',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/api/lead', async (req, res) => {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const request = new Request(`http://localhost${req.originalUrl ?? req.url}`, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          });
          const response = await handleLead(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        });
      },
    },
  };
}
