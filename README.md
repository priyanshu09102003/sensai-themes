# 🎨 SensAI - Themes

*A modern, intelligent theming solution built with Next.js that provides dynamic theme switching capabilities and a comprehensive design system for resume building.*

## ✨ Features

- **Dynamic Theme System** - Real-time theme switching with instant visual feedback
- **Multiple Theme Variants** - Pre-built light and dark themes with customizable color palettes  
- **TypeScript Support** - Full type safety with comprehensive TypeScript definitions
- **Performance Optimized** - Built with Next.js 13+ App Router for optimal loading speeds
- **Responsive Design** - Mobile-first approach ensuring compatibility across all devices
- **Developer Experience** - Hot reload, ESLint integration, and detailed documentation
- **Accessibility Compliant** - WCAG 2.1 AA compliant with proper contrast ratios
- **CSS Variables Integration** - Seamless integration with CSS custom properties

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/priyanshu09102003/sensai-themes.git

# Navigate to project directory
cd sensai-themes

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 📦 Installation

### **Prerequisites**

- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### **Setup**

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/priyanshu09102003/sensai-themes.git
   cd sensai-themes
   npm install
   ```

2. **Development server:**
   ```bash
   npm run dev
   ```

3. **Production build:**
   ```bash
   npm run build
   npm run start
   ```

## 🛠️ Usage

### **Basic Implementation**

```tsx
import { ThemeProvider } from '@/lib/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### **Theme Configuration**

```typescript
// lib/themes.ts
export const themeConfig = {
  themes: {
    light: {
      primary: 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(210 40% 96%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    dark: {
      primary: 'hsl(210 40% 98%)',
      secondary: 'hsl(222.2 84% 4.9%)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
    }
  }
}
```

### **Custom Theme Creation**

```typescript
import { createTheme } from '@/lib/create-theme'

const customTheme = createTheme({
  name: 'custom',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    // Additional color definitions
  }
})
```

## 📚 API Reference

### **ThemeProvider**

*Central provider component for theme context management.*

**Props:**
- `defaultTheme?: string` - Default theme identifier
- `storageKey?: string` - localStorage key for theme persistence
- `children: ReactNode` - Child components

### **useTheme Hook**

*Hook for accessing theme functionality within components.*

**Returns:**
- `theme: string` - Current active theme
- `setTheme: (theme: string) => void` - Theme setter function
- `themes: string[]` - Available theme options

## 📁 Project Structure

```
sensai-themes/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── theme-toggle.tsx  # Theme switching component
├── lib/                  # Utility functions and configurations
│   ├── themes.ts         # Theme definitions
│   ├── theme-provider.tsx # Theme context provider
│   └── utils.ts          # Utility functions
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

### **Tailwind CSS**

*The project uses Tailwind CSS with custom theme integration:*

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  darkMode: 'class',
}
```

### **Environment Variables**

*Optional environment variables for enhanced functionality:*

```bash
NEXT_PUBLIC_DEFAULT_THEME=light
NEXT_PUBLIC_THEME_STORAGE_KEY=sensai-theme
```

## 🌐 Deployment

### **Vercel** *(Recommended)*

```bash
npm run build
```

Deploy directly to Vercel by connecting your GitHub repository.

### **Other Platforms**

**Netlify:**
```bash
npm run build
npm run export
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Development

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |

### **Code Style**

*The project follows standard TypeScript and React conventions:*

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** strict mode enabled
- **Conventional** commit messages

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Commit** changes: `git commit -am 'Add new feature'`
4. **Push** to branch: `git push origin feature/new-feature`
5. **Submit** a pull request

### **Guidelines**

- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## ⚡ Performance

- **Lighthouse Performance Score:** 95+
- **First Contentful Paint:** <1.2s
- **Largest Contentful Paint:** <2.5s
- **Cumulative Layout Shift:** <0.1

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Priyanshu** - [@priyanshu09102003](https://github.com/priyanshu09102003)

## 🙏 Acknowledgments

- **Next.js** team for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for hosting and deployment platform
- **Open source community** for inspiration and contributions
