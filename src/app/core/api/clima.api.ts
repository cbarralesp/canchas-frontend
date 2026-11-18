import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Clima } from '../models/clima.model';

/** Único lugar que conoce la ruta del pronóstico (ClimaRestController.java). */
@Injectable({ providedIn: 'root' })
export class ClimaApi {
  private readonly http = inject(HttpClient);

  /** Responde el pronóstico, o null si el backend contesta 204 (sin pronóstico disponible). */
  pronostico(fecha: string): Observable<Clima | null> {
    return this.http.get<Clima | null>('/api/clima', { params: new HttpParams().set('fecha', fecha) });
  }
}
