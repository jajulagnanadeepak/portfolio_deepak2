// App.jsx - Example routing setup
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import PortfolioArchitecture from './pages/PortfolioArchitecture';
// Import your other components
// import Home from './pages/Home';
// import Projects from './pages/Projects';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/projects" element={<Projects />} /> */}
            <Route path="/design" element={<PortfolioArchitecture />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}



