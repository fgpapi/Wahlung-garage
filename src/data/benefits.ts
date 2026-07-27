import type { LucideIcon } from 'lucide-react';
import { FileCheck2, HandCoins, ShieldCheck, SwatchBook } from 'lucide-react';

export interface Benefit {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

export const BENEFITS: readonly Benefit[] = [
  {
    id: 'garantia',
    title: 'Garantía por escrito',
    body: 'Cada trabajo sale con su garantía impresa: la fecha, el servicio realizado y qué cubre exactamente. Si algo falla dentro del plazo, lo corregimos sin cobrarle de nuevo.',
    icon: ShieldCheck,
  },
  {
    id: 'color',
    title: 'Color por código de fábrica',
    body: 'Buscamos el código de color en la placa de su vehículo y preparamos la mezcla con ese dato. Por eso el panel reparado no queda de un tono distinto al resto de la carrocería.',
    icon: SwatchBook,
  },
  {
    id: 'aseguradoras',
    title: 'Trato directo con aseguradoras',
    body: 'Manejamos el papeleo del siniestro y entregamos el presupuesto en el formato que su aseguradora pide. Usted nos da el número de reclamo y nosotros seguimos el trámite.',
    icon: FileCheck2,
  },
  {
    id: 'pagos',
    title: 'Planes de pago',
    body: 'En trabajos mayores acordamos el pago por etapas: un adelanto para materiales y el resto contra entrega. Sin financiera de por medio y sin intereses.',
    icon: HandCoins,
  },
] as const;
