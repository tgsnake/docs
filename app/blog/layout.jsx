import Dropdown from '@/components/dropdown';
import Link from 'next/link';
export const metadata = {
  title: 'Blog | tgsnake',
  description: 'Journey',
};

export default function Layout({ children }) {
  return (
    <div>
      <header className="p-4 border-b border-gray-6 sticky top-0 navbar navbar-glass shadow-none z-50 flex justify-between items-center">
        <Link href="/blog" className="font-bold text-2xl">
          tgsnake
        </Link>
        <Dropdown />
      </header>
      <div className="px-4 py-2 mt-2 md:flex">
        <div className="md:mx-auto md:w-1/2">{children}</div>
      </div>
    </div>
  );
}
