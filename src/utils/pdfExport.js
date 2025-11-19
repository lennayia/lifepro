import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF report from user responses
 * @param {Object} data - User data and responses
 * @param {string} data.userName - User's display name
 * @param {Array} data.categories - Categories with responses
 * @param {Object} data.stats - Overall statistics
 */
export const generatePDFReport = (data) => {
  const { userName, categories, stats } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('LifePro - Osobní Hodnocení', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Vygenerováno: ${new Date().toLocaleDateString('cs-CZ')}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 5;
  doc.text(`Uživatel: ${userName}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  // Overall Statistics
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Celkové Statistiky', 14, yPosition);

  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');

  const statsData = [
    ['Celkový počet otázek', stats.totalQuestions.toString()],
    ['Zodpovězené otázky', stats.answeredQuestions.toString()],
    ['Celkový pokrok', `${stats.progressPercentage}%`],
    ['Oblíbené otázky', stats.favoriteCount.toString()],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Metrika', 'Hodnota']],
    body: statsData,
    theme: 'grid',
    headStyles: { fillColor: [63, 81, 181] },
    margin: { left: 14, right: 14 },
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Categories breakdown
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Přehled Kategorií', 14, yPosition);

  yPosition += 10;

  categories.forEach((category, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${category.icon} ${category.title}`, 14, yPosition);

    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(category.description || '', 14, yPosition);

    yPosition += 7;

    // Category stats
    const categoryStatsData = [
      ['Počet otázek', category.totalQuestions.toString()],
      ['Zodpovězeno', category.answeredQuestions.toString()],
      ['Pokrok', `${category.completionPercentage}%`],
    ];

    doc.autoTable({
      startY: yPosition,
      body: categoryStatsData,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 30 },
      },
    });

    yPosition = doc.lastAutoTable.finalY + 3;

    // Progress bar
    const barWidth = pageWidth - 28;
    const barHeight = 8;
    const fillWidth = (barWidth * category.completionPercentage) / 100;

    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(14, yPosition, barWidth, barHeight, 2, 2, 'FD');

    if (fillWidth > 0) {
      doc.setFillColor(76, 175, 80);
      doc.roundedRect(14, yPosition, fillWidth, barHeight, 2, 2, 'F');
    }

    yPosition += barHeight + 10;

    // Sections and answers
    if (category.sections && category.sections.length > 0) {
      category.sections.forEach((section) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(63, 81, 181);
        doc.text(`  ${section.title}`, 14, yPosition);
        yPosition += 6;

        if (section.answeredQuestions && section.answeredQuestions.length > 0) {
          doc.setFontSize(9);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(0, 0, 0);

          section.answeredQuestions.forEach((question) => {
            if (yPosition > pageHeight - 20) {
              doc.addPage();
              yPosition = 20;
            }

            const questionText = `    ✓ ${question.question_text}`;
            const lines = doc.splitTextToSize(questionText, pageWidth - 30);

            lines.forEach((line) => {
              doc.text(line, 14, yPosition);
              yPosition += 5;
            });
          });
        }

        yPosition += 3;
      });
    }

    yPosition += 5;
  });

  // Favorites section (if any)
  if (stats.favorites && stats.favorites.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Oblíbené Otázky', 14, yPosition);
    yPosition += 10;

    stats.favorites.forEach((fav) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const favText = `❤ ${fav.question_text}`;
      const lines = doc.splitTextToSize(favText, pageWidth - 28);

      lines.forEach((line) => {
        doc.text(line, 14, yPosition);
        yPosition += 5;
      });

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`   ${fav.category_title} → ${fav.section_title}`, 14, yPosition);
      yPosition += 7;
      doc.setTextColor(0, 0, 0);
    });
  }

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'LifePro - Aplikace pro osobní rozvoj a hodnocení',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc;
};

/**
 * Download PDF report
 */
export const downloadPDFReport = (data, filename = 'lifepro-report.pdf') => {
  const doc = generatePDFReport(data);
  doc.save(filename);
};

/**
 * Get PDF as blob (for preview or upload)
 */
export const getPDFBlob = (data) => {
  const doc = generatePDFReport(data);
  return doc.output('blob');
};
