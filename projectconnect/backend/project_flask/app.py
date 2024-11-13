from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from project_flask.models.account import Account
from project_flask.models.project import Project

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


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

@app.route('/check_account/<username>/<email>', methods=['GET'])
def check_account(username, email):
    if Account.account_exists(username, email):
        return {"exists": True}
    else:
        return {"exists": False}
    
# Project API's
    
@app.route('/project_exists', methods=['GET'])
def project_exists():
    data = request.json 
    creatorusername = data.get('creatorusername')
    title = data.get('title')
    
    if Project.project_exists(creatorusername, title):
        return {"exists": True}
    else:
        return {"exists": False}

@app.route('/buildProject', methods=['POST'])
def buildProject():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')
    description = data.get('description')

    # Extract optional fields, using None if they are not provided
    optional_fields = {
        "links": data.get('links'),
        "memberdescription": data.get('memberdescription'),
        "memberlinks": data.get('memberlinks'),
        "membercontactinfo": data.get('membercontactinfo'),
    }

    # Call the buildProject method, passing required and optional parameters
    result = Project.buildProject(creatorusername, title, description, **optional_fields)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    
@app.route('/getProjectInfo', methods=['GET'])
def getProjectInfo():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')

    result = Project.getProjectInfo(creatorusername, title)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    
@app.route('/deleteProject', methods=['POST'])
def deleteProject():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')

    result = Project.deleteProject(creatorusername, title)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    
@app.route('/archiveProject', methods=['POST'])
def archiveProject():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')

    result = Project.archiveProject(creatorusername, title)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    
@app.route('/unarchiveProject', methods=['POST'])
def unarchiveProject():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')

    result = Project.unarchiveProject(creatorusername, title)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    
@app.route('/count_projects', methods=['GET', 'OPTIONS'])
def count_projects():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
    # Original count_projects logic follows
    try:
        count = Project.count_projects()
        if count is not None:
            return jsonify({"status": "success", "count": count}), 200
        else:
            return jsonify({"status": "error", "message": "Could not retrieve project count"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
