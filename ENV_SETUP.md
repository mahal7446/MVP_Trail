# Environment Variables Setup

This project uses environment variables to store sensitive API keys. These keys are **NOT** committed to version control.

## Quick Setup

1. **Copy the example files:**
   ```bash
   # Root directory (for frontend)
   cp .env.example .env
   
   # Backend directory
   cp backend/.env.example backend/.env
   ```

2. **Add your API keys:**
   - Edit `.env` and add your OpenWeather and Gemini API keys
   - Edit `backend/.env` and add your API keys and SMTP credentials

## Required API Keys

### OpenWeather API
- **Get your key:** https://openweathermap.org/api
- **Used for:** Weather data on the dashboard
- **Variable name (frontend):** `VITE_OPENWEATHER_API_KEY`
- **Variable name (backend):** `OPENWEATHER_API_KEY`

### Google Gemini AI
- **Get your key:** https://makersuite.google.com/app/apikey
- **Used for:** AI-powered chatbot assistance
- **Variable name (frontend):** `VITE_GEMINI_API_KEY`
- **Variable name (backend):** `GEMINI_API_KEY`

## Important Notes

⚠️ **Never commit `.env` files to Git!** They contain sensitive information.

✅ **Always commit `.env.example` files** - they serve as templates for other developers.

## Files Protected from Git

The following files are in `.gitignore` and will **NOT** be pushed to GitHub:
- `.env`
- `.env.local`
- `backend/.env`

## What Gets Pushed to GitHub

✅ **Template files (safe to commit):**
- `.env.example`
- `backend/.env.example`

❌ **Actual environment files (never commit):**
- `.env`
- `backend/.env`
