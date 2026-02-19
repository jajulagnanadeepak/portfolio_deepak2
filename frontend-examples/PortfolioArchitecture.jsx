import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function PortfolioArchitecture() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/projects`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e0f12',
      color: '#e8eaf1',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: '1px solid #232531',
              color: '#b9c0d4',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#141722';
              e.target.style.color = '#7cd3ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#b9c0d4';
            }}
          >
            ← Back
          </button>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 12px 0',
            background: 'linear-gradient(135deg, #6a5af9, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Portfolio Architecture
          </h1>
          <p style={{ color: '#b9c0d4', fontSize: '18px', margin: 0 }}>
            Explore the design and structure of my portfolio projects
          </p>
        </div>

        {/* Architecture Overview */}
        <div style={{
          background: '#141722',
          border: '1px solid #232531',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '28px', color: '#fff' }}>
            System Architecture
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{
              background: '#0e0f12',
              border: '1px solid #232531',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#7cd3ff', fontSize: '20px' }}>Frontend</h3>
              <p style={{ margin: 0, color: '#b9c0d4', lineHeight: '1.6' }}>
                React-based user interface with modern design patterns and responsive layouts
              </p>
            </div>
            <div style={{
              background: '#0e0f12',
              border: '1px solid #232531',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#7cd3ff', fontSize: '20px' }}>Backend</h3>
              <p style={{ margin: 0, color: '#b9c0d4', lineHeight: '1.6' }}>
                Node.js & Express RESTful API with MongoDB for data persistence
              </p>
            </div>
            <div style={{
              background: '#0e0f12',
              border: '1px solid #232531',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#7cd3ff', fontSize: '20px' }}>Database</h3>
              <p style={{ margin: 0, color: '#b9c0d4', lineHeight: '1.6' }}>
                MongoDB with Mongoose ODM for structured data management
              </p>
            </div>
          </div>
        </div>

        {/* Projects Architecture */}
        <div>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '32px', color: '#fff' }}>
            Project Architecture
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#b9c0d4' }}>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              background: '#141722',
              border: '1px solid #232531',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: '#b9c0d4'
            }}>
              No projects found
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {projects.map((project) => (
                <div
                  key={project._id}
                  style={{
                    background: '#141722',
                    border: '1px solid #232531',
                    borderRadius: '16px',
                    padding: '32px',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '24px',
                    color: '#fff'
                  }}>
                    {project.title || project.name || 'Untitled Project'}
                  </h3>
                  {project.description && (
                    <p style={{
                      margin: '0 0 16px 0',
                      color: '#b9c0d4',
                      lineHeight: '1.6'
                    }}>
                      {project.description}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    {project.technologies && project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#0e0f12',
                          border: '1px solid #232531',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          color: '#7cd3ff'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack Section */}
        <div style={{
          background: '#141722',
          border: '1px solid #232531',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '40px'
        }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '28px', color: '#fff' }}>
            Technology Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {['React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Nodemailer'].map((tech) => (
              <div
                key={tech}
                style={{
                  background: '#0e0f12',
                  border: '1px solid #232531',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  color: '#b9c0d4'
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



