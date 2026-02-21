import React from 'react';
import { Star } from 'lucide-react';

const FeedbackActivityList = ({ feedbacks }) => {
    return (
        <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <h2 className="mb-4">Recent Team Activity</h2>
            <div className="grid">
                {feedbacks.map(feed => (
                    <div key={feed._id} className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex-between mb-4">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < feed.rating ? "#fbbf24" : "none"} />
                                ))}
                            </div>
                        </div>
                        <p className="mb-4">{feed.comment}</p>
                        <div className="flex-between">
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {feed.givenBy?.name} ➜ {feed.givenTo?.name}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(feed.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {feedbacks.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No recent activity yet.</p>
            )}
        </div>
    );
};

export default FeedbackActivityList;
