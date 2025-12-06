import { generateInvoiceHTML, InvoiceData } from "./invoiceGenerator";

export const downloadInvoicePDF = async (data: InvoiceData) => {
    if (typeof window === "undefined") return;

    // Dynamic import html2pdf.js because it depends on window/document
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.createElement("div");
    element.innerHTML = generateInvoiceHTML(data);
    // Ensure we can see it for rendering but it doesn't affect layout (off-screen)
    // Actually html2pdf can render off-screen elements if passed directly.
    // Using a temporary container is cleaner.

    const opt = {
        margin: 0,
        filename: `invoice_${data.customerName.replace(/\s+/g, "_")}_${data.invoiceNumber
            }.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait" as const,
        },
    };

    html2pdf().set(opt).from(element).save();
};
