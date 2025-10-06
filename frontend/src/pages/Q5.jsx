import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Q5 = () => {
  const location = useLocation();
  const [minDigits, setMinDigits] = useState(50);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const pythonCode = `
from sympy import isprime
from gmpy2 import mpz

def palindrome_generator(length):
    half = (length + 1) // 2
    start = 10 ** (half - 1)
    end = 10 ** half
    for i in range(start, end):
        s = str(i)
        pal = s + s[-2::-1]
        yield mpz(pal)

def find_large_palindromic_prime(min_digits=50):
    length = min_digits if min_digits % 2 == 1 else min_digits + 1
    while True:
        for pal in palindrome_generator(length):
            if isprime(pal):
                return pal
        length += 2
`;

  const handleRunCode = async () => {
    setOutput(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/q5?min_digits=${minDigits}`);
      const data = await res.json();
      setOutput(data.palindromic_prime || 'No prime found');
    } catch (err) {
      console.error('Error fetching:', err);
      setOutput('Error fetching output');
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
      <h2>Q5: Palindromic Prime ≥ 50 digits</h2>
      <p>
        Find a palindromic prime number with at least 50 digits.
      </p>

      {/* Input Field */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input 
            type="number" 
            className="form-control" 
            placeholder="Minimum digits (default 50)" 
            value={minDigits} 
            onChange={(e) => setMinDigits(Number(e.target.value))} 
          />
        </div>
        <div className="col-md-3">
          <button 
            className="btn btn-primary w-100" 
            onClick={handleRunCode}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Run Code'}
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
              <p className="mt-2">Finding palindromic prime...</p>
            </div>
          )}
          {!loading && output && (
            <pre className="bg-light p-2 w-100" style={{ overflowX: 'auto' }}>{output}</pre>
          )}
          {!loading && !output && <p>No output yet. Click "Run Code".</p>}
        </div>
      </div>
    </div>
  );
};

export default Q5;
