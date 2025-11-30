import { House, Search, Library} from 'lucide-react';

export default function Controls() {
  return (
    <div
      className="
        fixed bottom-0 left-0 w-full p-3 flex items-center justify-center text-white border-t border-white/20 ">
      <div className="flex flex-row gap-18 w-full justify-center items-center">
        <div className="flex flex-col w-10 h-10 items-center "><House/><div className="text-xs">Główna</div> </div>
        <div className="flex flex-col w-10 h-10 items-center"> <Search/><div className="text-xs">Szukaj</div> </div>
        <div className="flex flex-col w-10 h-10 items-center"><Library/><div className="text-xs">Biblioteka</div></div>
        </div>
    </div>
  );
}
