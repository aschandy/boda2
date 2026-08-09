# Invitacion digital de Ali y Narcy

Sitio estatico para GitHub Pages hecho solo con HTML, CSS y JavaScript vanilla. No usa React, npm, backend ni base de datos.

## Estructura

```text
/
├── index.html
├── styles.css
├── script.js
├── wedding.ics
├── README.md
├── design-reference.png
├── audio/
│   └── nuestra-cancion.mp3
└── images/
    ├── hero.jpg
    ├── lugar.jpg
    ├── gallery-01.jpg
    ├── gallery-02.jpg
    ├── gallery-03.jpg
    ├── gallery-04.jpg
    ├── gallery-05.jpg
    ├── gallery-06.jpg
    └── final.jpg
```

## Abrir localmente

La forma simple es abrir `index.html` en el navegador.

La forma recomendada para probar como sitio web:

```bash
python3 -m http.server 8000
```

Despues abrir:

```text
http://localhost:8000
```

No hace falta instalar nada con npm.

## Cambiar datos de la boda

Todos los datos repetidos estan al comienzo de `script.js`, en `WEDDING_CONFIG`.

Cambiar nombres:

```js
couple: {
    person1: "Ali",
    person2: "Narcy"
}
```

Cambiar fecha:

```js
wedding: {
    date: "2026-12-05"
}
```

Usar formato `AAAA-MM-DD`.

Cambiar horarios:

```js
startTime: "[HORA]",
endTime: "[HORA]",
```

Cuando tengan la hora real, usar formato de 24 horas:

```js
startTime: "19:30",
endTime: "03:00",
```

Si la fiesta termina despues de medianoche, el calendario lo interpreta como el dia siguiente.

## Cambiar lugar

En `script.js`:

```js
location: {
    name: "[NOMBRE DEL LUGAR]",
    address: "[DIRECCION]",
    mapsUrl: "[GOOGLE_MAPS_URL]"
}
```

Reemplazar:

- `[NOMBRE DEL LUGAR]`
- `[DIRECCION]`
- `[GOOGLE_MAPS_URL]`

## Conseguir el enlace de Google Maps

1. Abrir Google Maps.
2. Buscar el lugar exacto.
3. Click en "Compartir".
4. Copiar el enlace.
5. Pegar ese enlace en `mapsUrl`.

Ejemplo:

```js
mapsUrl: "https://maps.app.goo.gl/..."
```

El boton `COMO LLEGAR` usa ese valor.

## Reemplazar fotografias

Mantener exactamente estos nombres:

```text
images/hero.jpg
images/lugar.jpg
images/gallery-01.jpg
images/gallery-02.jpg
images/gallery-03.jpg
images/gallery-04.jpg
images/gallery-05.jpg
images/gallery-06.jpg
images/final.jpg
```

Reemplazar cada archivo por una foto nueva con el mismo nombre. Asi no hay que tocar HTML.

Sugerencia:

- `hero.jpg`: foto vertical o ambiente de agua/cielo con espacio para texto.
- `lugar.jpg`: foto del lugar. Esta es la imagen que aparece en la seccion `DONDE`.
- `gallery-01.jpg`: vertical protagonista.
- `gallery-02.jpg`: horizontal o foto de paisaje/pareja.
- `gallery-03.jpg` a `gallery-06.jpg`: fotos de pareja con diferentes encuadres.
- `final.jpg`: imagen fuerte para el cierre.

En `index.html` hay comentarios junto a cada imagen indicando que tipo de foto conviene poner.

## Musica

Guardar la cancion en:

```text
audio/nuestra-cancion.mp3
```

La web usa una pantalla de entrada con dos opciones: `ENTRAR CON MUSICA` y `ENTRAR SIN MUSICA`. Los navegadores moviles suelen exigir una interaccion del usuario antes de reproducir sonido, por eso la musica empieza solo despues de elegir una opcion.

Para cambiar la ruta, volumen, loop o duracion del fade, editar `AUDIO_CONFIG` al comienzo de `script.js`:

```js
const AUDIO_CONFIG = {
    src: "./audio/nuestra-cancion.mp3",
    volume: 0.35,
    loop: true,
    fadeDuration: 1200
};
```

- `src`: ruta del archivo de audio.
- `volume`: volumen objetivo. `0.35` equivale a 35%.
- `loop`: usar `true` para repetir la cancion o `false` para reproducirla una sola vez.
- `fadeDuration`: duracion del fade-in/fade-out en milisegundos.

Para probarlo localmente, abrir el sitio con:

```bash
python3 -m http.server 8000
```

Despues entrar a `http://localhost:8000`, elegir `ENTRAR CON MUSICA` y probar el control fijo `MUSICA`.

## Crear el Google Form

Crear un formulario nuevo en Google Forms con estas preguntas:

1. Nombre y apellido
   - Tipo: respuesta corta
   - Obligatoria: si

