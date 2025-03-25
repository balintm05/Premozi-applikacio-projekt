"use client"
import { Row, Col, Button } from "reactstrap"

export default function DaySelector({ selectedDate, onDateChange }) {
  const days = [
    { date: "2025.03.25", day: "Kedd", label: "Ma" },
    { date: "2025.03.26", day: "Szerda", label: "Holnap" },
    { date: "2025.03.27", day: "Csütörtök", label: null },
    { date: "2025.03.28", day: "Péntek", label: null },
    { date: "2025.03.29", day: "Szombat", label: null },
    { date: "2025.03.30", day: "Vasárnap", label: null },
  ]

  return (
    <div className="day-selector mb-4">
      <Row className="text-center">
        {days.map((day) => (
          <Col key={day.date} xs={6} md={2} className="mb-2">
            <Button
              color={selectedDate === day.date ? "primary" : "secondary"}
              outline={selectedDate !== day.date}
              className="w-100 py-2"
              onClick={() => onDateChange(day.date)}
            >
              {day.label && <div className="fw-bold">{day.label}</div>}
              <div>{day.date}</div>
              <div>{day.day}</div>
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  )
}

