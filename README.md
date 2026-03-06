# 🎯 QR Code Generator with Logo

Generate QR codes with a custom logo/image in the center - available as both a web app and Python script!

## ✨ Features
- 🌐 Beautiful web interface with drag-and-drop logo upload
- 📱 Responsive design that works on all devices
- 🖼️ Optional logo/image in the center of QR code
- 🔍 High error correction for reliable scanning
- ⚡ Fast serverless deployment on Vercel
- 💾 Download generated QR codes instantly

## 🚀 Quick Start

### Web Application (Recommended)

#### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python api/index.py

# Open browser to http://localhost:5000
```

#### Deploy to Vercel (Free!)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? Press Enter (or choose a name)
- In which directory is your code located? **.**
- Want to override the settings? **N**

Your app will be live at a URL like: `https://qrgenerator-xxx.vercel.app`

4. **For production deployment**:
```bash
vercel --prod
```

### Alternative: Git-Based Deployment

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy" - Vercel will auto-detect the configuration!

## 📁 Project Structure for Web App
```
qrgenerator/
├── api/
│   └── index.py           # Flask serverless function
├── templates/
│   └── index.html         # Web interface
├── static/
│   ├── style.css          # Styles
│   └── script.js          # Frontend logic
├── vercel.json            # Vercel configuration
├── requirements.txt       # Python dependencies
└── .vercelignore         # Files to exclude from deployment
```

## 💻 CLI Usage (Alternative)

If you prefer using the command line:

### Step 1: Create a Logo
```bash
python3 create_logo.py
```

### Step 2: Generate QR Code
```bash
python3 generate_qr.py
```

Edit `generate_qr.py` to customize:
- URL/text to encode
- Logo file path
- Logo size
- Colors

## 🛠️ How It Works

The web application:
1. Takes user input (URL/text) and optional logo via a modern web interface
2. Sends data to Flask serverless function on Vercel
3. Creates QR code with high error correction (allows 30% damage/obscuring)
4. Resizes and centers the logo using LANCZOS resampling for clarity
5. Returns the QR code as a base64 image
6. Provides instant download capability

## 🎨 Features in Detail

- **High Error Correction**: Uses `ERROR_CORRECT_H` level allowing up to 30% of the QR code to be covered
- **Quality Resampling**: LANCZOS algorithm ensures sharp, clear logos
- **Minimal Border**: Border set to 1 for compact QR codes
- **Responsive Design**: Works perfectly on mobile and desktop
- **No Storage**: All processing happens in-memory, no server storage needed

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

MIT License - feel free to use this project however you'd like!
