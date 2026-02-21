import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Star, ArrowLeft } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackItem from '../components/FeedbackItem';

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
    const [profileError, setProfileError] = useState(''); // Separate profile loading error
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            if (!id) return;

            // Initial UI state reset
            setEmployee(null);
            setFeedbacks([]);
            setGivenFeedbacks([]);
            setAvgRating(0);
            setProfileError('');
            setError('');
            setSuccess('');
            setNotFound(false);
            setIsLoading(true);

            try {
                // Fetch specific employee and a list for the dropdown
                const [empRes, feedRes, avgRes, allRes, givenRes] = await Promise.all([
                    API.get(`/employees/${id}`),
                    API.get(`/feedback/received/${id}`),
                    API.get(`/feedback/average/${id}`),
                    API.get(`/employees?limit=100`),
                    API.get(`/feedback/given/${id}`)
                ]);

                if (!ignore) {
                    setEmployee(empRes.data);
                    setFeedbacks(feedRes.data);
                    setAvgRating(avgRes.data.averageRating || 0);
                    setAllEmployees(allRes.data.employees || []);
                    setGivenFeedbacks(givenRes.data);
                    setIsLoading(false);
                }
            } catch (err) {
                if (!ignore) {
                    console.error("Profile Fetch Error Detail:", {
                        status: err.response?.status,
                        data: err.response?.data,
                        message: err.message
                    });

                    if (err.response?.status === 404) {
                        setNotFound(true);
                    } else if (err.response?.status === 429) {
                        setProfileError('Security: Too many requests. Please wait a minute and try again.');
                    } else {
                        setProfileError('Unable to load profile data. A server/connection error occurred.');
                    }
                    setIsLoading(false);
                }
            }
        };

        fetchData();
        return () => { ignore = true; };
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
            console.error("Submit Feedback Error:", err);
            if (!err.response) {
                setProfileError('Connection lost. Unable to submit feedback.');
            } else if (err.response.status === 429) {
                setError('Security: Too many requests. Please wait a minute.');
            } else {
                setError(err.response?.data?.message || 'Error submitting feedback');
            }
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
            console.error("Delete Feedback Error:", err);
            if (!err.response) {
                setProfileError('Connection lost. Unable to delete feedback.');
            } else {
                setError(err.response?.data?.message || 'Error deleting feedback');
            }
        }
    };

    if (isLoading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

    if (notFound) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2 className="mb-4">Employee Not Found</h2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>The employee ID may have changed after seeding the database.</p>
            <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
        </div>
    );

    if (profileError && !employee) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2 className="mb-4" style={{ color: 'var(--error)' }}>Connection Error</h2>
            <p className="mb-4">{profileError}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
    );

    if (!employee) return null;

    return (
        <div className="container">
            {profileError && (
                <div className="card mb-4" style={{ border: '1px solid var(--error)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
                    {profileError}
                </div>
            )}
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

                    <FeedbackForm
                        onSubmit={handleSubmit}
                        reviewerName={employee.name}
                        allEmployees={allEmployees}
                        currentProfileId={id}
                        selectedRecipient={selectedRecipient}
                        setSelectedRecipient={setSelectedRecipient}
                        formData={formData}
                        setFormData={setFormData}
                        error={error}
                        setError={setError}
                        success={success}
                    />
                </div>

                {/* Feedback List */}
                <div>
                    <h2 className="mb-4 flex-between">
                        Feedback Received
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feedbacks.length} Total</span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {feedbacks.map(feed => (
                            <FeedbackItem
                                key={feed._id}
                                feed={feed}
                                showRecipient={false}
                                showDelete={false}
                            />
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
                                <FeedbackItem
                                    key={feed._id}
                                    feed={feed}
                                    showRecipient={true}
                                    showDelete={true}
                                    onDelete={handleDelete}
                                    currentUserId={id}
                                />
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
