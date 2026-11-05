export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function renderEmailLayout({ heading, bodyHtml }) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
<tr><td style="background:#ff6a00;padding:24px 28px;">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">${escapeHtml(heading)}</h1>
</td></tr>
<tr><td style="padding:28px;color:#1c1f26;font-size:14px;line-height:22px;">
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;background:#fafafa;color:#8a8a8a;font-size:12px;">
Rela Hospital
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export function fieldsTable(rows) {
  const body = rows
    .map(([label, value]) => {
      const safeValue = value === null || value === undefined || value === '' ? '—' : escapeHtml(String(value))
      return `<tr><td style="padding:6px 0;font-weight:700;width:170px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top;">${safeValue}</td></tr>`
    })
    .join('')

  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${body}</table>`
}
