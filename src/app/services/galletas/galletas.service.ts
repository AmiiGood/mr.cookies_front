import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GetCookieResponse } from '../../interfaces/galleta/galleta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalletasService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}inventario`;
  constructor(private http: HttpClient) {}

  getCookies(): Observable<GetCookieResponse> {
    return this.http.get<GetCookieResponse>(`${this.apiUrl}/getGalletas`);
  }
}
