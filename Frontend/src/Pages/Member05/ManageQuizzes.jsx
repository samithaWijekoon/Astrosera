import React, { useState } from 'react';
import axios from 'axios';

const ManageQuizzes = () => {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/quiz/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Upload Successful!");
        } catch (err) {
            alert("Upload Failed");
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '10px' }}>
            <h3>📁 Bulk Upload Quizzes (Excel)</h3>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".xlsx, .xls"
                style={{ marginBottom: '10px' }}
            />
            <button onClick={handleUpload} style={{ backgroundColor: '#238636', padding: '10px' }}>
                Upload 100 Questions
            </button>
        </div>
    );
};

export default ManageQuizzes;