import React, { useState, useEffect, useMemo, useCallback } from 'react';
import API from '../services/api';
import { Search, UserPlus, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEPARTMENTS = ['Engineering', 'Design', 'HR', 'Marketing', 'Sales', 'Product', 'Operations', 'Finance', 'Legal'];

const HomePage = () => {
    const [employees, setEmployees] = useState([]);
    const [recentFeedbacks, setRecentFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', department: '' });
    const [createError, setCreateError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchEmployees = useCallback(async (page = 1, search = '') => {
        try {
            const res = await API.get(`/employees?page=${page}&limit=10&search=${search}`);
            setEmployees(res.data.employees);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchRecentFeedback = useCallback(async () => {
        try {
            const res = await API.get('/feedback');
            setRecentFeedbacks(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchEmployees(currentPage, debouncedTerm);
    }, [currentPage, debouncedTerm, fetchEmployees]);

    useEffect(() => {
        fetchRecentFeedback();
    }, [fetchRecentFeedback]);

    // Debounced search logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const validate = () => {
        const errors = {};
        if (!newEmployee.name.trim()) errors.name = 'Full name is required';
        if (!newEmployee.department.trim()) errors.department = 'Department is required';
        if (!newEmployee.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
            errors.email = 'Email is invalid';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        setCreateError('');
        if (!validate()) return;

        try {
            await API.post('/employees', newEmployee);
            setNewEmployee({ name: '', email: '', department: '' });
            setFieldErrors({});
            setShowCreateForm(false);
            fetchEmployees();
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Error creating employee');
        }
    };

    // Simplified: Backend now handles filtering and pagination
    const filteredEmployees = employees;




    return (
        <div className="container">
            <div className="flex-between mb-4">
                <h1 className="text-gradient">Team Members</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                    >
                        <UserPlus size={18} /> Create Employee
                    </button>
                </div>
            </div>

            {showCreateForm && (
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
                        <form onSubmit={handleCreateEmployee} noValidate>
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
                                        {DEPARTMENTS.map(dept => (
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
                                        setShowCreateForm(false);
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
            )}

            <div className="grid">
                {filteredEmployees.map(emp => (
                    <div key={emp._id} className="card">
                        <div className="flex-between">
                            <div>
                                <h3>{emp.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{emp.department}</p>
                            </div>
                            <Link to={`/employee/${emp._id}`} className="btn-primary" style={{ padding: '0.5rem' }}>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {employees.length > 0 && (
                <div className="flex-between mt-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <button
                        className="btn-primary"
                        style={{ background: currentPage === 1 ? 'transparent' : '', border: '1px solid var(--border-color)', opacity: currentPage === 1 ? 0.3 : 1 }}
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(prev => prev - 1);
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
                            setCurrentPage(prev => prev + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {filteredEmployees.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                    No employees found.
                </div>
            )}

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <h2 className="mb-4">Recent Team Activity</h2>
                <div className="grid">
                    {recentFeedbacks.map(feed => (
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
                                    {feed.givenBy.name} ➜ {feed.givenTo.name}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {new Date(feed.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {recentFeedbacks.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No recent activity.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
