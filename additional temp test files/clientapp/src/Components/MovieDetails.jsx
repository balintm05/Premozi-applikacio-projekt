"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Row, Col, Button, Badge } from "reactstrap"

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovieDetails()
  }, [id])

  async function fetchMovieDetails() {
    try {
      // In a real app, you would fetch from your ASP.NET Core API
      // const response = await fetch(`api/movies/${id}`);
      // const data = await response.json();

      // For demo purposes, we'll use mock data
      const mockMovies = {
        1: {
          id: 1,
          title: "A nyár utolsó napja",
          image: "/movies/last-day.jpg",
          time: "14:00",
          genre: "Dráma, Vígjáték",
          filmType: "FELIRATOS FILM",
          country: "Franciaország, Spanyolország",
          runtime: "117perc",
          description:
            "Aki filmrendező, Alex pedig színész. Benoit együtt töltött 6 estét úgy gondolták, hogy talán valami különös is születik, és valóra váltak Alex legtitkosabb vágyai. Azonban a barátságuk és a szerelmük nem várt fordulatot vesz, önzésüket és csalódottságukat is meghajtja a szakítás fájó pontja, akik értetlenül szemlélik az eseményeket.",
          cast: "Rosso Arana, Vito Sanz, Fernando Trueba, Andrés Gertrúdix, Francesco Carril, Ana Torrent",
          director: "Jonas Trueba",
          ageRating: 16,
        },
        2: {
          id: 2,
          title: "Mickey 17",
          image: "/movies/mickey17.jpg",
          time: "14:30",
          genre: "Dráma, Sci-Fi, Vígjáték",
          filmType: "FELIRATOS FILM",
          country: "Egyesült Államok, Nagy-Britannia",
          runtime: "137perc",
          description:
            "Az emberiség űrben, A bolygófelszíni expedíciók Eldobhatókat vesznek igénybe, akik tudják, hogy ha meghalnak, a tudatuk másolatát átviszik egy új testbe. Mickey7 a Niflheim jeges világának felderítője, és miután egy veszélyes küldetést teljesített, valahogy ha a testét elpusztul, újat adnak nekik a táborban való. A mentész tökéletes. De mire tökéletes rendszer.",
          cast: "Robert Pattinson, Steven Yeun, Naomi Ackie, Toni Collette, Mark Ruffalo, Holliday Grainger, Patsy Ferran, Cameron Britton, Christian Patterson",
          director: "Bong Joon-ho",
          ageRating: 16,
        },
        3: {
          id: 3,
          title: "Reggeli a hegyen",
          image: "/movies/breakfast.jpg",
          time: "16:30",
          genre: "Vígjáték",
          filmType: "FELIRATOS FILM",
          country: "Franciaország",
          runtime: "90perc",
          description:
            "A híres vállalkozó, Vincent állandóan pörgő élete hirtelen megváltoztatja kényszere, amikor az autója lerobban egy hegyi úton. A környéket mélyen, a modern világ elől elzárkózó két Pierre éli a mindennapjait. A két férfi befogadja Vincentet, aki hamarosan ellenséges érzéseket képviselő férfiak mély őszinteséggel és sok szeretettel.",
          cast: "Gregory Gadebois, Lambert Wilson, Marie Gillain, Betty Pierrucci Bertholet, Magali Bonat, Antoine Gouy",
          director: "Eric Besnard",
          ageRating: 12,
        },
      }

      setMovie(mockMovies[id] || mockMovies["1"])
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch movie details:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center">Loading movie details...</p>
  }

  if (!movie) {
    return <p className="text-center">Movie not found</p>
  }

  return (
    <div className="movie-details">
      <Row>
        <Col md={4}>
          <div className="position-relative mb-4">
            <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="img-fluid rounded" />
            <Badge color="warning" className="position-absolute bottom-0 start-0 m-2">
              {movie.ageRating}+
            </Badge>
          </div>
          <div className="d-grid gap-2">
            <Button color="primary" className="mb-2">
              Foglalás
            </Button>
            <Button color="outline-primary">Mikor vetítjük még?</Button>
          </div>
        </Col>
        <Col md={8}>
          <div className="mb-4">
            <h1>
              {movie.time} {movie.title}
            </h1>
            <Badge color="danger" className="me-2">
              {movie.filmType}
            </Badge>
            <span className="text-muted">{movie.genre}</span>
          </div>

          <div className="mb-3">
            <p>
              <strong>Származási ország:</strong> {movie.country}
            </p>
            <p>
              <strong>Vetítés ideje:</strong> {movie.runtime}
            </p>
          </div>

          <div className="mb-4">
            <h5>Synopsis</h5>
            <p>{movie.description}</p>
          </div>

          <div className="mb-3">
            <p>
              <strong>Rendező:</strong> {movie.director}
            </p>
            <p>
              <strong>Szereplők:</strong> {movie.cast}
            </p>
          </div>

          <Button color="secondary" tag={Link} to="/movies">
            Back to Movies
          </Button>
        </Col>
      </Row>
    </div>
  )
}

