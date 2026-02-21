import React from 'react';

const EmployeeCreate = ({
    show,
    onClose,
    newEmployee,
    setNewEmployee,
    fieldErrors,
    setFieldErrors,
    createError,
    onSubmit,
    departments
}) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') onClose(); }}>
            <div className="modal-content card" onClick={e => e.stopPropagation()}>
                <div className="flex-between mb-4">
                    <h2 className="text-gradient">Add Team Member</h2>
                    <button onClick={onClose} style={{ background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                </div>

                <form onSubmit={onSubmit} noValidate>
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={newEmployee.name}
                        onChange={(e) => {
                            setNewEmployee({ ...newEmployee, name: e.target.value });
                            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        style={{ borderColor: fieldErrors.name ? 'var(--error)' : 'var(--border-color)' }}
                        autoFocus
                    />
                    {fieldErrors.name && <p className="error-text">{fieldErrors.name}</p>}

                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="john@company.com"
                        value={newEmployee.email}
                        onChange={(e) => {
                            setNewEmployee({ ...newEmployee, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                        }}
                        style={{ borderColor: fieldErrors.email ? 'var(--error)' : 'var(--border-color)' }}
                    />
                    {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}

                    <label>Department</label>
                    <select
                        value={newEmployee.department}
                        onChange={(e) => {
                            setNewEmployee({ ...newEmployee, department: e.target.value });
                            if (fieldErrors.department) setFieldErrors({ ...fieldErrors, department: '' });
                        }}
                        style={{ borderColor: fieldErrors.department ? 'var(--error)' : 'var(--border-color)' }}
                    >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    {fieldErrors.department && <p className="error-text">{fieldErrors.department}</p>}

                    {createError && (
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {createError}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => { onClose(); setFieldErrors({}); }} className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeCreate;
