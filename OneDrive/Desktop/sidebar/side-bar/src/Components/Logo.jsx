import React from 'react';

const Logo = ({ collapsed }) => {
  return (
    <div className='logo'>
      {!collapsed && <div className="logo-text">NorbNode</div>}
      <div className="logo-image">
        <img src="/images/logo.jpg" alt="Your Logo" style={{ width: collapsed ? '40px' : '35px', height: 'auto' }} />
      </div>
    </div>
  );
};

export default Logo;
