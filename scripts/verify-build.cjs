const assert=require('node:assert/strict');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const worker=(await import(pathToFileURL(path.resolve('dist/server/index.js')))).default;
 for(const [route,file,type] of [['/','BITS_Digital_CodeForge_Challenge.html','text/html'],['/console.css','console.css','text/css'],['/vendor/xlsx.full.min.js','vendor/xlsx.full.min.js','text/javascript'],['/og.png','public/og.png','image/png']]){
  const res=await worker.fetch(new Request('https://example.test'+route));
  assert.equal(res.status,200);assert.ok(res.headers.get('content-type').startsWith(type));
  assert.ok(Buffer.from(await res.arrayBuffer()).equals(fs.readFileSync(file)),route+' matches validated source');
 }
 for(const route of ['/tests/fixtures/boundaries.xlsx','/STAGE1_BUG_LOG.md','/.openai/hosting.json','/package.json']){
  assert.equal((await worker.fetch(new Request('https://example.test'+route))).status,404);
 }
 assert.equal((await worker.fetch(new Request('https://example.test/',{method:'POST'}))).status,405);
 assert.equal(await (await worker.fetch(new Request('https://example.test/',{method:'HEAD'}))).text(),'');
 console.log('PASS: all deployed assets match source; private development files return 404; no upload endpoint; HEAD supported.');
})().catch(e=>{console.error(e);process.exitCode=1;});
