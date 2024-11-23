import jsPDF from 'jspdf';
import { CarritoItem } from '../interfaces/venta/venta';

export class TicketGenerator {
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  private static getDate(): string {
    return new Date().toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static generateTicket(carrito: CarritoItem[], totalVenta: number): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150],
    });

    doc.setFontSize(10);
    let yPos = 10;
    const leftMargin = 5;
    const lineHeight = 5;

    doc.setFont('helvetica', 'bold');
    doc.text('GALLETAS DON GALLETO', 40, yPos, { align: 'center' });
    yPos += lineHeight * 1.5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Blvd. Universidad Tecnológica 225', 40, yPos, { align: 'center' });
    yPos += lineHeight;
    doc.text('Tel: (477) 710-0020', 40, yPos, { align: 'center' });
    yPos += lineHeight * 1.5;

    doc.text(`Fecha: ${this.getDate()}`, leftMargin, yPos);
    yPos += lineHeight;
    doc.text(
      `Ticket #: ${Math.floor(Math.random() * 10000)}`,
      leftMargin,
      yPos
    );
    yPos += lineHeight * 1.5;

    doc.setDrawColor(0);
    doc.line(leftMargin, yPos, 75, yPos);
    yPos += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCTO', leftMargin, yPos);
    doc.text('SUBT', 65, yPos, { align: 'right' });
    yPos += lineHeight;

    doc.setDrawColor(0);
    doc.line(leftMargin, yPos, 75, yPos);
    yPos += lineHeight;

    doc.setFont('helvetica', 'normal');
    carrito.forEach((item) => {
      doc.text(`${item.nombre}`, leftMargin, yPos);
      yPos += lineHeight;

      doc.text(
        `${item.cantidad} x ${this.formatCurrency(item.precio_venta)}`,
        leftMargin,
        yPos
      );
      doc.text(`${this.formatCurrency(item.subtotal || 0)}`, 65, yPos, {
        align: 'right',
      });
      yPos += lineHeight * 1.2;
    });

    doc.setDrawColor(0);
    doc.line(leftMargin, yPos, 75, yPos);
    yPos += lineHeight * 1.2;

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', leftMargin, yPos);
    doc.text(`${this.formatCurrency(totalVenta)}`, 65, yPos, {
      align: 'right',
    });
    yPos += lineHeight * 2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('¡Gracias por su compra!', 40, yPos, { align: 'center' });
    yPos += lineHeight;
    doc.text('Vuelva pronto', 40, yPos, { align: 'center' });

    doc.save('ticket-venta.pdf');
  }
}
