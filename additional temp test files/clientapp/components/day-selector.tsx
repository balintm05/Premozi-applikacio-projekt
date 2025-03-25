import { cn } from "@/lib/utils"

export default function DaySelector() {
  const days = [
    { date: "2025.03.27", day: "Csütörtök", active: false },
    { date: "2025.03.28", day: "Péntek", active: false },
    { date: "2025.03.29", day: "Szombat", active: false },
    { date: "2025.03.30", day: "Vasárnap", active: false },
  ]

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-6 gap-1 text-center">
        <div className={cn("bg-gray-900 p-4 cursor-pointer", "bg-gray-800")}>
          <div className="font-bold">Ma</div>
          <div>Kedd</div>
        </div>
        <div className="bg-gray-900 p-4 cursor-pointer">
          <div className="font-bold">Holnap</div>
          <div>Szerda</div>
        </div>
        {days.map((day, index) => (
          <div key={index} className={cn("bg-gray-900 p-4 cursor-pointer", day.active && "bg-gray-800")}>
            <div>{day.date}</div>
            <div>{day.day}</div>
          </div>
        ))}
        <div className="bg-gray-900 p-4 cursor-pointer">
          <div>Teljes műsor</div>
        </div>
      </div>
    </div>
  )
}

