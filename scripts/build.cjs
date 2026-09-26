// Only these allowlisted app assets are published; workbooks, tests and logs stay local.
const fs=require('node:fs');
const path=require('node:path');
const assets={};
for(const [url,file,type] of [
 ['/', 'BITS_Digital_CodeForge_Challenge.html','text/html; charset=utf-8'],
 ['/console.css','console.css','text/css; charset=utf-8'],
 ['/vendor/xlsx.full.min.js','vendor/xlsx.full.min.js','text/javascript; charset=utf-8'],
 ['/vendor/LICENSE','vendor/LICENSE','text/plain; charset=utf-8']
]) assets[url]={body:fs.readFileSync(file,'utf8'),type};
if(fs.existsSync('public/og.png')){
 assets['/og.png']={body:fs.readFileSync('public/og.png').toString('base64'),type:'image/png',binary:true};
}
const source=`const assets=${JSON.stringify(assets)};
export default {async fetch(request){
 if(!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 const pathname=new URL(request.url).pathname;
 const asset=assets[pathname==='/index.html'?'/':pathname];
 if(!asset)return new Response('Not found',{status:404});
 const body=asset.binary?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body;
 return new Response(request.method==='HEAD'?null:body,{headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'public, max-age=0, must-revalidate'}});
}};\n`;
fs.mkdirSync('dist/server',{recursive:true});
fs.writeFileSync('dist/server/index.js',source);
fs.writeFileSync('dist/server/package.json',JSON.stringify({type:'module'}));
fs.mkdirSync('dist/.openai',{recursive:true});
fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built the grading console with '+Object.keys(assets).length+' public assets.');
