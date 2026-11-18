import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ArriendoApi } from '../../core/api/arriendo.api';
import { ApiError } from '../../core/models/api-error';
import { Arriendo } from '../../core/models/arriendo.model';
import { ToastService } from '../../shared/ui/toast.service';
import { formatearFecha, formatearHora, formatearPrecio } from '../../shared/util/formato';

/** Administración de arriendos: ve todas las reservas (o las de un día) y puede cancelarlas. */
@Component({
  selector: 'app-arriendos-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arriendos.page.html',
})
export class ArriendosAdminPage {
  private readonly api = inject(ArriendoApi);
  private readonly toast = inject(ToastService);

  protected readonly formatearFecha = formatearFecha;
  protected readonly formatearHora = formatearHora;
  protected readonly formatearPrecio = formatearPrecio;

  protected readonly fecha = signal<string | null>(null); // null = todos los arriendos
  protected readonly arriendos = signal<Arriendo[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  protected filtrar(valor: string): void {
    this.fecha.set(valor || null);
    this.cargar();
  }

  protected cancelar(arriendo: Arriendo): void {
    if (!confirm('¿Cancelar este arriendo?')) {
      return;
    }
    this.api.cancelarComoAdmin(arriendo.id).subscribe({
      next: () => {
        this.toast.exito('Arriendo cancelado');
        this.cargar();
      },
      error: (e: ApiError) => this.toast.error(e.message),
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.api.agenda(this.fecha()).subscribe({
      next: (lista) => {
        this.arriendos.set(lista);
        this.cargando.set(false);
      },
      error: (e: ApiError) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }
}
