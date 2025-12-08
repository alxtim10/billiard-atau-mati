export type InvoiceData = {
  invoiceNumber: string;
  date: string;
  customerName: string;
  sessionName?: string;
  location?: string;
  durationHours: number;
  ratePerHour?: number; // Calculated or estimated
  totalAmount: number;
  isPaid: boolean;
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
};

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const {
    invoiceNumber,
    date,
    customerName,
    sessionName,
    location,
    totalAmount,
    isPaid,
    items,
  } = data;

  // Indonesian Rupiah formatting
  const formatRp = (val: number) =>
    "Rp " + Math.round(val).toLocaleString("id-ID");

  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Invoice #${invoiceNumber}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 60px 40px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: #1d1d1f;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 1px solid #e5e5e7;
    }

    .brand h1 {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.6px;
      margin: 0;
      color: #000000;
    }

    .brand p {
      margin: 6px 0 0;
      font-size: 14px;
      color: #6e6e73;
      font-weight: 500;
    }

    .invoice-meta {
      text-align: right;
    }

    .invoice-meta h2 {
      font-size: 36px;
      font-weight: 600;
      margin: 0 0 8px 0;
      letter-spacing: -1px;
      color: #000000;
    }

    .invoice-number {
      font-size: 15px;
      color: #6e6e73;
      margin-bottom: 12px;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      background: ${isPaid ? "#e6f7ee" : "#fef2f2"};
      color: ${isPaid ? "#0d7a3f" : "#c42b1c"};
    }

    .status::before {
      content: "${isPaid ? "✓" : "○"}";
      font-size: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin: 50px 0;
      font-size: 15px;
    }

    .info-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #86868b;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .info-value {
      font-weight: 500;
      color: #1d1d1f;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 12px;
      margin: 20px 0 40px;
    }

    th {
      text-align: left;
      padding: 0 16px 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #86868b;
    }

    td {
      padding: 20px 16px;
      background: #f9f9fb;
      font-size: 15px;
    }

    tr td:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
    tr td:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }

    .description {
      font-weight: 500;
      color: #1d1d1f;
    }

    .session-note {
      font-size: 13px;
      color: #6e6e73;
      margin-top: 4px;
    }

    .text-right {
      text-align: right;
    }

    .amount {
      font-weight: 600;
      color: #1d1d1f;
      font-variant-numeric: tabular-nums;
    }

    .totals {
      max-width: 380px;
      margin-left: auto;
      padding: 24px 0;
      border-top: 1px solid #d2d2d7;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      font-size: 17px;
      margin-bottom: 12px;
    }

    .total-final {
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      margin-top: 12px !important;
      padding-top: 16px;
      border-top: 2px solid #000000;
    }

    .footer {
      margin-top: 80px;
      padding-top: 30px;
      border-top: 1px solid #e5e5e7;
      text-align: center;
      color: #86868b;
      font-size: 13px;
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      body { padding: 40px 20px; }
      .header, .info-grid { flex-direction: column; text-align: left; }
      .info-grid { gap: 30px; }
      .invoice-meta { text-align: left; margin-top: 20px; }
      .totals { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <div class="brand">
        <h1>Billiard & Mati</h1>
        <p>life_status = "no chill" if not go_billiard else "chill"</p>
      </div>
      <div class="invoice-meta">
        <h2>Invoice</h2>
        <div class="invoice-number">#${invoiceNumber}</div>
        <div class="status">${isPaid ? "Paid" : "Pending Payment"}</div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="info-label">Bill To</div>
        <div class="info-value">${customerName}</div>
        ${sessionName ? `<div class="info-value" style="margin-top: 12px; color: #6e6e73;">${sessionName}</div>` : ""}
      </div>
      <div style="text-align: right;">
        <div class="info-label">Date</div>
        <div class="info-value">${formattedDate}</div>
        ${location ? `<div class="info-label" style="margin-top: 16px;">Location</div><div class="info-value">${location}</div>` : ""}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Description</th>
          <th style="width: 15%;">Hours</th>
          <th style="width: 20%;" class="text-right">Rate</th>
          <th style="width: 15%;" class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>
              <div class="description">${item.description}</div>
              ${sessionName ? `<div class="session-note">Session: ${sessionName}</div>` : ""}
            </td>
            <td>${item.quantity} hr</td>
            <td class="text-right">${formatRp(item.price)}</td>
            <td class="text-right amount">${formatRp(item.total)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-line total-final">
        <span>Total ${isPaid ? "Paid" : "Due"}</span>
        <span>${formatRp(totalAmount)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing Billiard & Chill — where every game feels premium.</p>
      <p style="margin-top: 12px; color: #a5a5a8;">This invoice was automatically generated • For inquiries: hello@billiardchill.app</p>
    </div>

  </div>
</body>
</html>
`;
};