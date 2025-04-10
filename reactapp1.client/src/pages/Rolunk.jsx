// minta forrás: https://chat.deepseek.com
function Rolunk() {
    document.title = "Kapcsolat - Premozi";
    return (
        <div className="main-content">
            <header className="about-header">
                <h1>Rólunk</h1>
            </header>

            <section className="about-intro">
                <h2>Üdvözöljük a Premozi oldalán!</h2>
                <p>
                    A Premozi egy hangulatos, helyi közösség által szeretett mozi, ahol a filmművészet és a közös élmények állnak a középpontban.
                    Célunk, hogy minőségi filmeket mutassunk be kényelmes és barátságos környezetben, ahol mindenki otthon érzi magát.
                </p>
            </section>

            <section className="about-history">
                <h2>Történetünk</h2>
                <p>
                    A Premozi 2025-ben nyitotta meg kapuit, és azóta is a város kedvenc filmes helyszíne. Kis csapatunk szenvedélyesen hisz abban,
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
                <div className="contact-details">
                    <p><strong>Cím:</strong> Keszthely, Premozi utca 80</p>
                    <p><strong>Telefon:</strong> +36 20 232-0907</p>
                    <p><strong>E-mail:</strong> premoziappdev@gmail.com</p>
                </div>
            </section>

            <footer className="about-footer">
                <p>Várjuk szeretettel minden filmkedvelőt! 🎬</p>
            </footer>
            <style>{`
                .about-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.about-header h1 {
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.about-intro h2,
.about-history h2,
.about-features h2,
.about-contact h2 {
  color: var(--text-color);
  margin-top: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.features-list {
  list-style-type: none;
  padding: 0;
  margin: 1.5rem 0;
}

.features-list li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
  color: var(--text-color);
}


.contact-details {
  background-color: var(--content-bg);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid var(--border-color);
}

.contact-details p {
  margin: 0.5rem 0;
  color: var(--text-color);
}

.about-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-color);
  font-weight: 500;
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2rem;
  }
  
  .features-list li {
    padding-left: 1rem;
  }
}
            ` }</style>
        </div>
    );
}

export default Rolunk;