/**
 * Every photo slot on the page. Nothing here is a real image yet — each slot
 * renders as a styled placeholder that states exactly which photo belongs in it.
 *
 * TO ADD A REAL PHOTO
 * -------------------
 * Drop the file in `public/fotos/`, then add three fields to its slot:
 *
 *     { id: 'pintura-cabina',
 *       caption: 'Foto: cabina de pintura — horizontal 4:3',
 *       alt: 'Técnico aplicando pintura ...',
 *       ratio: '4/3',
 *   +   src: '/fotos/pintura-cabina.jpg',
 *   +   width: 1600,
 *   +   height: 1200 }
 *
 * The placeholder disappears and a lazy-loaded <img> takes its place. Because the
 * slot already reserves `ratio`, the layout does not move when the photo lands.
 * `width`/`height` must be the file's real pixel size so the browser can reserve
 * the box (Core Web Vitals: CLS).
 */

export type PhotoRatio = '4/3' | '3/4' | '1/1' | '16/9' | '3/2';

export interface PhotoSlot {
  id: string;
  /** Shown on the placeholder. Name the shot precisely — this is the brief. */
  caption: string;
  /** Alt text for the real photo. Also describes the placeholder to screen readers. */
  alt: string;
  /** Final aspect ratio. Held by the placeholder so nothing shifts on swap. */
  ratio: PhotoRatio;
  /** Path under /public. Set this to replace the placeholder with a real photo. */
  src?: string;
  /** Intrinsic pixel size of the file. Required whenever `src` is set. */
  width?: number;
  height?: number;
}

export const GALLERY_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'pintura', label: 'Pintura' },
  { id: 'mecanica', label: 'Mecánica' },
  { id: 'polarizado', label: 'Polarizado' },
  { id: 'tapiceria', label: 'Tapicería' },
] as const;

export type GalleryCategoryId = (typeof GALLERY_CATEGORIES)[number]['id'];
export type GalleryItemCategory = Exclude<GalleryCategoryId, 'todos'>;

export interface GalleryItem extends PhotoSlot {
  category: GalleryItemCategory;
}

/**
 * The filterable grid. Ratios are deliberately mixed so the masonry reads as a
 * real gallery rather than a uniform 3x3 of stock images.
 */
export const GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    id: 'pintura-cabina',
    category: 'pintura',
    caption: 'Foto: cabina de pintura, aplicando base — horizontal 4:3',
    alt: 'Técnico aplicando pintura base a un panel dentro de la cabina cerrada',
    ratio: '4/3',
  },
  {
    id: 'pintura-antes-guardafango',
    category: 'pintura',
    caption: 'Foto: guardafango abollado antes de reparar — vertical 3:4',
    alt: 'Guardafango delantero con abolladura profunda antes de la reparación',
    ratio: '3/4',
  },
  {
    id: 'pintura-pulido',
    category: 'pintura',
    caption: 'Foto: pulido final de la carrocería — panorámica 16:9',
    alt: 'Pulido final de la carrocería después de la pintura',
    ratio: '16/9',
  },
  {
    id: 'pintura-igualacion',
    category: 'pintura',
    caption: 'Foto: mezcla de color con el código de fábrica — cuadrada 1:1',
    alt: 'Preparación de la mezcla de pintura según el código de color del vehículo',
    ratio: '1/1',
  },
  {
    id: 'mecanica-escaner',
    category: 'mecanica',
    caption: 'Foto: escaneo computarizado del motor — horizontal 4:3',
    alt: 'Escáner automotriz conectado al puerto de diagnóstico del vehículo',
    ratio: '4/3',
  },
  {
    id: 'mecanica-suspension',
    category: 'mecanica',
    caption: 'Foto: vehículo en rampa, trabajo de suspensión — vertical 3:4',
    alt: 'Vehículo levantado en rampa durante una reparación de suspensión',
    ratio: '3/4',
  },
  {
    id: 'mecanica-frenos',
    category: 'mecanica',
    caption: 'Foto: cambio de pastillas y discos de freno — cuadrada 1:1',
    alt: 'Cambio de pastillas y discos de freno en el taller',
    ratio: '1/1',
  },
  {
    id: 'polarizado-instalacion',
    category: 'polarizado',
    caption: 'Foto: instalación de película en el parabrisas — horizontal 3:2',
    alt: 'Instalación de película polarizada sobre el vidrio del vehículo',
    ratio: '3/2',
  },
  {
    id: 'polarizado-terminado',
    category: 'polarizado',
    caption: 'Foto: vehículo terminado con polarizado — panorámica 16:9',
    alt: 'Vehículo terminado mostrando el polarizado instalado en todos los vidrios',
    ratio: '16/9',
  },
  {
    id: 'tapiceria-asientos',
    category: 'tapiceria',
    caption: 'Foto: asientos forrados en cuero — horizontal 4:3',
    alt: 'Asientos delanteros recién forrados en cuero',
    ratio: '4/3',
  },
  {
    id: 'tapiceria-cielo',
    category: 'tapiceria',
    caption: 'Foto: cielo reparado antes y después — vertical 3:4',
    alt: 'Cielo interior del vehículo reparado y reinstalado',
    ratio: '3/4',
  },
  {
    id: 'tapiceria-timon',
    category: 'tapiceria',
    caption: 'Foto: timón restaurado en cuero — cuadrada 1:1',
    alt: 'Timón restaurado y forrado en cuero con costura reforzada',
    ratio: '1/1',
  },
] as const;

