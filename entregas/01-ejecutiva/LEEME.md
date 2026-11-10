# Primera entrega — audio turismo geolocalizado

Fecha: 10 de noviembre de 2026. Documentación de decisión; aplicación aún no implementada.

## Lectura

1. **informe-ejecutivo.md:** informe A–M, mercado y competencia con fuentes, MVP, stack, GPS/audio/offline, editorial, precios, finanzas, identidad, marketing, riesgos y ejecución. Incluye dirección de wireframes y estructura futura del repositorio.
2. **anexo-financiero.md:** tablas de los tres escenarios, TAM/SAM/SOM de trabajo, inversión, flujo de caja de 12 meses y alternativa de suscripción.
3. **resultados-financieros.json:** insumos y resultados numéricos sin redondeo de presentación.
4. **evidencia-nombres.json:** respuestas resumidas RDAP y Apple Search para tres candidatos, con fecha de consulta; no es un dictamen de disponibilidad.

## Reproducir cálculos

Requiere Node.js; no instala dependencias. Abrir terminal en esta carpeta y ejecutar:

```powershell
node .\modelo-financiero.mjs
```

Regenera el anexo y JSON y ejecuta comprobaciones aritméticas. Los números del informe principal solo deben actualizarse junto con el modelo; no se modifican automáticamente.

Las consultas públicas de nombres se pueden repetir con:

```powershell
node .\comprobar-nombres.mjs
```

Este comando necesita internet y reemplaza la evidencia por la consulta nueva. No registra dominios ni reserva nombres. RDAP 404 y Apple Search sin resultados no demuestran disponibilidad comercial o marcaria.

## Decisiones propuestas

- Validar un corredor argentino y una experiencia offline con una voz, antes de ampliar catálogo y productos secundarios.
- Probar compra por ruta con cinco muestras gratuitas; no contar ventas únicas como MRR.
- React Native/TypeScript para interfaz y contratos; ejecución crítica nativa con persistencia local.
- Elegir la ruta piloto por acceso real a pruebas y editor local; RN 68 es candidata documentada, sin activaciones de campo todavía verificadas.
- Limitar el primer experimento de validación a USD 3.900; el presupuesto económico base posterior hasta beta es USD 64.948,80, sujeto a cotización y resultados.
- No elegir marca todavía: los tres .com examinados están registrados y falta clearance marcario.

## Estado verificable

**Entregado:** informe ejecutivo, modelo de planificación reproducible, consultas públicas limitadas de nombres y secuencia de construcción.

**Comprobado:** ejecución del modelo, identidades aritméticas incluidas y respuestas registradas de servicios públicos. Fuentes técnicas/comerciales consultadas por web.

**Pendiente:** 26 documentos detallados y su refinamiento, diseños finales, código del producto, entrevistas, contenido aprobado, recorridos, builds físicos, seguridad, compras reales y pruebas de tiendas. La entrega ejecutiva no se presenta como una plataforma construida.

**Requiere recursos externos:** teléfonos, Mac/Xcode o infraestructura de build y depuración adecuada, cuentas de desarrollador, contratos/licencias, acceso a la ruta y revisiones profesionales. No se creó ni contrató infraestructura, no se enviaron mensajes a terceros ni se ejecutaron campañas.

El escenario base pierde dinero en todas las escalas modeladas hasta 500.000 MAU. Los escenarios no son un pronóstico ni una validación del mercado; la inversión posterior depende de mejorar y demostrar contribución, CAC y repetición.
