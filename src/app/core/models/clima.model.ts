/** Pronóstico de un día (ClimaResponse.java). El backend responde 204 (sin contenido) cuando no hay dato. */
export interface Clima {
  fecha: string; // formato ISO: "2026-11-20"
  temperaturaMaxima: number; // grados Celsius
  probabilidadLluvia: number; // 0 a 100 (%)
}
