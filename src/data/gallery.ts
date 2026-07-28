/**
 * Every photo slot on the page.
 *
 * Slots with a `stem` render a real <picture>; slots without one still render
 * the styled placeholder that states which shot belongs there.
 *
 * TO ADD A REAL PHOTO
 * -------------------
 * 1. Drop the original in `source-images/` (originals are never touched again).
 * 2. Add it to PHOTOS in `scripts/build-photos.mjs`, run `npm run assets:photos`.
 * 3. Fill in the slot here from the line the script prints:
 *
 *     { id: 'servicio-polarizado',
 *       caption: 'L200 con polarizado instalado en todos los vidrios',
 *       alt: 'Mitsubishi L200 blanca con los vidrios ...',
 *       ratio: '16/9',
 *   +   stem: '/images/servicios/polarizado-1',
 *   +   widths: [640, 1024, 1599],
 *   +   width: 1599,
 *   +   height: 899 }
 *
 * `width`/`height` must be the largest derivative's real pixel size. Every box on
 * the page is reserved from those two numbers — the tile takes the shape of the
 * photo, so nothing is ever cropped to fit and nothing shifts on load (CLS).
 */

/** Only used to reserve a box for a slot that has no file yet. */
export type PhotoRatio = '4/3' | '3/4' | '1/1' | '16/9' | '3/2';

export interface PhotoSlot {
  id: string;
  /** Shown under the photo in the lightbox, and on the placeholder as the brief. */
  caption: string;
  /** Describes what is actually in the frame. Also read out for the placeholder. */
  alt: string;
  /** Path stem under /public. Derivatives are `${stem}-${w}.webp` and `.jpg`. */
  stem?: string;
  /** Generated widths, ascending. The largest is what the lightbox loads. */
  widths?: readonly number[];
  /**
   * Intrinsic pixel size of the largest derivative. Required whenever `stem` is
   * set: it drives both the `width`/`height` attributes and the reserved box.
   */
  width?: number;
  height?: number;
  /** Placeholder-only. Ignored once `width`/`height` are present. */
  placeholderRatio?: PhotoRatio;
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
 * The filterable grid. Ordered so the "Todos" view alternates orientations
 * rather than stacking every portrait shot into one column of the masonry.
 */
export const GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    id: 'pintura-dmax-gris',
    category: 'pintura',
    caption: 'D-Max gris entregada a flota corporativa',
    alt: 'Isuzu D-Max gris terminada, estacionada junto a la flota de pickups blancas después del trabajo de pintura',
    stem: '/images/galeria/pintura-1',
    widths: [640, 1024, 1280],
    width: 1280,
    height: 720,
  },
  {
    id: 'tapiceria-conductor-hilux',
    category: 'tapiceria',
    caption: 'Asiento de conductor reforrado en tela',
    alt: 'Asiento del conductor de una Toyota Hilux reforrado en tela con patrón geométrico gris sobre negro',
    stem: '/images/galeria/tapiceria-1',
    widths: [640, 1024, 1200],
    width: 1200,
    height: 1600,
  },
  {
    id: 'mecanica-choque-frontal',
    category: 'mecanica',
    caption: 'Ingreso: choque frontal antes de presupuestar',
    alt: 'Sedán rojo con el frente destruido por un choque, con el capó doblado, el faro roto y el radiador expuesto, recién ingresado al taller',
    stem: '/images/galeria/mecanica-1',
    widths: [640, 1024, 1200],
    width: 1200,
    height: 1600,
  },
  {
    id: 'polarizado-frontier-noche',
    category: 'polarizado',
    caption: 'Frontier con polarizado terminado',
    alt: 'Nissan Frontier plateada fotografiada de noche, con el polarizado ya instalado reflejando las luces del patio',
    stem: '/images/galeria/polarizado-1',
    widths: [640, 1024, 1600],
    width: 1600,
    height: 1200,
  },
  {
    id: 'pintura-dmax-blanca',
    category: 'pintura',
    caption: 'D-Max blanca lista para entrega',
    alt: 'Isuzu D-Max blanca con placa JAB0537 recién pintada, estacionada entre otras unidades de la flota',
    stem: '/images/galeria/pintura-2',
    widths: [640, 1024, 1280],
    width: 1280,
    height: 720,
  },
  {
    id: 'tapiceria-copiloto-panel',
    category: 'tapiceria',
    caption: 'Copiloto y panel de puerta terminados',
    alt: 'Asiento del copiloto y panel de puerta reforrados, con la consola central y los portavasos ya montados',
    stem: '/images/galeria/tapiceria-2',
    widths: [640, 1024, 1200],
    width: 1200,
    height: 1600,
  },
  {
    id: 'mecanica-patrulla-golpe',
    category: 'mecanica',
    caption: 'PN-375 con daño en el costado trasero',
    alt: 'Pickup policial PN-375 con el costado trasero hundido y el parachoques desprendido, esperando enderezado',
    stem: '/images/galeria/mecanica-2',
    widths: [640, 1024, 1280],
    width: 1280,
    height: 720,
  },
  {
    id: 'tapiceria-banca-trasera',
    category: 'tapiceria',
    caption: 'Banca trasera reforrada y reinstalada',
    alt: 'Banca trasera de doble cabina reforrada en tela con patrón, con los cinturones y las hebillas reinstalados',
    stem: '/images/galeria/tapiceria-3',
    widths: [640, 1024, 1200],
    width: 1200,
    height: 1600,
  },
  {
    id: 'pintura-patrulla-entregada',
    category: 'pintura',
    caption: 'Unidad policial devuelta con pintura y rotulación completas',
    alt: 'Pickup de la Policía Nacional en blanco y azul, ya pintada y rotulada, estacionada frente a la caseta de control',
    stem: '/images/galeria/pintura-3',
    widths: [640, 1024, 1280],
    width: 1280,
    height: 720,
  },
  {
    id: 'tapiceria-costura-contraste',
    category: 'tapiceria',
    caption: 'Asientos delanteros con costura de contraste',
    alt: 'Asiento delantero forrado en tela negra con costura blanca de contraste, con el segundo asiento al fondo',
    stem: '/images/galeria/tapiceria-4',
    widths: [640, 1024, 1200],
    width: 1200,
    height: 1600,
  },
] as const;

