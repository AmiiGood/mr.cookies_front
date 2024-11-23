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
import { TicketGenerator } from '../../utils/ticket-generator';

@Component({
  selector: 'app-insert-ventas',
  templateUrl: './insert-ventas.component.html',
  styleUrl: './insert-ventas.component.css',
})
export class InsertVentasComponent implements OnInit {
  readonly PESO_GALLETA = 40;

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
  generarTicketAlFinalizar: boolean = false;

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
          life: 5000,
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

  calcularSubtotal(
    cantidad: number,
    precio: number,
    tipoUnidad: TipoUnidad
  ): number {
    switch (tipoUnidad) {
      case 'unidad':
      case 'caja':
        return cantidad * precio;

      case 'peso':
        const galletasPorPeso = Math.floor(cantidad / this.PESO_GALLETA);
        return galletasPorPeso * precio;

      case 'monetaria':
        const galletasPorMonto = Math.floor(cantidad / precio);
        return galletasPorMonto * precio;

      default:
        return 0;
    }
  }

  mostrarMensajeSegunTipoUnidad(
    cantidadOriginal: number,
    cantidadEfectiva: number,
    tipoUnidad: TipoUnidad,
    nombreGalleta: string
  ): void {
    let mensaje = '';
    switch (tipoUnidad) {
      case 'peso':
        mensaje = `${cantidadOriginal}g de ${nombreGalleta} equivale a ${cantidadEfectiva} galletas`;
        break;
      case 'monetaria':
        mensaje = `$${cantidadOriginal} equivale a ${cantidadEfectiva} galletas de ${nombreGalleta}`;
        break;
      case 'unidad':
        mensaje = `${cantidadEfectiva} unidades de ${nombreGalleta} agregadas`;
        break;
      case 'caja':
        mensaje = `${cantidadEfectiva} cajas de ${nombreGalleta} agregadas`;
        break;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Producto agregado',
      detail: mensaje,
      life: 3000,
    });
  }

  agregarAlCarrito(): void {
    if (!this.selectedGalleta || this.selectedTipoUnidad === '') return;

    const subtotal = this.calcularSubtotal(
      this.cantidad,
      this.selectedGalleta.precio_venta,
      this.selectedTipoUnidad
    );

    let cantidadEfectiva = this.cantidad;
    if (this.selectedTipoUnidad === 'peso') {
      cantidadEfectiva = Math.floor(this.cantidad / this.PESO_GALLETA);
    } else if (this.selectedTipoUnidad === 'monetaria') {
      cantidadEfectiva = Math.floor(
        this.cantidad / this.selectedGalleta.precio_venta
      );
    }

    if (cantidadEfectiva > this.selectedGalleta.cantidad) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Stock insuficiente. Solo hay ${this.selectedGalleta.cantidad} galletas disponibles.`,
        life: 5000,
      });
      return;
    }

    const item: CarritoItem = {
      id_galleta: this.selectedGalleta.id_galleta,
      nombre: this.selectedGalleta.nombre,
      cantidad: this.cantidad,
      cantidadEfectiva: cantidadEfectiva,
      tipo_unidad: this.selectedTipoUnidad,
      precio_venta: this.selectedGalleta.precio_venta,
      subtotal,
    };

    this.carrito.push(item);
    this.mostrarMensajeSegunTipoUnidad(
      this.cantidad,
      cantidadEfectiva,
      this.selectedTipoUnidad,
      this.selectedGalleta.nombre
    );
    this.limpiarFormulario();
  }

  eliminarDelCarrito(item: CarritoItem): void {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
      this.messageService.add({
        severity: 'warn',
        summary: 'Producto eliminado',
        detail: `${item.nombre} ha sido eliminado del carrito`,
        life: 3000,
      });
    }
  }

  calcularTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + (item.subtotal || 0),
      0
    );
  }

  limpiarFormulario(): void {
    this.selectedTipoUnidad = '';
    this.selectedGalleta = null;
    this.cantidad = 1;
  }

  cancelarVenta(): void {
    if (this.carrito.length > 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Venta cancelada',
        detail: 'Se han descartado todos los productos del carrito',
        life: 3000,
      });
    }
    this.carrito = [];
    this.limpiarFormulario();
    this.router.navigate(['/ventas']);
  }

  imprimirTicket(): void {
    const total = this.calcularTotal();
    TicketGenerator.generateTicket(this.carrito, total);
    this.messageService.add({
      severity: 'success',
      summary: 'Ticket generado',
      detail: 'El ticket se está imprimiendo',
      life: 3000,
    });
  }

  finalizarCompra(): void {
    const ventaData: VentaItemRequest[] = this.carrito.map((item) => ({
      id_galleta: item.id_galleta,
      cantidad: item.cantidad,
      tipo_unidad: item.tipo_unidad,
    }));

    this.ventasService.agregarVenta(ventaData).subscribe({
      next: (response: VentaResponse) => {
        if (this.generarTicketAlFinalizar) {
          const total = this.calcularTotal();
          TicketGenerator.generateTicket(this.carrito, total);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
          life: 3000,
        });

        setTimeout(() => {
          this.carrito = [];
          this.limpiarFormulario();
          this.router.navigate(['/ventas']);
        }, 1000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al procesar la venta',
          life: 3000,
        });
      },
    });
  }
}
