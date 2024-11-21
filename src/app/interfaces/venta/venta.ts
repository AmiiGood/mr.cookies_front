export interface Venta {
  id_venta: number;
  fecha_venta: string;
  total: number;
}

export interface GetVentaResponse {
  message: string;
  ventas: Venta[];
}
