import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const FeedbackItem = ({ feed, showRecipient, showDelete, onDelete, currentUserId }) => {
    return (
        <div className="card" style={{ background: 'rgba(255,255,255,0.03)', opacity: feed.isDeleted ? 0.6 : 1 }}>
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
                    showDelete && (
                        <button
                            onClick={() => onDelete(feed._id, currentUserId)}
                            style={{ background: 'none', color: 'var(--error)', padding: '4px' }}
                            title="Delete feedback"
                        >
                            <Trash2 size={16} />
                        </button>
                    )
                )}
            </div>
            <p className="mb-4" style={{ textDecoration: feed.isDeleted ? 'line-through' : 'none' }}>
                {feed.comment}
            </p>
            <div className="flex-between">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {showRecipient ? `To ${feed.givenTo?.name}` : `By ${feed.givenBy?.name}`}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(feed.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default FeedbackItem;
