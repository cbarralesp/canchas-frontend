/** Modelos de datos de los arriendos: misma forma que los DTO JSON del backend. */

export type EstadoArriendo = 'CONFIRMADO' | 'CANCELADO';

/** Horas de inicio posibles (8 a 21): bloques de 1 hora entre las 08:00 y las 22:00. Igual que Arriendo.java. */
export const HORAS_DEL_DIA: number[] = Array.from({ length: 14 }, (_, i) => 8 + i);

/** ArriendoResponse.java. "modificable" indica si se deben mostrar los botones Modificar y Cancelar. */
export interface Arriendo {
  id: number;
  canchaId: number;
  nombreCancha: string;
  fecha: string; // formato ISO: "2026-12-01"
  hora: number;
  horaFin: number;
  precio: number;
  estado: EstadoArriendo;
  nombreArrendatario: string;
  email: string;
  telefono: string;
  modificable: boolean;
}

/** ArriendoRequest.java */
export interface CrearArriendoRequest {
  canchaId: number;
  fecha: string;
  hora: number;
  nombre: string;
  email: string;
  telefono: string;
}

/** CambioArriendoRequest.java */
export interface CambioArriendoRequest {
  email: string;
  canchaId: number;
  fecha: string;
  hora: number;
}
