from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from project_flask.models.account import Account

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests from your frontend

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/test-db-connection')
def test_db_connection():
    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1;")  
                result = cursor.fetchone()
                return jsonify({"status": "success", "result": result}), 200
    except Exception as e:
        # If there is an error, return it as JSON
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/accounts', methods=['POST'])
def register_account():
    data = request.json 

    result = Account.register(
        username=data.get('username'),
        loginEmail=data.get('loginEmail'),
        password=data.get('password')  
    )

    return jsonify(result), 201 if 'error' not in result else 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Retrieve account by email
    account = Account.get_account_by_email(email)

    # Compare plain-text password directly (not recommended for security)
    if account and account['password'] == password:
        return jsonify({"message": "Login successful", "user": account['username']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


#fix
# @app.route('/check_account/<username>/<email>', methods=['GET'])
# def check_account(username, email):
#     if Account.account_exists(username, email):
#         return {"exists": True}
#     else:
#         return {"exists": False}

if __name__ == '__main__':
    app.run(debug=True)
