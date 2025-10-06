python3 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python3 app.py



2. Activate the virtual environment

macOS / Linux (zsh/bash):

source venv/bin/activate


Windows (cmd):

venv\Scripts\activate


With the virtual environment activated:

pip install flask flask-cors sympy gmpy2


Or if you have a requirements.txt:

pip install -r requirements.txt


