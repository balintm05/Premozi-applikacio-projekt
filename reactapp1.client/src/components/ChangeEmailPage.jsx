import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeWrapper from "../layout/ThemeWrapper";

function ChangeEmailPage() {
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.patch("/auth/editUser", { email: newEmail });
            if (response.data.errorMessage) {
                setError(response.data.errorMessage);
            } else {
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt az email cím frissítése közben");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeWrapper>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Email cím módosítása</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        Email cím sikeresen frissítve! Átirányítás a profilra...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Új email cím
                        </label>
                        <input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Írja be az új email címet"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {isSubmitting ? 'Feldolgozás...' : 'Mentés'}
                    </button>
                </form>
            </div>
        </ThemeWrapper>
    );
}

export default ChangeEmailPage;