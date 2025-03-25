import { Link } from "react-router-dom"
import { Row, Col, Button } from "reactstrap"
import MovieCard from "./MovieCard"

export default function Home() {
  return (
    <div>
      <div className="text-center py-5">
        <h1 className="display-4 text-purple-700">Fontana Filmszínház</h1>
        <p className="lead">Hévíz, Rákóczi u. 9.</p>
        <p>+36 83 343 351</p>
        <Button color="primary" tag={Link} to="/movies" className="mt-3">
          View All Movies
        </Button>
      </div>

      <h2 className="text-center mb-4">Featured Movies</h2>
      <Row>
        <Col md={4} className="mb-4">
          <MovieCard id={1} image="/movies/accountant.jpg" title="A könyvelő 2." highlighted={false} />
        </Col>
        <Col md={4} className="mb-4">
          <MovieCard id={2} image="/movies/valentines.jpg" title="Véletlenül írtam egy könyvet" highlighted={false} />
        </Col>
        <Col md={4} className="mb-4">
          <MovieCard id={3} image="/movies/barbares.jpg" title="Barbárok a szomszédba" highlighted={false} />
        </Col>
      </Row>

      <div className="text-center py-4">
        <h2>2025.03.25. - Kedd</h2>
        <p>Check out today's screenings</p>
        <Button color="secondary" tag={Link} to="/movies" className="mt-2">
          View Schedule
        </Button>
      </div>
    </div>
  )
}

