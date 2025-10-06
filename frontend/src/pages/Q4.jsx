import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Q4 = () => {
  const location = useLocation();
  const [M1, setM1] = useState('');
  const [M2, setM2] = useState('');
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const pythonCode = `
from gmpy2 import mpz, next_prime

def brocard_primes(M1, M2):
    low = mpz(M1)**2
    high = mpz(M2)**2
    primes = []
    candidate = next_prime(low)
    while candidate < high and len(primes) < 4:
        primes.append(candidate)
        candidate = next_prime(candidate)
    return primes
  `;

  const handleRunCode = async () => {
    setOutput([]);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (M1) params.append('M1', M1);
      if (M2) params.append('M2', M2);

      const res = await fetch(`http://localhost:5001/api/q4?${params.toString()}`);
      const data = await res.json();
      setOutput(data.primes || []);
    } catch (err) {
      console.error('Error fetching:', err);
      setOutput([]);
    }
    setLoading(false);
  };

  return (
    <div className="container my-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Prime Assignment</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {[1,2,3,4,5,6,7].map(n => {
                const path = n === 1 ? '/' : `/q${n}`;
                return (
                  <li className="nav-item" key={n}>
                    {location.pathname === path ? (
                      <span className="nav-link active" aria-current="page">Q{n}</span>
                    ) : (
                      <Link className="nav-link" to={path}>Q{n}</Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Question Heading */}
      <h2>Q4: Brocard Primes</h2>
      <p>
        Find at least four prime numbers between (M1)^2 and (M2)^2. 
        You can use the Mersenne primes from Q3 or enter your own values.
      </p>

      {/* Input Fields */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="M1" 
            value={M1} 
            onChange={(e) => setM1(e.target.value)} 
          />
        </div>
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="M2" 
            value={M2} 
            onChange={(e) => setM2(e.target.value)} 
          />
        </div>
        <div className="col-md-3">
          <button 
            className="btn btn-primary w-100" 
            onClick={handleRunCode}
            disabled={loading || !M1 || !M2}
          >
            {loading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Python Controller Code */}
      <div className="card mb-3">
        <div className="card-header bg-secondary text-white">Controller Code (Python)</div>
        <div className="card-body">
          <pre style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '10px' }}>
            {pythonCode}
          </pre>
        </div>
      </div>

      {/* Output */}
      <div className="card">
        <div className="card-header bg-secondary text-white">Output</div>
        <div className="card-body" style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Searching for primes between squares...</p>
            </div>
          )}
          {!loading && output.length > 0 && (
            <ul className="list-group w-100">
              {output.map((item, idx) => (
                <li key={idx} className="list-group-item">{item}</li>
              ))}
            </ul>
          )}
          {!loading && output.length === 0 && <p>No output yet. Click "Run Code".</p>}
        </div>
      </div>
    </div>
  );
};

export default Q4;
