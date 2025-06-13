import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export HTML string to PDF using hidden iframe and html2canvas + jsPDF.
 * @param html HTML string to render and export
 * @param filename PDF file name
 * @param width Iframe and export width (default 1200)
 * @param height Iframe and export height (default 1100)
 */
export async function exportHtmlToPDF(
  html: string,
  filename = 'Report.pdf',
  width = 1200,
  height = 1100,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = width + 'px';
    iframe.style.height = height + 'px';
    document.body.appendChild(iframe);
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(html);
      iframe.contentDocument.close();
    }
    iframe.onload = () => {
      setTimeout(async () => {
        const target = iframe.contentDocument?.body;
        if (target) {
          const originalWidth = target.style.width;
          target.style.width = width + 'px';
          target.style.minWidth = width + 'px';
          target.style.maxWidth = width + 'px';
          const canvas = await html2canvas(target, {
            useCORS: true,
            backgroundColor: '#fff',
            scale: 2,
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(filename);
          target.style.width = originalWidth;
          target.style.minWidth = '';
          target.style.maxWidth = '';
        }
        document.body.removeChild(iframe);
        resolve();
      }, 2000);
    };
  });
}
