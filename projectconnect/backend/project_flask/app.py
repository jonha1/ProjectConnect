from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from project_flask.models.account import Account
from project_flask.models.user import User

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

@app.route('/api/getSkills', methods=['GET'])
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

@app.route('/api/getAboutMe', methods=['GET'])
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
    
@app.route('/api/getContactInfo', methods=['GET'])
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

if __name__ == '__main__':
    app.run(port=5001, debug=True)
