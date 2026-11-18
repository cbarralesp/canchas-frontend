import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArriendoApi } from '../../core/api/arriendo.api';
import { ClimaApi } from '../../core/api/clima.api';
import { ApiError } from '../../core/models/api-error';
import { HORAS_DEL_DIA } from '../../core/models/arriendo.model';
import { DisponibilidadCancha } from '../../core/models/cancha.model';
import { Clima } from '../../core/models/clima.model';
import { etiquetaDeporte, formatearFecha, formatearHora, formatearPrecio, hoyIso } from '../../shared/util/formato';

/** Pantalla de disponibilidad: canchas del día con sus 14 horas. Tocar una hora libre lleva al formulario de arriendo. */
@Component({
  selector: 'app-disponibilidad-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './disponibilidad.page.html',
})
export class DisponibilidadPage {
  private readonly api = inject(ArriendoApi);
  private readonly climaApi = inject(ClimaApi);

  protected readonly horas = HORAS_DEL_DIA;
  protected readonly fechaMinima = hoyIso();
  protected readonly etiquetaDeporte = etiquetaDeporte;
  protected readonly formatearFecha = formatearFecha;
  protected readonly formatearHora = formatearHora;
  protected readonly formatearPrecio = formatearPrecio;

  // Estado de la pantalla guardado en "signals": cuando cambian, Angular actualiza solo lo que depende de ellos.
  protected readonly fecha = signal(hoyIso());
  protected readonly canchas = signal<DisponibilidadCancha[]>([]);
  // undefined = consultando · null = sin pronóstico (la API externa falló o la fecha está fuera de rango)
  protected readonly clima = signal<Clima | null | undefined>(undefined);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  protected cambiarFecha(valor: string): void {
    if (valor) {
      this.fecha.set(valor);
      this.cargar();
    }
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    // El clima es informativo: si falla, la disponibilidad sigue funcionando igual
    this.clima.set(undefined);
    this.climaApi.pronostico(this.fecha()).subscribe({
      next: (c) => this.clima.set(c),
      error: () => this.clima.set(null),
    });
    this.api.disponibilidad(this.fecha()).subscribe({
      next: (canchas) => {
        this.canchas.set(canchas);
        this.cargando.set(false);
      },
      error: (e: ApiError) => {
        this.canchas.set([]);
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }
}
