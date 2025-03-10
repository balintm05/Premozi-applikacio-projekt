import "../../../bootstrap/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
function Layout() {
    return (
        <div>
            <a href="/">Main page</a>
            <main>
                <Outlet />
            </main>   
      </div>         
  );
}

export default Layout;