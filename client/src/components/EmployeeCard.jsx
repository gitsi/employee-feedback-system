import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EmployeeCard = ({ emp }) => {
    return (
        <Link to={`/employee/${emp._id}`} className="card card-clickable">
            <div className="flex-between" style={{ width: '100%' }}>
                <div>
                    <h3>{emp.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{emp.department}</p>
                </div>
                <div className="card-action">
                    <div className="btn-primary action-icon">
                        <ArrowRight size={18} />
                    </div>
                    <span className="action-text">Feedback</span>
                </div>
            </div>
        </Link>
    );
};

export default EmployeeCard;
