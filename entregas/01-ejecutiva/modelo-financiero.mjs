// Modelo de planificación, no contabilidad ni pronóstico. USD constantes.
// Ejecutar: node modelo-financiero.mjs. Sin dependencias externas.
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const scenarios = {
  conservador: { price: 4.99, buyerRate: .01, refund: .05, fee: .30, tax: .21, variablePerMAU: .18, paidCAC: 18, repeatProbability: .05 },
  base: { price: 7.99, buyerRate: .03, refund: .03, fee: .15, tax: .21, variablePerMAU: .08, paidCAC: 8, repeatProbability: .20 },
  optimista: { price: 9.99, buyerRate: .05, refund: .02, fee: .15, tax: .21, variablePerMAU: .05, paidCAC: 4, repeatProbability: .40 },
};
const sizes = [100, 1000, 5000, 10000, 50000, 100000, 500000];
const fixedCost = mau => mau <= 1000 ? 3000 : mau <= 10000 ? 8000 : mau <= 100000 ? 18000 : 50000;
const unitNet = s => s.price * (1-s.refund) / (1+s.tax) * (1-s.fee);
function economics(mau, s) {
  const buyers = mau*s.buyerRate;
  const gross = buyers*s.price;
  const net = buyers*unitNet(s);
  const variable = mau*s.variablePerMAU;
  const contribution = net-variable;
  const acquisition = buyers*.30*s.paidCAC;
  return { mau, buyers, gross, net, variable, contribution, fixed: fixedCost(mau), acquisition, operatingCash: contribution-fixedCost(mau)-acquisition, netARPU: net/mau, netARPPU: unitNet(s), grossMargin: net ? contribution/net : null };
}
const budgets = {
  austero: { engineeringHours:600, hourly:25, design:1500, editorial:1800, fieldAndDevices:1500, legal:1000, infrastructure:500, launch:700 },
  base: { engineeringHours:1000, hourly:40, design:3500, editorial:3000, fieldAndDevices:3000, legal:2000, infrastructure:1000, launch:1500 },
  holgado: { engineeringHours:1500, hourly:60, design:7000, editorial:6000, fieldAndDevices:5000, legal:4000, infrastructure:2000, launch:3000 },
};
const initial = Object.fromEntries(Object.entries(budgets).map(([name,b])=>{
  const subtotal = b.engineeringHours*b.hourly + b.design+b.editorial+b.fieldAndDevices+b.legal+b.infrastructure+b.launch+124;
  return [name,{...b,developerAccounts:124,subtotal,contingency:subtotal*.20,total:subtotal*1.20}];
}));
const market = Object.fromEntries([
  ['conservador',20e6,.65,2.5,.55,.08,4.99,30000,.015],
  ['base',28e6,.75,2.2,.70,.12,7.99,100000,.03],
  ['optimista',40e6,.80,2,.80,.18,9.99,250000,.05],
].map(([name,trips,carShare,party,digital,corridorShare,price,qualifiedReach,conversion])=>{
  const tam=trips*carShare/party*digital;
  const sam=tam*corridorShare;
  const som=Math.min(sam,qualifiedReach)*conversion;
  return [name,{ trips,carShare,party,digital,corridorShare,price,qualifiedReach,conversion,tamPurchaseOccasions:tam,tamValue:tam*price,samPurchaseOccasions:sam,samValue:sam*price,somBuyers:som,somGross:som*price }];
}));
const ramp=[100,250,500,1000,2000,3500,5000,7500,10000,15000,20000,30000];
let cash=150000-initial.base.total;
const cashflow=ramp.map((mau,i)=>{
  const e=economics(mau,scenarios.base);
  cash+=e.operatingCash;
  return {month:i+1,...e,cash};
});
const subscription={price:3.99,conversion:.04,churn:.08,fee:.15,tax:.21,refund:.03,variablePerMAU:.08};
const subN=10000, subPay=subN*subscription.conversion;
const subMRR=subPay*subscription.price;
const subNet=subscription.price*(1-subscription.refund)/(1+subscription.tax)*(1-subscription.fee);
const subContributionPerPayer=subNet-subscription.variablePerMAU/subscription.conversion;
const subscriptionExample={...subscription,mau:subN,payers:subPay,grossMRR:subMRR,grossARR:subMRR*12,netMonthlyReceipts:subPay*subNet,contributionAfterAllMAUVariable:subPay*subContributionPerPayer,stationaryContributionLTV:subContributionPerPayer/subscription.churn};
assert(Math.abs(unitNet(scenarios.base)-5.444425619834712)<1e-9);
assert.equal(economics(10000,scenarios.base).buyers,300);
assert(Math.abs(initial.base.total-64948.80)<1e-8);
assert.equal(market.base.somBuyers,3000);
assert.equal(subscriptionExample.grossMRR,1596);
for(const s of Object.values(scenarios)) for(const n of sizes){
  const e=economics(n,s);
  assert(Math.abs(e.operatingCash-(e.net-e.variable-e.fixed-e.acquisition))<1e-8);
}
const output={asOf:'2026-11-10',currency:'USD',status:'Supuestos de planificación; tarifas y carga fiscal requieren validación contractual y profesional.',scenarios,initial,market,scale:Object.fromEntries(Object.entries(scenarios).map(([name,s])=>[name,sizes.map(n=>economics(n,s))])),cashflow,subscriptionExample};
const fmt=n=>n.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
let md='# Anexo financiero reproducible\n\nFecha: 10/11/2026. USD constantes. Todos los volúmenes, tasas, honorarios y cargas fiscales son hipótesis, salvo las cuentas de tiendas referenciadas en el informe. No es una proyección validada.\n\n';
md+='Ejecutar `node modelo-financiero.mjs` desde esta carpeta para regenerar este anexo y `resultados-financieros.json`.\n\n';
md+='## Fórmulas y alcance\n\nU = MAU; b = fracción de MAU que compra una ruta nueva en el mes; P = precio al consumidor; r = reembolsos; t = impuesto indirecto supuesto incluido; f = comisión sobre precio neto de ese impuesto; v = costo variable por MAU.\n\nB = U × b; bruto = B × P; neto = bruto × (1-r) ÷ (1+t) × (1-f); contribución = neto - U×v; captación = B×30%×CAC; flujo operativo = contribución - fijo - captación. La secuencia fiscal es una simplificación, no una liquidación de las tiendas. No incorpora impuesto a ganancias, IIBB, retenciones, efectos de cambio, financiación ni retrasos de cobro; todos requieren un modelo contable específico.\n\n';
md+='El 30% es la proporción supuesta de compradores del mes adquiridos por canal pago. No es la proporción de MAU adquiridos. CAC es costo por comprador atribuido incremental; no por instalación. Fijo incluye mantenimiento, contenido, soporte y administración según el informe.\n\n';
md+='## Hipótesis por escenario\n\n|Escenario|P|Compradores/MAU/mes|Reembolsos|Comisión|Impuesto supuesto|Variable/MAU|CAC pago|Recompra hipotética|\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n';
for(const [name,s] of Object.entries(scenarios))md+=`|${name}|${fmt(s.price)}|${s.buyerRate*100}%|${s.refund*100}%|${s.fee*100}%|${s.tax*100}%|${fmt(s.variablePerMAU)}|${fmt(s.paidCAC)}|${s.repeatProbability*100}%|\n`;
md+='\n## Inversión hasta beta comercial\n\nIncluye etapa de validación dentro de las horas y partidas: no sumar nuevamente los USD 3.900 del primer experimento. No incluye capital de trabajo posterior. Horas de fundador valorizadas a tarifa económica; si no se pagan, baja la salida de caja y se mantiene el costo de oportunidad.\n\n|Escenario|Ingeniería|Otras partidas y cuentas|Subtotal|Reserva 20%|Total|\n|---|---:|---:|---:|---:|---:|\n';
for(const [name,b] of Object.entries(initial))md+=`|${name}|${fmt(b.engineeringHours*b.hourly)}|${fmt(b.subtotal-b.engineeringHours*b.hourly)}|${fmt(b.subtotal)}|${fmt(b.contingency)}|${fmt(b.total)}|\n`;
md+='\n## Escalas de operación\n\nU representa activos mensuales, no registros acumulados. Ventas nuevas por mes: compra de una ruta distinta, sin cobrar otra vez la misma. Los valores fraccionarios son esperanzas matemáticas. El modelo de ruta no tiene MRR/ARR de suscripción. No multiplicar un mes estacional por 12 como pronóstico.\n\n';
for(const [name,rows] of Object.entries(output.scale)){
 md+=`### ${name}\n\n|MAU|Compradores|Ventas brutas|Ingresos netos|Variables|Contribución|Fijos|Captación|Flujo operativo|\n|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
 for(const e of rows)md+=`|${e.mau}|${fmt(e.buyers)}|${fmt(e.gross)}|${fmt(e.net)}|${fmt(e.variable)}|${fmt(e.contribution)}|${fmt(e.fixed)}|${fmt(e.acquisition)}|${fmt(e.operatingCash)}|\n`;
 md+='\n';
}
md+='## TAM/SAM/SOM de trabajo\n\nNo son estimaciones estadísticas de mercado. Son escenarios de ocasiones de compra por grupo viajero. V = viajes-persona/año; a = participación auto; o = viajeros por vehículo; d = elegibilidad digital; c = cuota de corredores cubiertos; R = alcance calificado único; x = conversión. TAM = V×a÷o×d; SAM=TAM×c; SOM=min(SAM,R)×x. TAM/SAM valorados a compra universal son techos mecánicos, no facturación esperable ni mercado probado.\n\n|Escenario|TAM ocasiones|TAM techo bruto|SAM ocasiones|SAM techo bruto|Alcance|Conversión|SOM compradores|SOM bruto|\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n';
for(const [name,m] of Object.entries(market))md+=`|${name}|${fmt(m.tamPurchaseOccasions)}|${fmt(m.tamValue)}|${fmt(m.samPurchaseOccasions)}|${fmt(m.samValue)}|${fmt(m.qualifiedReach)}|${m.conversion*100}%|${fmt(m.somBuyers)}|${fmt(m.somGross)}|\n`;
md+='\nLos supuestos completos están en JSON. No anualizar Q2 2024 ni extrapolar la cobertura poblacional EVyTH de 62% a todo el país. Los viajes recurrentes impiden convertir ocasiones en personas únicas sin datos adicionales.\n\n';
md+='## Flujo de caja ilustrativo de 12 meses\n\nCapital inicial supuesto USD 150.000; desembolso inicial base al comienzo; operación posterior al lanzamiento. No son fechas comprometidas. Cobro y gasto en el mismo mes: contrastar con un estrés de 60 días de liquidación de tiendas y estacionalidad.\n\n|Mes|MAU|Flujo operativo|Caja de cierre|\n|---:|---:|---:|---:|\n';
for(const e of cashflow)md+=`|${e.month}|${e.mau}|${fmt(e.operatingCash)}|${fmt(e.cash)}|\n`;
md+='\n## Alternativa de suscripción, todavía no elegida\n\nEjemplo independiente: 10.000 MAU, conversión 4%, precio 3,99/mes, churn mensual 8%, mismas deducciones base. MRR bruto = 1.596; ARR bruto de ritmo = 19.152; neto mensual = '+fmt(subscriptionExample.netMonthlyReceipts)+'; contribución después del variable de TODOS los MAU = '+fmt(subscriptionExample.contributionAfterAllMAUVariable)+'. No se suma a ventas por ruta.\n\n';
md+='LTV de contribución estacionario = (neto mensual por pagador - variable por MAU / conversión) / churn = '+fmt(subscriptionExample.stationaryContributionLTV)+'. No incluye fijos ni adquisición y presupone tasas constantes, sin estacionalidad ni descuento. No es evidencia de LTV real. Payback = CAC / contribución mensual por pagador; no usar ingreso bruto para calcularlo.\n';
writeFileSync(new URL('./resultados-financieros.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
writeFileSync(new URL('./anexo-financiero.md',import.meta.url),md);
console.log(JSON.stringify({verified:true,initial,baseAt10000:economics(10000,scenarios.base),marketBase:market.base,yearEndCash:cashflow.at(-1).cash,subscriptionExample},null,2));
