# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Productores y familias de empresas agropecuarias** (zona Armstrong, Cañada de Gómez, Totoras y alrededores, Santa Fe). Llegan a la guía escaneando un QR en un evento, casi siempre desde el celular, con poca atención disponible.
- **Compradores del ebook**: personas que ya conocen al estudio (por la guía, un evento o redes) y quieren profundizar. Compran hablando por WhatsApp con la Dra. María Florencia Bossio.

## Product Purpose

Sitio del estudio jurídico Bossio & Monteresino. Ampliación 2026:

- `/guia`: página de la guía gratuita «El campo también necesita acuerdos» (PDF). Se llega por QR; el éxito es que la persona la descargue y, después, consulte por WhatsApp.
- `/ebook`: página de venta del ebook «La empresa que construimos, la familia que somos». El éxito es que la persona escriba por WhatsApp para comprarlo y, una vez que paga, descargue el ebook con la contraseña que le envía Florencia.

## Positioning

Derecho preventivo para empresas familiares agropecuarias: ordenar vínculos, bienes y decisiones antes de que aparezca el conflicto. «Ordenar no significa desconfiar.»

## Operating Context

- El cobro del ebook es por transferencia, gestionado por Florencia en WhatsApp (+54 9 3476 616820). No hay pasarela de pago.
- Florencia envía una contraseña fuerte y única (compartida entre compradores) por WhatsApp; el comprador la pega en la página.

## Capabilities and Constraints

- Hosting en Vercel, sitio Vite multipágina + Tailwind 3.
- La contraseña se valida en el servidor (función de Vercel). El PDF del ebook vive fuera de `public/` y se entrega con un link firmado que vence en minutos; la página pide un link nuevo en cada descarga para que al comprador nunca le quede vencido.
- **Pendiente:** PDF final del ebook (hoy se usa la guía como archivo de prueba), precio, índice real de los 8 capítulos, imágenes de muestra y video.

## Brand Commitments

- Nombre: Bossio & Monteresino · Estudio Jurídico. Logo en `public/logo.png`.
- Voz: cercana, clara, rioplatense (voseo), sin dramatismo ni promesas legales.
- La guía usa una portada de atardecer en el campo; es un activo real del material.

## Evidence on Hand

- Guía completa: `public/descargas/guia-el-campo-tambien-necesita-acuerdos.pdf` (17 páginas, 6 claves, autodiagnóstico de 12 preguntas).
- Foto de Florencia: `public/flor.jpg`.
- No hay testimonios, cifras de clientes ni precio del ebook: no inventarlos.

## Product Principles

1. El celular primero: el QR se escanea de pie, en un evento.
2. Un paso claro por pantalla: descargar, o hablar por WhatsApp.
3. Mostrar el contenido real antes de pedir algo.
4. Material de orientación, nunca promesa de resultado jurídico.
