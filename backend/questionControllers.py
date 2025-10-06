import gmpy2
import sys
import time
from sympy import isprime, primerange, nextprime
from gmpy2 import mpz, next_prime, is_prime

sys.set_int_max_str_digits(20000)
from flask import request

# -------- Q1: Kaprekar-like numbers (renamed) --------
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
        yield f"data: {{\"current_n\": {n}, \"runtime_seconds\": {elapsed}}}\n\n"
        time.sleep(0)
        if gmpy2.is_prime(candidate):
            elapsed = round(time.time() - start_time, 2)
            yield f"data: {{\"found\": true, \"n\": {n}, \"kaprekar_number\": \"{candidate}\", \"runtime_seconds\": {elapsed}}}\n\n"
            return
    elapsed = round(time.time() - start_time, 2)
    yield f"data: {{\"found\": false, \"runtime_seconds\": {elapsed}}}\n\n"

# -------- Q2: Repunit primes (renamed) --------
def repunit_number(n):
    return int("1" * n)

def generate_repunit_primes(start=2, end=1040):
    start_time = time.time()
    primes_list = []
    for n in primerange(start, end + 1):
        Rn = repunit_number(n)
        if isprime(Rn):
            primes_list.append({"n": n, "repunit": str(Rn)})
    elapsed = round(time.time() - start_time, 2)
    return {"repunit_primes": primes_list, "runtime_seconds": elapsed}

# -------- Q3: Mersenne primes (renamed) --------
LAST_Q3_RESULT = None

def lucas_lehmer_test(p):
    if p == 2:
        return True
    M = gmpy2.mpz(2)**p - 1
    s = gmpy2.mpz(4)
    for _ in range(p - 2):
        s = (s * s - 2) % M
    return s == 0

def find_mersenne_primes(start=2201, end=2300):
    global LAST_Q3_RESULT
    start_time = time.time()
    mersenne_list = []
    for p in range(start, end):
        if gmpy2.is_prime(p) and lucas_lehmer_test(p):
            M = gmpy2.mpz(2)**p - 1
            mersenne_list.append({"p": p, "mersenne_number": str(M)})
    elapsed = round(time.time() - start_time, 2)
    LAST_Q3_RESULT = {"mersenne_primes": mersenne_list, "runtime_seconds": elapsed}
    return LAST_Q3_RESULT

# -------- Q4: Brocard's conjecture using Q3 (renamed) --------
def brocard_primes():
    start_time = time.time()
    try:
        M1_input = request.args.get("startP")
        M2_input = request.args.get("endP")
        if M1_input and M2_input:
            M1 = mpz(M1_input)
            M2 = mpz(M2_input)
        elif LAST_Q3_RESULT and LAST_Q3_RESULT.get("mersenne_primes") and len(LAST_Q3_RESULT["mersenne_primes"]) >= 2:
            mersennes = LAST_Q3_RESULT["mersenne_primes"]
            M1 = mpz(mersennes[0]["mersenne_number"])
            M2 = mpz(mersennes[1]["mersenne_number"])
        else:
            M1 = mpz(2)**2203 - 1
            M2 = mpz(2)**2281 - 1
    except Exception:
        M1 = mpz(2)**2203 - 1
        M2 = mpz(2)**2281 - 1

    low = M1**2
    high = M2**2
    primes = []
    candidate = next_prime(low)
    while candidate < high and len(primes) < 4:
        primes.append(candidate)
        candidate = next_prime(candidate)
    elapsed = round(time.time() - start_time, 2)
    return {"primes": [str(p) for p in primes], "runtime_seconds": elapsed}

# -------- Q5: Palindromic prime ≥ 50 digits (renamed) --------
def palindrome_generator(length):
    half = (length + 1) // 2
    start = 10 ** (half - 1)
    end = 10 ** half
    for i in range(start, end):
        s = str(i)
        pal = s + s[-2::-1]
        yield mpz(pal)

def find_large_palindromic_prime(min_digits=50):
    start_time = time.time()
    length = min_digits if min_digits % 2 == 1 else min_digits + 1
    while True:
        for pal in palindrome_generator(length):
            if is_prime(pal):
                elapsed = round(time.time() - start_time, 2)
                return {"palindromic_prime": str(pal), "digits": len(str(pal)), "runtime_seconds": elapsed}
        length += 2

# -------- Q6: Perfect numbers from Mersenne primes (renamed) --------
def perfect_numbers_from_mersenne(p_values_str=None):
    from gmpy2 import mpz
    mersennes = []
    if p_values_str:
        try:
            p_list = [int(p.strip()) for p in p_values_str.split(",")]
        except ValueError:
            p_list = [2, 3]  # fallback
    else:
        p_list = [2, 3]

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


# ===================== New Open Prime Problems =====================

# -------- Q-a: Wieferich primes --------
def wieferich_primes(start, end):
    """
    Find Wieferich primes between start and end
    A prime p is Wieferich if 2^(p-1) ≡ 1 (mod p^2)
    """
    start_time = time.time()
    start, end = int(start), int(end)
    found_primes = []

    for p in range(start, end + 1):
        if is_prime(p) and pow(2, p-1, p**2) == 1:
            found_primes.append(p)

    elapsed = round(time.time() - start_time, 2)
    return {"wieferich_primes": found_primes, "runtime_seconds": elapsed}

# -------- Q-e: Legendre's Conjecture --------
def legendre_conjecture(N):
    """
    There is at least one prime between N^2 and (N+1)^2
    Works for large N (>50 digits)
    """
    start_time = time.time()
    N = mpz(N)
    low = N**2
    high = (N + 1)**2
    prime = nextprime(low)
    valid = low < prime < high
    elapsed = round(time.time() - start_time, 2)
    return {
        "N": str(N),
        "low": str(low),
        "high": str(high),
        "found_prime": str(prime) if valid else None,
        "is_valid": valid,
        "runtime_seconds": elapsed
    }

# -------- Q-f: Oppermann's Conjecture --------
def oppermann_conjecture(N):
    """
    1) Prime between N*(N-1) and N^2
    2) Prime between N^2 and N*(N+1)
    Works for large N (>50 digits)
    """
    start_time = time.time()
    N = mpz(N)
    low1, high1 = N*(N-1), N**2
    low2, high2 = N**2, N*(N+1)

    prime1 = nextprime(low1)
    prime2 = nextprime(low2)

    valid1 = low1 < prime1 < high1
    valid2 = low2 < prime2 < high2
    elapsed = round(time.time() - start_time, 2)

    return {
        "N": str(N),
        "range1": [str(low1), str(high1)],
        "range2": [str(low2), str(high2)],
        "prime1": str(prime1) if valid1 else None,
        "prime2": str(prime2) if valid2 else None,
        "is_valid1": valid1,
        "is_valid2": valid2,
        "runtime_seconds": elapsed
    }

