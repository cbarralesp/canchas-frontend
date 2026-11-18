import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ArriendoApi } from '../../core/api/arriendo.api';
import { CanchaApi } from '../../core/api/cancha.api';
import { ApiError } from '../../core/models/api-error';
import { Arriendo, HORAS_DEL_DIA } from '../../core/models/arriendo.model';
import { Cancha } from '../../core/models/cancha.model';
import { ToastService } from '../../shared/ui/toast.service';
import { etiquetaDeporte, formatearHora, formatearPrecio, hoyIso } from '../../shared/util/formato';

/** Modificar un arriendo: cambiar de cancha, fecha u hora. Ruta: /editar/:id?email=... */
@Component({
  selector: 'app-editar-arriendo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editar-arriendo.page.html',
})
export class EditarArriendoPage implements OnInit {
  readonly id = input.required<string>(); // viene de la ruta /editar/:id
  readonly email = input<string>(); //         viene del parámetro ?email=

  private readonly arriendoApi = inject(ArriendoApi);
  private readonly canchaApi = inject(CanchaApi);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly horas = HORAS_DEL_DIA;
  protected readonly fechaMinima = hoyIso();
  protected readonly etiquetaDeporte = etiquetaDeporte;
  protected readonly formatearHora = formatearHora;
  protected readonly formatearPrecio = formatearPrecio;

  protected readonly arriendo = signal<Arriendo | null>(null);
  protected readonly canchas = signal<Cancha[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly enviando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    canchaId: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', [Validators.required]],
    hora: [8, [Validators.required]],
  });

  ngOnInit(): void {
    const email = this.email();
    if (!email) {
      this.error.set('Falta el email. Vuelve a "Mis arriendos".');
      return;
    }
    this.canchaApi.listar().subscribe({
      next: (lista) => this.canchas.set(lista.filter((c) => c.activa)),
      error: (e: ApiError) => this.error.set(e.message),
    });
    this.arriendoApi.obtener(Number(this.id()), email).subscribe({
      next: (arriendo) => {
        this.arriendo.set(arriendo);
        this.form.setValue({ canchaId: arriendo.canchaId, fecha: arriendo.fecha, hora: arriendo.hora });
      },
      error: (e: ApiError) => this.error.set(e.message),
    });
  }

  protected guardar(): void {
    const email = this.email();
    if (!email || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    const { canchaId, fecha, hora } = this.form.getRawValue();
    this.arriendoApi
      .modificar(Number(this.id()), { email, canchaId: Number(canchaId), fecha, hora: Number(hora) })
      .subscribe({
        next: () => {
          this.toast.exito('Arriendo modificado correctamente');
          void this.router.navigate(['/mis-arriendos'], { queryParams: { email } });
        },
        error: (e: ApiError) => {
          this.error.set(e.message);
          this.enviando.set(false);
        },
      });
  }
}
