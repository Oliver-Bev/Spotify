import { House, Search, Library} from 'lucide-react';
import Link from 'next/link';

export default function Controls() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full p-3 flex items-center justify-center text-white border-t border-white/20 bg-gray-600/15 backdrop-blur-md z-2">
      <div className="flex flex-row gap-18 w-full justify-center items-center">
       <Link href="/" passHref>
            <div className="flex flex-col w-10 h-10 items-center cursor-pointer hover:text-indigo-400 transition">
                <House/>
                <div className="text-xs">Głowna</div>
            </div>
        </Link>

        <Link href="/search" passHref>
            <div className="flex flex-col w-10 h-10 items-center cursor-pointer hover:text-indigo-400 transition">
                <Search/>
                <div className="text-xs">Szukaj</div>
            </div>
        </Link>
       
        <Link href="/library" passHref>
            <div className="flex flex-col w-10 h-10 items-center cursor-pointer hover:text-indigo-400 transition">
                <Library/>
                <div className="text-xs">Biblioteka</div>
            </div>
        </Link>
        </div>
    </div>
  );
}
