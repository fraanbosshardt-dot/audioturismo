# Anexo financiero reproducible

Fecha: 10/11/2026. USD constantes. Todos los volúmenes, tasas, honorarios y cargas fiscales son hipótesis, salvo las cuentas de tiendas referenciadas en el informe. No es una proyección validada.

Ejecutar `node modelo-financiero.mjs` desde esta carpeta para regenerar este anexo y `resultados-financieros.json`.

## Fórmulas y alcance

U = MAU; b = fracción de MAU que compra una ruta nueva en el mes; P = precio al consumidor; r = reembolsos; t = impuesto indirecto supuesto incluido; f = comisión sobre precio neto de ese impuesto; v = costo variable por MAU.

B = U × b; bruto = B × P; neto = bruto × (1-r) ÷ (1+t) × (1-f); contribución = neto - U×v; captación = B×30%×CAC; flujo operativo = contribución - fijo - captación. La secuencia fiscal es una simplificación, no una liquidación de las tiendas. No incorpora impuesto a ganancias, IIBB, retenciones, efectos de cambio, financiación ni retrasos de cobro; todos requieren un modelo contable específico.

El 30% es la proporción supuesta de compradores del mes adquiridos por canal pago. No es la proporción de MAU adquiridos. CAC es costo por comprador atribuido incremental; no por instalación. Fijo incluye mantenimiento, contenido, soporte y administración según el informe.

## Hipótesis por escenario

|Escenario|P|Compradores/MAU/mes|Reembolsos|Comisión|Impuesto supuesto|Variable/MAU|CAC pago|Recompra hipotética|
|---|---:|---:|---:|---:|---:|---:|---:|---:|
|conservador|4,99|1%|5%|30%|21%|0,18|18,00|5%|
|base|7,99|3%|3%|15%|21%|0,08|8,00|20%|
|optimista|9,99|5%|2%|15%|21%|0,05|4,00|40%|

## Inversión hasta beta comercial

Incluye etapa de validación dentro de las horas y partidas: no sumar nuevamente los USD 3.900 del primer experimento. No incluye capital de trabajo posterior. Horas de fundador valorizadas a tarifa económica; si no se pagan, baja la salida de caja y se mantiene el costo de oportunidad.

|Escenario|Ingeniería|Otras partidas y cuentas|Subtotal|Reserva 20%|Total|
|---|---:|---:|---:|---:|---:|
|austero|15.000,00|7.124,00|22.124,00|4.424,80|26.548,80|
|base|40.000,00|14.124,00|54.124,00|10.824,80|64.948,80|
|holgado|90.000,00|27.124,00|117.124,00|23.424,80|140.548,80|

## Escalas de operación

U representa activos mensuales, no registros acumulados. Ventas nuevas por mes: compra de una ruta distinta, sin cobrar otra vez la misma. Los valores fraccionarios son esperanzas matemáticas. El modelo de ruta no tiene MRR/ARR de suscripción. No multiplicar un mes estacional por 12 como pronóstico.

### conservador

|MAU|Compradores|Ventas brutas|Ingresos netos|Variables|Contribución|Fijos|Captación|Flujo operativo|
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|100|1,00|4,99|2,74|18,00|-15,26|3.000,00|5,40|-3.020,66|
|1000|10,00|49,90|27,42|180,00|-152,58|3.000,00|54,00|-3.206,58|
|5000|50,00|249,50|137,12|900,00|-762,88|8.000,00|270,00|-9.032,88|
|10000|100,00|499,00|274,24|1.800,00|-1.525,76|8.000,00|540,00|-10.065,76|
|50000|500,00|2.495,00|1.371,22|9.000,00|-7.628,78|18.000,00|2.700,00|-28.328,78|
|100000|1.000,00|4.990,00|2.742,44|18.000,00|-15.257,56|18.000,00|5.400,00|-38.657,56|
|500000|5.000,00|24.950,00|13.712,19|90.000,00|-76.287,81|50.000,00|27.000,00|-153.287,81|

### base

|MAU|Compradores|Ventas brutas|Ingresos netos|Variables|Contribución|Fijos|Captación|Flujo operativo|
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|100|3,00|23,97|16,33|8,00|8,33|3.000,00|7,20|-2.998,87|
|1000|30,00|239,70|163,33|80,00|83,33|3.000,00|72,00|-2.988,67|
|5000|150,00|1.198,50|816,66|400,00|416,66|8.000,00|360,00|-7.943,34|
|10000|300,00|2.397,00|1.633,33|800,00|833,33|8.000,00|720,00|-7.886,67|
|50000|1.500,00|11.985,00|8.166,64|4.000,00|4.166,64|18.000,00|3.600,00|-17.433,36|
|100000|3.000,00|23.970,00|16.333,28|8.000,00|8.333,28|18.000,00|7.200,00|-16.866,72|
|500000|15.000,00|119.850,00|81.666,38|40.000,00|41.666,38|50.000,00|36.000,00|-44.333,62|

