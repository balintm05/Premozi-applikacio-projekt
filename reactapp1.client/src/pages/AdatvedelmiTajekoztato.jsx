import React from 'react';
// minta forrás: https://minner.hu/wp-content/uploads/2019/02/Adatkezel%C3%A9si-t%C3%A1j%C3%A9koztat%C3%B3-converted.docx
function AdatvedelmiTajekoztato() {
    document.title = "Adatvédelmi tájékoztató - Premozi";
    return (
        <div className="privacy-policy-container">
            <div className="sidebar">
                <h3 style={{color:'black'}}>Tartalom</h3>
                <ul className="toc">
                    <li><a href="#az-adatkezelési-tájékoztató-célja">1. Az adatkezelési tájékoztató célja</a></li>
                    <li><a href="#az-adatkezelő-adatai">2. Az adatkezelő adatai</a>
                        <ul>
                            <li><a href="#adatvédelmi-tisztviselő">2.1 Adatvédelmi tisztviselő</a></li>
                        </ul>
                    </li>
                    <li><a href="#a-kezelt-személyes-adatok-köre">3. A kezelt személyes adatok köre</a>
                        <ul>
                            <li><a href="#regisztrációs-során-megadandó-személyes-adatok">3.1 Regisztrációs során megadandó személyes adatok</a></li>
                            <li><a href="#technikai-adatok">3.2 Technikai adatok</a></li>
                            <li><a href="#cookie-k-sütik">3.3 Cookie-k (Sütik)</a>
                                <ul>
                                    <li><a href="#a-sütik-feladata">3.3.1 A sütik feladata</a></li>
                                    <li><a href="#feltétlenül-szükséges-munkamenet-session-cookie-k">3.3.2 Feltétlenül szükséges, munkamenet (session) cookie-k</a></li>
                                    <li><a href="#harmadik-fél-által-elhelyezett-cookie-k-analitika">3.3.3 Harmadik fél által elhelyezett cookie-k (analitika)</a></li>
                                </ul>
                            </li>
                            <li><a href="#online-rendeléshez-kapcsolódó-adatok">3.4 Online rendeléshez kapcsolódó adatok</a></li>
                            <li><a href="#online-ügyintézéshez-kapcsolódó-adatok">3.5 Online ügyintézéshez kapcsolódó adatok</a></li>
                            <li><a href="#hírlevélhez-kapcsolódó-adatok">3.6 Hírlevélhez kapcsolódó adatok</a></li>
                        </ul>
                    </li>
                    <li><a href="#a-kezelt-adatok-tervezett-felhasználása-és-megőrzési-ideje">4. A kezelt adatok tervezett felhasználása és megőrzési ideje</a></li>
                    <li><a href="#az-adatkezelés-célja-módja-és-jogalapja">5. Az adatkezelés célja, módja és jogalapja</a>
                        <ul>
                            <li><a href="#általános-adatkezelési-irányelvek">5.1 Általános adatkezelési irányelvek</a></li>
                        </ul>
                    </li>
                    <li><a href="#az-adatok-fizikai-tárolási-helyei">6. Az adatok fizikai tárolási helyei</a></li>
                    <li><a href="#adattovábbítás-adatfeldogozás-az-adatokat-megismerők-köre">7. Adattovábbítás, adatfeldogozás, az adatokat megismerők köre</a></li>
                    <li><a href="#érintett-jogai-és-jogérvényesítési-lehetőségei">8. Érintett jogai és jogérvényesítési lehetőségei</a>
                        <ul>
                            <li><a href="#tájékoztatáshoz-való-jog">8.1 Tájékoztatáshoz való jog</a></li>
                            <li><a href="#az-érintett-hozzáféréshez-való-joga">8.2 Az érintett hozzáféréshez való joga</a></li>
                            <li><a href="#helyesbítés-joga">8.3 Helyesbítés joga</a></li>
                            <li><a href="#törléshez-való-jog">8.4 Törléshez való jog</a></li>
                            <li><a href="#az-adatkezelés-korlátozásához-való-jog">8.5 Az adatkezelés korlátozásához való jog</a></li>
                            <li><a href="#adathordozáshoz-való-jog">8.6 Adathordozáshoz való jog</a></li>
                            <li><a href="#tiltakozás-joga">8.7 Tiltakozás joga</a></li>
                            <li><a href="#automatizált-döntéshozatal-egyedi-ügyekben">8.8 Automatizált döntéshozatal egyedi ügyekben</a></li>
                            <li><a href="#visszavonás-joga">8.9 Visszavonás joga</a></li>
                            <li><a href="#bírósághoz-fordulás-joga">8.10 Bírósághoz fordulás joga</a></li>
                            <li><a href="#adatvédelmi-hatósági-eljárás">8.11 Adatvédelmi hatósági eljárás</a></li>
                        </ul>
                    </li>
                    <li><a href="#egyéb-rendelkezések">9. Egyéb rendelkezések</a></li>
                </ul>
            </div>
            <div className="content">
                <h1>Adatkezelési tájékoztató</h1>

                <section id="az-adatkezelési-tájékoztató-célja">
                    <h3>1. Az adatkezelési tájékoztató célja</h3>
                    <p>
                        A Premozi Kft. (cím, a továbbiakban, szolgáltató, adatkezelő) mint adatkezelő, magára nézve kötelezőnek ismeri el jelen jogi közlemény tartalmát. Kötelezettséget vállal arra, hogy tevékenységével kapcsolatos minden adatkezelés megfelel a jelen szabályzatban és a hatályos nemzeti jogszabályokban, valamint az Európai Unió jogi aktusaiban meghatározott elvárásoknak.
                    </p>
                    <p>
                        A Premozi Kft. adatkezeléseivel kapcsolatosan felmerülő adatvédelmi irányelvek folyamatosan elérhetők a <a href={`${window.location.origin}/adatvedelem`}>{`${window.location.origin}`}/adatvedelem</a> címen.
                    </p>
                    <p>
                        A Premozi Kft. fenntartja magának a jogot jelen tájékoztató bármikori megváltoztatására. Természetesen az esetleges változásokról kellő időben értesíti közönségét.
                    </p>
                </section>

                <section id="az-adatkezelő-adatai">
                    <h3>2. Az adatkezelő adatai</h3>
                    <p>
                        Amennyiben megkeresné Társaságunkat, az alábbi elérhetőségeken léphet kapcsolatba az adatkezelővel:
                    </p>
                    <ul>
                        <li>Név: Premozi Kft.</li>
                        <li>Székhely: [Cég székhelye]</li>
                        <li>Cégjegyzékszám: [Cégjegyzékszám]</li>
                        <li>A bejegyző bíróság megnevezése: [Bíróság neve]</li>
                        <li>Adószám: [Adószám]</li>
                        <li>Telefonszám: [Telefonszám]</li>
                        <li>E-mail: [E-mail cím]</li>
                    </ul>

                    <h3 id="adatvédelmi-tisztviselő">2.1. Adatvédelmi tisztviselő</h3>
                    <ul>
                        <li>Név: [Adatvédelmi tisztviselő neve]</li>
                        <li>Telefonszám: [Adatvédelmi tisztviselő telefonszáma]</li>
                        <li>E-mail: [Adatvédelmi tisztviselő e-mail címe]</li>
                    </ul>
                </section>

                <section id="a-kezelt-személyes-adatok-köre">
                    <h3>3. A kezelt személyes adatok köre</h3>

                    <h3 id="regisztrációs-során-megadandó-személyes-adatok">3.1. Regisztrációs során megadandó személyes adatok</h3>
                    <p>[Itt szerepeljenek a regisztrációhoz szükséges adatok]</p>

                    <h3 id="technikai-adatok">3.2. Technikai adatok</h3>
                    <p>
                        A Premozi Kft. a személyes adatok kezeléséhez a szolgáltatás nyújtása során alkalmazott informatikai eszközöket úgy választja meg és üzemelteti, hogy a kezelt adat:
                    </p>
                    <ul>
                        <li>az arra feljogosítottak számára hozzáférhető (rendelkezésre állás);</li>
                        <li>hitelessége és hitelesítése biztosított (adatkezelés hitelessége);</li>
                        <li>változatlansága igazolható (adatintegritás);</li>
                        <li>a jogosulatlan hozzáférés ellen védett (adat bizalmassága) legyen.</li>
                    </ul>

                    <h3 id="cookie-k-sütik">3.3. Cookie-k (Sütik)</h3>

                    <h4 id="a-sütik-feladata">3.3.1. A sütik feladata</h4>
                    <ul>
                        <li>információkat gyűjtenek a látogatókról és eszközeikről;</li>
                        <li>megjegyzik a látogatók egyéni beállításait;</li>
                        <li>megkönnyítik a weboldal használatát;</li>
                        <li>minőségi felhasználói élményt biztosítanak.</li>
                    </ul>

                    <h4 id="feltétlenül-szükséges-munkamenet-session-cookie-k">3.3.2. Feltétlenül szükséges, munkamenet (session) cookie-k</h4>
                    <p>
                        Ezen sütik célja, hogy a látogatók maradéktalanul és zökkenőmentesen böngészhessék a weboldalát. Az ilyen típusú sütik érvényességi ideje a munkamenet (böngészés) befejezéséig tart.
                    </p>

                    <h4 id="harmadik-fél-által-elhelyezett-cookie-k-analitika">3.3.3. Harmadik fél által elhelyezett cookie-k (analitika)</h4>
                    <p>
                        A weboldalán alkalmazza a Google Analytics mint harmadik fél sütijeit is. A Google Analytics statisztikai célú szolgáltatás használatával információkat gyűjtünk arról, hogy a látogatók hogyan használják a weboldalakat.
                    </p>

                    <h3 id="online-rendeléshez-kapcsolódó-adatok">3.4. Online rendeléshez kapcsolódó adatok</h3>
                    <p>[Tartalom az online rendeléshez kapcsolódó adatokról]</p>

                    <h3 id="online-ügyintézéshez-kapcsolódó-adatok">3.5. Online ügyintézéshez kapcsolódó adatok</h3>
                    <p>[Tartalom az online ügyintézéshez kapcsolódó adatokról]</p>

                    <h3 id="hírlevélhez-kapcsolódó-adatok">3.6. Hírlevélhez kapcsolódó adatok</h3>
                    <p>[Tartalom a hírlevélhez kapcsolódó adatokról]</p>
                </section>

                <section id="a-kezelt-adatok-tervezett-felhasználása-és-megőrzési-ideje">
                    <h3>4. A kezelt adatok tervezett felhasználása és megőrzési ideje</h3>
                    <table>
                        <thead>
                            <tr style={{ color: 'black' }}>
                                <th>Adatkezelés neve</th>
                                <th>Felhasználása</th>
                                <th>Jogalap</th>
                                <th>Megőrzési idő</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>[Adatkezelés neve]</td>
                                <td>[Felhasználás célja]</td>
                                <td>[Jogalap]</td>
                                <td>[Megőrzési idő]</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section id="az-adatkezelés-célja-módja-és-jogalapja">
                    <h3>5. Az adatkezelés célja, módja és jogalapja</h3>
                    <h3 id="általános-adatkezelési-irányelvek">5.1. Általános adatkezelési irányelvek</h3>
                    <p>[Tartalom az általános adatkezelési irányelvekről]</p>
                </section>

                <section id="az-adatok-fizikai-tárolási-helyei">
                    <h3>6. Az adatok fizikai tárolási helyei</h3>
                    <p>[Tartalom az adatok tárolási helyeiről]</p>
                </section>

                <section id="adattovábbítás-adatfeldogozás-az-adatokat-megismerők-köre">
                    <h3>7. Adattovábbítás, adatfeldogozás, az adatokat megismerők köre</h3>
                    <p>[Tartalom az adattovábbításról és feldolgozásról]</p>
                </section>

                <section id="érintett-jogai-és-jogérvényesítési-lehetőségei">
                    <h3>8. Érintett jogai és jogérvényesítési lehetőségei</h3>

                    <h3 id="tájékoztatáshoz-való-jog">8.1. Tájékoztatáshoz való jog</h3>
                    <p>
                        Az érintett tájékoztatást kérhet személyes adatai kezeléséről.
                    </p>

                    <h3 id="az-érintett-hozzáféréshez-való-joga">8.2. Az érintett hozzáféréshez való joga</h3>
                    <p>
                        Az érintett jogosult arra, hogy az adatkezelőtől visszajelzést kapjon arra vonatkozóan, hogy személyes adatainak kezelése folyamatban van-e.
                    </p>

                    <h3 id="helyesbítés-joga">8.3. Helyesbítés joga</h3>
                    <p>
                        Az érintett jogosult arra, hogy helytelen személyes adatai helyesbítését kérje.
                    </p>

                    <h3 id="törléshez-való-jog">8.4. Törléshez való jog</h3>
                    <p>
                        Az érintett jogosult arra, hogy kérésére a Premozi Kft. indokolatlan késedelem nélkül törölje a rá vonatkozó személyes adatokat.
                    </p>

                    <h3 id="az-adatkezelés-korlátozásához-való-jog">8.5. Az adatkezelés korlátozásához való jog</h3>
                    <p>
                        Az érintett jogosult az adatkezelés korlátozását kérni bizonyos feltételek mellett.
                    </p>

                    <h3 id="adathordozáshoz-való-jog">8.6. Adathordozáshoz való jog</h3>
                    <p>
                        Az érintett jogosult a rá vonatkozó személyes adatok más adatkezelőnek való továbbítását kérni.
                    </p>

                    <h3 id="tiltakozás-joga">8.7. Tiltakozás joga</h3>
                    <p>
                        Az érintett jogosult tiltakozni személyes adatainak kezelése ellen.
                    </p>

                    <h3 id="automatizált-döntéshozatal-egyedi-ügyekben">8.8. Automatizált döntéshozatal egyedi ügyekben</h3>
                    <p>
                        Az érintett jogosult az emberi beavatkozás kérésére.
                    </p>

                    <h3 id="visszavonás-joga">8.9. Visszavonás joga</h3>
                    <p>
                        Az érintett jogosult a hozzájárulását bármikor visszavonni.
                    </p>

                    <h3 id="bírósághoz-fordulás-joga">8.10. Bírósághoz fordulás joga</h3>
                    <p>
                        Az érintett jogosult bírósághoz fordulni jogsérelem esetén.
                    </p>

                    <h3 id="adatvédelmi-hatósági-eljárás">8.11. Adatvédelmi hatósági eljárás</h3>
                    <p>
                        Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatóságnál lehet élni:
                    </p>
                    <ul>
                        <li>Név: Nemzeti Adatvédelmi és Információszabadság Hatóság</li>
                        <li>Székhely: 1125 Budapest, Szilágyi Erzsébet fasor 22/C.</li>
                        <li>Levelezési cím: 1530 Budapest, Pf.: 5.</li>
                        <li>Telefon: 0613911400</li>
                        <li>E-mail: <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a></li>
                        <li>Honlap: <a href="http://www.naih.hu">www.naih.hu</a></li>
                    </ul>
                </section>

                <section id="egyéb-rendelkezések">
                    <h3>9. Egyéb rendelkezések</h3>
                    <p>
                        E tájékoztatóban fel nem sorolt adatkezelésekről az adat felvételekor adunk tájékoztatást.
                    </p>
                </section>
            </div>

            <style>{`
                .privacy-policy-container {
                    display: flex;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                    text-align: left;
                }

                .sidebar {
                    width: 300px;
                    padding: 20px;
                    position: sticky;
                    top: 0;
                    align-self: flex-start;
                    background-color: #f8f9fa;
                    height: 100vh;
                    overflow-y: auto;
                }

                .sidebar h3 {
                    margin-top: 0;
                    font-size: 1.2rem;
                }

                .toc {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }

                .toc li {
                    margin-bottom: 8px;
                    line-height: 1.4;
                }

                .toc a {
                    color: #333;
                    text-decoration: none;
                    font-size: 0.9rem;
                }

                .toc a:hover {
                    color: #0066cc;
                    text-decoration: underline;
                }

                .toc ul {
                    list-style-type: none;
                    padding-left: 15px;
                    margin-top: 5px;
                }

                .content {
                    flex: 1;
                    padding: 20px;
                }

                .content h1 {
                    margin-top: 0;
                }

                section {
                    margin-bottom: 30px;
                }

                section h3 {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }

                section h3, section h4 {
                    margin-top: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }

                table, th, td {
                    border: 1px solid #ddd;
                }

                th, td {
                    padding: 12px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                }

                @media (max-width: 768px) {
                    .privacy-policy-container {
                        flex-direction: column;
                    }
                    
                    .sidebar {
                        width: 100%;
                        height: auto;
                        position: relative;
                    }
                    
                    .content {
                        padding: 20px 10px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AdatvedelmiTajekoztato;