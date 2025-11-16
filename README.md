# YTAnlz.AI - YouTube Transcript Analyzer

A powerful Next.js application that analyzes YouTube video transcripts using AI and provides intelligent Q&A capabilities.

## 🚀 Features

### 1. **YouTube Transcript Analysis**
- Extract transcripts from any YouTube video
- AI-powered question answering
- Multi-language support (English & Hindi)
- Real-time chat interface

### 2. **Smart AI Integration**
- Google Gemini 1.5 Flash AI model
- Automatic language detection (English/Romanized Hindi)
- Context-aware responses with timestamps
- Fallback responses when AI is unavailable

### 3. **User Authentication**
- Secure signup/login system
- Password validation with real-time feedback
  - Minimum 8 characters
  - Uppercase & lowercase letters
  - Numbers & special characters
  - Visual green/red indicators

### 4. **Collection Management**
- Save analyzed transcripts
- My Collections dashboard
- Delete saved collections
- View transcript history

### 5. **Subscription Plans**
- Free, Pro, and Enterprise tiers
- Demo payment interface (UPI & Credit Card UI)
- Professional payment modal design

## 📦 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **AI:** Google Generative AI (Gemini 1.5 Flash)
- **Styling:** Tailwind CSS
- **UI Components:** Custom component library
- **Icons:** Lucide React

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/kavy-borad/YTAnlz.AI.git

# Navigate to project directory
cd YTAnlz.AI

# Install dependencies
npm install
<<<<<<< HEAD

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## 📁 Project Structure

```
YTAnlz.AI/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint
│   │   └── transcript/route.ts    # Transcript extraction
│   ├── dashboard/page.tsx         # Dashboard with collections
│   ├── login/page.tsx             # Login page
│   ├── register/page.tsx          # Signup with validation
│   └── page.tsx                   # Landing page
├── components/
│   ├── payment-modal.tsx          # Payment UI modal
│   ├── pricing-card.tsx           # Subscription plans
│   └── ui/                        # UI components
├── public/                        # Static assets
└── package.json
```

## 🎯 Key Features Explained

### AI Chat Integration
The application uses Google's Gemini 1.5 Flash model to analyze YouTube transcripts and answer user questions intelligently.

**Features:**
- Bilingual support (English & Hindi Devanagari)
- Timestamp-based responses
- Context-aware answers
- Quote extraction from transcripts

### Password Validation
Real-time password strength indicator with visual feedback:
- ✅ Green checkmarks for met requirements
- ❌ Red indicators for pending requirements
- Prevents form submission until all criteria are met

### Payment Modal
Professional payment interface (UI only - no actual charges):
- Credit/Debit Card form with validation
- UPI payment option
- Auto-formatting for card numbers
- Success animation after submission

## 🚀 Deployment on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kavy-borad/YTAnlz.AI)

**Environment Variables Required:**
- `GOOGLE_AI_API_KEY` - Your Google AI API key

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile-first approach
- Tablet optimization
- Desktop experience

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kavy Patel**
- GitHub: [@kavy-borad](https://github.com/kavy-borad)
- Email: kavypate0101@gmail.com

## 🙏 Acknowledgments

- Google Generative AI for powerful AI capabilities
- Next.js team for the amazing framework
- Open source community

## 📞 Support

For support, email kavypate0101@gmail.com or open an issue on GitHub.

---

Made with ❤️ by Kavy Patel
=======
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev

```
Environment Variables:
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

Project Structure:
YTAnlz.AI/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat endpoint
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard with collections
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Signup with validation
│   └── pricing/
│       └── page.tsx              # Subscription plans
├── components/
│   ├── payment-modal.tsx         # Payment UI modal
│   └── ui/                       # UI components
├── public/                       # Static assets
└── package.json

📄 License
This project is licensed under the MIT License.

👨‍💻 Author
Kavy Patel

GitHub: @kavy-borad
Email: kavypate0101@gmail.com

🙏 Acknowledgments
Google Generative AI for powerful AI capabilities
Next.js team for the amazing framework
Open source community

📞 Support
For support, email kavypate0101@gmail.com or open an issue on GitHub.

Made with ❤️ by Kavy Patel


>>>>>>> d90c637ece1ab8f506f10e93164467d580c1139f
