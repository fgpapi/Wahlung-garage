# Wahlung Garage — sitio web

Landing page de una sola pantalla para Wahlung Garage (Tegucigalpa, Honduras).
Su único objetivo es que un dueño de vehículo mande un mensaje de WhatsApp
pidiendo cotización.

Vite + React + TypeScript + Tailwind CSS v4. Sin CMS, sin backend, sin base de
datos. Se despliega tal cual en Vercel.

---

## Empezar

```bash
npm install
npm run dev          # http://127.0.0.1:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica tipos y genera `dist/` |
| `npm run preview` | Sirve `dist/` para revisarlo |
| `npm run typecheck` | Solo verificación de tipos |
| `npm run check:contrast` | Verifica todos los pares de color contra WCAG |
| `npm run audit` | Revisa responsive, accesibilidad e interacciones en Chrome real |
| `npm run assets:media` | Regenera el video y el póster del hero |
| `npm run assets:logo` | Regenera el logo, el ícono y la imagen social |

> `npm install` puede pedir aprobar scripts de instalación (npm 11).
> Ejecute `npm approve-scripts esbuild ffmpeg-static` si aparece la advertencia.

---

## 1. Cambiar fotos (lo más común)

**Todas las fotos del sitio viven en un solo archivo: [`src/data/gallery.ts`](src/data/gallery.ts).**

Mientras no haya foto real, cada espacio se dibuja como un marcador oscuro que
dice exactamente qué foto va ahí. Para poner la foto real:

1. Guarde el archivo en `public/fotos/` (cree la carpeta si no existe).
2. Busque el espacio en `src/data/gallery.ts` y agregue **tres líneas**:

```ts
{
  id: 'pintura-cabina',
  caption: 'Foto: cabina de pintura, aplicando base — horizontal 4:3',
  alt: 'Técnico aplicando pintura base a un panel dentro de la cabina cerrada',
  ratio: '4/3',
  src: '/fotos/pintura-cabina.jpg',   // <- agregar
  width: 1600,                        // <- agregar (ancho real del archivo)
  height: 1200,                       // <- agregar (alto real del archivo)
},
```

Eso es todo. El marcador desaparece y aparece la foto, con `loading="lazy"` y el
espacio ya reservado, así que **la página no salta** cuando carga.

### Reglas para las fotos

- `width` y `height` deben ser las medidas **reales** del archivo. Si están mal,
  la página se mueve al cargar y baja la calificación de Google.
- Respete el `ratio` que ya trae cada espacio (`4/3`, `3/4`, `1/1`, `16/9`, `3/2`).
  Si la foto tiene otra proporción se recorta desde el centro.
- Cambie también el `alt` para que describa la foto real. Es lo que leen Google y
  los lectores de pantalla.
- Comprima antes de subir (JPG de calidad ~80, máximo 1600px de ancho).

### Dónde está cada grupo de fotos

| En el archivo | Dónde sale en la página |
|---|---|
| `GALLERY_ITEMS` | La galería con filtros (sección 04) |
| `SERVICE_PHOTOS` | La foto de cada uno de los cuatro servicios |
| `COMPARISON` | El comparador Antes/Después (sección 05) |
| `ABOUT_PHOTO` | La sección "Nosotros" |

> **El comparador es lo más importante de la página.** Las dos fotos deben estar
> tomadas desde **el mismo punto, con el mismo lente y la misma luz**. Si no, el
> deslizador enseña la diferencia de encuadre en vez de enseñar la reparación.

---

## 2. Cambiar textos

Ningún texto está escrito dentro del código de los componentes. Todo está en
`src/data/`:

| Archivo | Qué contiene |
|---|---|
| [`copy.ts`](src/data/copy.ts) | Hero, títulos de sección, "Nosotros", pie de página, textos de accesibilidad |
| [`services.ts`](src/data/services.ts) | Los cuatro servicios: nombre, descripción y viñetas |
| [`benefits.ts`](src/data/benefits.ts) | Los cuatro compromisos (sección 02) |
| [`process.ts`](src/data/process.ts) | Los cuatro pasos (sección 03) |
| [`faq.ts`](src/data/faq.ts) | Las seis preguntas frecuentes |
| [`testimonials.ts`](src/data/testimonials.ts) | Los testimonios |
| [`site.ts`](src/data/site.ts) | Dirección, horario, teléfonos, menú, clientes corporativos |

### Los testimonios son de ejemplo

`src/data/testimonials.ts` trae tres testimonios **inventados**, marcados con
`TODO`. Están escritos para verse creíbles y sobrios, pero **no son de clientes
reales**. Reemplácelos antes de publicar: basta una captura de WhatsApp con
permiso del cliente.

---

## 3. Cambiar teléfonos, dirección u horario

Los números están en **un solo lugar**: [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts).

```ts
export const WHATSAPP_PRIMARY = '50488250870';    // principal
export const WHATSAPP_SECONDARY = '50433669984';  // alterno
```

Formato: código de país sin `+` ni espacios. De ahí salen automáticamente todos
los botones de WhatsApp, los enlaces `tel:` y el texto que se muestra.

El mensaje que se escribe solo también está en ese archivo:

```ts
const MESSAGE_BASE = 'Hola, quiero cotizar un servicio';
// Con servicio:  "Hola, quiero cotizar un servicio de Polarizado"
```

La dirección y el horario están en [`src/data/site.ts`](src/data/site.ts).

> ⚠️ **Importante:** los teléfonos, la dirección y el horario también aparecen en
> los datos estructurados (`JSON-LD`) dentro de [`index.html`](index.html), que es
> lo que lee Google para la ficha del negocio. Están ahí a propósito, para que
> Google los vea sin ejecutar JavaScript. **Si cambia un dato, cámbielo en los dos
> lugares.**

---

## 4. Redes sociales

En `FOOTER.social` dentro de [`src/data/copy.ts`](src/data/copy.ts) los enlaces
están en `'#'` porque todavía no hay perfiles confirmados. Ponga las URL reales:

```ts
social: [
  { label: 'Facebook', href: 'https://facebook.com/...' },
  { label: 'Instagram', href: 'https://instagram.com/...' },
],
```

---

## 5. Logos de Hertz y Blintec

La barra de confianza muestra los nombres escritos con tipografía, no los logos
reales. Fue una decisión deliberada: **usar un logo aproximado o sacado de
internet es uso indebido de marca.** Cuando las dos empresas autoricen sus
archivos oficiales, reemplácelos en `src/components/TrustBar.tsx`.

---

## 6. Archivos de marca (logo, video, ícono)

Los originales están en `media/` y **no se publican**. De ahí se generan los
archivos de `public/`:

```bash
npm run assets:media   # video del hero + pósters   (necesita ffmpeg-static)
npm run assets:logo    # logo, ícono, imagen social (Windows: usa .NET)
```

| Generado | Origen | Para qué |
|---|---|---|
| `public/hero.mp4` | `media/hero.source.mp4` | Fondo del hero (456 KB, era 3.3 MB) |
| `public/hero-poster.jpg` | primer cuadro del video | `poster` del video |
| `public/hero-poster-800.jpg` | primer cuadro del video | Imagen fija en celular |
| `public/logo.webp` | `media/logo.source.jpeg` | Logo completo, para fondos claros |
| `public/logo-mark.webp` | `media/logo.source.jpeg` | Solo el emblema, sirve en claro y oscuro |
| `public/og-image.jpg` | póster + emblema | Vista previa al compartir el enlace |

**Para cambiar el video del hero:** reemplace `media/hero.source.mp4` y ejecute
`npm run assets:media`. Los archivos generados sí se suben a git — Vercel no
ejecuta ffmpeg al desplegar.

El logo original es un JPEG sobre fondo blanco. El script le quita el fondo
(incluida la sombra gris) y separa el emblema del texto automáticamente.

---

## 7. Colores y tipografía

Los colores de marca **se sacaron del archivo del logo**, no se inventaron. Están
en [`src/styles/theme.css`](src/styles/theme.css) con el comentario de dónde
salió cada uno:

| Token | Valor | De dónde salió |
|---|---|---|
| `--color-brand-primary` | `#FF6600` | La palabra "GARAGE" del logo |
| `--color-brand-navy` | `#042653` | La palabra "WAHLUNG" del logo |
| `--color-brand-secondary` | `#005ACC` | Las cinco estrellas del logo |
| `--color-brand-bright` | `#009EF7` | La salpicadura azul |

