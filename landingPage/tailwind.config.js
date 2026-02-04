module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'agri-dark': '#0f3d2e',
        'agri-green': '#22c55e',
        'agri-green-light': '#4ade80',
        'agri-muted': '#d1fae5',
        'agri-button-dark': '#052e1c',
      },
      backgroundImage: {
        'agri-gradient': 'linear-gradient(135deg, #0f3d2e, #145a3a)',
      },
    },
  },
  plugins: [],
}
