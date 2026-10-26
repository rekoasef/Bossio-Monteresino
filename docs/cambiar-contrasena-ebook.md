# Cómo cambiar la contraseña del ebook

La contraseña que se envía por WhatsApp a quienes compran el ebook vive en Vercel, no en el código. Se puede cambiar cuando quieras, en unos 3 minutos.

## Pasos

1. Entrá a [vercel.com](https://vercel.com) con la cuenta del sitio y abrí el proyecto del sitio (bossiomonteresino.com).
2. Andá a **Settings → Environment Variables**.
3. Buscá la variable **`EBOOK_PASSWORD`**, tocá los tres puntos **⋯ → Edit**, escribí la nueva contraseña y guardá.
4. Andá a **Deployments**, en el último deploy tocá **⋯ → Redeploy** y confirmá.
5. Esperá a que diga **Ready** (1 o 2 minutos). Desde ese momento solo funciona la contraseña nueva.

## Consejos

- Usá una contraseña larga y fácil de copiar, por ejemplo tres palabras y un número: `Surco-Lucero-Molino-4821!`.
- Mandala siempre en un mensaje aparte, sola, así el comprador la copia sin errores.
- Si alguien ya había ingresado con la contraseña vieja, la página le avisa que cambió y le pide la nueva.
- Cambiarla de vez en cuando (por ejemplo, cada mes) evita que circule una contraseña vieja.

## Cambiar el archivo del ebook

El PDF está en `private/ebook.pdf` del repositorio (fuera de la parte pública del sitio). Para reemplazarlo, se sube el nuevo PDF con ese mismo nombre y se publica de nuevo. Hoy contiene un archivo de prueba.
