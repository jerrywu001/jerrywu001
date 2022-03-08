import { createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';
import { c as buildAssetsDir } from './server.mjs';
import 'unenv/runtime/polyfill/fetch.node';
import 'http';
import 'https';
import 'destr';
import 'ohmyfetch';
import 'unenv/runtime/fetch/index';
import 'defu';

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"47e-q65lwVeQU/htKZucHqwNsN9087w\"",
    "mtime": "2022-03-01T01:25:58.000Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/bootstrap-5304c866.mjs": {
    "type": "application/javascript",
    "etag": "\"1d7f9-VQzDVc/qfzub+rsYrVPLV0tVxUE\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/bootstrap-5304c866.mjs"
  },
  "/_nuxt/bootstrap.5478eccd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"139f7-bTTtQUY+xPVPzqctzDgKLpFlnRk\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/bootstrap.5478eccd.css"
  },
  "/_nuxt/entry-41710679.mjs": {
    "type": "application/javascript",
    "etag": "\"65-/zfKz/2Sh+J2uwiBlwx/yQ3J0SY\"",
    "mtime": "2022-03-08T09:51:35.056Z",
    "path": "../public/_nuxt/entry-41710679.mjs"
  },
  "/_nuxt/index-4bcd7bf6.mjs": {
    "type": "application/javascript",
    "etag": "\"9d5-2sPs2VvbMvSD6Bo+VLNjhfClNx0\"",
    "mtime": "2022-03-08T09:51:35.057Z",
    "path": "../public/_nuxt/index-4bcd7bf6.mjs"
  },
  "/_nuxt/index.500a19b9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1-rcg7GeeTSRscbqD9i0bNnzLlkvw\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/index.500a19b9.css"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"4c5-MK4Wmm1UqwpUSUDG1idq/UeO22g\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/page-71efa004.mjs": {
    "type": "application/javascript",
    "etag": "\"20b-4XdtRtfVpblsXVr89GgUikdIe+I\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/page-71efa004.mjs"
  },
  "/_nuxt/page.5d053e60.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"99-/ulMhMm0xJsRLJx4JyOeEWdty8Q\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/page.5d053e60.css"
  },
  "/_nuxt/_postname_-4bcb9be3.mjs": {
    "type": "application/javascript",
    "etag": "\"aa68-B/fk7nIVHTaZUVKAx03q+chf1wM\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/_postname_-4bcb9be3.mjs"
  },
  "/_nuxt/_postname_.2f0fca4a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"204f-d/1rBkc2yhIu5THHqgO8NEYp7lg\"",
    "mtime": "2022-03-08T09:51:35.058Z",
    "path": "../public/_nuxt/_postname_.2f0fca4a.css"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));

function readAsset (id) {
  return promises.readFile(resolve(mainDir, getAsset(id).path))
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const TWO_DAYS = 2 * 60 * 60 * 24;
const STATIC_ASSETS_BASE = "/_nuxt/D:/personal/code-resource/vue/nuxt3-app/dist" + "/" + "1646733089";
async function serveStatic(req, res) {
  if (!METHODS.includes(req.method)) {
    return;
  }
  let id = withLeadingSlash(withoutTrailingSlash(parseURL(req.url).pathname));
  let asset = getAsset(id);
  if (!asset) {
    const _id = id + "/index.html";
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
    }
  }
  const isBuildAsset = id.startsWith(buildAssetsDir());
  if (!asset) {
    if (isBuildAsset && !id.startsWith(STATIC_ASSETS_BASE)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    res.statusCode = 304;
    return res.end("Not Modified (etag)");
  }
  const ifModifiedSinceH = req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      res.statusCode = 304;
      return res.end("Not Modified (mtime)");
    }
  }
  if (asset.type) {
    res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    res.setHeader("Last-Modified", asset.mtime);
  }
  if (isBuildAsset) {
    res.setHeader("Cache-Control", `max-age=${TWO_DAYS}, immutable`);
  }
  const contents = await readAsset(id);
  return res.end(contents);
}

export { serveStatic as default };
