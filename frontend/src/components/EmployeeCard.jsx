import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EmployeeCard = ({ emp }) => {
    return (
        <div className="card">
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
    );
};

export default EmployeeCard;
