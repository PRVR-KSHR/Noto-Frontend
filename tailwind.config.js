/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // noto Brand Colors
        'noto': {
          primary: '#10367D',      // Deep blue - main brand color
          secondary: '#74B4D9',    // Light blue - accents & highlights  
          light: '#EBEBEB',        // Light gray - backgrounds & subtle elements
          dark: '#0A1B3D',         // Darker shade of primary for depth
        },
        // Semantic colors using your palette
        primary: {
          50: '#EFF4FF',
          100: '#DBE8FE', 
          200: '#BFD7FE',
          300: '#93BBFD',
          400: '#609BFA',
          500: '#74B4D9',  // Your accent blue
          600: '#10367D',  // Your primary blue
          700: '#0A1B3D',
          800: '#0F1629',
          900: '#0D1526',
        },
  // Background and foreground
  // Updated light-mode background to a softer off-white for eye comfort
  background: '#FFF8EC',
        foreground: '#10367D',
        muted: {
          DEFAULT: '#EBEBEB',     // Your light gray
          foreground: '#6B7280',
        },
        // UI element colors
        border: '#EBEBEB',
        input: '#EBEBEB',
        ring: '#74B4D9',
        // Success, warning, error (complementary to your palette)
        success: '#10B981',
        warning: '#F59E0B', 
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'noto': '0 4px 6px -1px rgba(16, 54, 125, 0.1), 0 2px 4px -1px rgba(16, 54, 125, 0.06)',
        'noto-lg': '0 10px 15px -3px rgba(16, 54, 125, 0.1), 0 4px 6px -2px rgba(16, 54, 125, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
