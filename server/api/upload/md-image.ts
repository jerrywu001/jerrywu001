import ImageKit from 'imagekit';

export default defineEventHandler(async (event) => {
  const { imageKitPublickey, imageKitPrivatekey, imageKitUrlEndpoint } = useRuntimeConfig();
  const { files, blogId } = await readBody<{ blogId: string; files: Array<{ base64: string; name: string }>; }>(event);

  if (!files || !files.length) return [];

  const urls: string[] = [];
  // https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload
  const imagekit = new ImageKit({
    publicKey: imageKitPublickey,
    privateKey: imageKitPrivatekey,
    urlEndpoint: imageKitUrlEndpoint,
  });

  for await (const file of files) {
    const res = await imagekit.upload({
      file: file.base64,
      fileName: file.name,
      folder: `supabases-blogs/${blogId}`,
    });

    urls.push(res.url);
  }

  return urls;
});
