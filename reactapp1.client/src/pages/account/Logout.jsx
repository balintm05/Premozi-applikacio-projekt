

function Logout() {
    const x = async () => {
        await fetch("https://localhost:7153/api/Auth/logout", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
    };
    x();
    return (
        <div>
            <p>Kijelentkez�s folyamatban...</p>
        </div>    
  );
}

export default Logout;