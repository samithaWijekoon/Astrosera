import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManageQuizzes from './ManageQuizzes'; // Your upload component

const AdminDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);

    // Fetch questions from database
    const fetchQuizzes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/quiz', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuizzes(res.data);
        } catch (err) {
            console.error("Error fetching quizzes", err);
        }
    };

    // Wipe the database
    const handleClearAll = async () => {
        if (window.confirm("Are you sure? This will delete all 100 questions!")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5001/api/quiz/clear', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Database Cleared!");
                fetchQuizzes(); // Refresh the list
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    useEffect(() => { fetchQuizzes(); }, []);

    return (
        <div style={{ padding: '30px', color: 'white', backgroundColor: '#0d1117', minHeight: '100vh' }}>
            <h2>🚀 Astrosera Analytics & Quiz Management</h2>

            <ManageQuizzes onUploadSuccess={fetchQuizzes} />

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                <h3>Current Quiz Pool ({quizzes.length} Questions)</h3>
                <button onClick={handleClearAll} style={{ backgroundColor: '#da3633', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                    Clear All Quizzes
                </button>
            </div>

            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#161b22' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #30363d' }}>
                            <th style={padding}>No</th>
                            <th style={padding}>Question</th>
                            <th style={padding}>Correct Answer</th>
                            <th style={padding}>Week</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((q) => (
                            <tr key={q._id} style={{ borderBottom: '1px solid #21262d' }}>
                                <td style={padding}>{q.questionNo}</td>
                                <td style={padding}>{q.question}</td>
                                <td style={padding}><span style={{ color: '#3fb950' }}>{q.correctAnswer}</span></td>
                                <td style={padding}>{q.weekNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const padding = { padding: '12px' };

export default AdminDashboard;