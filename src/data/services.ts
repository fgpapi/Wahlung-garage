import type { LucideIcon } from 'lucide-react';
import { Armchair, SprayCan, Sun, Wrench } from 'lucide-react';

export interface Service {
  /** Doubles as the section anchor and the key into SERVICE_PHOTOS. */
  id: string;
  name: string;
  /** One line, for the overview card. */
  summary: string;
  /** Opening paragraph of the full section. */
  body: string;
  bullets: readonly string[];
  icon: LucideIcon;
  /** Appended verbatim to the pre-filled WhatsApp message. */
  whatsappLabel: string;
  /** Short mono label used in the section header. */
  code: string;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'enderezado-y-pintura',
    name: 'Enderezado y Pintura',
    code: '01.1',
    summary: 'Reparación de golpes y pintura igualada con el código de fábrica.',
    body: 'Enderezamos la lámina, corregimos la estructura y pintamos en cabina cerrada. El color lo preparamos con el código de fábrica de su vehículo, no a ojo, para que el panel reparado no se note contra el resto de la carrocería.',
    bullets: [
      'Igualación de color con el código de fábrica del vehículo',
      'Pintura en cabina cerrada, libre de polvo',
      'Enderezado de lámina y corrección de estructura',
      'Pulido y detallado final antes de entregar',
    ],
    icon: SprayCan,
    whatsappLabel: 'Enderezado y Pintura',
  },
  {
    id: 'mecanica-general',
    name: 'Mecánica General',
    code: '01.2',
    summary: 'Diagnóstico con escáner, mantenimiento y reparación completa.',
    body: 'Atendemos el mantenimiento de rutina y las fallas que le dejan el carro parado. Escaneamos antes de destapar nada, para cobrarle la reparación que el vehículo necesita y no la que parece a simple vista.',
    bullets: [
      'Escaneo computarizado antes de pasarle el presupuesto',
      'Motor, frenos, suspensión y dirección',
      'Cambio de aceite, filtros y sistema de enfriamiento',
      'Revisión de 20 puntos incluida en cada servicio',
    ],
    icon: Wrench,
    whatsappLabel: 'Mecánica General',
  },
  {
    id: 'polarizado',
    name: 'Polarizado',
    code: '01.3',
    summary: 'Película para vidrios cortada a medida, con garantía escrita.',
    body: 'Instalamos película para vidrios con corte a medida para cada ventana. Antes de cortar le explicamos qué porcentaje puede llevar su vehículo, para que no tenga problemas en un retén.',
    bullets: [
      'Corte a medida por vidrio, sin recortes ni traslapes visibles',
      'Porcentajes conforme a la normativa hondureña',
      'Rechazo de calor y bloqueo de rayos UV',
      'Garantía contra burbujas, despegue y decoloración',
    ],
    icon: Sun,
    whatsappLabel: 'Polarizado',
  },
  {
    id: 'tapiceria',
    name: 'Tapicería',
    code: '01.4',
    summary: 'Forrado y restauración de asientos, cielo, timón y paneles.',
    body: 'Reparamos lo que el sol y el uso diario van dañando adentro. Forramos asientos completos, corregimos el cielo caído y restauramos timón, palanca y paneles en cuero o tela.',
    bullets: [
      'Forrado de asientos en cuero, sintético o tela',
      'Reparación de cielo caído o manchado',
      'Restauración de timón, palanca y paneles de puerta',
      'Costura reforzada, siguiendo el patrón original',
    ],
    icon: Armchair,
    whatsappLabel: 'Tapicería',
  },
] as const;
