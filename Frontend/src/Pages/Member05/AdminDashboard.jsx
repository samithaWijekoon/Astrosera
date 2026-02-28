import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We will call the backend route we just created
                const { data } = await axios.get('http://localhost:5001/api/analytics/stats', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStats(data.stats);
            } catch (error) {
                console.error("Error fetching analytics", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: '2rem', backgroundColor: '#0b0d17', color: 'white', minHeight: '100vh' }}>
            <h1>🚀 AstroSera Admin Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '2rem' }}>
                <div className="stat-card" style={cardStyle}>
                    <h3>Total Students</h3>
                    <p style={numberStyle}>{stats.totalUsers}</p>
                </div>
                <div className="stat-card" style={cardStyle}>
                    <h3>Total Admins</h3>
                    <p style={numberStyle}>{stats.totalAdmins}</p>
                </div>
                <div className="stat-card" style={cardStyle}>
                    <h3>Active Sessions</h3>
                    <p style={numberStyle}>Live Data...</p>
                </div>
            </div>
        </div>
    );
};

// Simple Styles
const cardStyle = { backgroundColor: '#161b22', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #30363d' };
const numberStyle = { fontSize: '2.5rem', fontWeight: 'bold', color: '#58a6ff' };

export default AdminDashboard;