### Nuxi

sdasd `const a = 1`

```treeview[class=no-line-numbers]
root_folder
├── a first folder
|   ├── holidays.mov
|   ├── javascript-file.js
|   └── some_picture.jpg
├── documents
|   ├── spreadsheet.xls
|   ├── manual.pdf
|   ├── document.docx
|   └── presentation.ppt
└── etc.
```

```bash[data-prompt="Cmder C:\Users\haha>" data-output="2-11"]
dir


    Directory: C:\Users\Chris


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d-r--        10/14/2015   5:06 PM            Contacts
d-r--        12/12/2015   1:47 PM            Desktop
d-r--         11/4/2015   7:59 PM            Documents
```

```bash[data-user=haha][data-host=admin][data-output="2,4-8"]
pwd
/usr/home/chris/bin
ls -la
total 2
drwxr-xr-x   2 chris  chris     11 Jan 10 16:48 .
drwxr--r-x  45 chris  chris     92 Feb 14 11:10 ..
-rwxr-xr-x   1 chris  chris    444 Aug 25  2013 backup
-rwxr-xr-x   1 chris  chris    642 Jan 17 14:42 deploy
```

```bash[class="no-command-line no-line-numbers"]
pwd
/usr/home/chris/bin
ls -la
```

```json{2,6,8-10}[ssd.json]
{
  "scripts": {
    "dev": "nuxt",
    "dev": "nuxi dev",
    "build": "nuxt build",
    "build": "nuxi build",
    "start": "nuxt start",
    "start": "nuxi preview"
  }
}
```

```diff[ssd.js][class="language-diff-javascript diff-highlight"]
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
+    console.log(`foo: ${foo}`);
```


```css
@font-face {
	src: url(http://lea.verou.me/logo.otf);
	font-family: 'LeaVerou';
}
```

```bash
yarn add --dev @nuxt/bridge@npm:@nuxt/bridge-edge
```

```css
div {
    border: 40px solid transparent;
    border-image: 33.334% url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"> \
                          <circle cx="5" cy="5" r="5" fill="%23ab4"/><circle cx="15" cy="5" r="5" fill="%23655"/> \
                          <circle cx="25" cy="5" r="5" fill="%23e07"/><circle cx="5" cy="15" r="5" fill="%23655"/> \
                          <circle cx="15" cy="15" r="5" fill="hsl(15, 25%, 75%)"/> \
                          <circle cx="25" cy="15" r="5" fill="%23655"/><circle cx="5" cy="25" r="5" fill="%23fb3"/> \
                          <circle cx="15" cy="25" r="5" fill="%23655"/><circle cx="25" cy="25" r="5" fill="%2358a"/></svg>');
    padding: 1em;
    max-width: 20em;
    font: 130%/1.6 Baskerville, Palatino, serif;
}
```

```css
span.foo {
	background-color: navy;
	color: #BFD;
}

span.bar {
	background: rgba(105, 0, 12, .38);
	color: hsl(30, 100%, 50%);
	border-color: transparent;
}
```
