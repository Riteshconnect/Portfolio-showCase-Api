import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel'; // Your MySQL model
import transporter from '../config/nodeMailer'; // <-- 1. IMPORT NODEMAILER

// === @desc:   Submit a contact form message ===
// === @route:  POST /api/contact ===
// === @access: Public ===
export const submitContactForm = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    // 1. Basic validation
    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please fill out all fields: name, email, and message');
    }

    // 2. Save the message to your MySQL database
    let newContact;
    try {
      newContact = await Contact.create({
        name,
        email,
        message,
      });
// ...
  } catch (error) {
    // This will catch validation errors (like an invalid email)
    res.status(400);

    // --- FIX: Check the error type ---
    if (error instanceof Error) {
      throw new Error(`Error saving message: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while saving the message.');
    }
  }
// ...
    // --- 3. Send the Email Notification ---
    try {
      const mailOptions = {
        from: `"Your Portfolio" <${process.env.EMAIL_USER}>`, // Sender address
        to: process.env.EMAIL_USER, // List of receivers (your personal email)
        subject: 'New Contact Form Submission!', // Subject line
        html: `
          <h2>You have a new contact form message:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('[email]: Contact form email sent successfully.');
    } catch (emailError) {
      // This logs the email error but doesn't stop the user
      // The user's message is already saved, which is the most important part
      console.error('[email]: Error sending contact email:', emailError);
    }

    // 4. Send the final success response to the user
    res.status(201).json({
      message: 'Message received! Thank you for contacting me.',
      data: newContact,
    });
  }
);