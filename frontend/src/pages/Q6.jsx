import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Q6 = () => {
  const location = useLocation();
  const [pValues, setPValues] = useState('2,3'); // Default small Mersenne primes
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const pythonCode = `
from gmpy2 import mpz

def perfect_numbers_from_mersenne(p_values_str=None):
    mersennes = []
    if p_values_str:
        p_list = [int(p.strip()) for p in p_values_str.split(",")]
        for p in p_list:
            M_p = mpz(2)**p - 1
            mersennes.append({"p": p, "mersenne_number": str(M_p)})
    else:
        p_list = [2,3]
        for p in p_list:
            M_p = mpz(2)**p - 1
            mersennes.append({"p": p, "mersenne_number": str(M_p)})

    perfect_numbers = []
    for item in mersennes:
        p = item["p"]
        M_p = mpz(item["mersenne_number"])
        N = (1 << (p - 1)) * M_p
        perfect_numbers.append({"p": p, "perfect_number": str(N)})
    return perfect_numbers
`;

  const handleRunCode = async () => {
    setOutput([]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/q6?p_values=${encodeURIComponent(pValues)}`);
      const data = await res.json();
      setOutput(data.perfect_numbers || []);
    } catch (err) {
      console.error('Error fetching:', err);
      setOutput([{ error: 'Error fetching output' }]);
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
      <h2>Q6: Perfect Numbers from Mersenne Primes</h2>
      <p>
        Using Mersenne primes, generate perfect numbers using the formula 2^(p-1) * (2^p - 1).
      </p>

      {/* Input Field */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter Mersenne exponents, e.g., 2,3,5" 
            value={pValues} 
            onChange={(e) => setPValues(e.target.value)} 
          />
        </div>
        <div className="col-md-3">
          <button 
            className="btn btn-primary w-100" 
            onClick={handleRunCode}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Run Code'}
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
        <div className="card-body" style={{ minHeight: '100px' }}>
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Generating perfect numbers...</p>
            </div>
          )}
          {!loading && output.length === 0 && <p>No output yet. Click "Run Code".</p>}
          {!loading && output.length > 0 && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {output.map((item, idx) => (
                <pre key={idx} className="bg-light p-2">
                  {item.error ? item.error : `p = ${item.p}, Perfect Number = ${item.perfect_number}`}
                </pre>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Q6;
