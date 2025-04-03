import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './YouTubeModal.css';

const YouTubeModal = ({ youtubeUrl, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = extractYouTubeId(youtubeUrl);

    if (!videoId) return children;

    return (
        <>
            <div className="trailer-container" onClick={() => setIsOpen(true)}>
                {children}
            </div>

            {isOpen && ReactDOM.createPortal(
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
        </>
    );
};

export default YouTubeModal;