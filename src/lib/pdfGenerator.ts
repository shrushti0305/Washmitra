import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Booking } from '../types';

export const generateServiceSummaryPDF = (
  booking: Booking,
  serviceTitle: string = 'General Service',
  technicianName: string = 'Verified WashMitra'
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(6, 45, 39); // #062D27
  doc.text('WASH Mitra', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(242, 101, 34); // #F26522
  doc.text('SERVICE COMPLETION SUMMARY', 14, 30);

  // Divider
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 35, 196, 35);

  // Client & Service Details
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Customer Detail:', 14, 45);
  doc.setTextColor(0, 0, 0);
  doc.text(booking.name || 'Customer', 14, 52);
  doc.text(booking.address || booking.location || '-', 14, 58);

  doc.setTextColor(100, 100, 100);
  doc.text('Technician Detail:', 120, 45);
  doc.setTextColor(0, 0, 0);
  doc.text(technicianName, 120, 52);
  doc.text('Verified WASH Mitra Professional', 120, 58);

  doc.setTextColor(100, 100, 100);
  doc.text('Booking ID:', 14, 75);
  doc.setTextColor(0, 0, 0);
  doc.text(booking.id, 45, 75);

  doc.setTextColor(100, 100, 100);
  doc.text('Date:', 14, 82);
  doc.setTextColor(0, 0, 0);
  doc.text(new Date(booking.created_at).toLocaleDateString(), 45, 82);

  doc.setTextColor(100, 100, 100);
  doc.text('Status:', 14, 89);
  doc.setTextColor(6, 45, 39);
  doc.text(booking.status, 45, 89);

  // Service line item
  const tableData = [[
    serviceTitle,
    booking.notes || '-',
    `INR ${booking.labor_charge?.toFixed(2) || '0.00'}`
  ]];

  autoTable(doc, {
    startY: 100,
    head: [['Service', 'Notes', 'Labor Charge']],
    body: tableData,
    headStyles: { fillColor: [6, 45, 39] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Summary:', 140, finalY);

  doc.setFontSize(10);
  doc.text('Visit Charge:', 140, finalY + 8);
  doc.text(`INR ${booking.visit_charge?.toFixed(2) || '0.00'}`, 180, finalY + 8, { align: 'right' });

  doc.text('Travel Charge:', 140, finalY + 15);
  doc.text(`INR ${booking.travel_charge?.toFixed(2) || '0.00'}`, 180, finalY + 15, { align: 'right' });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 140, finalY + 25);
  doc.setTextColor(242, 101, 34);
  doc.text(`INR ${booking.total_price?.toFixed(2) || '0.00'}`, 180, finalY + 25, { align: 'right' });

  // Footer / Branding
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing WASH Mitra. We are committed to localized sustainable development.', 105, 285, { align: 'center' });

  doc.save(`WASHMitra_Invoice_${booking.id}.pdf`);
};
