import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { Search, UserPlus } from 'lucide-react';
import EmployeeCard from '../components/EmployeeCard';
import Pagination from '../components/Pagination';
import ActivityFeed from '../components/ActivityFeed';
import CreateEmployeeModal from '../components/CreateEmployeeModal';

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
    const [error, setError] = useState(''); // Graceful error state

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchEmployees = useCallback(async (page = 1, search = '') => {
        try {
            setError('');
            const res = await API.get(`/employees?page=${page}&limit=10&search=${search}`);
            setEmployees(res.data.employees);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            console.error(err);
            setError('Unable to load employees. Please ensure the backend is running.');
        }
    }, []);

    const fetchRecentFeedback = useCallback(async () => {
        try {
            const res = await API.get('/feedback');
            setRecentFeedbacks(res.data);
        } catch (err) {
            console.error("Recent Feedback Fetch Error:", err);
            // We set the global error if the main backend connection seems failed
            if (!err.response) {
                setError('Unable to load activity feed. Connection lost.');
            }
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
            setCurrentPage(1); // Reset to first page on search
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
            fetchEmployees(1, debouncedTerm); // Fetch first page of search results
        } catch (err) {
            console.error("Create Employee Error:", err);
            if (!err.response) {
                // Connection Error
                setError('Unable to reach the server to create employee. Please try again.');
                setShowCreateForm(false);
            } else if (err.response.status === 429) {
                setCreateError('Security: Too many requests. Please wait a bit.');
            } else {
                setCreateError(err.response?.data?.message || 'Error creating employee');
            }
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
                        onClick={() => setShowCreateForm(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                    >
                        <UserPlus size={18} /> Create Employee
                    </button>
                </div>
            </div>

            <CreateEmployeeModal
                show={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                newEmployee={newEmployee}
                setNewEmployee={setNewEmployee}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                createError={createError}
                onSubmit={handleCreateEmployee}
                departments={DEPARTMENTS}
            />

            <div className="grid">
                {employees.map(emp => (
                    <EmployeeCard key={emp._id} emp={emp} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {error && (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2 className="mb-4" style={{ color: 'var(--error)' }}>Connection Error</h2>
                    <p className="mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
                </div>
            )}

            {!error && employees.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                    No employees found.
                </div>
            )}

            <ActivityFeed feedbacks={recentFeedbacks} />
        </div>
    );
};

export default HomePage;
