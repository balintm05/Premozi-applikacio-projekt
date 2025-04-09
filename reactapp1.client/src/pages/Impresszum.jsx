import React from 'react';
// minta forrás: https://webshippy.com/wp-content/uploads/impresszum-minta.pdf
function Impresszum() {
    document.title = "Impresszum - Premozi";
    return (
        <div className="privacy-policy-container">
            <div className="content">
                <h1>Impresszum</h1>

                <section>
                    <h3>Az oldal üzemeltetője</h3>
                    <ul>
                        <li><strong>Cégnév:</strong> Premozi Kft.</li>
                        <li><strong>Székhely:</strong> 1234 Város, Sablon utca 123.</li>
                        <li><strong>Telefon:</strong> 36 30 123 4567</li>
                        <li><strong>E-mail:</strong> premoziappdev@gmail.com</li>
                        <li><strong>Weboldal:</strong> {window.location.origin}</li>
                    </ul>
                </section>

                <section>
                    <h3>Cégjogi információk</h3>
                    <ul>
                        <li><strong>A céget bejegyző hatóság:</strong> Fővárosi Cégbíróság</li>
                        <li><strong>Cégjegyzékszám:</strong> 12-34-567890</li>
                        <li><strong>Adószám:</strong> 12345678-9-01</li>
                        <li><strong>Hatósági engedély:</strong> 123456</li>
                        <li><strong>Kamara:</strong> Budapesti Kereskedelmi és Iparkamara (BKIK)</li>
                    </ul>
                </section>

                <section>
                    <h3>Technikai információk</h3>
                    <ul>
                        <li><strong>Tárhelyszolgáltató:</strong> Tárhely Szolgáltató Kft.</li>
                        <li><strong>Székhely:</strong> 1234 Város, Minta utca 123.</li>
                        <li><strong>E-mail:</strong> info@tarhelyszolgaltato.hu</li>
                    </ul>
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

                section h2 {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }

                ul {
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 8px;
                    line-height: 1.4;
                }

                strong {
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .privacy-policy-container {
                        flex-direction: column;
                    }
                    
                    .content {
                        padding: 20px 10px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Impresszum;