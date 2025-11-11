# Local Development Setup

## Running the Server Locally

To test the contact form with Resend locally, you need to run a local server.

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Express (web server)
- CORS (for cross-origin requests)
- dotenv (for loading .env file)

### Step 2: Make sure your .env file exists

Create a `.env` file in the root directory with:

```
RESEND_API=your_resend_api_key_here
RESEND_FROM_EMAIL=your_verified_email@domain.com
```

### Step 3: Start the Server

```bash
npm run dev
```

Or:

```bash
node server.js
```

The server will start on `http://localhost:3000`

### Step 4: Open the Website

Open your browser and go to `http://localhost:3000`

The contact form will now work and send emails via Resend!

## Alternative: Using Vercel CLI

If you prefer to use Vercel's local development:

```bash
npm install -g vercel
vercel dev
```

This will use your `.env` file and simulate the Vercel environment.

## Troubleshooting

- **405 Method Not Allowed**: Make sure you're using the local server (port 3000), not Live Server
- **API Key Error**: Check that your `.env` file has `RESEND_API` set correctly
- **CORS Errors**: The server includes CORS, so this shouldn't be an issue

