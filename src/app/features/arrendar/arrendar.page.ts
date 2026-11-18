import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ArriendoApi } from '../../core/api/arriendo.api';
import { CanchaApi } from '../../core/api/cancha.api';
import { ApiError } from '../../core/models/api-error';
import { Cancha } from '../../core/models/cancha.model';
import { ToastService } from '../../shared/ui/toast.service';
import { etiquetaDeporte, formatearFecha, formatearHora, formatearPrecio } from '../../shared/util/formato';

/**
 * Formulario para arrendar la hora elegida. La cancha, la fecha y la hora llegan por la URL
 * (/arrendar?canchaId=1&fecha=2026-12-01&hora=19) gracias a withComponentInputBinding.
 */
@Component({
  selector: 'app-arrendar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './arrendar.page.html',
})
export class ArrendarPage implements OnInit {
  readonly canchaId = input<string>();
  readonly fecha = input<string>();
  readonly hora = input<string>();

  private readonly canchaApi = inject(CanchaApi);
  private readonly arriendoApi = inject(ArriendoApi);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly etiquetaDeporte = etiquetaDeporte;
  protected readonly formatearFecha = formatearFecha;
  protected readonly formatearHora = formatearHora;
  protected readonly formatearPrecio = formatearPrecio;

  protected readonly cancha = signal<Cancha | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly enviando = signal(false);

  /** Formulario reactivo: cada campo con sus validaciones (las mismas que valida el backend). */
  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,12}$/)]],
  });

  ngOnInit(): void {
    const id = Number(this.canchaId());
    if (!id || !this.fecha() || !this.hora()) {
      this.error.set('Falta elegir la cancha y el horario. Vuelve a Disponibilidad.');
      return;
    }
    this.canchaApi.obtener(id).subscribe({
      next: (cancha) => this.cancha.set(cancha),
      error: (e: ApiError) => this.error.set(e.message),
    });
  }

  protected enviar(): void {
    const cancha = this.cancha();
    if (!cancha || this.form.invalid) {
      this.form.markAllAsTouched(); // muestra los errores de todos los campos
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.arriendoApi
      .crear({
        ...this.form.getRawValue(),
        canchaId: cancha.id,
        fecha: this.fecha() as string,
        hora: Number(this.hora()),
      })
      .subscribe({
        next: (arriendo) => {
          this.toast.exito('¡Arriendo confirmado!');
          void this.router.navigate(['/mis-arriendos'], { queryParams: { email: arriendo.email } });
        },
        error: (e: ApiError) => {
          this.error.set(e.message); // por ejemplo: "Ese horario ya está arrendado"
          this.enviando.set(false);
        },
      });
  }
}