/** One supporting photo per service section, keyed by the service id. */
export const SERVICE_PHOTOS: Record<string, PhotoSlot> = {
  'enderezado-y-pintura': {
    id: 'servicio-pintura',
    caption: 'Foto: panel en cabina, pistola en mano — horizontal 3:2',
    alt: 'Aplicación de pintura sobre un panel dentro de la cabina',
    ratio: '3/2',
  },
  'mecanica-general': {
    id: 'servicio-mecanica',
    caption: 'Foto: motor abierto durante el diagnóstico — horizontal 3:2',
    alt: 'Motor abierto durante una revisión de diagnóstico',
    ratio: '3/2',
  },
  polarizado: {
    id: 'servicio-polarizado',
    caption: 'Foto: corte de película a medida — horizontal 3:2',
    alt: 'Corte a medida de la película polarizada sobre el vidrio',
    ratio: '3/2',
  },
  tapiceria: {
    id: 'servicio-tapiceria',
    caption: 'Foto: costura de tapicería en proceso — horizontal 3:2',
    alt: 'Trabajo de costura sobre la tapicería de un asiento',
    ratio: '3/2',
  },
};

/**
 * The before/after comparator. Both photos must be shot from the same position,
 * same focal length and same lighting, or the slider reveals the mismatch rather
 * than the repair.
 */
export const COMPARISON: { before: PhotoSlot; after: PhotoSlot } = {
  before: {
    id: 'comparador-antes',
    caption: 'Foto ANTES: puerta golpeada, mismo ángulo — panorámica 16:9',
    alt: 'Puerta lateral con golpe y pintura dañada antes de la reparación',
    ratio: '16/9',
  },
  after: {
    id: 'comparador-despues',
    caption: 'Foto DESPUÉS: misma puerta reparada y pintada — panorámica 16:9',
    alt: 'La misma puerta lateral ya enderezada, pintada y pulida',
    ratio: '16/9',
  },
};

/** Shop photo used beside the "Nosotros" copy. */
export const ABOUT_PHOTO: PhotoSlot = {
  id: 'nosotros-taller',
  caption: 'Foto: fachada o interior del taller con el equipo — horizontal 4:3',
  alt: 'Instalaciones de Wahlung Garage en Aldea Germania, Tegucigalpa',
  ratio: '4/3',
};

/** Maps a ratio token to the CSS `aspect-ratio` value. */
export const RATIO_CSS: Record<PhotoRatio, string> = {
  '4/3': '4 / 3',
  '3/4': '3 / 4',
  '1/1': '1 / 1',
  '16/9': '16 / 9',
  '3/2': '3 / 2',
};
