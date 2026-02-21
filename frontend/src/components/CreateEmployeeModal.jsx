import React from 'react';

const CreateEmployeeModal = ({
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%', background: 'var(--bg-card)' }}>
                <h2 className="mb-4">Add New Employee</h2>
                <form onSubmit={onSubmit} noValidate>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Charlie Davis"
                                value={newEmployee.name}
                                onChange={(e) => {
                                    setNewEmployee({ ...newEmployee, name: e.target.value });
                                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                                }}
                                style={{ borderColor: fieldErrors.name ? 'var(--error)' : 'var(--border-color)', marginBottom: '0.2rem' }}
                            />
                            {fieldErrors.name && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '0.8rem' }}>{fieldErrors.name}</p>}
                        </div>
                        <div>
                            <label>Department</label>
                            <select
                                value={newEmployee.department}
                                onChange={(e) => {
                                    setNewEmployee({ ...newEmployee, department: e.target.value });
                                    if (fieldErrors.department) setFieldErrors({ ...fieldErrors, department: '' });
                                }}
                                style={{ borderColor: fieldErrors.department ? 'var(--error)' : 'var(--border-color)', marginBottom: '0.2rem' }}
                            >
                                <option value="">Select Dept</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {fieldErrors.department && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '0.8rem' }}>{fieldErrors.department}</p>}
                        </div>
                    </div>
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="charlie@company.com"
                        value={newEmployee.email}
                        onChange={(e) => {
                            setNewEmployee({ ...newEmployee, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                        }}
                        style={{ borderColor: fieldErrors.email ? 'var(--error)' : 'var(--border-color)', marginBottom: '0.2rem' }}
                    />
                    {fieldErrors.email && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '1rem' }}>{fieldErrors.email}</p>}

                    {createError && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{createError}</p>}

                    <div className="flex-between" style={{ gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                setFieldErrors({});
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-main)',
                                width: '100%'
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Create Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmployeeModal;
