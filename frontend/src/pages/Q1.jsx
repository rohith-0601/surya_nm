import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Q1 = () => {
  const location = useLocation();
  const [start, setStart] = useState(1000);
  const [end, setEnd] = useState(3000);
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const pythonCode = `
import gmpy2
import sys
import time
from sympy import isprime
from gmpy2 import mpz, next_prime, is_prime

sys.set_int_max_str_digits(20000)

def kaprekar_variant(n: int) -> int:
    num = 0
    for i in range(1, n + 1):
        num = num * (10 ** len(str(i))) + i
    for i in range(n - 1, 0, -1):
        num = num * (10 ** len(str(i))) + i
    return num

def find_kaprekar_prime(start=1000, end=3000):
    start_time = time.time()
    for n in range(start, end + 1):
        candidate = kaprekar_variant(n)
        elapsed = round(time.time() - start_time, 2)
        yield f"data: {{\\"current_n\\": {n}, \\"runtime_seconds\\": {elapsed}}}\\n\\n"
        time.sleep(0)
        if gmpy2.is_prime(candidate):
            elapsed = round(time.time() - start_time, 2)
            yield f"data: {{\\"found\\": true, \\"n\\": {n}, \\"kaprekar_number\\": \\"{candidate}\\", \\"runtime_seconds\\": {elapsed}}}\\n\\n"
            return
    elapsed = round(time.time() - start_time, 2)
    yield f"data: {{\\"found\\": false, \\"runtime_seconds\\": {elapsed}}}\\n\\n"
  `;

  const handleRunCode = () => {
    setOutput([]);
    setLoading(true);

    const eventSource = new EventSource(
      `http://localhost:5001/api/q1/stream?start=${start}&end=${end}`
    );

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.found !== undefined) {
          const foundNumber = data.found ? data.kaprekar_number : null;
          setOutput([foundNumber]);
          eventSource.close();
          setLoading(false);
        }
      } catch (err) {
        console.error("Error parsing SSE:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };
  };

  return (
    <div className="container my-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Prime Assignment
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                const path = n === 1 ? "/" : `/q${n}`;
                return (
                  <li className="nav-item" key={n}>
                    {location.pathname === path ? (
                      <span className="nav-link active" aria-current="page">
                        Q{n}
                      </span>
                    ) : (
                      <Link className="nav-link" to={path}>
                        Q{n}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Question Heading */}
      <h2>Q1: Kaprekar-like Prime</h2>
      <p>
        A prime number is 12345678910987654321. Here n is 10. Find the next
        number that follows this pattern. The number n lies between 1000 and
        3000.
      </p>

      {/* Input Fields */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Start (default 1000)"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="End (default 3000)"
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
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Python Controller Code */}
      <div className="card mb-3">
        <div className="card-header bg-secondary text-white">
          Controller Code (Python)
        </div>
        <div className="card-body">
          <pre
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
              padding: "10px",
            }}
          >
            {pythonCode}
          </pre>
        </div>
      </div>

      {/* Output */}
      {/* Output */}
      <div className="card">
        <div className="card-header bg-secondary text-white">Output</div>
        <div
          className="card-body"
          style={{
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            overflowX: "auto", // allow horizontal scroll for very long numbers
            wordBreak: "break-all", // break long continuous text
            whiteSpace: "pre-wrap", // preserve line breaks
            textAlign: "center",
          }}
        >
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Searching for Kaprekar prime...</p>
            </div>
          )}
          {!loading && output.length > 0 && (
            <pre style={{ overflowX: "auto" }}>
              {output[0]
                ? `Kaprekar prime found:\n${output[0]}`
                : "No Kaprekar prime found in the given range."}
            </pre>
          )}
          {!loading && output.length === 0 && (
            <p>No output yet. Click "Run Code".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Q1;
