import { useEffect, useState } from "react";

function FilmListAdmin() {
    const [formData, setFormData] = useState({ id: "", cim: "", kategoria: "", mufaj: "", korhatar: "", jatekido: "", gyarto: "", rendezo: "", szereplok: "", leiras: "", eredetiNyelv: "", eredetiCim: "", szinkron: "", imdb: "", alapAr: "", megjegyzes:"" });
    const [musorok, setMusorok] = useState([]);
    const [loading, setLoading] = useState(true);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        fetch("https://localhost:7153/api/Film/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                const fData = data.map(d => ({
                    id: d.id,
                    cim: d.cim,
                    kategoria: d.kategoria,
                    mufaj: d.mufaj,
                    korhatar: d.korhatar,
                    jatekido: d.jatekido,
                    gyarto: d.gyarto,
                    rendezo: d.rendezo,
                    szereplok: d.szereplok,
                    leiras: d.leiras,
                    eredetiNyelv: d.eredetiNyelv,
                    eredetiCim: d.eredetiCim,
                    szinkron: d.szinkron,
                    trailerLink: d.trailerLink,
                    imdb: d.imdb,
                    alapAr: d.alapAr,
                    megjegyzes: d.megjegyzes
                }));
                setMusorok(fData);
                setLoading(false);
            })
            .catch(error => {
                console.error("Hiba az adatok betöltésekor:", error);
                setLoading(false);
            });
    }, [formData]);

    if (loading) {
        return <p>Betöltés...</p>;
    }

    return (
        <div className="container text-center" style={{ width: "100%", maxWidth: "95%", margin: "0 auto" }} >
            <br></br><h1 className="font-weight-bold">Műsorok</h1><br></br>
            <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-bordered table-dark">
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
                        <tr>
                            <th className="border border-secondary"> <input type="text" name="id" onChange={handleChange} value={formData.id} /> </th>
                            <th className="border border-secondary"><input type="text" name="cim" onChange={handleChange} value={formData.cim} /></th>
                            <th className="border border-secondary"><input type="text" name="kategoria" onChange={handleChange} value={formData.kategoria} /></th>
                            <th className="border border-secondary"><input type="text" name="mufaj" onChange={handleChange} value={formData.mufaj} /></th>
                            <th className="border border-secondary"><input type="text" name="korhatar" onChange={handleChange} value={formData.korhatar} /></th>
                            <th className="border border-secondary"><input type="text" name="jatekido" onChange={handleChange} value={formData.jatekido} /></th>
                            <th className="border border-secondary"><input type="text" name="gyarto" onChange={handleChange} value={formData.gyarto} /></th>
                            <th className="border border-secondary"><input type="text" name="rendezo" onChange={handleChange} value={formData.rendezo} /></th>
                            <th className="border border-secondary"><input type="text" name="szereplok" onChange={handleChange} value={formData.szereplok} /></th>
                            <th className="border border-secondary"><input type="text" name="leiras" onChange={handleChange} value={formData.leiras} /></th>
                            <th className="border border-secondary"><input type="text" name="eredetiNyelv" onChange={handleChange} value={formData.eredetiNyelv} /></th>
                            <th className="border border-secondary"><input type="text" name="eredetiCim" onChange={handleChange} value={formData.eredetiCim} /></th>
                            <th className="border border-secondary"><input type="text" name="szinkron" onChange={handleChange} value={formData.szinkron} /></th>
                            <th className="border border-secondary"></th>
                            <th className="border border-secondary"><input type="text" name="imdb" onChange={handleChange} value={formData.imdb} /></th>
                            <th className="border border-secondary"><input type="text" name="alapAr" onChange={handleChange} value={formData.alapAr} /></th>
                            <th className="border border-secondary"><input type="text" name="megjegyzes" onChange={handleChange} value={formData.megjegyzes} /></th>
                            <th className="border border-secondary"></th>

                        </tr>
                        {musorok.map((musor) => (
                            <tr key={musor.id}>
                                <td className="border border-secondary">{musor.id}</td>
                                <td className="border border-secondary">{musor.cim}</td>
                                <td className="border border-secondary">{musor.kategoria}</td>
                                <td className="border border-secondary">{musor.mufaj}</td>
                                <td className="border border-secondary">{musor.korhatar}</td>
                                <td className="border border-secondary">{musor.jatekido} perc</td>
                                <td className="border border-secondary">{musor.gyarto}</td>
                                <td className="border border-secondary">{musor.rendezo}</td>
                                <td className="border border-secondary">{musor.szereplok}</td>
                                <td className="border border-secondary">{musor.leiras}</td>
                                <td className="border border-secondary">{musor.eredetiNyelv}</td>
                                <td className="border border-secondary">{musor.eredetiCim}</td>
                                <td className="border border-secondary">{musor.szinkron}</td>
                                <td className="border border-secondary"> <a href={musor.trailerLink} target="_blank">Trailer</a></td>
                                <td className="border border-secondary">{musor.imdb}</td>
                                <td className="border border-secondary">{musor.alapAr}</td>
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
            </div>
            
            <br></br><br></br><br></br>
        </div>
    );
}

export default FilmListAdmin;