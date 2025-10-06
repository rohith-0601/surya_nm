from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from questionControllers import (
    find_kaprekar_prime,
    generate_repunit_primes,
    find_mersenne_primes,
    brocard_primes,
    find_large_palindromic_prime,
    perfect_numbers_from_mersenne,
    # New open prime problems
    wieferich_primes,
    legendre_conjecture,
    oppermann_conjecture
)

app = Flask(__name__)
CORS(app)  # Allow React frontend to fetch

# -------- Q1: Kaprekar primes (SSE) --------
@app.route("/api/q1/stream")
def api_q1_stream():
    try:
        start = int(request.args.get("start", 1000))
        end = int(request.args.get("end", 3000))
    except (ValueError, TypeError):
        start, end = 1000, 3000
    if start > end:
        start, end = end, start
    return Response(find_kaprekar_prime(start=start, end=end), mimetype="text/event-stream")

# -------- Q2: Repunit primes --------
@app.route("/api/q2")
def api_q2():
    start = int(request.args.get("start", 2))
    end = int(request.args.get("end", 1040))
    return jsonify(generate_repunit_primes(start=start, end=end))

# -------- Q3: Mersenne primes --------
@app.route("/api/q3")
def api_q3(): 
    start = int(request.args.get("start", 2201))
    end = int(request.args.get("end", 2300))
    return jsonify(find_mersenne_primes(start=start, end=end))

# -------- Q4: Brocard primes --------
@app.route("/api/q4")
def api_q4():
    return jsonify(brocard_primes())

# -------- Q5: Palindromic prime --------
@app.route("/api/q5")
def api_q5():
    min_digits = request.args.get("min_digits", default=50, type=int)
    return jsonify(find_large_palindromic_prime(min_digits=min_digits))

# -------- Q6: Perfect numbers from Mersenne primes --------
# app.py

@app.route("/api/q6")
def api_q6():
    # Read comma-separated exponents from query string
    p_values_str = request.args.get("p_values")  # e.g., "2,3,5"
    result = perfect_numbers_from_mersenne(p_values_str=p_values_str)
    return jsonify({"perfect_numbers": result})


# ===================== New Open Prime Problems =====================

# -------- Q-a: Wieferich primes --------
@app.route("/api/q7")
def api_q7():
    part = request.args.get("part")
    if not part:
        return jsonify({"error": "Provide 'part' parameter (a/e/f)"}), 400

    if part == "a":
        start = request.args.get("start", default=2, type=int)
        end = request.args.get("end", default=4000, type=int)
        return jsonify(wieferich_primes(start, end))
    elif part == "e":
        N = request.args.get("N")
        if not N:
            return jsonify({"error": "Provide N for Legendre"}), 400
        return jsonify(legendre_conjecture(N))
    elif part == "f":
        N = request.args.get("N")
        if not N:
            return jsonify({"error": "Provide N for Oppermann"}), 400
        return jsonify(oppermann_conjecture(N))
    else:
        return jsonify({"error": "Invalid part. Use 'a', 'e', or 'f'."}), 400



if __name__ == "__main__":
    app.run(debug=True, port=5001)
