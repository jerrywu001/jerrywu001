function getClientIP(req: any) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

export default defineEventHandler(async (event) => {
  const { req } = event.node;
  const ip = getClientIP(req);

  return {
    ip,
  };
});
