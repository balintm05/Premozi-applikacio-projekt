import Cookies from 'universal-cookie';

function Logout() {
    const cookies = new Cookies();
    cookies.remove("JWTToken", { path: "/"});
    cookies.remove("refreshToken", { path: "/" });
    window.open("/", "_self");
  return (
    <p>Kijelentkez�s folyamatban...</p>
  );
}

export default Logout;