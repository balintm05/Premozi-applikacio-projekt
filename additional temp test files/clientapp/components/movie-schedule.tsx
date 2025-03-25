import Image from "next/image"
import { Button } from "@/components/ui/button"

interface MovieScheduleProps {
  time: string
  title: string
  image: string
  genre: string
  filmType: string
  country: string
  runtime: string
  description: string
  cast: string
  director: string
  ageRating: number
}

export default function MovieSchedule({
  time,
  title,
  image,
  genre,
  filmType,
  country,
  runtime,
  description,
  cast,
  director,
  ageRating,
}: MovieScheduleProps) {
  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4 bg-gray-900 p-4 rounded">
      <div className="flex flex-col">
        <div className="text-xl font-bold text-purple-500 mb-2">
          {time} {title}
        </div>
        <div className="relative h-[200px] w-full mb-4">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded" />
          <div className="absolute bottom-2 left-2 bg-yellow-600 text-black text-xs font-bold px-1 py-0.5 rounded">
            {ageRating}
          </div>
        </div>
        <div className="space-y-2">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Foglalás</Button>
          <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-900/30">
            Mikor vetítjük még?
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-red-700 text-xs font-bold px-2 py-1 inline-block mb-1">{filmType}</div>
        <div className="text-sm">{genre}</div>
        <div className="text-sm">Származási ország: {country}</div>
        <div className="text-sm">Vetítés ideje: {runtime}</div>
        <p className="text-sm mt-2">{description}</p>
        <div className="text-sm mt-2">Rendező: {director}</div>
        <div className="text-sm">Szereplők: {cast}</div>
      </div>
    </div>
  )
}

