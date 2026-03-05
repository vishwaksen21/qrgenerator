# 🚀 Deployment Guide for Vercel

## Prerequisites
- A GitHub account
- A Vercel account (free at vercel.com)

## Method 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

If you don't have npm, install Node.js first from https://nodejs.org

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Project Directory
```bash
cd /workspaces/qrgenerator
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → Press Enter or type "qrgenerator"
- **In which directory is your code located?** → . (press Enter)
- **Want to override the settings?** → No

🎉 Your app will be deployed! You'll get a URL like: `https://qrgenerator-xxx.vercel.app`

### Step 4: Deploy to Production
```bash
vercel --prod
```

---

## Method 2: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add web application for QR generator"
git push origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `qrgenerator` repository
5. Vercel will auto-detect the configuration
6. Click **"Deploy"**

🎉 Done! Your app is live!

---

## Method 3: One-Click Deploy

Click this button to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vishwaksen21/qrgenerator)

---

## Testing Your Deployment

Once deployed, visit your Vercel URL and:
1. Enter a URL or text in the input field
2. Optionally upload a logo image
3. Click "Generate QR Code"
4. Download your custom QR code!

---

## Troubleshooting

### Issue: "Build failed"
**Solution:** Make sure `requirements.txt` is present and contains:
```
Flask==3.0.0
Pillow==10.2.0
qrcode==7.4.2
```

### Issue: "Static files not loading"
**Solution:** Verify `vercel.json` routes are correct:
```json
{
  "routes": [
    {"src": "/static/(.*)", "dest": "/static/$1"},
    {"src": "/(.*)", "dest": "/api/index.py"}
  ]
}
```

### Issue: "500 Internal Server Error"
**Solution:** Check Vercel logs:
```bash
vercel logs
```

---

## Environment Variables (Optional)

If you need to add environment variables:
```bash
vercel env add VARIABLE_NAME
```

Or via Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add your variables

---

## Custom Domain (Optional)

To add a custom domain:
1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your domain and follow the instructions

---

## Local Development

To test locally before deploying:
```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python api/index.py

# Open http://localhost:5000 in your browser
```

---

## Support

- Vercel Documentation: https://vercel.com/docs
- GitHub Issues: Open an issue in your repository

---

**Ready to deploy? Choose a method above and your QR generator will be live in minutes!** 🚀
