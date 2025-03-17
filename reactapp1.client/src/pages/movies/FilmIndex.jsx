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
            <table className="table table-bordered table-dark">
                <thead>
                    <tr>
                        <th>Cím</th>
                        <th>Kategória</th>
                        <th>Műfaj</th>
                        <th>Korhatár</th>
                        <th>Játékidő</th>
                        <th>Gyártó</th>
                        <th>Rendező</th>
                        <th>Szereplők</th>
                        <th>Leírás</th>
                        <th>Eredeti nyelv</th>
                        <th>Eredeti cím</th>
                        <th>Szinkron</th>
                        <th>Trailer</th>
                        <th>IMDB értékelés</th>
                        <th>Ár</th>
                        <th>Megjegyzés</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {musorok.map((musor) => (
                        <tr key={musor.id}>
                            <td>{musor.cim}</td>
                            <td>{musor.kategoria}</td>
                            <td>{musor.mufaj }</td>                           
                            <td>{musor.korhatar }</td>
                            <td>{musor.jatekido } perc</td>
                            <td>{musor.gyarto }</td>
                            <td>{musor.rendezo }</td>
                            <td>{musor.szereplok }</td>
                            <td>{musor.leiras }</td>
                            <td>{musor.eredetiNyelv }</td>
                            <td>{musor.eredetiCim }</td>
                            <td>{musor.szinkron }</td>
                            <td>{musor.trailerLink }</td>
                            <td>{musor.imdb }</td>
                            <td>{musor.alapAr }</td>
                            <td>{musor.megjegyzes}</td>
                            <td className="border-1">
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
        </div>
    );
}

export default Musorok;