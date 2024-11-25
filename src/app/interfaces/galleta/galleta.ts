export interface Cookie {
  id_galleta: number;
  nombre: string;
  cantidad: number;
  caducidad: string;
  descripcion: string;
  costo_produccion: number;
  precio_venta: number;
  estatus: string;
}

export interface GetCookieResponse {
  message: string;
  cookies: Cookie[];
}

export interface UpdateCookieBody {
  nombre_galleta: string;
}

export interface ProductionRequestBody {
  id_galleta: number;
}

export interface CookieRecipeDetail {
  id_detalle_receta: number;
  cantidad: number;
  id_insumo_fk: number;
  id_galleta_fk: number;
}

export interface ProductionResponse {
  message: string;
  cookie: CookieRecipeDetail[];
}
