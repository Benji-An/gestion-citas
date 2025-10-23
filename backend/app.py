from flask import Flask
from flask_cors import CORS

from auth import auth_bp
from appointments import appointments_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(appointments_bp, url_prefix='/appointments')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
