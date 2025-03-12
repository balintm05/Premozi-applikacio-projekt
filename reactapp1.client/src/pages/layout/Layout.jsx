import "../../../bootstrap/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import Cookies from 'universal-cookie';
/*
 <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="~/js/site.js" asp-append-version="true"></script>

    <Navbar
                    fluid={true}
                    rounded={true}
                >
                    <Navbar.Brand href="/">
                        <img
                            src="https://flowbite.com/docs/images/logo.svg"
                            className="mr-3 h-6 sm:h-9"
                            alt="Flowbite Logo"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            Flowbite
                        </span>
                    </Navbar.Brand>
                    <div className="flex md:order-2">
                        <Dropdown
                            arrowIcon={false}
                            inline={true}
                            label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded={true} />}>
                            <Dropdown.Header>
                                <span className="block text-sm">
                                    Bonnie Green
                                </span>
                                <span className="block truncate text-sm font-medium">
                                    name@flowbite.com
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item>
                                Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Settings
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Earnings
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item>
                                Sign out
                            </Dropdown.Item>
                        </Dropdown>
                        <Navbar.Toggle />
                    </div>
                    <Navbar.Collapse>
                        <Navbar.Link
                            href="/navbars"
                            active={true}
                        >
                            Home
                        </Navbar.Link>
                        <Navbar.Link href="/navbars">
                            About
                        </Navbar.Link>
                        <Navbar.Link href="/navbars">
                            Services
                        </Navbar.Link>
                        <Navbar.Link href="/navbars">
                            Pricing
                        </Navbar.Link>
                        <Navbar.Link href="/navbars">
                            Contact
                        </Navbar.Link>
                    </Navbar.Collapse>    
 */
function LoginButton() {
    const cookies = new Cookies();
    const jwtToken = cookies.get("JWTToken");
    if (jwtToken != null) {
        return (
            <div className="text-light my-2 my-lg-0 mr-sm-0 my-sm-0 ">
                <a href="/account/logout">
                    <button style={{ backgroundColor: "rgb(25,0,25)" }} className="btn my-2 btn-outline-light my-sm-0 text-light text-center" type="submit">Kijelentkezés</button>
                </a>
            </div>
        );
    }
    else {
        return (
            <div className="text-light my-2 my-lg-0 mr-sm-0 my-sm-0 ">
                <a href="/account/login">
                    <button style={{ backgroundColor: "rgb(25,0,25)" }} className="btn my-2 btn-outline-light my-sm-0 text-light text-center" type="submit">Bejelentkezés</button>
                </a>
            </div>
        );
    }
}
function Layout() {
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark bg-dark border-bottom box-shadow mb-3">
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand" href="/">Premozi hivatalos weboldala</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Főoldal</a>
                                </li>
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Privacy</a>
                                </li>
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Film</a>
                                </li>
                            </ul>
                            <LoginButton></LoginButton>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="container bg-light text-dark">
                <main role="main" className="pb-3">
                    <Outlet />
                </main>
            </div>
            <footer className="border-top footer text-light bg-dark text-center">
                <div className="container">
                    &copy; 2025 - Premozi - <a href="/">Főoldal</a>
                </div>
            </footer>
        </div>
  );
}

export default Layout;