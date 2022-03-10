const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs');

function getDirs(base) {
  const files = fs.readdirSync(base);
  files.forEach((item, index) => {
    const fPath = path.join(base, item);
    const stat = fs.statSync(fPath);
    if (stat.isDirectory()) {
      getDirs(fPath);
    }
    if (stat.isFile()) {
      console.log(fPath);
    }
  });
}

getDirs(docsDir);