### Por qué los botones naranjas llevan letra negra

`#FF6600` con letra blanca da 2.94:1 de contraste y **no cumple** el mínimo de
accesibilidad (4.5:1). Con letra casi negra da 6.67:1 y sí cumple. Por eso todos
los botones naranjas llevan letra oscura. No lo cambie a blanco.

Por la misma razón el naranja **nunca se usa como texto sobre fondo claro**: para
eso existe `--color-brand-primary-ink` (`#B93504`, 5.88:1).

Ejecute `npm run check:contrast` después de tocar cualquier color. Falla si
alguna combinación baja del mínimo.

> Ojo: el verificador revisa los tokens, **no** las versiones con transparencia
> (`text-ink-muted/60`). Evite los modificadores de opacidad en texto.

Tipografía: **Archivo** para títulos e **IBM Plex Sans/Mono** para texto y datos
técnicos. Se cargan desde el propio sitio (`@fontsource`), no desde Google.

---

## 8. Desplegar en Vercel

El repositorio ya trae `vercel.json`. Importe el proyecto en Vercel y no hay que
configurar nada más:

- Framework: Vite (detectado solo)
- Build: `npm run build`
- Output: `dist`

Después de publicar con el dominio real, actualice el dominio en:

- `index.html` — `canonical`, etiquetas `og:` y el bloque `JSON-LD`
- `src/data/site.ts` — `SITE.url`
- `public/sitemap.xml`
- `public/robots.txt`

