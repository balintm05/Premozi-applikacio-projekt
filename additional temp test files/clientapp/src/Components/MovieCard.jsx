import { Link } from "react-router-dom"
import { Card, CardBody, CardTitle, CardText, Badge } from "reactstrap"

export default function MovieCard({ id, image, title, time, highlighted }) {
  return (
    <Card className={`movie-card h-100 ${highlighted ? "border-warning" : ""}`}>
      <div className="position-relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="card-img-top movie-poster"
          style={{ height: "280px", objectFit: "cover" }}
        />
        <div className={`movie-overlay ${highlighted ? "bg-warning-subtle" : ""}`}>
          <CardTitle tag="h5" className="text-center mb-0">
            {title}
          </CardTitle>
        </div>
      </div>
      <CardBody>
        {time && (
          <Badge color="primary" className="mb-2">
            {time}
          </Badge>
        )}
        <CardText>
          <Link to={`/movies/${id}`} className="btn btn-sm btn-outline-secondary w-100">
            View Details
          </Link>
        </CardText>
      </CardBody>
    </Card>
  )
}

