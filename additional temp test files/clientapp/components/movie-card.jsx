import Image from "./image-component"
import { cn } from "../lib/utils"

export default function MovieCard({ image, title, highlighted }) {
  return (
    <div className="relative group cursor-pointer">
      <div className="relative h-[280px] w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2",
            highlighted && "bg-yellow-600/80",
          )}
        >
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </div>
      </div>
    </div>
  )
}

