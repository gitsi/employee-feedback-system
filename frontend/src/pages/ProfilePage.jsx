import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Star, MessageSquare, Trash2, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [givenFeedbacks, setGivenFeedbacks] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [formData, setFormData] = useState({ rating: 5, comment: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFormData({ rating: 5, comment: '' });
        setSelectedRecipient('');
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch specific employee and a list for the dropdown
                const [empRes, feedRes, avgRes, allRes] = await Promise.all([
                    API.get(`/employees/${id}`),
                    API.get(`/feedback/received/${id}`),
                    API.get(`/feedback/average/${id}`),
                    API.get(`/employees?limit=100`) // Get more for the dropdown
                ]);

                setEmployee(empRes.data);
                setFeedbacks(feedRes.data);
                setAvgRating(avgRes.data.averageRating || 0);
                setAllEmployees(allRes.data.employees || []); // Extract from .employees
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (id) {
                try {
                    const res = await API.get(`/feedback/given/${id}`);
                    setGivenFeedbacks(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchUserData();
    }, [id]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!selectedRecipient) {
            setError('Please select a recipient');
            return;
        }
        try {
            await API.post('/feedback', { ...formData, givenBy: id, givenTo: selectedRecipient });
            setSuccess('Feedback submitted successfully!');
            setFormData({ rating: 5, comment: '' });
            setSelectedRecipient('');
            // Refresh feedbacks received and average rating
            const [feedRes, avgRes, givenRes] = await Promise.all([
                API.get(`/feedback/received/${id}`),
                API.get(`/feedback/average/${id}`),
                API.get(`/feedback/given/${id}`)
            ]);
            setFeedbacks(feedRes.data);
            setAvgRating(avgRes.data.averageRating || 0);
            setGivenFeedbacks(givenRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting feedback');
        }
    };

    const handleDelete = async (feedbackId, giverId) => {
        try {
            await API.delete(`/feedback/${feedbackId}?employeeId=${giverId}`);
            setFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
            setGivenFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
            const avgRes = await API.get(`/feedback/average/${id}`);
            setAvgRating(avgRes.data.averageRating || 0);
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting feedback');
        }
    };

    if (!employee) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/')} className="mb-4 flex-between gap-2" style={{ background: 'none', color: 'var(--text-muted)' }}>
                <ArrowLeft size={18} /> Back to Team
            </button>

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
                {/* Profile Card */}
                <div className="card">
                    <h2 className="mb-4">{employee.name}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{employee.department}</p>
                    <div className="mt-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star color="#fbbf24" fill="#fbbf24" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{avgRating.toFixed(1)}</span>
                        <span style={{ color: 'var(--text-muted)' }}>/ 5.0</span>
                    </div>
                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />

                    <form onSubmit={handleSubmit} noValidate>
                        <h3 className="mb-4">Give Feedback as {employee.name}</h3>
                        <label>Give Feedback To</label>
                        <select
                            value={selectedRecipient}
                            onChange={(e) => {
                                setSelectedRecipient(e.target.value);
                                if (error) setError('');
                            }}
                            required
                        >
                            <option value="">Select Team Member</option>
                            {allEmployees.filter(emp => emp._id !== id).map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.name}</option>
                            ))}
                        </select>
                        <label>Rating</label>
                        <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}>
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>

                        <label>Comment</label>
                        <textarea
                            rows="4"
                            placeholder={`How did they do? ${employee.name} is the reviewer.`}
                            value={formData.comment}
                            onChange={(e) => {
                                setFormData({ ...formData, comment: e.target.value });
                                if (error) setError('');
                            }}
                            style={{ borderColor: error && !formData.comment ? 'var(--error)' : 'var(--border-color)' }}
                            required
                        ></textarea>

                        {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                        {success && <p style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</p>}

                        <button type="submit" className="btn-primary" style={{ width: '100%', opacity: selectedRecipient ? 1 : 0.5 }} disabled={!selectedRecipient}>
                            Submit Feedback
                        </button>
                    </form>
                </div>

                {/* Feedback List */}
                <div>
                    <h2 className="mb-4 flex-between">
                        Feedback Received
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feedbacks.length} Total</span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {feedbacks.map(feed => (
                            <div key={feed._id} className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="flex-between mb-4">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < feed.rating ? "#fbbf24" : "none"} />
                                        ))}
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {new Date(feed.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mb-4">{feed.comment}</p>
                                <div className="flex-between">
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        By {feed.givenBy.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {feedbacks.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No feedback received yet.</p>
                        )}
                    </div>

                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <h2 className="mb-4 flex-between">
                            Feedback Given
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{givenFeedbacks.length} Total</span>
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {givenFeedbacks.map(feed => (
                                <div key={feed._id} className="card" style={{ background: 'rgba(255,255,255,0.03)', opacity: feed.isDeleted ? 0.6 : 1 }}>
                                    <div className="flex-between mb-4">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < feed.rating ? "#fbbf24" : "none"} />
                                            ))}
                                        </div>
                                        {feed.isDeleted ? (
                                            <span style={{
                                                background: 'var(--error)',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}>
                                                DELETED
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(feed._id, id)}
                                                style={{ background: 'none', color: 'var(--error)', padding: '4px' }}
                                                title="Delete feedback"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="mb-4" style={{ textDecoration: feed.isDeleted ? 'line-through' : 'none' }}>
                                        {feed.comment}
                                    </p>
                                    <div className="flex-between">
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            To {feed.givenTo?.name}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {new Date(feed.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {givenFeedbacks.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No given feedback yet.</p>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ProfilePage;
