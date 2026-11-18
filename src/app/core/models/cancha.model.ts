/** Modelos de datos de las canchas: tienen la misma forma que los DTO JSON del backend (CanchaResponse, etc.). */

export type Deporte = 'FUTBOL' | 'PADEL' | 'TENIS' | 'BASQUET';

/** Valores y textos para llenar la lista desplegable de deportes. */
export const DEPORTES: { valor: Deporte; etiqueta: string }[] = [
  { valor: 'FUTBOL', etiqueta: 'Fútbol' },
  { valor: 'PADEL', etiqueta: 'Pádel' },
  { valor: 'TENIS', etiqueta: 'Tenis' },
  { valor: 'BASQUET', etiqueta: 'Básquetbol' },
];

export interface Cancha {
  id: number;
  nombre: string;
  deporte: Deporte;
  tarifaHora: number;
  activa: boolean;
}

/** Datos que envía el administrador para crear o editar una cancha (CanchaRequest.java). */
export interface CanchaRequest {
  nombre: string;
  deporte: Deporte;
  tarifaHora: number;
}

/** Una cancha con las horas de inicio que siguen libres en la fecha consultada (DisponibilidadResponse.java). */
export interface DisponibilidadCancha {
  cancha: Cancha;
  horasLibres: number[];
}
