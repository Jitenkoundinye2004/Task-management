import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const accentColors = [
  { name: 'Teal', value: '#14b8a6', primary: 'teal' },
  { name: 'Blue', value: '#3b82f6', primary: 'blue' },
  { name: 'Purple', value: '#8b5cf6', primary: 'purple' },
  { name: 'Pink', value: '#ec4899', primary: 'pink' },
  { name: 'Orange', value: '#f97316', primary: 'orange' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || '#14b8a6');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle Dark/Light Theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    // Handle Accent Color with RGB for Tailwind opacity support
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r} ${g} ${b}`;
    };

    const rgb = hexToRgb(accentColor);
    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    shades.forEach(shade => {
      root.style.setProperty(`--primary-${shade}`, rgb);
    });

    localStorage.setItem('accentColor', accentColor);
  }, [theme, accentColor]);

  const toggleTheme = (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor, accentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
