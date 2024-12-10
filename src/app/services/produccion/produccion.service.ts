import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionCookieResponse } from '../../interfaces/produccion/produccion';
import {
  StatusUpdate,
  UpdateStatusResponse,
} from '../../interfaces/produccion/produccion';

@Injectable({
  providedIn: 'root',
})
export class ProduccionService {
  private baseUrl = `${environment.apiUrl}produccion`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de galletas en producción
   */
  getProduction(): Observable<ProductionCookieResponse> {
    return this.http.get<ProductionCookieResponse>(
      `${this.baseUrl}/getProduction`
    );
  }

  /**
   * Actualiza el estado de una galleta en producción
   * @param cookieId ID de la galleta a actualizar
   * @param status Nuevo estado de la galleta
   */
  updateStatus(
    cookieId: number,
    status: StatusUpdate
  ): Observable<UpdateStatusResponse> {
    return this.http.put<UpdateStatusResponse>(
      `${this.baseUrl}/updateEstatus/${cookieId}`,
      status
    );
  }

  /**
   * Obtiene el siguiente estado en el flujo de producción
   * @param currentStatus Estado actual de la galleta
   */
  getNextStatus(currentStatus: string): string {
    switch (currentStatus.toLowerCase()) {
      case 'preparacion':
        return 'horneado';
      case 'horneado':
        return 'enfriando';
      case 'enfriando':
        return 'listo';
      default:
        return currentStatus;
    }
  }

  /**
   * Verifica si la galleta puede progresar al siguiente estado
   * @param currentStatus Estado actual de la galleta
   */
  canProgress(currentStatus: string): boolean {
    return !['listo', 'ok'].includes(currentStatus.toLowerCase());
  }
}
