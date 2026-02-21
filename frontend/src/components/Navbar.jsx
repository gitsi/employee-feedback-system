import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, UserCircle } from 'lucide-react';
import API from '../services/api';

const Navbar = () => {
    return (
        <nav style={{ background: 'var(--glass)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            <div className="container flex-between">
                <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star className="text-gradient" />
                    <h2 className="text-gradient">Feedback Hub</h2>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Users size={18} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
