from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from project_flask.models.account import Account
from project_flask.models.user import User
from project_flask.models.member import Member
from project_flask.models.creator import Creator

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

    account = Account.get_account_by_email(email)

    if account and account['password'] == password:
        return jsonify({"message": "Login successful", "user": account['username']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/leave-project', methods=['POST'])
def leave_project():
    data = request.json
    username = data.get("username")
    project_title = data.get("project_title")
    result = Member.leaveProject(username, project_title)

    if "error" in result:
        return jsonify(result), 400
    else:
        return jsonify(result), 200
    
@app.route('/api/join-project', methods=['POST'])
def join_project():
    data = request.json
    username = data.get("username")
    project_title = data.get("project_title")

    if not username or not project_title:
        return jsonify({"error": "Missing username or project title"}), 400

    result = User.join_project(username, project_title)

    if "error" in result:
        return jsonify(result), 400
    else:
        return jsonify(result), 201

@app.route('/api/delete-project', methods=['DELETE'])
def delete_project():
    data = request.json
    creatorusername = data.get("creatorusername")
    title = data.get("title")

    if not creatorusername or not title:
        return jsonify({"error": "Missing creatorusername or title"}), 400

    # Instantiate the Creator object
    creator = Creator(username=creatorusername, displayName=None, loginEmail=None, password=None, aboutMe=None, contactInfo=None, skills=None)
    
    # Call the deleteProject method
    result = creator.deleteProject(creatorusername, title)

    # Return the appropriate response
    if "error" in result:
        return jsonify(result), 400
    else:
        return jsonify(result), 200
    
if __name__ == '__main__':
    app.run(debug=True)
