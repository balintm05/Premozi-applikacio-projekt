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
                console.error("Hiba az adatok betöltésekor:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Betöltés...</p>;
    }

    return (
        <div className="container">
            <h1>Műsorok</h1>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th className="border border-secondary">ID</th>
                        <th className="border border-secondary">Cím</th>
                        <th className="border border-secondary">Kategória</th>
                        <th className="border border-secondary">Műfaj</th>
                        <th className="border border-secondary">Korhatár</th>
                        <th className="border border-secondary">Játékidő</th>
                        <th className="border border-secondary">Gyártó</th>
                        <th className="border border-secondary">Rendező</th>
                        <th className="border border-secondary">Szereplők</th>
                        <th className="border border-secondary">Leírás</th>
                        <th className="border border-secondary">Eredeti nyelv</th>
                        <th className="border border-secondary">Eredeti cím</th>
                        <th className="border border-secondary">Szinkron</th>
                        <th className="border border-secondary">Trailer</th>
                        <th className="border border-secondary">IMDB értékelés</th>
                        <th className="border border-secondary">Ár</th>
                        <th className="border border-secondary">Megjegyzés</th>
                        <th className="border border-secondary"></th>
                    </tr>
                </thead>
                <tbody>
                    {musorok.map((musor) => (
                        <tr key={musor.id}>
                            <td className="border border-secondary">{musor.id}</td>
                            <td className="border border-secondary">{musor.cim}</td>
                            <td className="border border-secondary">{musor.kategoria}</td>
                            <td className="border border-secondary">{musor.mufaj }</td>                           
                            <td className="border border-secondary">{musor.korhatar }</td>
                            <td className="border border-secondary">{musor.jatekido } perc</td>
                            <td className="border border-secondary">{musor.gyarto }</td>
                            <td className="border border-secondary">{musor.rendezo }</td>
                            <td className="border border-secondary">{musor.szereplok }</td>
                            <td className="border border-secondary">{musor.leiras }</td>
                            <td className="border border-secondary">{musor.eredetiNyelv }</td>
                            <td className="border border-secondary">{musor.eredetiCim }</td>
                            <td className="border border-secondary">{musor.szinkron}</td>
                            <td className="border border-secondary"> <a href={musor.trailerLink} target="_blank">Trailer</a></td>
                            <td className="border border-secondary">{musor.imdb }</td>
                            <td className="border border-secondary">{musor.alapAr }</td>
                            <td className="border border-secondary">{musor.megjegyzes}</td>
                            <td className="border border-secondary">
                                <a href={`/musor/manage/edit/${musor.id}`} className="mr-1">
                                    <button className="btn my-2 btn-outline-light my-sm-0 text-light text-center bg-primary font-weight-bold text-white">
                                        Profil
                                    </button>
                                </a>
                                <a href={`/`}>
                                    <button className="btn my-2 btn-outline-light my-sm-0 text-light font-weight-bold text-center bg-info text-white">
                                        Módosítás
                                    </button>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br><br></br><br></br>
        </div>
    );
}

export default Musorok;