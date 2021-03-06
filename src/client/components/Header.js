import React from 'react';
import { Link } from 'react-router';
import MainNav from './MainNav';
import SubNav from './SubNav';

const Header = ({ onLogoutClick, user }) => {
  return (
    <div>
      <header className="header">
        <div className="container">
          {/* Branding */}
          <div className="header-left">
            <Link to='/' className="header-item logo">
              Texans<span className="thin">Vote</span>
            </Link>
          </div>
          {/* Mobile menu */}
          <span className="header-toggle">
            <span></span>
            <span></span>
            <span></span>
          </span>
          {/* Main navigation */}
          <MainNav onLogoutClick={onLogoutClick} user={user}/>
        </div>
      </header>
    </div>
  );
};

module.exports = Header;
