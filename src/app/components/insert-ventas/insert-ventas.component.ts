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
  readonly PESO_CAJA_PEQUENA = 500;
  readonly PESO_CAJA_GRANDE = 1000;
  readonly PESO_GALLETA = 40;

  tiposUnidad: DropdownOption[] = [
    { label: 'Monetaria', value: 'monetaria' },
    { label: 'Por peso (gramos)', value: 'peso' },
    { label: 'Caja 500g', value: 'caja-500' },
    { label: 'Caja 1kg', value: 'caja-1000' },
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
    if (
      this.selectedTipoUnidad === '' ||
      this.selectedGalleta === null ||
      this.cantidad <= 0
    ) {
      return false;
    }

    // Calcular la cantidad efectiva de galletas
    const cantidadEfectiva = this.calcularCantidadEfectiva(
      this.cantidad,
      this.selectedTipoUnidad
    );

    // Si la cantidad efectiva es 0, el formulario no es válido
    if (cantidadEfectiva === 0) {
      return false;
    }

    // Verificar si hay suficiente stock
    return this.verificarStockSuficiente(
      this.selectedGalleta.id_galleta,
      cantidadEfectiva
    );
  }

  private getTipoCaja(
    tipoUnidad: string
  ): { tipo: 'caja'; peso: number } | null {
    if (tipoUnidad === 'caja-500')
      return { tipo: 'caja', peso: this.PESO_CAJA_PEQUENA };
    if (tipoUnidad === 'caja-1000')
      return { tipo: 'caja', peso: this.PESO_CAJA_GRANDE };
    return null;
  }

  calcularSubtotal(
    cantidad: number,
    precio: number,
    tipoUnidad: string
  ): number {
    const tipoCaja = this.getTipoCaja(tipoUnidad);
    if (tipoCaja) {
      const galletasPorCaja = Math.floor(tipoCaja.peso / this.PESO_GALLETA);
      return cantidad * (galletasPorCaja * precio);
    }

    switch (tipoUnidad) {
      case 'unidad':
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

  calcularStockDisponible(idGalleta: number): number {
    const galletasEnCarrito = this.carrito
      .filter((item) => item.id_galleta === idGalleta)
      .reduce((total, item) => total + item.cantidadEfectiva, 0);

    const galleta = this.galletas.find((g) => g.id_galleta === idGalleta);
    return galleta ? galleta.cantidad - galletasEnCarrito : 0;
  }

  verificarStockSuficiente(
    idGalleta: number,
    cantidadNecesaria: number
  ): boolean {
    const stockDisponible = this.calcularStockDisponible(idGalleta);
    return stockDisponible >= cantidadNecesaria;
  }

  getStockDisplay(galleta: Cookie): string {
    const stockDisponible = this.calcularStockDisponible(galleta.id_galleta);
    return `${galleta.nombre} - Stock disponible: ${stockDisponible}`;
  }

  calcularCantidadEfectiva(cantidad: number, tipoUnidad: string): number {
    const tipoCaja = this.getTipoCaja(tipoUnidad);
    if (tipoCaja) {
      return cantidad * Math.floor(tipoCaja.peso / this.PESO_GALLETA);
    }

    switch (tipoUnidad) {
      case 'unidad':
        return cantidad;
      case 'peso':
        return Math.floor(cantidad / this.PESO_GALLETA);
      case 'monetaria':
        return Math.floor(cantidad / (this.selectedGalleta?.precio_venta || 1));
      default:
        return 0;
    }
  }

  mostrarMensajeSegunTipoUnidad(
    cantidadOriginal: number,
    cantidadEfectiva: number,
    tipoUnidad: string,
    nombreGalleta: string
  ): void {
    let mensaje = '';
    const tipoCaja = this.getTipoCaja(tipoUnidad);

    if (tipoCaja) {
      const pesoCaja =
        tipoCaja.peso === this.PESO_CAJA_PEQUENA ? '500g' : '1kg';
      mensaje = `${cantidadOriginal} cajas de ${pesoCaja} de ${nombreGalleta} (${cantidadEfectiva} galletas) agregadas`;
    } else {
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
      }
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

    const cantidadEfectiva = this.calcularCantidadEfectiva(
      this.cantidad,
      this.selectedTipoUnidad
    );

    // Validar que la cantidad efectiva no sea 0
    if (cantidadEfectiva === 0) {
      let mensaje = '';
      if (this.selectedTipoUnidad === 'monetaria') {
        mensaje = `El monto $${this.cantidad} es insuficiente para comprar al menos una galleta. El precio mínimo es $${this.selectedGalleta.precio_venta}`;
      } else if (this.selectedTipoUnidad === 'peso') {
        mensaje = `${this.cantidad}g es insuficiente para una galleta completa. El peso mínimo es ${this.PESO_GALLETA}g`;
      } else {
        mensaje = 'La cantidad debe resultar en al menos una galleta';
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Cantidad inválida',
        detail: mensaje,
        life: 5000,
      });
      return;
    }

    if (
      !this.verificarStockSuficiente(
        this.selectedGalleta.id_galleta,
        cantidadEfectiva
      )
    ) {
      const stockDisponible = this.calcularStockDisponible(
        this.selectedGalleta.id_galleta
      );
      let mensaje = `Stock insuficiente. Se necesitan ${cantidadEfectiva} galletas y solo hay ${stockDisponible} disponibles`;

      if (stockDisponible > 0) {
        if (this.selectedTipoUnidad.startsWith('caja-')) {
          mensaje += `. Puedes comprar por unidad hasta ${stockDisponible} galletas`;
        }
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: mensaje,
        life: 5000,
      });
      return;
    }

    const subtotal = this.calcularSubtotal(
      this.cantidad,
      this.selectedGalleta.precio_venta,
      this.selectedTipoUnidad
    );

    let tipoUnidadBackend = this.selectedTipoUnidad;
    if (
      this.selectedTipoUnidad === 'caja-500' ||
      this.selectedTipoUnidad === 'caja-1000'
    ) {
      tipoUnidadBackend = 'caja';
    }

    const item: CarritoItem = {
      id_galleta: this.selectedGalleta.id_galleta,
      nombre: this.selectedGalleta.nombre,
      cantidad: this.cantidad,
      cantidadEfectiva: cantidadEfectiva,
      tipo_unidad: tipoUnidadBackend,
      tipo_unidad_display: this.selectedTipoUnidad,
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

  getOptionsTemplate(): string {
    return `
      <ng-template pTemplate="item" let-galleta>
        <div [class.text-red-500]="calcularStockDisponible(galleta.id_galleta) === 0">
          {{ getStockDisplay(galleta) }}
          <span *ngIf="calcularStockDisponible(galleta.id_galleta) === 0">(Sin stock)</span>
        </div>
      </ng-template>
    `;
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

      this.galletas = [...this.galletas];
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
    const ventaData: VentaItemRequest[] = this.carrito.map((item) => {
      const cantidad =
        item.tipo_unidad === 'caja' ? item.cantidadEfectiva : item.cantidad;

      return {
        id_galleta: item.id_galleta,
        cantidad: cantidad,
        tipo_unidad: item.tipo_unidad,
      };
    });

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

        this.carrito = [];
        this.limpiarFormulario();
        this.router.navigate(['/ventas']);
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

  onCantidadChange(): void {
    if (this.selectedGalleta && this.selectedTipoUnidad && this.cantidad > 0) {
      const cantidadEfectiva = this.calcularCantidadEfectiva(
        this.cantidad,
        this.selectedTipoUnidad
      );

      if (cantidadEfectiva === 0) {
        let mensaje = '';
        if (this.selectedTipoUnidad === 'monetaria') {
          mensaje = `Monto mínimo requerido: $${this.selectedGalleta.precio_venta}`;
        } else if (this.selectedTipoUnidad === 'peso') {
          mensaje = `Peso mínimo requerido: ${this.PESO_GALLETA}g`;
        }

        if (mensaje) {
          this.messageService.add({
            severity: 'info',
            summary: 'Cantidad insuficiente',
            detail: mensaje,
            life: 3000,
          });
        }
      }
    }
  }
}
