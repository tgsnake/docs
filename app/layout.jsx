import Provider from '@/components/body';
import '../styles/global.css';
import 'nextra-theme-docs/style.css';

export const metadata = {
  title: 'Blog | tgsnake',
  description: 'Journey',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="transition-all">
      <body className="font-rubik">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
