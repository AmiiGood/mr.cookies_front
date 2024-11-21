export interface Producto {
  id: number;
  nombre: string;
}

export interface ItemCarrito {
  cantidad: number;
  id_galleta: number;
  tipo_unidad: string;
  nombreProducto: string;
}
