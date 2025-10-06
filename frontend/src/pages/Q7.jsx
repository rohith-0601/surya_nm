import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Q7 = () => {
  const location = useLocation();
  const [part, setPart] = useState("a"); // a = Wieferich, e = Legendre, f = Oppermann
  const [inputs, setInputs] = useState({ start: 2, end: 4000, N: "" });
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = {
    a: "Find Wieferich primes between start and end. A prime p is Wieferich if 2^(p-1) ≡ 1 (mod p^2).",
    e: "Legendre's Conjecture: There is at least one prime between N^2 and (N+1)^2.",
    f: "Oppermann's Conjecture: Find primes between N*(N-1) and N^2, and N^2 and N*(N+1)."
  };

  const pythonCodes = {
    a: `
def wieferich_primes(start, end):
    found_primes = []
    for p in range(start, end+1):
        if is_prime(p) and pow(2, p-1, p**2) == 1:
            found_primes.append(p)
    return found_primes
    `,
    e: `
def legendre_conjecture(N):
    low = N**2
    high = (N+1)**2
    prime = nextprime(low)
    return prime if low < prime < high else None
    `,
    f: `
def oppermann_conjecture(N):
    prime1 = nextprime(N*(N-1))
    prime2 = nextprime(N**2)
    return prime1, prime2
    `
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleRun = async () => {
    setOutput(null);
    setLoading(true);
    let url = "http://localhost:5001/api/q7";
    const params = new URLSearchParams();
    params.append("part", part);
    if (part === "a") {
      params.append("start", inputs.start);
      params.append("end", inputs.end);
    } else {
      params.append("N", inputs.N);
    }

    try {
      const res = await fetch(`${url}?${params.toString()}`);
      const data = await res.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
      setOutput({ error: "Failed to fetch output" });
    }
    setLoading(false);
  };

  const renderInputs = () => {
    if (part === "a") {
      return (
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              type="number"
              name="start"
              className="form-control"
              placeholder="Start"
              value={inputs.start}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="end"
              className="form-control"
              placeholder="End"
              value={inputs.end}
              onChange={handleInputChange}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              type="text"
              name="N"
              className="form-control"
              placeholder="N"
              value={inputs.N}
              onChange={handleInputChange}
            />
          </div>
        </div>
      );
    }
  };

  const renderOutput = () => {
  if (loading) return <p>Loading...</p>;
  if (!output) return <p>No output yet.</p>;

  // Check if output is empty for Wieferich (array) or primes not found for Legendre/Oppermann
  if (
    (part === "a" && output.wieferich_primes && output.wieferich_primes.length === 0) ||
    (part === "e" && !output.found_prime) ||
    (part === "f" && !output.prime1 && !output.prime2)
  ) {
    return <p>No numbers found in the given range.</p>;
  }

  // Display nicely
  return (
    <div>
      {Object.keys(output).map((key) => (
        <div key={key}>
          <strong>{key}:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(output[key], null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
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
                      <span className="nav-link active">Q{n}</span>
                    ) : (
                      <Link className="nav-link" to={path}>Q{n}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <h2>Q7: Open Prime Problems</h2>

      {/* Part selection */}
      <div className="btn-group mb-3">
        <button className={`btn btn-${part==="a"?"primary":"outline-primary"}`} onClick={()=>setPart("a")}>Wieferich</button>
        <button className={`btn btn-${part==="e"?"primary":"outline-primary"}`} onClick={()=>setPart("e")}>Legendre</button>
        <button className={`btn btn-${part==="f"?"primary":"outline-primary"}`} onClick={()=>setPart("f")}>Oppermann</button>
      </div>

      {/* Question */}
      <div className="card mb-3">
        <div className="card-header bg-secondary text-white">Question</div>
        <div className="card-body">
          <p>{questions[part]}</p>
        </div>
      </div>

      {/* Code */}
      <div className="card mb-3">
        <div className="card-header bg-secondary text-white">Controller Code (Python)</div>
        <div className="card-body">
          <pre style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '10px' }}>
            {pythonCodes[part]}
          </pre>
        </div>
      </div>

      {/* Inputs */}
      {renderInputs()}

      {/* Run Button */}
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Output */}
      <div className="card">
        <div className="card-header bg-secondary text-white">Output</div>
        <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {renderOutput()}
        </div>
      </div>
    </div>
  );
};

export default Q7;
