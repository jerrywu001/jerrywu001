const client_manifest = {
  "node_modules/nuxt3/dist/app/entry.mjs": {
    "file": "entry-41710679.mjs",
    "src": "node_modules/nuxt3/dist/app/entry.mjs",
    "isEntry": true,
    "dynamicImports": [
      "_bootstrap-5304c866.mjs"
    ]
  },
  "_bootstrap-5304c866.mjs": {
    "file": "bootstrap-5304c866.mjs",
    "isDynamicEntry": true,
    "dynamicImports": [
      "layouts/page.vue",
      "pages/index.vue",
      "pages/posts/[category]/[postname].vue"
    ],
    "css": [
      "bootstrap.5478eccd.css"
    ]
  },
  "pages/index.vue": {
    "file": "index-4bcd7bf6.mjs",
    "src": "pages/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "_bootstrap-5304c866.mjs"
    ],
    "css": [
      "index.500a19b9.css"
    ]
  },
  "pages/posts/[category]/[postname].vue": {
    "file": "_postname_-4bcb9be3.mjs",
    "src": "pages/posts/[category]/[postname].vue",
    "isDynamicEntry": true,
    "imports": [
      "_bootstrap-5304c866.mjs"
    ],
    "css": [
      "_postname_.2f0fca4a.css"
    ]
  },
  "layouts/page.vue": {
    "file": "page-71efa004.mjs",
    "src": "layouts/page.vue",
    "isDynamicEntry": true,
    "imports": [
      "_bootstrap-5304c866.mjs"
    ],
    "css": [
      "page.5d053e60.css"
    ]
  }
};

export { client_manifest as default };
