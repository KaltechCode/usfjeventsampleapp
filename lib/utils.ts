import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import nodemailer from 'nodemailer';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}




const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

const sendEmail = async (data: { sender: { name: string; address: string }; receipients: { name: string; address: string }[]; message?: string; subject?: string }) => {
    const { sender, receipients, message, subject } = data;

    try {
        return await transporter.sendMail({
            from: `${sender.name} <${sender.address}>`,
            to: receipients.map(
                (recipient) => `${recipient.name} <${recipient.address}>`,
            ),
            subject,
            html: message,
            text: message,
        });
    } catch (error) {
        console.error('Email sending error details:', error);
        throw error;
    }
};

export default sendEmail;

export const registrationMailSender = {
  name: 'United Servants for Jesus',
  address: 'usfj_auth@kaltechconsultancy.tech',
};

export const registrationMailRecipient = {
  name: 'United Servants for Jesus',
  // address: 'notifications@usfjesus.org',
  address: 'test@kaltechconsultancy.tech'
};


export function escapeHtml(value: string) {
  return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

export function brandedVolunteerEmail({
  title,
  intro,
  content = '',
  action,
  footer = 'United Servants for Jesus | Serving our community in faith',
}: {
  title: string;
  intro: string;
  content?: string;
  action?: {
    url: string;
    label: string;
  };
  footer?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const logoUrl = siteUrl ? `${siteUrl}/images/usfj_white_logo.png` : undefined;

  return `
  <div style="margin:0;background:#f4f6fb;padding:32px 16px;font-family:Arial,sans-serif;color:#142560;line-height:1.6;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dbe3f4;">
      <div style="padding:28px 32px;background:#142560;text-align:center;color:#ffffff;">
        ${
            logoUrl 
                ? `<img src="${escapeHtml(logoUrl)}" alt="United Servants for Jesus" style="height:42px;display:inline-block;" />`
                : 'United Servants for Jesus'
        }
        <h1 style="margin:20px 0 0;color:#ffffff;font-size:20px;line-height:1.3;">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 18px;font-size:16px;">${escapeHtml(intro)}</p>
        ${content}
        ${
            action
                ? `<p style="margin:32px 0 0;text-align:center;"><a href="${escapeHtml(action.url)}" style="display:inline-block;padding:13px 22px;background:#142560;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:4px;">${escapeHtml(action.label)}</a></p>`
                : ''
        }
      </div>
      <div style="padding:18px 32px;background:#142560;color:#ffffff;font-size:13px;text-align:center;">${escapeHtml(footer)}</div>
    </div>
  </div>
`;
}