/** One supporting photo per service section, keyed by the service id. */
export const SERVICE_PHOTOS: Record<string, PhotoSlot> = {
  'enderezado-y-pintura': {
    id: 'servicio-pintura',
    caption: 'Hilux doble cabina entregada después de enderezado y pintura',
    alt: 'Toyota Hilux plateada recién entregada, estacionada a la entrada del taller junto al portón, con el capó y los costados ya pulidos',
    stem: '/images/servicios/pintura-1',
    widths: [640, 960],
    width: 960,
    height: 1280,
  },
  'mecanica-general': {
    id: 'servicio-mecanica',
    caption: 'Frente desarmado para trabajar radiador y soportes',
    alt: 'Pickup dentro del taller con el frente desarmado: parachoques y faros fuera, radiador e intercooler a la vista y el parabrisas enmascarado con cinta',
    stem: '/images/servicios/mecanica-general',
    widths: [640, 1024, 1599],
    width: 1599,
    height: 899,
  },
  polarizado: {
    id: 'servicio-polarizado',
    caption: 'L200 con polarizado instalado en todos los vidrios',
    alt: 'Mitsubishi L200 blanca con los vidrios laterales y el parabrisas ya polarizados, estacionada en el patio del taller',
    stem: '/images/servicios/polarizado-1',
    widths: [640, 1024, 1599],
    width: 1599,
    height: 899,
  },
  tapiceria: {
    id: 'servicio-tapiceria',
    caption: 'Cabina de NP300 con los asientos delanteros reforrados',
    alt: 'Interior de una Nissan NP300 con el asiento del conductor, el volante y la palanca de cambios, forrados en tela gris y negra',
    stem: '/images/servicios/tapiceria-1',
    widths: [640, 1024, 1200],
    width: 1200,
    height: 1600,
  },
};

/**
 * The before/after comparator: the same Mazda 3, same rear three-quarter angle.
 * Both files are published at exactly 1600x1204 — `MUST_MATCH` in
 * scripts/build-photos.mjs fails the build if that ever stops being true, because
 * a slider whose two halves are different shapes shifts the framing as it moves.
 */
export const COMPARISON: { before: PhotoSlot; after: PhotoSlot } = {
  before: {
    id: 'comparador-antes',
    caption: 'Antes: costado trasero golpeado y pintura opaca',
    alt: 'Mazda 3 hatchback cubierto de polvo de lijado, con la pintura opaca y el costado y el parachoques traseros golpeados, sobre la grava del taller',
    stem: '/images/comparador/antes',
    widths: [640, 1024, 1600],
    width: 1600,
    height: 1204,
  },
  after: {
    id: 'comparador-despues',
    caption: 'Después: el mismo Mazda 3 pintado y pulido',
    alt: 'El mismo Mazda 3 hatchback ya pintado en plata metálico y pulido, con el costado y el parachoques traseros corregidos, tomado desde el mismo ángulo',
    stem: '/images/comparador/despues',
    widths: [640, 1024, 1600],
    width: 1600,
    height: 1204,
  },
};

/**
 * The shop itself, beside the "Un taller, no una agencia" copy. Both are 4:3
 * landscape, so the section pairs them as one large plus one offset smaller
 * rather than as two equal squares.
 */
export const ABOUT_PHOTOS: readonly PhotoSlot[] = [
  {
    id: 'nosotros-predio',
    caption: 'El predio, sobre la calle principal de Aldea Germania',
    alt: 'Terreno del taller delimitado por un muro de piedra y ladrillo, con los medidores eléctricos a un costado y un edificio de dos niveles con portones negros al fondo',
    stem: '/images/nosotros/local-1',
    widths: [640, 1024, 1600],
    width: 1600,
    height: 1200,
  },
  {
    id: 'nosotros-patio',
    caption: 'El patio de maniobras y la nave de trabajo',
    alt: 'Patio de concreto del taller con la nave de lámina abierta a un costado, los portones de servicio al fondo y el cerro detrás',
    stem: '/images/nosotros/local-2',
    widths: [640, 1024, 1600],
    width: 1600,
    height: 1200,
  },
] as const;

/** Maps a ratio token to the CSS `aspect-ratio` value. */
export const RATIO_CSS: Record<PhotoRatio, string> = {
  '4/3': '4 / 3',
  '3/4': '3 / 4',
  '1/1': '1 / 1',
  '16/9': '16 / 9',
  '3/2': '3 / 2',
};
