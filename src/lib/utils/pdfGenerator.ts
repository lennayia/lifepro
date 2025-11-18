/**
 * PDF Generator Utility
 * Generování krásného PDF z AI analýzy
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Analysis {
  patterns: {
    values: string[];
    skills: string[];
    interests: string[];
    motivations: string[];
  };
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  connections: Array<{
    theme: string;
    items: string[];
  }>;
  blind_spots: Array<{
    area: string;
    description: string;
  }>;
  generated_at: string;
}

interface UserInfo {
  email?: string;
  id: string;
}

export const generateAnalysisPDF = (
  analysis: Analysis,
  user: UserInfo
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Barvy
  const primaryColor: [number, number, number] = [102, 126, 234]; // #667eea
  const secondaryColor: [number, number, number] = [118, 75, 162]; // #764ba2
  const textColor: [number, number, number] = [33, 33, 33];
  const lightGray: [number, number, number] = [240, 240, 240];

  // === TITULNÍ STRANA ===
  // Gradient pozadí (simulace pomocí čar)
  for (let i = 0; i < pageHeight; i += 2) {
    const ratio = i / pageHeight;
    const r = primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * ratio;
    const g = primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * ratio;
    const b = primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * ratio;
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(0, i, pageWidth, i);
  }

  // Hlavní nadpis
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Vaše životní poslání', pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Analýza osobnosti a kariéry', pageWidth / 2, 95, {
    align: 'center',
  });

  // Info o uživateli
  doc.setFontSize(12);
  if (user.email) {
    doc.text(`${user.email}`, pageWidth / 2, 110, { align: 'center' });
  }

  const generatedDate = new Date(analysis.generated_at).toLocaleDateString(
    'cs-CZ',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
  doc.text(`Vygenerováno: ${generatedDate}`, pageWidth / 2, 120, {
    align: 'center',
  });

  // Footer
  doc.setFontSize(10);
  doc.text('LifePro - Najděte své životní poslání', pageWidth / 2, pageHeight - 15, {
    align: 'center',
  });

  // === STRANA 2: KLÍČOVÉ VZORCE ===
  doc.addPage();
  yPos = margin;

  doc.setTextColor(...textColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Klíčové vzorce', margin, yPos);
  yPos += 15;

  // Hodnoty
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('💎 Vaše hodnoty', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  const valuesText = analysis.patterns.values.join(' • ');
  const valueLines = doc.splitTextToSize(valuesText, pageWidth - 2 * margin);
  doc.text(valueLines, margin, yPos);
  yPos += valueLines.length * 6 + 10;

  // Dovednosti
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 Vaše dovednosti', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  const skillsText = analysis.patterns.skills.join(' • ');
  const skillLines = doc.splitTextToSize(skillsText, pageWidth - 2 * margin);
  doc.text(skillLines, margin, yPos);
  yPos += skillLines.length * 6 + 10;

  // Zájmy
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('✨ Vaše zájmy', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  const interestsText = analysis.patterns.interests.join(' • ');
  const interestLines = doc.splitTextToSize(
    interestsText,
    pageWidth - 2 * margin
  );
  doc.text(interestLines, margin, yPos);
  yPos += interestLines.length * 6 + 10;

  // Motivace
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('🚀 Vaše motivace', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  const motivationsText = analysis.patterns.motivations.join(' • ');
  const motivationLines = doc.splitTextToSize(
    motivationsText,
    pageWidth - 2 * margin
  );
  doc.text(motivationLines, margin, yPos);
  yPos += motivationLines.length * 6;

  // === STRANA 3+: DOPORUČENÍ ===
  if (analysis.suggestions.length > 0) {
    doc.addPage();
    yPos = margin;

    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Doporučení pro vás', margin, yPos);
    yPos += 15;

    analysis.suggestions.forEach((suggestion, index) => {
      // Kontrola, zda je dost místa, jinak nová stránka
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      // Box pro každé doporučení
      doc.setFillColor(...lightGray);
      doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 45, 3, 3, 'F');

      // Kategorie
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(suggestion.category.toUpperCase(), margin + 5, yPos + 2);

      // Název
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(suggestion.title, margin + 5, yPos + 10);

      // Popis
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(
        suggestion.description,
        pageWidth - 2 * margin - 10
      );
      doc.text(descLines, margin + 5, yPos + 17);

      yPos += 50;
    });
  }

  // === STRANA: SPOJITOSTI ===
  if (analysis.connections.length > 0) {
    doc.addPage();
    yPos = margin;

    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Objevené spojitosti', margin, yPos);
    yPos += 15;

    analysis.connections.forEach((connection) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('🔗 ' + connection.theme, margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      const itemsText = connection.items.join(' • ');
      const itemLines = doc.splitTextToSize(itemsText, pageWidth - 2 * margin);
      doc.text(itemLines, margin + 5, yPos);
      yPos += itemLines.length * 5 + 10;
    });
  }

  // === STRANA: SLEPÁ MÍSTA ===
  if (analysis.blind_spots.length > 0) {
    doc.addPage();
    yPos = margin;

    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Oblasti k zamyšlení', margin, yPos);
    yPos += 15;

    analysis.blind_spots.forEach((spot) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFillColor(255, 248, 225); // Light yellow
      doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 35, 3, 3, 'F');

      doc.setFontSize(12);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('💡 ' + spot.area, margin + 5, yPos + 2);

      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(
        spot.description,
        pageWidth - 2 * margin - 10
      );
      doc.text(descLines, margin + 5, yPos + 10);

      yPos += 40;
    });
  }

  // Stáhnout PDF
  const fileName = `LifePro_Analyza_${generatedDate.replace(/ /g, '_')}.pdf`;
  doc.save(fileName);
};

export const downloadJSON = (data: any, fileName: string): void => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
