from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from project_flask.models.account import Account
# from project_flask.models.user import User
from project_flask.models.project import Project

load_dotenv()

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

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

## ACCOUNT ##

@app.route('/register', methods=['POST'])
def register_account():
    data = request.json 

    result = Account.register(
        username=data.get('username'),
        displayname=data.get('displayname'),
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
    
@app.route('/getEmailByUser', methods=['POST'])
def getEmailByUser():
    data = request.json
    username = data.get("username")

    # Validate input
    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    try:
        print(f"Attempting to fetch email for username: {username}")
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT loginemail FROM users WHERE username = %s
                    """,
                    (username,)
                )
                result = cursor.fetchone()

        if result:
             # Extract email directly
            email = result['loginemail'] 
            return jsonify({"email": email}), 200 
        else:
            print(result)
            return jsonify({"status": "error", "message": "User not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": "Internal server error"}), 500
    
## USER ##
@app.route('/api/editSkills', methods=['POST'])
def editSkils():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    newSkills = data.get("skills")

    if not username or not newSkills or not newSkills:
        return jsonify({"error": "Username and skills are required"}), 400

    account = Account.account_exists(username,loginEmail)

    if not account:
        return jsonify({"error": "Invalid credentials"}), 401
    
    skills_list = [skill.strip() for skill in newSkills.split(",") if skill.strip()]
    all_skills = ", ".join(skills_list)  

    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE users 
                    SET skills = %s
                    WHERE username = %s
                    """,
                    (all_skills, username)
                )
                conn.commit()

        return jsonify({"status": "success", "updatedSkills": all_skills}), 200

    except Exception as e:
        print(f"Error updating skills: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/getSkills', methods=['POST'])
def get_skills():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT skills FROM users WHERE username = %s
                    """,
                    (username,)
                )
                result = cursor.fetchone()

        if result:
            return jsonify({"status": "success", "skills": result["skills"]}), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404

    except Exception as e:
        print(f"Error fetching skills: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
       
@app.route('/api/editAboutMe', methods=['POST'])
def edit_about_me():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    new_about_me = data.get("newAboutMe")

    if not username or not new_about_me:
        return jsonify({"status": "error", "message": "Both username and newAboutMe are required"}), 400

    account = Account.account_exists(username,loginEmail)

    if not account:
        return jsonify({"error": "Invalid credentials"}), 401
    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE users 
                    SET aboutme = %s 
                    WHERE username = %s
                    RETURNING aboutme;
                    """,
                    (new_about_me, username)
                )
                updated_record = cursor.fetchone()
                conn.commit()

        if updated_record:
            return jsonify({"status": "success", "aboutme": updated_record["aboutme"]}), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404

    except Exception as e:
        print(f"Error updating aboutMe: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/getAboutMe', methods=['POST'])
def get_about_me():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")

    if not username or not loginEmail:
        return jsonify({"status": "error", "message": "Username and loginEmail are required"}), 400

    account_exists = Account.account_exists(username, loginEmail)
    if not account_exists:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT aboutme FROM users WHERE username = %s AND loginEmail = %s
                    """,
                    (username, loginEmail)
                )
                result = cursor.fetchone()

        if result and "aboutme" in result:
            return jsonify({"status": "success", "aboutme": result["aboutme"]}), 200
        else:
            return jsonify({"status": "error", "message": "No aboutme found for the user"}), 404
    except Exception as e:
        print(f"Error fetching aboutMe: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/editContactInfo', methods=['POST'])
def edit_Contact_Info():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    newContactInfo = data.get("contactInfo")

    if not username or not newContactInfo:
        return jsonify({"status": "error", "message": "Both username and contactInfo are required"}), 400

    account = Account.account_exists(username,loginEmail)

    if not account:
        return jsonify({"error": "Invalid credentials"}), 401
    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE users 
                    SET contactinfo = %s 
                    WHERE username = %s
                    RETURNING contactinfo;
                    """,
                    (newContactInfo, username)
                )
                updated_record = cursor.fetchone()
                conn.commit()

        if updated_record:
            return jsonify({"status": "success", "contactinfo": updated_record["contactinfo"]}), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404

    except Exception as e:
        print(f"Error updating contactinfo: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/getContactInfo', methods=['POST'])
def get_Contact_Info():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")

    if not username or not loginEmail:
        return jsonify({"status": "error", "message": "Username and loginEmail are required"}), 400

    account_exists = Account.account_exists(username, loginEmail)
    if not account_exists:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        with Account.get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT contactinfo FROM users WHERE username = %s AND loginEmail = %s
                    """,
                    (username, loginEmail)
                )
                result = cursor.fetchone()

        if result and "contactinfo" in result:
            return jsonify({"status": "success", "contactinfo": result["contactinfo"]}), 200
        else:
            return jsonify({"status": "error", "message": "No contactinfo found for the user"}), 404
    except Exception as e:
        print(f"Error fetching aboutMe: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

## important ##
@app.route('/api/getUserDetails', methods=['POST'])
def get_user_details():
    try:
        data = request.json
        username = data.get("username")
        print(f"Received request for username: {username}")

        if not username:
            return jsonify({"status": "error", "message": "Username is required"}), 400

        with Account.get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                cursor.execute("""
                    SELECT displayname, loginemail, aboutme, contactinfo, skills
                    FROM users
                    WHERE username = %s
                """, (username,))
                result = cursor.fetchone()
                print("SQL query result:", result)

                if result:
                    # Directly jsonify the RealDictRow
                    return jsonify({
                        "status": "success",
                        **result
                    }), 200
                else:
                    return jsonify({"status": "error", "message": "User not found"}), 404

    except Exception as e:
        print(f"Error fetching user details: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
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
    tag = data.get('tag')
    
    if not all([creatorusername, title, description, tag]):
        return jsonify({"error": "Missing required fields: 'creatorusername', 'title', 'description', or 'tag'"}), 400

    # Extract optional fields, using None if they are not provided
    optional_fields = {
        "links": data.get('links'),
        "memberdescription": data.get('memberdescription'),
        "memberlinks": data.get('memberlinks'),
        "membercontactinfo": data.get('membercontactinfo'),
    }

    # Call the buildProject method, passing required and optional parameters
    result = Project.buildProject(creatorusername, title, description, tag, **optional_fields)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    
@app.route('/getProjectInfo', methods=['POST', 'OPTIONS'])
def getProjectInfo():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
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

@app.route('/findProjects', methods=['POST', 'OPTIONS'])
def findProjects():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
    # Parse JSON data from the request body
    data = request.json
    searchQuery = data.get('searchQuery', "")
    tag = data.get('tag', "")
    
    # Call the Project.getProjects method to fetch projects based on the search query
    result = Project.findProjects(searchQuery, tag)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # Bad request if there's an error
    else:
        return jsonify(result), 200  # Return the project list with 200 OK
    
@app.route('/projects/by_creator', methods=['POST'])
def get_projects_by_creator():
    try:
        data = request.json
        creatorusername = data.get("creatorusername")
        
        if not creatorusername:
            return jsonify({"status": "error", "message": "Creator username is required"}), 400

        response = Project.get_projects_by_creator(creatorusername)

        if response["status"] == "success":
            return jsonify({"status": "success", "projects": response["projects"]}), 200
        else:
            return jsonify({"status": "error", "message": response.get("message", "No projects found")}), 404

    except Exception as e:
        print(f"Error in /projects/by_creator: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
