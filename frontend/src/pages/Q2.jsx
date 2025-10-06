import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Q2 = () => {
  const location = useLocation();
  const [start, setStart] = useState(2);
  const [end, setEnd] = useState(1040);
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const pythonCode = `
from sympy import isprime, primerange

def repunit_number(n):
    return int("1" * n)

def generate_repunit_primes(start=2, end=1040):
    primes_list = []
    for n in primerange(start, end+1):
        Rn = repunit_number(n)
        if isprime(Rn):
            primes_list.append({"n": n, "repunit": str(Rn)})
    return primes_list
  `;

  const handleRunCode = async () => {
    setOutput([]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/q2?start=${start}&end=${end}`);
      const data = await res.json();
      setOutput(data.repunit_primes);
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
      <h2>Q2: Repunit Primes</h2>
      <p>
        11 is prime, 111 is not prime. We use the notation 1N = N ones. Only check for N being prime. 
        Determine the 5 repunit primes between N=2 and N=1040.
      </p>

      {/* Input Fields */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input 
            type="number" 
            className="form-control" 
            placeholder="Start N (default 2)" 
            value={start} 
            onChange={(e) => setStart(Number(e.target.value))} 
          />
        </div>
        <div className="col-md-3">
          <input 
            type="number" 
            className="form-control" 
            placeholder="End N (default 1040)" 
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
              <p className="mt-2">Searching for repunit primes...</p>
            </div>
          )}
          {!loading && output.length > 0 && (
            <ul className="list-group w-100">
              {output.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  N={item.n} : {item.repunit}
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

export default Q2;
