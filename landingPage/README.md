# AgriDetect AI - Landing Page

A modern, responsive AI agriculture landing page built with React 18, Vite, and Tailwind CSS.

## Features

- ✨ Modern SaaS-style design
- 🎨 Dark green gradient aesthetic
- 📱 Fully responsive (mobile-first approach)
- ⚡ Built with Vite for fast development
- 🎯 Smooth scrolling navigation
- 🔧 Tailwind CSS for utility-first styling

## Tech Stack

- **React** 18 - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Inter Font** - Modern typography

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      - Navigation bar
│   ├── Hero.jsx        - Hero section with CTA
│   ├── Features.jsx    - Features showcase
│   ├── CTA.jsx         - Call-to-action section
│   └── Footer.jsx      - Footer with links
├── App.jsx             - Main app component
├── main.jsx            - Entry point
└── index.css           - Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:
- `agri-dark`: Primary background
- `agri-green`: Primary accent
- `agri-green-light`: Light accent
- `agri-muted`: Muted text

### Sections
All components are self-contained in the `src/components/` directory and can be easily modified or extended.

## Responsive Design

- **Desktop**: Full layout with navigation links visible
- **Tablet**: Optimized spacing and text sizes
- **Mobile**: Single column layout with stacked buttons

---

Built with ❤️ for modern agriculture
