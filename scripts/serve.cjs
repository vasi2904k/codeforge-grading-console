const http=require('node:http');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const worker=(await import(pathToFileURL(path.resolve('dist/server/index.js')))).default;
 const server=http.createServer(async(req,res)=>{
  try{
   const response=await worker.fetch(new Request('http://localhost:4173'+req.url,{method:req.method}));
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end('Unable to serve the console.');}
 });
 server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
})();
