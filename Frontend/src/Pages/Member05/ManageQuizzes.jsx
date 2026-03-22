import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const ManageQuizzes = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an Excel file first!");

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file); // 'file' matches req.files.file in backend

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/quiz/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                alert(response.data.message);
                setFile(null);
                // Clear the input field
                document.getElementById('quiz-file-input').value = "";
            }
        } catch (err) {
            console.error("Upload Error:", err);
            const errMsg = err.response?.data?.message || "Server connection failed";
            alert("Upload Failed: " + errMsg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h3>📁 Bulk Upload Quizzes (Excel)</h3>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '15px' }}>
                Columns: Question No, Question, Answer 1, Answer 2, Answer 3, Answer 4, Correct Answer
            </p>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    id="quiz-file-input"
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    style={inputStyle}
                />
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{
                        ...buttonStyle,
                        backgroundColor: uploading ? '#1e4a27' : '#238636',
                        cursor: uploading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {uploading ? 'Processing...' : 'Upload 100 Questions'}
                </button>
            </div>
        </div>
    );
};

// Simple Dashboard Styles
const containerStyle = { backgroundColor: '#161b22', padding: '20px', borderRadius: '10px', border: '1px solid #30363d', marginTop: '20px' };
const inputStyle = { padding: '8px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: 'white', borderRadius: '5px' };
const buttonStyle = { color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', transition: '0.3s' };

export default ManageQuizzes;