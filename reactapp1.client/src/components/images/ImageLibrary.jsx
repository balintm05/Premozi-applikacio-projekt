import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from '../../admin/AdminLayout';
import { FaTrash, FaUpload } from 'react-icons/fa';
import ThemeWrapper from '../../layout/ThemeWrapper';
import ReactDOM from 'react-dom';
import './ImageModal.css';

function ImageLibrary() {
    const { api } = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    document.title = "Képkönyvtár - Premozi";

    useEffect(() => {
        const loadImages = async () => {
            try {
                const cachedImages = localStorage.getItem('cachedImages');
                const cacheTimestamp = localStorage.getItem('imagesCacheTimestamp');
                const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < (60 * 60 * 1000); 

                if (cachedImages && isCacheValid) {
                    setImages(JSON.parse(cachedImages));
                    setLoading(false);
                    return;
                }

                const response = await api.get('/Image/get');
                setImages(response.data);
                localStorage.setItem('cachedImages', JSON.stringify(response.data));
                localStorage.setItem('imagesCacheTimestamp', Date.now().toString());
            } catch (error) {
                setError("Nem sikerült betölteni a képeket");
                console.error("Hiba a képek betöltésekor:", error);
            } finally {
                setLoading(false);
            }
        };
        loadImages();
    }, [api]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Kérjük válasszon ki egy fájlt");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploadProgress(0);
            const response = await api.post('/Image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });
            const newImages = [...images, response.data];
            setImages(newImages);
            setSelectedFile(null);
            setUploadProgress(0);
            localStorage.setItem('cachedImages', JSON.stringify(newImages));
            localStorage.setItem('imagesCacheTimestamp', Date.now().toString());
        } catch (error) {
            setError(error.response?.data?.error?.message || "Sikertelen feltöltés");
            console.error("Feltöltési hiba:", error);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a képet?")) return;

        try {
            await api.delete(`/Image/delete/${id}`);
            const updatedImages = images.filter(img => img.id !== id);
            setImages(updatedImages);
            localStorage.setItem('cachedImages', JSON.stringify(updatedImages));
            localStorage.setItem('imagesCacheTimestamp', Date.now().toString());
        } catch (error) {
            setError("Nem sikerült törölni a képet");
            console.error("Törlési hiba:", error);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsImageModalOpen(true);
    };

    const ImageModal = () => {
        if (!isImageModalOpen || !selectedImage) return null;

        return ReactDOM.createPortal(
            <div className="image-modal-overlay" onClick={() => setIsImageModalOpen(false)}>
                <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={() => setIsImageModalOpen(false)}>
                        &times;
                    </button>
                    <div className="image-container">
                        <img
                            src={`https://localhost:7153${selectedImage.relativePath}`}
                            alt={selectedImage.originalFileName}
                            className="modal-image"
                            loading="lazy"
                        />
                        <div className="image-info">
                            <p>{selectedImage.originalFileName}</p>
                            <p>{formatFileSize(selectedImage.fileSize)}</p>
                            <p>{new Date(selectedImage.uploadDate).toLocaleString('hu-HU')}</p>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bájt';
        const k = 1024;
        const sizes = ['Bájt', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <AdminLayout>
                <ThemeWrapper className="betoltes">
                    <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                        <div className="spinner"></div>
                    </div>
                </ThemeWrapper>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ThemeWrapper className="container p-4">
                <h2 className="mb-4" style={{ color: 'var(--text-color)' }}>Képkönyvtár</h2>

                {error && (
                    <div className="alert alert-danger mb-4">
                        {error}
                    </div>
                )}
                <div className="card mb-4" style={{
                    backgroundColor: 'var(--content-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <div className="card-body">
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{
                                    backgroundColor: 'var(--content-bg)',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleUpload}
                                disabled={!selectedFile || uploadProgress > 0}
                            >
                                <FaUpload className="me-2" />
                                {uploadProgress > 0 ? `Feltöltés... ${uploadProgress}%` : 'Feltöltés'}
                            </button>
                        </div>
                        {selectedFile && (
                            <div className="mt-2">
                                <small style={{ color: 'var(--text-color)' }}>
                                    Kiválasztva: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                </small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="row">
                    {images.length === 0 ? (
                        <div className="col-12 text-center py-4" style={{ color: 'var(--text-color)' }}>
                            <p>Nincsenek képek</p>
                        </div>
                    ) : (
                        images.map(image => (
                            <div key={image.id} className="col-md-4 col-lg-3 mb-4">
                                <div className="card h-100" style={{
                                    backgroundColor: 'var(--content-bg)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-color)'
                                }}>
                                    <div
                                        className="card-img-top img-fluid"
                                        style={{
                                            height: '200px',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleImageClick(image)}
                                    >
                                        <img
                                            src={`https://localhost:7153${image.relativePath}`}
                                            alt={image.originalFileName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title text-truncate">{image.originalFileName}</h6>
                                        <p className="card-text small">
                                            <span className="d-block">{formatFileSize(image.fileSize)}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                {new Date(image.uploadDate).toLocaleString('hu-HU')}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="card-footer" style={{
                                        backgroundColor: 'var(--content-bg)',
                                        borderColor: 'var(--border-color)'
                                    }}>
                                        <button
                                            className="btn btn-danger btn-sm w-100"
                                            onClick={() => handleDelete(image.id)}
                                        >
                                            <FaTrash className="me-1" />
                                            Törlés
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <ImageModal />
            </ThemeWrapper>
        </AdminLayout>
    );
}

export default ImageLibrary;