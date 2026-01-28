import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import logoImage from '../assets/bus-ticket.png';

export class TicketGenerator {
  constructor() {
    this.companyName = "Bus Booking App";
    this.supportEmail = "support@busbooking.lk";
    this.supportPhone = "+94 11 234 5678";
  }

  // Sanitize any text: convert to string and remove fancy chars
  sanitizeText(text) {
    if (text === undefined || text === null) return 'N/A';
    text = String(text);
    // Replace fancy quotes with plain ones
    text = text.replace(/’|‘/g, "'").replace(/“|”/g, '"');
    // Remove non-printable characters
    text = text.replace(/[^\x20-\x7E]/g, '');
    return text.trim();
  }

  async generateQRCode(data) {
    try {
      return await QRCode.toDataURL(JSON.stringify(data), { width: 200, margin: 1 });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  generateBarcode(bookingId) {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, String(bookingId), { format: "CODE128", width: 2, height: 50, displayValue: true });
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  async generatePDFTicket(booking) {
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();

    // HEADER
    pdf.setFillColor(30, 144, 255);
    pdf.rect(0, 0, width, 50, 'F');
    pdf.addImage(logoImage, 'PNG', 10, 10, 30, 30);
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.text(this.companyName, 50, 20);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('E-Ticket Confirmation', 50, 35);

    // BOOKING INFO
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text(`Booking ID: ${this.sanitizeText(booking.id)}`, 20, 60);
    pdf.text(`Status: ${this.sanitizeText(booking.status)}`, width - 50, 60);

    // JOURNEY DETAILS
    pdf.setFillColor(173, 216, 230);
    pdf.rect(20, 70, width - 40, 50, 'F');
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(14);
    pdf.text('JOURNEY DETAILS', width / 2, 77, { align: 'center' });

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(14);
    pdf.text(`Route: ${this.sanitizeText(booking.busRoute)}`, 30, 90);
    pdf.text(`Bus No: ${this.sanitizeText(booking.busNo)}`, 30, 100);
    pdf.text(`Date: ${this.formatDate(booking.travelDate || booking.date)}`, 30, 110);
    pdf.text(`Time: ${this.sanitizeText(booking.time) || 'N/A'}`, width - 70, 110);

    // PASSENGER DETAILS
    pdf.setFillColor(255, 228, 196);
    pdf.rect(20, 120, width - 40, 50, 'F');
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(14);
    pdf.text('PASSENGER DETAILS', width / 2, 127, { align: 'center' });

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(12);
    pdf.text(`Name: ${this.sanitizeText(booking.name)}`, 30, 140);
    pdf.text(`Seats: ${this.sanitizeText((booking.seats || []).join(', '))}`, 30, 150);

    // TOTAL AMOUNT
    pdf.setFillColor(30, 144, 255);
    pdf.setTextColor(255);
    pdf.roundedRect(width - 70, 135, 50, 20, 2, 2, 'F');
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(12);
    pdf.text(`Rs ${this.sanitizeText(booking.totalAmount)}`, width - 45, 148, { align: 'center' });

    // QR CODE & BARCODE
    const qrCode = await this.generateQRCode(booking);
    const barcode = this.generateBarcode(booking.id);
    if (qrCode) pdf.addImage(qrCode, 'PNG', 30, 175, 50, 50);
    if (barcode) pdf.addImage(barcode, 'PNG', width - 90, 180, 60, 25);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0);
    pdf.text('Scan QR / Barcode for verification', width / 2, 235, { align: 'center' });

    // INSTRUCTIONS
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(220, 20, 60);
    const instructions = [
      '• Arrive 15 minutes before departure.',
      '• Carry a valid photo ID.',
      '• Show this ticket to the bus conductor.'
    ];
    let y = 245;
    instructions.forEach(line => {
      pdf.text(line, 20, y);
      y += 8;
    });

    // FOOTER
    pdf.setDrawColor(200);
    pdf.line(20, y + 5, width - 20, y + 5);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('This is an e-ticket. No signature required.', width / 2, y + 15, { align: 'center' });
    pdf.text(`Contact: ${this.supportEmail} | ${this.supportPhone}`, width / 2, y + 25, { align: 'center' });
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 102, 204);
    pdf.text('Thank you for choosing our service. Have a safe journey!', width / 2, y + 35, { align: 'center' });

    return pdf;
  }

  // DOWNLOAD TICKET
  async downloadTicket(booking) {
    try {
      const pdf = await this.generatePDFTicket(booking);
      const filename = `Ticket-${this.sanitizeText(booking.id)}.pdf`;
      pdf.save(filename);
      return { success: true, filename };
    } catch (err) {
      console.error('Error generating ticket:', err);
      return { success: false, error: err.message };
    }
  }
}

export default new TicketGenerator();
