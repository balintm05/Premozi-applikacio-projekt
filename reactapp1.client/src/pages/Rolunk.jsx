function Rolunk() {
    document.title = "Kapcsolat - Premozi";
    return (
        <div className="about-page">
            <header className="about-header">
                <h1>Rólunk</h1>
            </header>

            <section className="about-intro">
                <h2>Üdvözöljük a [Mozi Neve] oldalán!</h2>
                <p>
                    A [Mozi Neve] egy hangulatos, helyi közösség által szeretett mozi, ahol a filmművészet és a közös élmények állnak a középpontban.
                    Célunk, hogy minőségi filmeket mutassunk be kényelmes és barátságos környezetben, ahol mindenki otthon érzi magát.
                </p>
            </section>

            <section className="about-history">
                <h2>Történetünk</h2>
                <p>
                    A [Mozi Neve] [év]-ben nyitotta meg kapuit, és azóta is a város kedvenc filmes helyszíne. Kis csapatunk szenvedélyesen hisz abban,
                    hogy a mozi nem csak szórakozás, hanem közösségi tér is, ahol emberek találkoznak, beszélgetnek és felejthetetlen pillanatokat élnek át együtt.
                </p>
            </section>

            <section className="about-features">
                <h2>Miért válasszon minket?</h2>
                <ul className="features-list">
                    <li>
                        <strong>Kiváló filmválaszték</strong> – Klasszikusoktól a legújabb filmekig, mindenki megtalálja nálunk a számára megfelelő műsort.
                    </li>
                    <li>
                        <strong>Hangulatos környezet</strong> – Kényelmes ülőhelyek, barátságos kiszolgálás és egyedi atmoszféra várja a látogatókat.
                    </li>
                    <li>
                        <strong>Közösségi események</strong> – Rendszeresen szervezünk tematikus filmhetet, filmklubot és különleges vetítéseket.
                    </li>
                    <li>
                        <strong>Helyi szellem</strong> – A helyi közösség támogatása és a független alkotók elősegítése fontos számunkra.
                    </li>
                </ul>
            </section>

            <section className="about-contact">
                <h2>Lépjen velünk kapcsolatba!</h2>
                <p>
                    Szeretnéd megnézni a legújabb vetítéseinket, vagy érdekelnek a mozival kapcsolatos eseményeink?
                    Kövess minket a [Facebook/Instagram] oldalunkon, vagy iratkozz fel hírlevelünkre!
                </p>
                <div className="contact-details">
                    <p><strong>Cím:</strong> [Mozi címe]</p>
                    <p><strong>Telefon:</strong> [Telefonszám]</p>
                    <p><strong>E-mail:</strong> [Email cím]</p>
                </div>
            </section>

            <footer className="about-footer">
                <p>Várjuk szeretettel minden filmkedvelőt! 🎬</p>
            </footer>
            <style>
                {`
                .about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
}

.about-header {
  text-align: center;
  margin-bottom: 2rem;
}

.about-header h1 {
  font-size: 2.5rem;
  color: #d32f2f; /* Cinema red color */
}

.about-intro h2,
.about-history h2,
.about-features h2,
.about-contact h2 {
  color: #d32f2f;
  margin-top: 2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.features-list {
  list-style-type: none;
  padding: 0;
}

.features-list li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.features-list li:before {
  content: "✔";
  color: #d32f2f;
  position: absolute;
  left: 0;
}

.contact-details {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 5px;
  margin-top: 1rem;
}

.about-footer {
  text-align: center;
  margin-top: 3rem;
  font-size: 1.2rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .about-page {
    padding: 1rem;
  }
  
  .about-header h1 {
    font-size: 2rem;
  }
}
                `}</style>
        </div>
    );
}

export default Rolunk;