### optimista

|MAU|Compradores|Ventas brutas|Ingresos netos|Variables|Contribución|Fijos|Captación|Flujo operativo|
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|100|5,00|49,95|34,39|5,00|29,39|3.000,00|6,00|-2.976,61|
|1000|50,00|499,50|343,87|50,00|293,87|3.000,00|60,00|-2.766,13|
|5000|250,00|2.497,50|1.719,35|250,00|1.469,35|8.000,00|300,00|-6.830,65|
|10000|500,00|4.995,00|3.438,71|500,00|2.938,71|8.000,00|600,00|-5.661,29|
|50000|2.500,00|24.975,00|17.193,53|2.500,00|14.693,53|18.000,00|3.000,00|-6.306,47|
|100000|5.000,00|49.950,00|34.387,07|5.000,00|29.387,07|18.000,00|6.000,00|5.387,07|
|500000|25.000,00|249.750,00|171.935,33|25.000,00|146.935,33|50.000,00|30.000,00|66.935,33|

## TAM/SAM/SOM de trabajo

No son estimaciones estadísticas de mercado. Son escenarios de ocasiones de compra por grupo viajero. V = viajes-persona/año; a = participación auto; o = viajeros por vehículo; d = elegibilidad digital; c = cuota de corredores cubiertos; R = alcance calificado único; x = conversión. TAM = V×a÷o×d; SAM=TAM×c; SOM=min(SAM,R)×x. TAM/SAM valorados a compra universal son techos mecánicos, no facturación esperable ni mercado probado.

|Escenario|TAM ocasiones|TAM techo bruto|SAM ocasiones|SAM techo bruto|Alcance|Conversión|SOM compradores|SOM bruto|
|---|---:|---:|---:|---:|---:|---:|---:|---:|
|conservador|2.860.000,00|14.271.400,00|228.800,00|1.141.712,00|30.000,00|1.5%|450,00|2.245,50|
|base|6.681.818,18|53.387.727,27|801.818,18|6.406.527,27|100.000,00|3%|3.000,00|23.970,00|
|optimista|12.800.000,00|127.872.000,00|2.304.000,00|23.016.960,00|250.000,00|5%|12.500,00|124.875,00|

Los supuestos completos están en JSON. No anualizar Q2 2024 ni extrapolar la cobertura poblacional EVyTH de 62% a todo el país. Los viajes recurrentes impiden convertir ocasiones en personas únicas sin datos adicionales.

## Flujo de caja ilustrativo de 12 meses

Capital inicial supuesto USD 150.000; desembolso inicial base al comienzo; operación posterior al lanzamiento. No son fechas comprometidas. Cobro y gasto en el mismo mes: contrastar con un estrés de 60 días de liquidación de tiendas y estacionalidad.

|Mes|MAU|Flujo operativo|Caja de cierre|
|---:|---:|---:|---:|
|1|100|-2.998,87|82.052,33|
|2|250|-2.997,17|79.055,17|
|3|500|-2.994,33|76.060,83|
|4|1000|-2.988,67|73.072,17|
|5|2000|-7.977,33|65.094,83|
|6|3500|-7.960,34|57.134,50|
|7|5000|-7.943,34|49.191,16|
|8|7500|-7.915,00|41.276,16|
|9|10000|-7.886,67|33.389,48|
|10|15000|-17.830,01|15.559,47|
|11|20000|-17.773,34|-2.213,87|
|12|30000|-17.660,02|-19.873,89|

## Alternativa de suscripción, todavía no elegida

Ejemplo independiente: 10.000 MAU, conversión 4%, precio 3,99/mes, churn mensual 8%, mismas deducciones base. MRR bruto = 1.596; ARR bruto de ritmo = 19.152; neto mensual = 1.087,52; contribución después del variable de TODOS los MAU = 287,52. No se suma a ventas por ruta.

LTV de contribución estacionario = (neto mensual por pagador - variable por MAU / conversión) / churn = 8,99. No incluye fijos ni adquisición y presupone tasas constantes, sin estacionalidad ni descuento. No es evidencia de LTV real. Payback = CAC / contribución mensual por pagador; no usar ingreso bruto para calcularlo.
