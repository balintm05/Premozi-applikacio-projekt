

function Logout() {
    const x = async () => {
        await fetch("https://localhost:7153/api/Auth/logout", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
    };
    x();
    window.open("/", "_self");
    return (
        <div>
            <p>Kijelentkezés folyamatban...</p>
        </div>    
  );
}

export default Logout;