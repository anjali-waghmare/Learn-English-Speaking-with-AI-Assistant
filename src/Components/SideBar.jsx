import React, { useState } from 'react';

const Sidebar = () => {
  // State to manage whether the sidebar is open or closed
  const [isOpen, setIsOpen] = useState(true);

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Inline styles for demonstration purposes
  const sidebarStyle = {
    width: isOpen ? '200px' : '60px',
    height: '100vh',
    backgroundColor: '#1f2937',
    color: 'white',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  };

  const navItemStyle = {
    padding: '15px 10px',
    cursor: 'pointer',
    display: isOpen ? 'block' : 'none'
  };

  return (
    <div style={sidebarStyle}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar} 
        style={{ 
          marginBottom: '20px', 
          cursor: 'pointer', 
          backgroundColor: '#374151', 
          color: 'white', 
          border: 'none', 
          padding: '10px' 
        }}
      >
        {isOpen ? 'Home ⇦' : '⇨'}
      </button>

      {/* Navigation Links */}
      <nav>
      
      </nav>
    </div>
  );
};

export default Sidebar;