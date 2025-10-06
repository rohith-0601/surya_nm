import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Q3 = () => {
  const location = useLocation();
  const [start, setStart] = useState(2201);
  const [end, setEnd] = useState(2300);
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const pythonCode = `
import gmpy2
from gmpy2 import mpz, is_prime

def lucas_lehmer_test(p):
    if p == 2:
        return True
    M = mpz(2)**p - 1
    s = mpz(4)
    for _ in range(p - 2):
        s = (s * s - 2) % M
    return s == 0

def find_mersenne_primes(start=2201, end=2300):
    mersenne_list = []
    for p in range(start, end):
        if is_prime(p) and lucas_lehmer_test(p):
            M = mpz(2)**p - 1
            mersenne_list.append({"p": p, "mersenne_number": str(M)})
    return mersenne_list
  `;

  const handleRunCode = async () => {
    setOutput([]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/q3?start=${start}&end=${end}`);
      const data = await res.json();
      setOutput(data.mersenne_primes || []);
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
      <h2>Q3: Mersenne Primes</h2>
      <p>
        Find Mersenne primes where p lies between 2201 and 2299. 
        A Mersenne prime is a prime of the form 2^p - 1.
      </p>

      {/* Input Fields */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input 
            type="number" 
            className="form-control" 
            placeholder="Start p (default 2201)" 
            value={start} 
            onChange={(e) => setStart(Number(e.target.value))} 
          />
        </div>
        <div className="col-md-3">
          <input 
            type="number" 
            className="form-control" 
            placeholder="End p (default 2300)" 
            value={end} 
            onChange={(e) => setEnd(Number(e.target.value))} 
          />
        </div>
        <div className="col-md-3">
          <button 
            className="btn btn-primary w-100" 
            onClick={handleRunCode}
            disabled={loading}
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
              <p className="mt-2">Searching for Mersenne primes...</p>
            </div>
          )}
          {!loading && output.length > 0 && (
            <ul className="list-group w-100">
              {output.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  p={item.p} : {item.mersenne_number}
                </li>
              ))}
            </ul>
          )}
          {!loading && output.length === 0 && <p>No output yet. Click "Run Code".</p>}
        </div>
      </div>
    </div>
  );
};

export default Q3;