---

## 9. Verificación

`npm run audit` abre el Chrome instalado y revisa la página a 360, 768 y 1440 px:

- que no haya barra de desplazamiento horizontal
- que el video **no** se cargue en celular (abajo de 768px) y salga el póster
- que todos los botones midan al menos 44×44 px
- que toda imagen tenga `alt` y que los encabezados no salten de nivel
- que el menú, el desplegable, el acordeón, la galería y el comparador funcionen
  con teclado
- que todos los enlaces de WhatsApp y los anclas `#` lleguen a algún lado

Resultado de la última corrida completa:

| Medida | Resultado |
|---|---|
| Lighthouse — Rendimiento (celular) | **93** |
| Lighthouse — Accesibilidad | **100** |
| Lighthouse — Buenas prácticas | **100** |
| Lighthouse — SEO | **100** |
| Largest Contentful Paint | 2.7 s |
| Total Blocking Time | 50 ms |
| Cambio de diseño acumulado (CLS) | **0.001** |
| `npm run audit` | 54 verificaciones, 0 fallas |
| `npm run check:contrast` | 21 pares, todos pasan |
| `npm run build` | Sin errores de TypeScript |

Medido sobre la compilación de producción (`npm run preview`), con Chrome en modo
celular y red simulada.

---

## Estructura

```
media/              Originales (logo y video). No se publican.
public/             Archivos generados + robots.txt + sitemap.xml
scripts/            Generación de imágenes y verificación
src/
  components/       Secciones de la página
    ui/             Piezas reutilizables (botón, foto, encabezado…)
  data/             TODOS los textos y las fotos
  lib/              WhatsApp, hooks, utilidades
  styles/theme.css  Colores, tipografía y estilos base
index.html          SEO, Open Graph y datos estructurados
```

Todo el código y los comentarios están en inglés; todo lo que ve el cliente está
en español de Honduras.
