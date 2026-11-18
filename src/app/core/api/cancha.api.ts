import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Cancha, CanchaRequest } from '../models/cancha.model';

/** Único lugar que conoce las rutas HTTP de las canchas (CanchaRestController.java). */
@Injectable({ providedIn: 'root' })
export class CanchaApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/canchas';

  listar(): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(this.base);
  }

  obtener(id: number): Observable<Cancha> {
    return this.http.get<Cancha>(`${this.base}/${id}`);
  }

  crear(request: CanchaRequest): Observable<Cancha> {
    return this.http.post<Cancha>(this.base, request);
  }

  actualizar(id: number, request: CanchaRequest): Observable<Cancha> {
    return this.http.put<Cancha>(`${this.base}/${id}`, request);
  }

  cambiarEstado(id: number, activa: boolean): Observable<Cancha> {
    return this.http.patch<Cancha>(`${this.base}/${id}/estado`, null, {
      params: new HttpParams().set('activa', activa),
    });
  }
}
