function AdminIndex() {
    return (
        <div className="text-center text-white">
        <br></br>
            <h1>Adminisztrátori kezelőfelületek</h1>
            <br></br>
            <a href="/admin/users">Fiókkezelő</a><br></br>
            <a href="/admin/filmek">Film kezelő</a><br></br>
            <a href="/">Terem kezelő</a><br></br>
            <a href="/">Vetítés kezelő</a><br></br>
            <a href="/">Rendelés kezelő</a>
        </div>
  );
}

export default AdminIndex;