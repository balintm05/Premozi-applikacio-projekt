"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import MovieCard from "./MovieCard"
import DaySelector from "./DaySelector"

export default function MovieList() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("2025.03.25")

  useEffect(() => {
    fetchMovies()
  }, [selectedDate])

  async function fetchMovies() {
    try {
      // In a real app, you would fetch from your ASP.NET Core API
      // const response = await fetch(`api/movies?date=${selectedDate}`);
      // const data = await response.json();

      // For demo purposes, we'll use mock data
      const mockData = [
        { id: 1, title: "A könyvelő 2.", image: "/movies/accountant.jpg", time: "14:00" },
        { id: 2, title: "Véletlenül írtam egy könyvet", image: "/movies/valentines.jpg", time: "14:30" },
        { id: 3, title: "Barbárok a szomszédba", image: "/movies/barbares.jpg", time: "16:30" },
        { id: 4, title: "Fekete táska", image: "/movies/black-mask.jpg", time: "17:30" },
        { id: 5, title: "Bridget Jones: Bolondulásig", image: "/movies/bridget-jones.jpg", time: "19:00" },
        { id: 6, title: "Barátok", image: "/movies/friends.jpg", time: "19:30" },
      ]

      setMovies(mockData)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch movies:", error)
      setLoading(false)
    }
  }

  function handleDateChange(date) {
    setSelectedDate(date)
  }

  return (
    <div>
      <h1 className="text-center mb-4">Movie Schedule</h1>

      <DaySelector selectedDate={selectedDate} onDateChange={handleDateChange} />

      <div className="text-center py-4 mb-4">
        <h2>{selectedDate} - Kedd</h2>
      </div>

      {loading ? (
        <p className="text-center">Loading movies...</p>
      ) : (
        <Row>
          {movies.map((movie) => (
            <Col md={4} key={movie.id} className="mb-4">
              <MovieCard id={movie.id} image={movie.image} title={movie.title} time={movie.time} highlighted={false} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

