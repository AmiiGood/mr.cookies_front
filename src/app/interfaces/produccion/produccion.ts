export interface ProductionCookieResponse {
  message: string;
  production: {
    id_galleta: number;
    nombre: string;
    cantidad: number;
    caducidad: string;
    descripcion: string;
    costo_produccion: number;
    precio_venta: number;
    estatus: string;
  }[];
}

export interface UpdateStatusResponse {
  message: string;
  cookie: number[];
}

export interface StatusUpdate {
  estatus: string;
}

export interface ProductionCookie {
  id_galleta: number;
  nombre: string;
  cantidad: number;
  caducidad: string;
  descripcion: string;
  costo_produccion: number;
  precio_venta: number;
  estatus: string;
}
