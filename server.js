// Local development server for testing Resend integration
// Run with: node server.js
// Requires: npm install express dotenv cors

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if RESEND_API is set
    if (!process.env.RESEND_API) {
        return res.status(500).json({ 
            error: 'RESEND_API environment variable is not set',
            message: 'Please add RESEND_API to your .env file'
        });
    }

    // Always use onboarding@resend.dev (pre-verified by Resend)
    // Gmail and other domains cannot be used as "from" without domain verification
    const fromEmail = 'onboarding@resend.dev';

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API}`
            },
            body: JSON.stringify({
                from: fromEmail,
                to: 'ethanowicks9@gmail.com',
                subject: `New Contact Form Submission from ${name}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>You can reply directly to this email to respond to ${name} at ${email}</small></p>
                `,
                replyTo: email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
        }

        return res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
            error: 'Failed to send email', 
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Make sure your .env file contains RESEND_API');
});

