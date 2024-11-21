import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Cookie,
  GetCookieResponse,
  UpdateCookieBody,
} from '../../interfaces/galleta/galleta';
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

  updateCookie(
    id: number,
    cookieData: Partial<UpdateCookieBody>
  ): Observable<any> {
    console.log('updateCookie', id, cookieData);

    return this.http.put<any>(`${this.apiUrl}/updateGalleta/${id}`, cookieData);
  }
}
