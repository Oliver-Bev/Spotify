import Image from "next/image";
import { CircleUserRound } from 'lucide-react';
import Carousel from "@/components/Carousel";
import Controls from "@/components/Controls";

type Album = {
  id: string;
  title: string;
  src: string;
};
const albums: Album[] = [
  { id: "1", title: "Ground Zero", src: "/img/groundZero.jpg" },
  { id: "2", title: "PRO8L3M", src: "/img/pro8l3m.jpg" },
  { id: "3", title: "Art Brut 2", src: "/img/artBrut2.jpeg" },
  { id: "4", title: "EX UMBRA", src: "/img/exumbra.jpg" },
  { id: "5", title: "Fight Club", src: "/img/fightclub.jpg" },
  { id: "6", title: "WIDMO", src: "/img/widmo.jpg" },
];

const images = [
  { src: "/img/groundZero.jpg", alt: "Ground Zero" },
  { src: "/img/pro8l3m.jpg", alt: "pro8l3m" },
  { src: "/img/exumbra.jpg", alt: "exumbra" },
  { src: "/img/fightclub.jpg", alt: "Fight Club" },
  { src: "/img/widmo.jpg", alt: "widmo" },
];

function AlbumCard({ title, src }: { title: string; src: string }) {
  return (
    <div className="h-30 w-25 flex flex-col justify-center items-center ">
      <div className="w-full">
        <Image src={src} alt={title} width={200} height={200} style={{ objectFit: "cover" }} />
      </div>
      <div className="font-light mt-2">{title}</div>
    </div>
  );
}

export default function Home() {
  return (

    <div className="h-100vh w-100vw ">
     
      <div className="top">
        <div className="bg-blue-700 text-white p-3"><CircleUserRound/></div>
      </div>

      <div className="h-100 w-100 justify-center items-center text-white">
      
      <div className="pt-10 pl-5 font-bold">Odkryj Mix'y:</div>

        <div className="flex gap-6 p-6 flex flex-wrap justify-center">
          {albums.map((a) => (
            <AlbumCard key={a.id} title={a.title} src={a.src} />
          ))}
        </div>

        <div className="pt-10 pl-5 font-bold">Polecane dla Ciebie:</div>
        <Carousel images={images} itemsPerView={3} gap={12} />

      </div>

      <Controls/>
    </div>

  );
}
