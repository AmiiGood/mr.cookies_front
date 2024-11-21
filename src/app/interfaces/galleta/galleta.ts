export interface Cookie {
  id_galleta: number;
  nombre: string;
  cantidad: number;
  caducidad: string;
  descripcion: string;
  costo_produccion: number;
  precio_venta: number;
  estatus: boolean;
}

export interface GetCookieResponse {
  message: string;
  cookies: Cookie[];
}
