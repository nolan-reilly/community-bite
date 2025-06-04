import Link from "next/link"
import { CircleCheckBig } from "lucide-react";

export interface Pantry {
  id: number,
  name: string,
  address: string,
  location?: {lat: number, lng: number},
  distance: {text: string, value: number},  // text (miles) value(yards?)
  duration: {text: string, value: number},  // text (min) value (sec)
  mapsURL: string | ""
}

interface props {
  pantry: Pantry,
  className?: string,
  isSearchable: boolean,
  setSelectedPantry: (pantry: any) => void
}

export default function PantryInfoCard({pantry, className, isSearchable = false, setSelectedPantry}: props) {

  return (
    <div id={`${pantry.id}`} className={`${className} border-b border-solid border-gray-400`} onClick={() => setSelectedPantry(pantry)} >
      <div className="flex flex-row gap-2">
        <h1 className="font-bold text-base" >{pantry.name}</h1>
        {isSearchable && <CircleCheckBig />}
      </div>
      <Link 
        className="underline text-blue-700 text-[0.925rem] hover:text-blue-900 hover:no-underline"
        href={pantry?.mapsURL}
        target="_blank"
      >
        {pantry.address}
      </Link>
      <h3 className="text-[0.925rem]" >Distance: {pantry.distance.text}</h3>
      <h3 className="text-[0.925rem]" >Average Time: {pantry.duration.text}</h3>
    </div>
  )
};