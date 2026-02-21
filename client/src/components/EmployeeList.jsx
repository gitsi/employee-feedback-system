import React from 'react';
import EmployeeCard from './EmployeeCard';

const EmployeeList = ({ employees, isLoading, error }) => {
    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2 className="mb-4" style={{ color: 'var(--error)' }}>Connection Error</h2>
                <p className="mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
            </div>
        );
    }

    if (!isLoading && employees.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                No employees found.
            </div>
        );
    }

    return (
        <div className="grid">
            {employees.map(emp => (
                <EmployeeCard key={emp._id} emp={emp} />
            ))}
        </div>
    );
};

export default EmployeeList;
