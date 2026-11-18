import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ArriendoApi } from '../../core/api/arriendo.api';
import { ApiError } from '../../core/models/api-error';
import { Arriendo } from '../../core/models/arriendo.model';
import { ToastService } from '../../shared/ui/toast.service';
import { formatearFecha, formatearHora, formatearPrecio } from '../../shared/util/formato';

/** "Mis arriendos": busca por email, muestra los arriendos y permite modificarlos o cancelarlos. */
@Component({
  selector: 'app-mis-arriendos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './mis-arriendos.page.html',
})
export class MisArriendosPage implements OnInit {
  /** Llega por la URL (?email=...) cuando se viene desde el formulario de arriendo o desde "Modificar". */
  readonly email = input<string>();

  private readonly api = inject(ArriendoApi);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly formatearFecha = formatearFecha;
  protected readonly formatearHora = formatearHora;
  protected readonly formatearPrecio = formatearPrecio;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  protected readonly buscado = signal<string | null>(null); // email con el que se hizo la última búsqueda
  protected readonly arriendos = signal<Arriendo[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const inicial = this.email();
    if (inicial) {
      this.form.controls.email.setValue(inicial);
      this.buscar();
    }
  }

  protected buscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.getRawValue().email.trim();
    this.cargando.set(true);
    this.error.set(null);
    this.api.listar(email).subscribe({
      next: (lista) => {
        this.buscado.set(email);
        this.arriendos.set(lista);
        this.cargando.set(false);
      },
      error: (e: ApiError) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected cancelar(arriendo: Arriendo): void {
    const email = this.buscado();
    if (!email || !confirm('¿Cancelar este arriendo? El horario quedará libre.')) {
      return;
    }
    this.api.cancelar(arriendo.id, email).subscribe({
      next: () => {
        this.toast.exito('Arriendo cancelado');
        this.buscar(); // recarga la lista para ver el nuevo estado
      },
      error: (e: ApiError) => this.toast.error(e.message),
    });
  }
}
