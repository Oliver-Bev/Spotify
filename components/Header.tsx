"use client";
import { CircleUserRound } from 'lucide-react';
import { usePathname } from 'next/navigation'; 

export default function Header() {
    const pathname = usePathname(); 

    const getPageTitle = (path: string): string => {
       
        switch (path) {
            case '/':
                return 'Wszystko';
            case '/library':
                return 'Biblioteka';
            case '/search': 
                return 'Szukaj';
            default:
              
                if (path.startsWith('/albumy/')) {
                    return 'Album'; 
                }
                return '';
        }
    };

    const title = getPageTitle(pathname);

    return(
        <div className="fixed top-0 left-0 bg-black text-white p-3 w-full flex flex-row items-center border-b border-white/40 z-20 ">

            <CircleUserRound size={32}/>

            <div className="ml-3 text-xl font-semibold">
                {title}
            </div>
            
        </div>
    );
}