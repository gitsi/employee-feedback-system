import React from 'react';

const FeedbackCreate = ({
    onSubmit,
    reviewerName,
    allEmployees,
    currentProfileId,
    selectedRecipient,
    setSelectedRecipient,
    formData,
    setFormData,
    error,
    setError,
    success
}) => {
    return (
        <form onSubmit={onSubmit} noValidate>
            <h3 className="mb-4">Give Feedback as {reviewerName}</h3>
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
                {allEmployees.filter(emp => emp._id !== currentProfileId).map(emp => (
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
                placeholder={`How did they do? ${reviewerName} is the reviewer.`}
                value={formData.comment}
                onChange={(e) => {
                    setFormData({ ...formData, comment: e.target.value });
                    if (error) setError('');
                }}
                style={{ borderColor: error && !formData.comment ? 'var(--error)' : 'var(--border-color)' }}
                required
            ></textarea>

            {error && <p className="error-text">{error}</p>}
            {success && <p style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</p>}

            <button type="submit" className="btn-primary" style={{ width: '100%', opacity: selectedRecipient ? 1 : 0.5 }} disabled={!selectedRecipient}>
                Submit Feedback
            </button>
        </form>
    );
};

export default FeedbackCreate;
