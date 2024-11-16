from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from project_flask.models.account import Account
from project_flask.models.user import user

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
    #creatos account instance

    account = Account.get_account_by_email(email)

    if account and account['password'] == password:
        return jsonify({"message": "Login successful", "user": account['username']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/editSkills', methods=['POST'])
def editSkills():
    # Parse the JSON payload from the request
    data = request.get_json()

    if not data or 'new_skills' not in data or 'email' not in data:
        return jsonify({"error": "Invalid input. 'email' and 'new_skills' keys are required."}), 400

    # Extract email and new_skills from the request
    email = data.get("email")
    new_skills = data.get("new_skills")

    # Fetch the account by email
    account = Account.get_account_by_email(email)

    # Check if the account exists
    if not account:
        return jsonify({"error": f"Account with email '{email}' does not exist."}), 404

    # if not user:
    #     return jsonify({"error": "No user associated with this account."}), 404

    # Update the user's skills
    user.editSkills(new_skills)

    return jsonify({
        "message": "Skills updated successfully",
        "new_skills": user.skills
    })


@app.route('/getSkills', methods=['GET'])
def getSkills(self):
    return self.skills

@app.route('/editAboutMe', methods=['POST'])
def editAboutMe(self, new_about_me):
    self.aboutMe = new_about_me

@app.route('/getAboutMe', methods=['GET'])
def getAboutMe(self):
    return self.aboutMe

@app.route('/editContactInfo', methods=['POST'])
def editContactInfo(self, new_contact_info):
    self.contactInfo = new_contact_info

@app.route('/getContactInfo', methods=['GET'])
def getContactInfo(self):
    return self.contactInfo

@app.route('/getDisplayInfo', methods=['GET'])
def getDisplayName(self):
    return self.displayName

if __name__ == '__main__':
    app.run(debug=True)
