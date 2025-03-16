import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.PASSWORD,
  },
});

// Send password to the user's email
export const sendEmail = async (email, name, password) => {
  // Send password to the user's email
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: `Welcome to the Ticket Management System, ${name}`,
    html: `
      <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c3e50;
        text-align: center;
        font-size: 24px;
        margin-bottom: 15px;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .credentials {
        margin-top: 20px;
        padding: 15px;
        background-color: #f2f2f2;
        border-radius: 5px;
        font-weight: bold;
        text-align: center;
        font-size: 14px;
      }
      .credentials p {
        margin: 5px 0;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #777;
      }
      .header {
        background-color: #007bff;
        color: #fff;
        padding: 30px 0;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }

      /* Responsive Design */
      @media screen and (max-width: 600px) {
        .container {
          padding: 15px;
        }
        h1 {
          font-size: 22px;
        }
        .credentials {
          font-size: 13px;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Ticket Management System</h1>
    </div>
    <div class="container">
      <h1>Welcome to the Ticket Management System!</h1>
      <div class="content">
        <p>Hello ${name},</p>
        <p>We're thrilled to welcome you to the Ticket Management System! This platform will help you efficiently manage and track tickets. We’re excited to have you on board and look forward to providing you with the best experience.</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>Best regards,</p>
        <p>The Ticket Management System Team</p>
        <p><strong>Note:</strong> We highly recommend changing your password as soon as possible by visiting the profile section.</p>
      </div>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to contact us at any time.</p>
    </div>
  </body>
  </html>
    `,
  };
  await transporter.sendMail(mailOptions);
};
