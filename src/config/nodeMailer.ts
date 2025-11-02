import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Create a Transporter
// This is the object that can send email.
// We're configuring it to use Gmail.
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Verify the connection (optional but recommended)
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('[email]: Nodemailer connected to Gmail successfully.');
  } catch (error) {
    console.error('[email]: Error connecting to Gmail:', error);
  }
};

// 3. Export the transporter
export default transporter;