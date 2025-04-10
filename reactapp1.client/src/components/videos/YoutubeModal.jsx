import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const YouTubeModal = ({ youtubeUrl, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return children;

    const handleClick = () => {
        if (isMobile) {
            window.open(youtubeUrl, '_blank');
        } else {
            setIsOpen(true);
        }
    };

    return (
        <>
            <div className="trailer-container" onClick={handleClick}>
                {children}
            </div>

            {!isMobile && isOpen && ReactDOM.createPortal(
                <div className="youtube-modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="youtube-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setIsOpen(false)}>
                            &times;
                        </button>
                        <div className="video-container">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube video player"
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <style>{ `.youtube-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.youtube-modal-content {
    position: relative;
    width: 80vw;
    max-width: 70%;
    background: transparent;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
}

    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }

.close-button {
    position: absolute;
    top: -50px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 40px;
    cursor: pointer;
    z-index: 1001;
    padding: 10px;
    line-height: 1;
    transition: all 0.1s ease;
}

    .close-button:hover {
        color: #ff0000;
        transform: scale(1.2);
    }

.trailer-container {
    display: inline-block;
    cursor: pointer;
}

.trailer-button {
    display: inline-block;
    background-color: var(--link-color);
    color: var(--btn-text);
    padding: 10px 20px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.1s;
    border: none;
    cursor: pointer;
}

    .trailer-button:hover {
        background-color: var(--active-link);
    }

@media (max-width: 768px) {
    .youtube-modal-content {
        width: 95vw;
        max-width: 95vw;
    }

    .close-button {
        top: -40px;
        font-size: 30px;
    }
}` }</style>
        </>
    );
};

export default YouTubeModal;