import React from 'react';
import FeedbackItem from './FeedbackItem';

const FeedbackList = ({ feedbacks, title, emptyMessage, showRecipient = false, showDelete = false, onDelete, currentUserId }) => {
    return (
        <div className="mt-4">
            <h2 className="mb-4 flex-between">
                {title}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feedbacks.length} Total</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {feedbacks.map(feed => (
                    <FeedbackItem
                        key={feed._id}
                        feed={feed}
                        showRecipient={showRecipient}
                        showDelete={showDelete}
                        onDelete={onDelete}
                        currentUserId={currentUserId}
                    />
                ))}
                {feedbacks.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>{emptyMessage}</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
