
import Image from "next/image";
import { CircleUserRound } from 'lucide-react';
import Carousel from "@/components/Carousel";
import Controls from "@/components/Controls";
import Header from "@/components/Header";


//config bazy Supabase
const MY_BUCKET_NAME = 'images'; 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;


if (!SUPABASE_URL) {
    console.error("Zmienna NEXT_PUBLIC_SUPABASE_URL nie została ustawiona w pliku .env.local!");
}

type Album = {
    id: string;
    title: string;
    src: string; 
};


const albums: Album[] = [
    { id: "1", title: "Ground Zero", src: "groundZero.jpg" },
    { id: "2", title: "PRO8L3M", src: "pro8l3m.jpg" },
    { id: "3", title: "Art Brut 2", src: "artBrut2.jpeg" },
    { id: "4", title: "EX UMBRA", src: "exumbra.jpg" },
    { id: "5", title: "Fight Club", src: "fightclub.jpg" },
    { id: "6", title: "WIDMO", src: "widmo.jpg" },
];

const images = [
    { src: "groundZero.jpg", alt: "Ground Zero" },
    { src: "pro8l3m.jpg", alt: "pro8l3m" },
    { src: "exumbra.jpg", alt: "exumbra" },
    { src: "fightclub.jpg", alt: "Fight Club" },
    { src: "widmo.jpg", alt: "widmo" },
];



function AlbumCard({ title, src }: { title: string; src: string }) {

    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${MY_BUCKET_NAME}/${src}`;

    return (
        <div className="h-30 w-25 flex flex-col justify-center items-center ">
            <div className="w-full">
             
                <Image 
                    src={imageUrl} 
                    alt={title} 
                    width={200} 
                    height={200} 
                    style={{ objectFit: "cover" }} 
                />
            </div>
            <div className="font-light mt-2">{title}</div>
        </div>
    );
}

function ImageDisplay({ fileName, altText, width, height }: { fileName: string, altText: string, width: number, height: number }) {

    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${MY_BUCKET_NAME}/${fileName}`;
    
    return (
        <div>
           
            <Image
                src={imageUrl}
                alt={altText}
                width={width} 
                height={height}
            />
        </div>
    );
}


export default function Home() {
    return (

        <div className="min-h-screen bg-black"> 
       
            <Header/>

            <div className="flex justify-center">
                <div className="w-full max-w-screen-xl">
              
                    <div className="pt-16 text-white"> 
                    
                        <div className="pl-5 font-bold">Odkryj Mix'y:</div> 
                        
                        <div className="flex gap-6 p-6 flex flex-wrap justify-center">
                            {albums.map((a) => (
                                <AlbumCard key={a.id} title={a.title} src={a.src} />
                            ))}
                        </div>

                        <div className="pt-10 pl-5 font-bold">Polecane dla Ciebie:</div>
                        <Carousel images={images} itemsPerView={3} gap={12} />
                        <Carousel images={images} itemsPerView={3} gap={12} />
                        <Carousel images={images} itemsPerView={3} gap={12} />

                    </div>
                </div>
            </div>

            <Controls/>
        </div>
    );
}