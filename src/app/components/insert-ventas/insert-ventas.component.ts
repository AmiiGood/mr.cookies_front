import { Component, OnInit } from '@angular/core';
import {
  CarritoItem,
  DropdownOption,
  TipoUnidad,
  VentaItemRequest,
  VentaResponse,
} from '../../interfaces/venta/venta';
import { GalletasService } from '../../services/galletas/galletas.service';
import { VentasService } from '../../services/ventas/ventas.service';
import { MessageService } from 'primeng/api';
import { Cookie } from '../../interfaces/galleta/galleta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insert-ventas',
  templateUrl: './insert-ventas.component.html',
  styleUrl: './insert-ventas.component.css',
})
export class InsertVentasComponent implements OnInit {
  tiposUnidad: DropdownOption[] = [
    { label: 'Monetaria', value: 'monetaria' },
    { label: 'Por peso', value: 'peso' },
    { label: 'Caja', value: 'caja' },
    { label: 'Por unidad', value: 'unidad' },
  ];

  galletas: Cookie[] = [];
  selectedTipoUnidad: TipoUnidad | '' = '';
  selectedGalleta: Cookie | null = null;
  cantidad: number = 1;
  carrito: CarritoItem[] = [];

  constructor(
    private galletasService: GalletasService,
    private ventasService: VentasService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarGalletas();
  }

  cargarGalletas(): void {
    this.galletasService.getCookies().subscribe({
      next: (response) => {
        this.galletas = response.cookies;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las galletas',
        });
      },
    });
  }

  isValidForm(): boolean {
    return (
      this.selectedTipoUnidad !== '' &&
      this.selectedGalleta !== null &&
      this.cantidad > 0
    );
  }

  calcularSubtotal(cantidad: number, precio: number): number {
    return cantidad * precio;
  }

  agregarAlCarrito(): void {
    if (!this.selectedGalleta || this.selectedTipoUnidad === '') return;

    const subtotal = this.calcularSubtotal(
      this.cantidad,
      this.selectedGalleta.precio_venta
    );
    const item: CarritoItem = {
      id_galleta: this.selectedGalleta.id_galleta,
      nombre: this.selectedGalleta.nombre,
      cantidad: this.cantidad,
      tipo_unidad: this.selectedTipoUnidad,
      precio_venta: this.selectedGalleta.precio_venta,
      subtotal,
    };

    this.carrito.push(item);
    this.limpiarFormulario();

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Producto agregado al carrito',
    });
  }

  calcularTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + (item.subtotal || 0),
      0
    );
  }

  eliminarDelCarrito(item: CarritoItem): void {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
    }
  }

  limpiarFormulario(): void {
    this.selectedTipoUnidad = '';
    this.selectedGalleta = null;
    this.cantidad = 1;
  }

  cancelarVenta(): void {
    this.carrito = [];
    this.limpiarFormulario();
    this.router.navigate(['/ventas']);
  }

  imprimirTicket(): void {
    // Implementar lógica de impresión
    console.log('Imprimir ticket:', this.carrito);
  }

  finalizarCompra(): void {
    const ventaData: VentaItemRequest[] = this.carrito.map((item) => ({
      id_galleta: item.id_galleta,
      cantidad: item.cantidad,
      tipo_unidad: item.tipo_unidad,
    }));

    this.ventasService.agregarVenta(ventaData).subscribe({
      next: (response: VentaResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
        });
        this.cancelarVenta();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al procesar la venta',
        });
      },
    });
  }
}
