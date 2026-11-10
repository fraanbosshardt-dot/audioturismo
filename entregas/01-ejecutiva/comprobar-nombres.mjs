// Investigación pública preliminar. No registra dominios ni crea cuentas.
import { writeFileSync } from 'node:fs';
const names=['viaruna','taluvia','ruviora'];
const checks=await Promise.all(names.flatMap(name=>[
  {name,kind:'RDAP .com',url:`https://rdap.verisign.com/com/v1/domain/${name}.com`},
  {name,kind:'RDAP .app',url:`https://pubapi.registry.google/rdap/domain/${name}.app`},
  {name,kind:'Apple Search Argentina',url:`https://itunes.apple.com/search?term=${name}&entity=software&country=ar&limit=50`},
].map(async check=>{
  try {
    const response=await fetch(check.url,{signal:AbortSignal.timeout(15000)});
    let data; try{ data=await response.json(); } catch { data=null; }
    return {...check,checkedAt:new Date().toISOString(),status:response.status,domain:data?.ldhName,events:data?.events,resultCount:data?.resultCount,results:data?.results?.map(x=>({name:x.trackName,url:x.trackViewUrl})),interpretation:response.status===404?'Sin objeto RDAP devuelto; NO prueba disponibilidad registrable.':response.ok?'Respuesta pública recibida; revisar contenido.':'Consulta inconclusa.'};
  }catch(error){return {...check,checkedAt:new Date().toISOString(),error:String(error),interpretation:'Consulta inconclusa.'};}
})));
writeFileSync(new URL('./evidencia-nombres.json',import.meta.url),JSON.stringify(checks,null,2)+'\n');
console.log(JSON.stringify(checks,null,2));
