import fs from 'node:fs';
const assets=fs.readdirSync('dist/assets').filter(n=>/\.(js|css|woff2)$/.test(n)).map(n=>'/assets/'+n);
const sw=fs.readFileSync('public/sw.js','utf8').replace("const CACHE='semelle-v1';",`const CACHE='semelle-${Date.now()}';`).replace("['/','/manifest",`[${assets.map(a=>JSON.stringify(a)).join(',')},'/','/manifest`);
fs.writeFileSync('dist/sw.js',sw);
