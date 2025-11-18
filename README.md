# Kezi Fire Chilli - Zimbabwe's Finest Heat

A bold, vibrant website for a premium chilli brand based in Kezi, Zimbabwe. The site features an energetic, authentic design emphasizing local farming heritage and the power of African chillies.

## Features

- 🎨 Fiery, energetic design with vibrant color palette
- 📱 Fully responsive mobile-first layout
- 🛍️ Product showcase with heat levels and pricing
- 📝 Interactive contact form with TypeScript backend
- 🔔 Telegram Bot integration for form submissions
- ♿ Accessible and SEO-friendly

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express, TypeScript
- **API Integration:** Telegram Bot API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Telegram Bot Token (get from @BotFather)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nkosana1/Kezi-Fire-Chilli-.git
cd Kezi-Fire-Chilli-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Telegram Bot credentials:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=3000
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will run on `http://localhost:3000`

## Project Structure

```
├── index.html              # Homepage
├── about.html              # About page
├── chilli-powder.html      # Chilli powder product page
├── chilli-oils.html        # Chilli oils product page
├── contact.html            # Contact page with form
├── styles.css              # Main stylesheet
├── script.js               # Navigation menu handler
├── contact-form.js         # Contact form handler
├── server.ts               # TypeScript Express server
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── .env.example            # Environment variables template
```

## Contact Form

The contact form includes:
- Client-side validation
- Server-side validation with express-validator
- Input sanitization against injection attacks
- Telegram Bot API integration
- Proper error handling

## License

MIT License - see LICENSE file for details

## Contact

Kezi Fire Chilli
123 Farm Road, Kezi City
Matabeleland South, Zimbabwe
Phone: +263 77 123 4567
Email: info@kezifirechilli.co.zw

