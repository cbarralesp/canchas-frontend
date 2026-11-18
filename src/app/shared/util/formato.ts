import { DEPORTES, Deporte } from '../../core/models/cancha.model';

/** "2026-10-31" -> "31-10-2026" (sin pasar por Date, para evitar corrimientos de zona horaria). */
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-');
  return `${dia}-${mes}-${anio}`;
}

/** 19 -> "19:00". */
export function formatearHora(hora: number): string {
  return `${hora}:00`;
}

/** 30000 -> "$30.000" (pesos chilenos, sin decimales). */
export function formatearPrecio(monto: number): string {
  return `$${monto.toLocaleString('es-CL')}`;
}

/** "FUTBOL" -> "Fútbol". */
export function etiquetaDeporte(deporte: Deporte): string {
  return DEPORTES.find((d) => d.valor === deporte)?.etiqueta ?? deporte;
}

/** Fecha local en formato ISO (yyyy-MM-dd). No usa toISOString: ese método convierte a UTC y puede cambiar el día. */
function aIso(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function hoyIso(): string {
  return aIso(new Date());
}
