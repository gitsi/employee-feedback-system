import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 0) return null;

    return (
        <div className="flex-between mt-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
                className="btn-primary"
                style={{ background: currentPage === 1 ? 'transparent' : '', border: '1px solid var(--border-color)', opacity: currentPage === 1 ? 0.3 : 1 }}
                disabled={currentPage === 1}
                onClick={() => {
                    onPageChange(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                Previous
            </button>
            <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>
                Page {currentPage} of {totalPages || 1}
            </span>
            <button
                className="btn-primary"
                style={{ background: currentPage === totalPages || totalPages <= 1 ? 'transparent' : '', border: '1px solid var(--border-color)', opacity: (currentPage === totalPages || totalPages <= 1) ? 0.3 : 1 }}
                disabled={currentPage === totalPages || totalPages <= 1}
                onClick={() => {
                    onPageChange(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
