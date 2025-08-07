# routes/analyze.py
from flask import Blueprint, request, jsonify
from model.summary_generator import analyze_zip_file
import os

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    zip_path = os.path.join("uploads", file.filename)
    file.save(zip_path)

    try:
        summary = analyze_zip_file(zip_path)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
