import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#0e0f12',
      color: '#e8eaf1',
      padding: '40px 20px',
      marginTop: '60px',
      borderTop: '1px solid #232531'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px'
      }}>
        {/* Quick Links Section */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#fff' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link 
                to="/design" 
                style={{ 
                  color: '#b9c0d4', 
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#7cd3ff'}
                onMouseLeave={(e) => e.target.style.color = '#b9c0d4'}
              >
                Design
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link 
                to="/" 
                style={{ 
                  color: '#b9c0d4', 
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#7cd3ff'}
                onMouseLeave={(e) => e.target.style.color = '#b9c0d4'}
              >
                Home
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link 
                to="/projects" 
                style={{ 
                  color: '#b9c0d4', 
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#7cd3ff'}
                onMouseLeave={(e) => e.target.style.color = '#b9c0d4'}
              >
                Projects
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#fff' }}>Contact</h3>
          <p style={{ margin: '0 0 8px 0', color: '#b9c0d4' }}>Email: your@email.com</p>
          <p style={{ margin: '0', color: '#b9c0d4' }}>© {new Date().getFullYear()} Portfolio</p>
        </div>
      </div>
    </footer>
  );
}



