import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CanchaApi } from '../../core/api/cancha.api';
import { ApiError } from '../../core/models/api-error';
import { Cancha, DEPORTES } from '../../core/models/cancha.model';
import { ToastService } from '../../shared/ui/toast.service';
import { etiquetaDeporte, formatearPrecio } from '../../shared/util/formato';

/** Administración de canchas (CRUD): lista, crear, editar y activar/desactivar. */
@Component({
  selector: 'app-canchas-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './canchas.page.html',
})
export class CanchasAdminPage {
  private readonly api = inject(CanchaApi);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly deportes = DEPORTES;
  protected readonly etiquetaDeporte = etiquetaDeporte;
  protected readonly formatearPrecio = formatearPrecio;

  protected readonly canchas = signal<Cancha[]>([]);
  protected readonly editandoId = signal<number | null>(null); // null = el formulario crea una cancha nueva
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(60)]],
    deporte: ['FUTBOL', [Validators.required]],
    tarifaHora: [30000, [Validators.required, Validators.min(5000), Validators.max(100000)]],
  });

  constructor() {
    this.cargar();
  }

  protected editar(c: Cancha): void {
    this.editandoId.set(c.id);
    this.form.setValue({ nombre: c.nombre, deporte: c.deporte, tarifaHora: c.tarifaHora });
    this.error.set(null);
  }

  protected cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', deporte: 'FUTBOL', tarifaHora: 30000 });
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valores = this.form.getRawValue();
    const request = {
      nombre: valores.nombre.trim(),
      deporte: valores.deporte as Cancha['deporte'],
      tarifaHora: Number(valores.tarifaHora),
    };
    const id = this.editandoId();
    const operacion = id === null ? this.api.crear(request) : this.api.actualizar(id, request);
    operacion.subscribe({
      next: () => {
        this.toast.exito(id === null ? 'Cancha creada' : 'Cancha actualizada');
        this.cancelarEdicion();
        this.cargar();
      },
      error: (e: ApiError) => this.error.set(e.message),
    });
  }

  protected alternarEstado(c: Cancha): void {
    this.api.cambiarEstado(c.id, !c.activa).subscribe({
      next: () => {
        this.toast.exito(c.activa ? 'Cancha desactivada' : 'Cancha activada');
        this.cargar();
      },
      error: (e: ApiError) => this.toast.error(e.message),
    });
  }

  private cargar(): void {
    this.api.listar().subscribe({
      next: (lista) => this.canchas.set(lista),
      error: (e: ApiError) => this.error.set(e.message),
    });
  }
}
