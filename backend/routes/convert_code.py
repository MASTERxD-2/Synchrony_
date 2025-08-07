# routes/convert_code.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from model.summary_generator import analyze_zip_file

convert_code_bp = Blueprint('convert_code', __name__)

@convert_code_bp.route('/api/convert-code', methods=['POST'])
def convert_code():
    try:
        print("📩 Received request to /api/convert-code")

        if 'zipfile' not in request.files:
            print("❌ No zipfile in request.files")
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['zipfile']
        filename = secure_filename(file.filename)
        filepath = os.path.join('/tmp', filename)
        print(f"📁 Saving uploaded zip to: {filepath}")
        file.save(filepath)

        print("🧠 Running analyze_zip_file...")
        summary = analyze_zip_file(filepath)

        print("✅ Summary generated.")
        return jsonify({'summary': summary})

    except Exception as e:
        print(f"🔥 Error in convert_code: {e}")
        return jsonify({'error': str(e)}), 500

