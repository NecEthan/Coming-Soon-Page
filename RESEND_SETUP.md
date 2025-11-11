# Resend Email Setup Instructions

## Quick Setup (Using Serverless Function)

The contact form is configured to use Resend via a serverless function for security.

### Option 1: Deploy to Vercel (Recommended)

1. **Get your Resend API Key:**
   - Sign up at https://resend.com
   - Go to API Keys section
   - Create a new API key
   - Copy the key

2. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Go to Environment Variables
   - Add:
     - `RESEND_API` = your Resend API key
     - `RESEND_FROM_EMAIL` = your verified email/domain (e.g., `contact@yourdomain.com`)

   **Or use a `.env` file locally:**
   - Create a `.env` file in the root directory
   - Add: `RESEND_API=your_api_key_here`
   - Add: `RESEND_FROM_EMAIL=your_email@domain.com`

4. **Redeploy** after adding environment variables

### Option 2: Deploy to Netlify

1. **Create `netlify/functions/send-email.js`:**
   ```javascript
   exports.handler = async (event, context) => {
     // Same code as api/send-email.js but adapted for Netlify
   }
   ```

2. **Add Environment Variables in Netlify:**
   - Go to Site settings > Environment variables
   - Add `RESEND_API` and `RESEND_FROM_EMAIL`

### Option 3: Use Netlify Forms (Easier Alternative)

If you prefer not to use Resend directly, you can use Netlify Forms:

1. Add `netlify` attribute to the form:
   ```html
   <form id="contact-form" netlify>
   ```

2. Deploy to Netlify - forms will work automatically
3. Configure email notifications in Netlify dashboard

## Testing

After deployment, test the contact form. Emails will be sent to: **ethanowicks9@gmail.com**

## Important Notes

- Never expose your Resend API key in frontend code
- Always use environment variables
- The serverless function keeps your API key secure
- **Domain Verification**: If you get a "domain is not verified" error:
  - Option 1: Don't set `RESEND_FROM_EMAIL` in .env - it will use `onboarding@resend.dev` (pre-verified)
  - Option 2: Verify your own domain at https://resend.com/domains
  - Option 3: Use an email from a domain you've verified in Resend

## Quick Fix for Domain Verification Error

If you see "The gmail.com domain is not verified" error:

1. **Remove RESEND_FROM_EMAIL from .env** (or don't set it)
   - The code will automatically use `onboarding@resend.dev` which is pre-verified
   
2. **Or verify your domain:**
   - Go to https://resend.com/domains
   - Add and verify your domain
   - Then set `RESEND_FROM_EMAIL=contact@yourdomain.com` in .env

