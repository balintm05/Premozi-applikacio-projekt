import "../../../bootstrap/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
import "./Layout.css";
/*
 <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="~/js/site.js" asp-append-version="true"></script>
 */
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
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Privacy</a>
                                </li>
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Film</a>
                                </li>
                            </ul>
                            <div className="text-light my-2 my-lg-0 mr-sm-0 my-sm-0 ">
                                <a href="/account/login">
                                    <button style={{ backgroundColor: "rgb(25,0,25)" }} className="btn my-2 btn-outline-light my-sm-0 text-light text-center" type="submit">Bejelentkezés</button>
                                </a>                               
                            </div>
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