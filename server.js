const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const KEY=process.env.ANTHROPIC_API_KEY,PORT=process.env.PORT||3000,MODEL=process.env.CLAUDE_MODEL||'claude-sonnet-5-5';
const rooms=new Map();let n=0;setInterval(()=>n=0,6e4);
const json=(res,code,body)=>{res.statusCode=code;res.setHeader('content-type','application/json');res.end(body)};
const srv=http.createServer(async(req,res)=>{
  if(req.url==='/api/status')return json(res,200,JSON.stringify({ws:true,ai:!!KEY}));
  if(req.url==='/api/judge'&&req.method==='POST'){
    if(!KEY)return json(res,503,'{}');
    if(++n>60)return json(res,429,'{}');
    let b='';for await(const c of req)b+=c;
    try{
      const prompt=String(JSON.parse(b).prompt||'').slice(0,2000);
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},body:JSON.stringify({model:MODEL,max_tokens:300,messages:[{role:'user',content:prompt}]})});
      const j=await r.json(),t=(j.content||[]).map(x=>x.text||'').join(''),m=t.match(/\{[\s\S]*\}/);
      json(res,200,m?m[0]:'{}');
    }catch(e){json(res,500,'{}')}
    return;
  }
  fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(d)});
});
const wss=new WebSocketServer({server:srv,path:'/ws'});
wss.on('connection',(ws,req)=>{
  const code=(new URL(req.url,'http://x').searchParams.get('room')||'').slice(0,16);
  const set=rooms.get(code)||new Set();rooms.set(code,set);
  if(set.size>=2)return ws.close();
  set.add(ws);
  ws.on('message',d=>{if(d.length<4096)for(const c of set)if(c.readyState===1)c.send(d.toString())});
  ws.on('close',()=>{set.delete(ws);if(!set.size)rooms.delete(code)});
});
srv.listen(PORT,()=>console.log('http://localhost:'+PORT));
