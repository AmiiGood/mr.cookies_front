import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetVentaResponse } from '../../interfaces/venta/venta';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}ventas`;

  constructor(private http: HttpClient) {}

  getVentas(): Observable<GetVentaResponse> {
    return this.http.get<GetVentaResponse>(`${this.apiUrl}/getVentas`);
  }

  
}
