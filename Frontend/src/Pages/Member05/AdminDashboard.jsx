import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ManageQuizzes from './ManageQuizzes';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalAccounts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5001/api/analytics/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setStats(data.stats);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    // Data format for the Chart
    const chartData = [
        { name: 'Students', count: stats.totalUsers },
        { name: 'Admins', count: stats.totalAdmins },
    ];

    if (loading) return <div style={containerStyle}>Loading Admin Panel...</div>;

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1>AstroSera Admin Control Panel</h1>
                <p>Member 05: Analytics & Quiz Management</p>
            </header>

            {/* Section 1: Analytics Cards */}
            <div style={gridStyle}>
                <div style={cardStyle}>
                    <h4>Total Users</h4>
                    <h2 style={highlightStyle}>{stats.totalUsers}</h2>
                </div>
                <div style={cardStyle}>
                    <h4>Total Admins</h4>
                    <h2 style={highlightStyle}>{stats.totalAdmins}</h2>
                </div>
                <div style={cardStyle}>
                    <h4>System Status</h4>
                    <h2 style={{ ...highlightStyle, color: '#238636' }}>Active</h2>
                </div>
            </div>

            {/* Section 2: Visual Insights & Quiz Management */}
            <div style={mainContentStyle}>
                {/* Chart Column */}
                <div style={{ ...cardStyle, flex: 1 }}>
                    <h3>User Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                                <XAxis dataKey="name" stroke="#8b949e" />
                                <YAxis stroke="#8b949e" />
                                <Tooltip contentStyle={{ backgroundColor: '#161b22', border: 'none' }} />
                                <Bar dataKey="count" fill="#58a6ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quiz Management Column */}
                <div style={{ flex: 1.5 }}>
                    <ManageQuizzes />
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const containerStyle = {
    padding: '40px',
    backgroundColor: '#0d1117',
    minHeight: '100vh',
    color: '#c9d1d9',
    fontFamily: 'Arial, sans-serif'
};

const headerStyle = {
    marginBottom: '30px',
    borderBottom: '1px solid #30363d',
    paddingBottom: '20px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
};

const cardStyle = {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '10px',
    padding: '20px',
};

const mainContentStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    flexWrap: 'wrap'
};

const highlightStyle = {
    fontSize: '2.5rem',
    margin: '10px 0',
    color: '#58a6ff'
};

export default AdminDashboard;