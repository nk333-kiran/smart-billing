import * as XLSX from "xlsx";
import jsPDF from "jspdf";

// Export an array of plain objects to .xlsx
export const exportToExcel = (rows, sheetName, fileName) => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Export a simple table (columns + rows) to a PDF
export const exportTableToPdf = (title, columns, rows, fileName) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const marginX = 14;
  let y = 20;

  pdf.setFontSize(16);
  pdf.text(title, marginX, y);
  y += 10;

  pdf.setFontSize(10);
  const colWidth =
    (pdf.internal.pageSize.getWidth() - marginX * 2) / columns.length;

  pdf.setFont(undefined, "bold");
  columns.forEach((col, i) => {
    pdf.text(String(col.label), marginX + i * colWidth, y);
  });
  pdf.setFont(undefined, "normal");
  y += 6;

  rows.forEach((row) => {
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
    columns.forEach((col, i) => {
      const val = row[col.key];
      pdf.text(String(val ?? ""), marginX + i * colWidth, y);
    });
    y += 6;
  });

  pdf.save(`${fileName}.pdf`);
};
