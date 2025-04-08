import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';
import ThemeWrapper from '../layout/ThemeWrapper';

function Jegyarak() {
    const [jegyTipusok, setJegyTipusok] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    document.title = "Jegyárak - Premozi";
    useEffect(() => {
        const fetchJegyTipusok = async () => {
            try {
                const response = await api.get('/foglalas/getJegyTipus');
                setJegyTipusok(response.data);
            } catch  {
                setError('Hiba a jegyár adatok betöltésekor');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJegyTipusok();
    }, []);

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'sans-serif',
            backgroundColor: 'var(--auth-card-bg)',
            color: 'var(--auth-text)',
            borderRadius: '8px',
            boxShadow: 'var(--auth-shadow)',
            border: '1px solid var(--auth-border)'
        },
        header: {
            fontSize: '24px',
            fontWeight: '300',
            marginBottom: '30px',
            color: 'var(--auth-text)',
            textAlign: 'center'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '30px'
        },
        th: {
            padding: '12px 15px',
            textAlign: 'center',
            borderBottom: '5px solid var(--border-color)',
            fontWeight: '400',
            color: 'var(--auth-text)'
        },
        td: {
            padding: '12px 15px',
            borderBottom: '1px solid var(--border-color)',
            color: 'var(--auth-text)'
        },
        loading: {
            textAlign: 'center',
            padding: '20px',
            color: 'var(--auth-text)'
        },
        error: {
            padding: '15px',
            background: 'rgba(229, 62, 62, 0.1)',
            color: '#e53e3e',
            borderRadius: '4px',
            textAlign: 'center',
            borderLeft: '4px solid #e53e3e'
        }
    };

    if (isLoading) {
        return (
            <ThemeWrapper className="betoltes">
                <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                    <div className="spinner"></div>
                </div>
            </ThemeWrapper>
        );
    }

    if (error) {
        return (
            <ThemeWrapper>
                <div style={styles.error}>{error}</div>
            </ThemeWrapper>
        );
    }

    return (
        <ThemeWrapper>
            <div style={styles.container}>
                <h2 style={styles.header}>Jegyáraink</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Típus</th>
                            <th style={styles.th}>Ár (Ft)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jegyTipusok.map((jegy) => (
                            <tr key={jegy.id}>
                                <td style={styles.td}>{jegy.nev}</td>
                                <td style={styles.td}>{jegy.ar.toLocaleString('hu-HU') + " Ft"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="mt-3">Jelenleg csak a helyszínen való fizetés lehetséges, megértésüket köszönjük!</p>
            </div>
        </ThemeWrapper>
    );
}

export default Jegyarak;