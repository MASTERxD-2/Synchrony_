# backend/app.py

import sys
import os
from flask import Flask

# Add backend directory to sys.path so relative imports work
sys.path.append(os.path.dirname(__file__))

from routes.convert_code import convert_code_bp

app = Flask(__name__)
app.register_blueprint(convert_code_bp)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
