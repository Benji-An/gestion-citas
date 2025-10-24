from flask import Flask
from flask_cors import CORS

from auth import auth_bp
from appointments import appointments_bp

app = Flask(__name__)
# Configure CORS explicitly to allow the frontend served from Apache (http://localhost)
# Allow localhost and 127.0.0.1 origins — adjust if your frontend runs on a different host/port
CORS(app, resources={r"/*": {"origins": ["http://localhost", "http://127.0.0.1"]}}, supports_credentials=True)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(appointments_bp, url_prefix='/appointments')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
