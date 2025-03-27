import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../layout/Layout';
import  ThemeWrapper  from '../layout/ThemeWrapper';

function FilmListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [formData, setFormData] = useState({
        id: "", cim: "", kategoria: "", mufaj: "", korhatar: "", jatekido: "",
        gyarto: "", rendezo: "", szereplok: "", leiras: "", eredetiNyelv: "",
        eredetiCim: "", szinkron: "", imdb: "", alapAr: "", megjegyzes: ""
    });
    const [musorok, setMusorok] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const controller = new AbortController();

        api.post('/Film/query', formData, {
            signal: controller.signal,
            withCredentials:true
        })
            .then(response => {
                const fData = response.data.map(d => ({
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
                if (error.name !== 'CanceledError') {
                    console.error("Hiba az adatok betöltésekor:", error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [formData, api]);

    if (loading) {
        return <ThemeWrapper><p></p></ThemeWrapper>;
    }

    return (
        <ThemeWrapper className="container py-4">
            <h1 className="text-center mb-4">Műsorok</h1>
            <div className="table-responsive">
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cím</th>
                            <th>Kategória</th>
                            <th>Műfaj</th>
                            <th >Korhatár</th>
                            <th >Játékidő</th>
                            <th >Gyártó</th>
                            <th >Rendező</th>
                            <th >Szereplők</th>
                            <th >Leírás</th>
                            <th >Eredeti nyelv</th>
                            <th >Eredeti cím</th>
                            <th >Szinkron</th>
                            <th >Trailer</th>
                            <th >IMDB értékelés</th>
                            <th >Ár</th>
                            <th >Megjegyzés</th>
                            <th ></th>
                        </tr>
                        <tr>
                            <th > <input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="id" onChange={handleChange} value={formData.id} /> </th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="cim" onChange={handleChange} value={formData.cim} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="kategoria" onChange={handleChange} value={formData.kategoria} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="mufaj" onChange={handleChange} value={formData.mufaj} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="korhatar" onChange={handleChange} value={formData.korhatar} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="jatekido" onChange={handleChange} value={formData.jatekido} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="gyarto" onChange={handleChange} value={formData.gyarto} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="rendezo" onChange={handleChange} value={formData.rendezo} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="szereplok" onChange={handleChange} value={formData.szereplok} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="leiras" onChange={handleChange} value={formData.leiras} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="eredetiNyelv" onChange={handleChange} value={formData.eredetiNyelv} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="eredetiCim" onChange={handleChange} value={formData.eredetiCim} /></th>
                            <th ><input type="text" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} name="szinkron" onChange={handleChange} value={formData.szinkron} /></th>
                            <th ></th>
                            <th ><input type="text" name="imdb" onChange={handleChange} value={formData.imdb} /></th>
                            <th ><input type="text" name="alapAr" onChange={handleChange} value={formData.alapAr} /></th>
                            <th ><input type="text" name="megjegyzes" onChange={handleChange} value={formData.megjegyzes} /></th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody>                        
                        {musorok.map((musor) => (
                            <tr key={musor.id}>
                                <td >{musor.id}</td>
                                <td >{musor.cim}</td>
                                <td >{musor.kategoria}</td>
                                <td >{musor.mufaj}</td>
                                <td >{musor.korhatar}</td>
                                <td >{musor.jatekido} perc</td>
                                <td >{musor.gyarto}</td>
                                <td >{musor.rendezo}</td>
                                <td >{musor.szereplok}</td>
                                <td >{musor.leiras}</td>
                                <td >{musor.eredetiNyelv}</td>
                                <td >{musor.eredetiCim}</td>
                                <td >{musor.szinkron}</td>
                                <td > <a href={musor.trailerLink} target="_blank" rel="noopener noreferrer">Trailer</a></td>
                                <td >{musor.imdb}</td>
                                <td >{musor.alapAr}</td>
                                <td >{musor.megjegyzes}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <a href={`/musor/manage/edit/${musor.id}`}>
                                            <button className={`btn ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}>
                                                Profil
                                            </button>
                                        </a>
                                        <button className={`btn ${darkMode ? 'btn-info' : 'btn-outline-info'}`}>
                                            Módosítás
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br></br><br></br><br></br>
            </div>
        </ThemeWrapper>
    );
}

export default FilmListAdmin;