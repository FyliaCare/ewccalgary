import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface VolunteerEmailData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendVolunteerConfirmation(data: VolunteerEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #933548, #7B2D3B); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
        .header p { color: #ffffff; opacity: 0.7; font-size: 14px; margin-top: 5px; }
        .content { padding: 30px; }
        .content h2 { color: #933548; font-size: 20px; }
        .content p { line-height: 1.6; color: #d4d4d4; }
        .detail { background: #2a2a2a; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .detail span { color: #a0a0a0; font-size: 13px; }
        .detail strong { color: #ffffff; display: block; margin-top: 2px; }
        .footer { padding: 20px 30px; border-top: 1px solid #2a2a2a; text-align: center; }
        .footer p { color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EWC Calgary</h1>
          <p>Volunteer Application Received</p>
        </div>
        <div class="content">
          <h2>Welcome, ${data.firstName}! 🙏</h2>
          <p>Thank you for signing up to volunteer at <strong>Empowerment Worship Centre — Calgary Campus</strong>. We're excited to have you join the team!</p>
          
          <div class="detail">
            <span>Name</span>
            <strong>${data.firstName} ${data.lastName}</strong>
          </div>
          <div class="detail">
            <span>Department</span>
            <strong>${data.department}</strong>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol style="color: #d4d4d4; line-height: 1.8;">
            <li>Our team will review your application</li>
            <li>You'll be contacted within 3–5 business days</li>
            <li>You'll be invited to an orientation / onboarding session</li>
            <li>Training and placement in your chosen department</li>
          </ol>
          
          <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:info@ewccalgary.ca" style="color: #933548;">info@ewccalgary.ca</a>.</p>
          
          <p>God bless you!<br><strong>EWC Calgary Team</strong></p>
        </div>
        <div class="footer">
          <p>Empowerment Worship Centre — Calgary Campus</p>
          <p>225 Chaparral Drive SE, Calgary, Alberta, Canada</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"EWC Calgary" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: "Volunteer Application Received — EWC Calgary",
      html,
    });
    console.log(`Volunteer confirmation email sent to ${data.email}`);
  } catch (error) {
    console.error("Failed to send volunteer confirmation email:", error);
  }
}

export async function sendContactNotification(data: ContactEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ewccalgary.org";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #933548, #7B2D3B); padding: 20px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 20px; margin: 0; }
        .content { padding: 25px; }
        .detail { background: #2a2a2a; padding: 12px; border-radius: 6px; margin: 10px 0; }
        .detail span { color: #a0a0a0; font-size: 12px; }
        .detail strong { color: #ffffff; display: block; margin-top: 2px; }
        .message-box { background: #2a2a2a; padding: 15px; border-radius: 8px; border-left: 3px solid #933548; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Message</h1>
        </div>
        <div class="content">
          <div class="detail">
            <span>From</span>
            <strong>${data.name} (${data.email})</strong>
          </div>
          <div class="detail">
            <span>Subject</span>
            <strong>${data.subject}</strong>
          </div>
          <div class="message-box">
            <p style="color: #d4d4d4; line-height: 1.6; margin: 0;">${data.message}</p>
          </div>
          <p style="margin-top: 15px;"><a href="mailto:${data.email}" style="color: #933548;">Reply to ${data.name}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"EWC Calgary Website" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Contact Form: ${data.subject} — from ${data.name}`,
      html,
    });
    console.log("Contact notification sent to admin");
  } catch (error) {
    console.error("Failed to send contact notification:", error);
  }
}
