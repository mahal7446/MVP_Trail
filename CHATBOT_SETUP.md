# AI Chatbot Setup Guide

## Prerequisites

You need a **Google Gemini API Key** to use the chatbot functionality.

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

## Backend Setup

### 1. Install Required Package

The `google-generativeai` package has been added to `requirements.txt`. Install it by running:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit `backend/.env` and add your Gemini API key:

```bash
# AI Chatbot (Google Gemini)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-actual-api-key-here
```

**Replace `your-actual-api-key-here` with your real API key.**

### 3. Restart Backend Server

After updating the `.env` file, restart your backend server:

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
python backend/app.py
```

## Frontend Setup

No additional setup required! The frontend is already configured.

## Testing the Chatbot

### Test Locally

1. **Start both servers** (if not already running):
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Navigate to the app**: Open http://localhost:8081

3. **Upload a plant image**:
   - Go to Upload page
   - Upload a plant image
   - Wait for disease prediction

4. **Open the chatbot**:
   - Click the floating chat button (bottom-right corner)
   - You should see a greeting message about the detected disease
   - Ask questions like:
     - "How do I treat this?"
     - "What fertilizer should I use?"
     - "How can I prevent this in the future?"

5. **Test Voice Features**:
   - Click the microphone icon
   - Allow microphone permission when prompted
   - Speak your question
   - Click the speaker icon on AI responses to hear them

6. **Test Multiple Languages**:
   - Change app language in settings
   - Send a message
   - AI should respond in the selected language

## Troubleshooting

### Chatbot Not Responding

**Error: "API key not found"**
- Make sure you've added `GEMINI_API_KEY` to `backend/.env`
- Restart the backend server after adding the key

**Error: "Failed to get response"**
- Check your internet connection
- Verify your API key is valid
- Check backend console for detailed error messages

### Voice Input Not Working

**Microphone button is grayed out**
- Voice input requires HTTPS or localhost
- Use Chrome, Edge, or Safari (best browser support)
- Allow microphone permissions when prompted

**No speech detected**
- Speak clearly and loudly
- Check microphone settings in your OS
- Try a different browser

### Language Issues

**AI responds in wrong language**
- Make sure you've selected the correct language in app settings
- Try refreshing the page
- Clear chat and send a new message

## Supported Languages

The chatbot supports:
- English (en)
- Hindi (hi)
- Kannada (kn)
- Telugu (te)
- Tamil (ta)
- Bengali (bn)

## API Usage & Costs

**Google Gemini Free Tier:**
- 60 requests per minute
- 1000 requests per day
- Free for testing and development

For production use with higher limits, you may need to upgrade your Gemini API plan.

## Deployment to Vercel

### Backend Deployment

The backend needs to be deployed separately (Heroku, Railway, Render, etc.) as Vercel doesn't support long-running Python servers.

**Quick Option: Use Railway**

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Connect your GitHub repo
4. Add environment variable: `GEMINI_API_KEY`
5. Railway will auto-deploy

### Frontend Environment Variables

Update your Vercel environment variables:

```
VITE_API_URL=https://your-backend-url.railway.app
```

Then redeploy the frontend.

## Next Steps

- Test the chatbot thoroughly with different questions
- Try all supported languages
- Test voice input and output
- Gather user feedback
- Monitor API usage in Google AI Studio

## Support

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Check backend logs for Python errors
3. Verify API key is correct and active
4. Ensure both frontend and backend are running
