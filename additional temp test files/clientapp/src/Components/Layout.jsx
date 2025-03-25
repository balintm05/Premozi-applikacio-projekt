import { Outlet, Link } from "react-router-dom"
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from "reactstrap"
import "./NavMenu.css"

export default function Layout() {
  return (
    <div>
      <Navbar color="dark" dark expand="md" className="mb-4">
        <Container>
          <NavbarBrand tag={Link} to="/">
            <img src="/logo.svg" alt="Fontana Filmszínház" className="logo-img" />
            Fontana Filmszínház
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/movies">
                Movies
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Házirend</NavLink>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

