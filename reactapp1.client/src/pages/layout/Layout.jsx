import "../../../bootstrap/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
function Layout() {
    return (
        <div>
            <p>Layout</p>
            <main>
                <Outlet />
            </main>   
      </div>         
  );
}

export default Layout;