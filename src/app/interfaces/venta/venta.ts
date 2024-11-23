export type TipoUnidad =
  | 'monetaria'
  | 'peso'
  | 'unidad'
  | 'caja-500'
  | 'caja-1000'
  | 'caja';

export interface DropdownOption {
  label: string;
  value: TipoUnidad;
}

export interface CarritoItem {
  id_galleta: number;
  nombre: string;
  cantidad: number;
  cantidadEfectiva: number;
  tipo_unidad_display?: string;
  tipo_unidad: TipoUnidad;
  precio_venta: number;
  subtotal: number;
}

export interface VentaItemRequest {
  id_galleta: number;
  cantidad: number;
  tipo_unidad: TipoUnidad;
}

export interface VentaResponse {
  message: string;
}

export interface GetVentaResponse {
  message: string;
  ventas: Venta[];
}

export interface Venta {
  id_venta: number;
  fecha: string;
  total: number;
  items: VentaItem[];
}

export interface VentaItem {
  id_item: number;
  id_venta: number;
  id_galleta: number;
  cantidad: number;
  tipo_unidad: TipoUnidad;
  subtotal: number;
}
