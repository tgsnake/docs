'use client';
import { ThemeProvider } from 'next-themes';

export default function Provider({ children }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
    </ThemeProvider>
  );
}
