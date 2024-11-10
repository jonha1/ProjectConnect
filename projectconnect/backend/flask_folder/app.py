from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_folder.models.account import Account

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests from your frontend

# Connect to PostgreSQL database
@app.route('/findConnection', methods=['GET'])
def get_db_connection():
    try:
        # Get the DATABASE_URL from the environment variable
        database_url = os.getenv("DATABASE_URL")
        print(f"DATABASE_URL: {database_url}")
        
        # Try connecting to the database
        conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
        
        # If successful, return a success message
        return jsonify({"message": "Database connection successful!"}), 200
    except Exception as e:
        # In case of an error, return an error message
        return jsonify({"error": str(e)}), 500


@app.route('/api/accounts', methods=['POST'])
def register_account():
    data = request.json  # Get the JSON data from the request

    # Call the register method with the necessary parameters
    result = Account.register(
        username=data.get('username'),
        loginemail=data.get('loginemail'),
        password=data.get('password')  # Remember to hash the password here
    )

    return jsonify(result), 201 if 'error' not in result else 400

if __name__ == '__main__':
    app.run(debug=True)


## TEST
# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
#     loginemail = data['loginemail']
#     password = data['password']  # Store password as plain text (not secure)

#     conn = get_db_connection()
#     cursor = conn.cursor()
#     try:
#         cursor.execute(
#             "INSERT INTO users (loginemail, password) VALUES (%s, %s) RETURNING id", 
#             (loginemail, password)
#         )
#         user_id = cursor.fetchone()['id']
#         conn.commit()
#         return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
#     finally:
#         cursor.close()
#         conn.close()


# @app.route('/login', methods=['POST'])
# def signin():
#     data = request.get_json()
#     print("Received data:", data)
    
#     # Use 'loginemail' here as per your schema
#     loginemail = data['loginemail']
#     password = data['password']

#     conn = get_db_connection()
#     cursor = conn.cursor()
#     try:
#         # Use the correct field names 'loginemail' and 'password'
#         cursor.execute("SELECT * FROM users WHERE loginemail = %s AND password = %s", (loginemail, password))
#         user = cursor.fetchone()
#         print("Fetched user:", user)

#         if user:
#             return jsonify({"message": "Logged in successfully", "user_id": user['username']}), 200
#         else:
#             return jsonify({"error": "Invalid email or password"}), 401
#     finally:
#         cursor.close()
#         conn.close()