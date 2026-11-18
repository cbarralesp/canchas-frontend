import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Arriendo, CambioArriendoRequest, CrearArriendoRequest } from '../models/arriendo.model';
import { DisponibilidadCancha } from '../models/cancha.model';

/**
 * Único lugar que conoce las rutas HTTP de los arriendos y la disponibilidad (ArriendoRestController.java).
 * Los componentes llaman a estos métodos y nunca arman URLs por su cuenta.
 */
@Injectable({ providedIn: 'root' })
export class ArriendoApi {
  private readonly http = inject(HttpClient);

  disponibilidad(fecha: string): Observable<DisponibilidadCancha[]> {
    return this.http.get<DisponibilidadCancha[]>('/api/disponibilidad', {
      params: new HttpParams().set('fecha', fecha),
    });
  }

  crear(request: CrearArriendoRequest): Observable<Arriendo> {
    return this.http.post<Arriendo>('/api/arriendos', request);
  }

  listar(email: string): Observable<Arriendo[]> {
    return this.http.get<Arriendo[]>('/api/arriendos', { params: new HttpParams().set('email', email) });
  }

  obtener(id: number, email: string): Observable<Arriendo> {
    return this.http.get<Arriendo>(`/api/arriendos/${id}`, { params: new HttpParams().set('email', email) });
  }

  modificar(id: number, request: CambioArriendoRequest): Observable<Arriendo> {
    return this.http.put<Arriendo>(`/api/arriendos/${id}`, request);
  }

  cancelar(id: number, email: string): Observable<Arriendo> {
    return this.http.patch<Arriendo>(`/api/arriendos/${id}/cancelacion`, null, {
      params: new HttpParams().set('email', email),
    });
  }

  /** Administración: todos los arriendos, o solo los de una fecha. */
  agenda(fecha: string | null): Observable<Arriendo[]> {
    const params = fecha ? new HttpParams().set('fecha', fecha) : new HttpParams();
    return this.http.get<Arriendo[]>('/api/admin/arriendos', { params });
  }

  cancelarComoAdmin(id: number): Observable<Arriendo> {
    return this.http.patch<Arriendo>(`/api/admin/arriendos/${id}/cancelacion`, null);
  }
}
