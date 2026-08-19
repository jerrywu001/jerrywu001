import { ProxyAgent, fetch } from 'undici';

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined;

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
  setHeader(event, 'pragma', 'no-cache');
  setHeader(event, 'expires', '0');

  const response = await fetch(
    'https://models.dev/api.json',
    {
      cache: 'no-store',
      dispatcher,
      headers: { 'cache-control': 'no-cache' },
    },
  );
  const contentType = response.headers.get('content-type');

  setResponseStatus(event, response.status, response.statusText);

  if (contentType) {
    setHeader(event, 'content-type', contentType);
  }

  return await response.text();
});
