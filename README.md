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


