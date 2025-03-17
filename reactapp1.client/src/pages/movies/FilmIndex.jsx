import { useEffect, useState } from "react";

function Musorok() {
    const [musorok, setMusorok] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://localhost:7153/api/Movie/getMovies", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setMusorok(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Hiba az adatok bet�lt�sekor:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Bet�lt�s...</p>;
    }

    return (
        <div className="container">
            <h1>M�sorok</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>C�m</th>
                        <th>Le�r�s</th>
                        <th>Id�tartam</th>
                    </tr>
                </thead>
                <tbody>
                    {musorok.map((musor) => (
                        <tr key={musor.id}>
                            <td>{musor.cim}</td>
                            <td>{musor.leiras}</td>
                            <td>{musor.idotartam} perc</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Musorok;