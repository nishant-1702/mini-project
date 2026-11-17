"use client";

import { jsPDF } from "jspdf";

export default function DownloadProfile({ profile }) {
  const handleDownload = () => {
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let y = 25;

    // PDF heading
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("User Profile", 20, y);

    y += 10;

    pdf.setDrawColor(180);
    pdf.line(20, y, pageWidth - 20, y);

    y += 15;

    // Profile fields
    const address = profile.address || {};

    const fields = [
      ["Full Name", profile.fullName],
      ["Email", profile.email],
      ["Phone", profile.phone],
      ["Street", address.street],
      ["Locality", address.locality],
      ["City", address.city],
      ["State", address.state],
      ["Country", address.country],
      ["Postal Code", address.postalCode],
      ["Full Address", address.fullAddress],
    ];

    pdf.setFontSize(11);

    fields.forEach(([label, value]) => {
      if (!value) return;

      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}:`, 20, y);

      pdf.setFont("helvetica", "normal");

      const wrappedText = pdf.splitTextToSize(
        String(value),
        pageWidth - 65
      );

      if (y + wrappedText.length * 7 > pageHeight - 20) {
        pdf.addPage();
        y = 25;
      }

      pdf.text(wrappedText, 65, y);

      y += Math.max(wrappedText.length * 7, 8) + 5;
    });

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
      20,
      pageHeight - 10
    );

    pdf.save("my-profile.pdf");
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
    >
      Download Profile PDF
    </button>
  );
}