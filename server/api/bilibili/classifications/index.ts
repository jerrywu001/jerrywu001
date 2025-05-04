async function queryClassifications() {
  return new Promise((resolve, reject) => {
    fetch(
      'https://api.bilibili.com/pugv/app/web/classifications/new',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'sec-fetch-mode': 'cors',
        },
        referrer: 'https://www.bilibili.com',
        referrerPolicy: 'strict-origin-when-cross-origin'
      }
    )
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default defineEventHandler(async () => {
  try {
    const res = await queryClassifications();
    return res;
  } catch (err) {
    return err;
  }
});