2. Vas a acompanarnos?
   - Tipo: opcion multiple
   - Opciones: Si, No
   - Obligatoria: si

3. Requeris un menu especial?
   - Tipo: opcion multiple
   - Opciones: No, Vegetariano, Vegano, Sin gluten, Otra restriccion o alergia
   - Obligatoria: no, salvo que quieran forzar respuesta

4. Si elegiste "Otra restriccion o alergia", contanos cual.
   - Tipo: parrafo
   - Obligatoria: no

5. Que cancion no puede faltar en la fiesta?
   - Tipo: respuesta corta
   - Obligatoria: no

## Conectar Google Forms con Google Sheets

1. Abrir el formulario.
2. Ir a la pestana "Respuestas".
3. Click en el icono de Google Sheets.
4. Crear una hoja nueva o elegir una existente.

La web no escribe en Google Sheets. El flujo correcto es:

```text
Invitado -> Google Forms -> Google Sheets
```

## Pegar GOOGLE_FORM_URL

En Google Forms:

1. Click en "Enviar".
2. Elegir el icono de enlace.
3. Copiar la URL publica.
4. Pegarla en `script.js`:

```js
rsvp: {
    googleFormUrl: "https://forms.gle/..."
}
```

El boton `CONFIRMAR ASISTENCIA` abre esa URL en una pestana nueva.

## Probar RSVP

1. Abrir el sitio localmente.
2. Ir a la seccion RSVP.
3. Click en `CONFIRMAR ASISTENCIA`.
4. Confirmar que abre Google Forms.
5. Enviar una respuesta de prueba.
6. Verificar que aparece en Google Sheets.

## Datos bancarios

Editar en `script.js`:

```js
gift: {
    bank: "[BANCO]",
    holder: "[TITULAR]",
    account: "[CUENTA]",
    alias: "[ALIAS]"
}
```

El boton `COPIAR DATOS` copia esos cuatro datos al portapapeles.

## Calendario

Los enlaces `AGENDAR EN GOOGLE` y `AGENDAR EN CALENDAR` estan en la seccion `DONDE`.

`AGENDAR EN GOOGLE` se genera desde `WEDDING_CONFIG`.

El archivo `wedding.ics` existe como respaldo para Apple Calendar, Outlook y otros calendarios. Cuando JavaScript esta activo, el boton descarga una version generada automaticamente con los datos actuales de `script.js`.

## Open Graph y WhatsApp

En `index.html` estan estos metadatos:

```html
<meta property="og:title" content="Ali y Narcy &mdash; 05.12.26">
<meta property="og:description" content="Nos casamos. Te esperamos en Montevideo.">
<meta property="og:image" content="[URL ABSOLUTA DE LA IMAGEN DE PREVIEW]">
```

Cuando el sitio este publicado, `og:image` debe ser una URL absoluta publica.

Ejemplo:

```html
<meta property="og:image" content="https://usuario.github.io/repositorio/images/hero.jpg">
```

Para probar la preview de WhatsApp, enviar el enlace a un chat propio. WhatsApp puede cachear la imagen, asi que si cambian la preview puede tardar en actualizar.

## Publicar en GitHub Pages

1. Crear un repositorio nuevo en GitHub.
2. Subir todos los archivos de este proyecto.
3. Entrar al repositorio en GitHub.
4. Ir a `Settings`.
5. Ir a `Pages`.
6. En `Build and deployment`, elegir `Deploy from a branch`.
7. Elegir la rama `main`.
8. Elegir la carpeta `/root`.
9. Guardar.
10. Esperar a que GitHub muestre la URL publica.

La URL suele verse asi:

```text
https://usuario.github.io/nombre-del-repositorio/
```

## Compartir por WhatsApp

1. Abrir la URL publica.
2. Confirmar que carga bien en el celular.
3. Copiar la URL.
4. Enviarla por WhatsApp.
5. Revisar que aparezca titulo, descripcion e imagen.

## Dominio propio

Mas adelante pueden conectar un dominio desde GitHub Pages:

1. Comprar o usar un dominio existente.
2. En GitHub, ir a `Settings > Pages`.
3. Escribir el dominio en `Custom domain`.
4. Configurar los DNS del dominio segun las instrucciones de GitHub.
5. Activar HTTPS cuando GitHub lo permita.

## Actualizar la web publicada

1. Editar los archivos localmente.
2. Probar en `http://localhost:8000`.
3. Subir los cambios a GitHub.
4. Esperar a que GitHub Pages publique la nueva version.
5. Abrir la URL publica y verificar.

## Datos que faltan

- Nombre del lugar.
- Direccion exacta.
- Hora de comienzo.
- Hora de finalizacion.
- URL de Google Maps.
- URL de Google Forms.
- Datos bancarios.
- Fotografias reales de la pareja.
- Frases personales para la galeria.
- URL absoluta para `og:image` cuando el sitio este publicado.
