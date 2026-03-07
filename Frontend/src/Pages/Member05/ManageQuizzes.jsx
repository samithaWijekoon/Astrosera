import React, { useState } from 'react';
import axios from 'axios';

const ManageQuizzes = () => {
    const [formData, setFormData] = useState({
        questionText: '',
        a: '', b: '', c: '', d: '',
        correctAnswer: 'a',
        weekNumber: 1
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/quiz/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Question added successfully!");
            setFormData({ questionText: '', a: '', b: '', c: '', d: '', correctAnswer: 'a', weekNumber: 1 });
        } catch (err) {
            alert("Error adding question. Are you logged in as Admin?");
        }
    };

    return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#161b22', borderRadius: '8px' }}>
            <h2>➕ Add New Quiz Question</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Question Text" value={formData.questionText} onChange={(e) => setFormData({ ...formData, questionText: e.target.value })} required />
                <input type="text" placeholder="Option A" value={formData.a} onChange={(e) => setFormData({ ...formData, a: e.target.value })} required />
                <input type="text" placeholder="Option B" value={formData.b} onChange={(e) => setFormData({ ...formData, b: e.target.value })} required />
                <input type="text" placeholder="Option C" value={formData.c} onChange={(e) => setFormData({ ...formData, c: e.target.value })} required />
                <input type="text" placeholder="Option D" value={formData.d} onChange={(e) => setFormData({ ...formData, d: e.target.value })} required />
                <select value={formData.correctAnswer} onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}>
                    <option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option>
                </select>
                <button type="submit" style={{ backgroundColor: '#238636', color: 'white', padding: '10px', cursor: 'pointer' }}>Save Question</button>
            </form>
        </div>
    );
};

export default ManageQuizzes;