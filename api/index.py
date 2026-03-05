from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'QR Code Generator API',
        'endpoints': {
            '/api/generate': 'POST - Generate QR code with optional logo'
        },
        'usage': 'Send POST request to /api/generate with JSON: {"data": "your-url", "logo": "base64-image"}'
    })

# For local development
if __name__ == '__main__':
    app.run(debug=True)
