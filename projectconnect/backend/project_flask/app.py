from flask_cors import CORS
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from project_flask.models.account import Account
from project_flask.models.member import Member
from project_flask.models.creator import Creator
from project_flask.models.project import Project
from project_flask.models.bookmark import Bookmark
from project_flask.models.notification import Notification
from project_flask.models.user import User

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

## ACCOUNT APIS ##
## make sure to find out if account exists 
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
    check = data.get("check") 
    password = data.get("password")

    if "@" in check:
        account = Account.get_account_by_email(check)
        if not account:
            return jsonify({"error": "Incorrect email"}), 404
    else:
        account = Account.get_account_by_username(check)
        if not account:
            return jsonify({"error": "Incorrect username"}), 404

    if not account:
        return jsonify({"error": "Account doesn't exist"}), 404

    if account['password'] != password:
        return jsonify({"error": "Incorrect password"}), 401

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
        

@app.route('/updateProfileFromEdit', methods=['POST'])
def updateProfileFromEdit():
    data = request.json
    username = data.get("username")
    column = data.get("column")
    value = data.get("value")
    
    result = User.updateProfileFromEdit(username, column, value)
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
    # Check if the result is an error

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

@app.route('/delete-project', methods=['POST'])
def delete_project():
    data = request.json
    creatorusername = data.get("creatorusername")
    title = data.get("title")
    print(title, creatorusername)
    result = Creator.deleteProject(creatorusername, title)
    if "error" in result:
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation
@app.route('/getEmailByUser', methods=['POST'])
def get_email_by_user():
    try:
        data = request.json
        username = data.get("username")

        if not username:
            return jsonify({"status": "error", "message": "Username is required"}), 400

        result = Account.getEmailByUser(username)

        if result["status"] == "success":
            return jsonify({"email": result["email"]}), 200
        else:
            return jsonify({"status": "error", "message": result["message"]}), 404
    except Exception as e:
        print(f"Error in getEmailByUser route: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500
    
## USER APIS ##

@app.route('/api/editSkills', methods=['POST'])
def editSkills():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    newSkills = data.get("skills")

    if not username or not loginEmail or not newSkills:
        return jsonify({"status": "error", "message": "Username, loginEmail, and skills are required"}), 400

    account = Account.account_exists(username, loginEmail)
    if not account:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    result = User.editSkills(username, newSkills)

    if result["status"] == "success":
        return jsonify({"status": "success", "updatedSkills": result["updatedSkills"]}), 200
    else:
        return jsonify({"status": "error", "message": result["message"]}), 500


@app.route('/api/getSkills', methods=['POST'])
def get_skills():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    result = User.getSkills(username)

    if result["status"] == "success":
        return jsonify({"status": "success", "skills": result["skills"]}), 200
    else:
        return jsonify({"status": "error", "message": result["message"]}), 500

       
@app.route('/api/editAboutMe', methods=['POST'])
def edit_about_me():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    new_about_me = data.get("newAboutMe")

    if not username or not new_about_me:
        return jsonify({"status": "error", "message": "Both username and newAboutMe are required"}), 400

    # account = Account.account_exists(username, loginEmail)
    # if not account:
    #     return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    result = User.editAboutMe(username, new_about_me)

    if result["status"] == "success":
        return jsonify({"status": "success", "aboutme": result["aboutme"]}), 200
    else:
        return jsonify({"status": "error", "message": result["message"]}), 500

@app.route('/api/getAboutMe', methods=['POST'])
def get_about_me():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")

    if not username or not loginEmail:
        return jsonify({"status": "error", "message": "Username and loginEmail are required"}), 400

    account_exists = Account.account_exists(username, loginEmail)
    if not account_exists:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    result = User.getAboutMe(username, loginEmail)

    if result["status"] == "success":
        return jsonify({"status": "success", "aboutme": result["aboutme"]}), 200
    else:
        return jsonify({"status": "error", "message": result["message"]}), 500

@app.route('/api/editContactInfo', methods=['POST'])
def edit_contact_info():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    newContactInfo = data.get("contactInfo")

    if not username or not newContactInfo:
        return jsonify({"status": "error", "message": "Both username and contactInfo are required"}), 400

    account = Account.account_exists(username, loginEmail)
    if not account:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    result = User.editContactInfo(username, newContactInfo)

    if result["status"] == "success":
        return jsonify({"status": "success", "contactinfo": result["contactinfo"]}), 200
    else:
        return jsonify({"status": "error", "message": result["message"]}), 500
    
@app.route('/api/getContactInfo', methods=['POST'])
def get_contact_info():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")

    if not username or not loginEmail:
        return jsonify({"status": "error", "message": "Username and loginEmail are required"}), 400

    account_exists = Account.account_exists(username, loginEmail)
    if not account_exists:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    result = User.getContactInfo(username, loginEmail)

    if result["status"] == "success":
        return jsonify({"status": "success", "contactinfo": result["contactinfo"]}), 200
    else:
        return jsonify({"status": "error", "message": result["message"]}), 500

@app.route('/api/getUserDetails', methods=['POST'])
def get_user_details():
    try:
        # Parse JSON input
        data = request.json
        username = data.get("username")
        print(f"Received request for username: {username}")

        if not username:
            return jsonify({"status": "error", "message": "Username is required"}), 400

        result = User.getUserDetails(username)

        # Return appropriate response
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 404
    except Exception as e:
        print(f"Error fetching user details: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
## important ##
@app.route('/api/updateUserInfo', methods=['POST'])
def update_user_info():
    data = request.json
    username = data.get("username")
    contact_info = data.get("contactInfo")
    skills = data.get("skills")
    about_me = data.get("aboutMe")

    result = User.updateUserInfo(username, contact_info, skills, about_me)

    if result["status"] == "success":
        return jsonify(result), 200
    else:
        return jsonify(result), 400 if result.get("message") == "Username is required" else 500

    
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
    print('Received Data:', data)  # Log the incoming request
    
    creatorusername = data.get('creatorusername')
    title = data.get('title')
    description = data.get('description')
    tag = data.get('tag')
   
    links= data.get('links', '')
    memberDescription= data.get('memberDescription', '')
    memberLinks= data.get('memberLinks', '')
    memberContact= data.get('memberContact', '')

    if not all([creatorusername, title, description, tag]):
        return jsonify({"error": "Missing required fields: 'creatorusername', 'title', 'description', or 'tag'"}), 400

    creator = Creator(
        username=creatorusername,
        displayName=data.get('displayName', ""),
        loginEmail=data.get('loginEmail', ""),
        password = data.get('password', ""),
        aboutMe=data.get('aboutMe', ""),
        contactInfo=data.get('contactInfo', ""),
        skills=data.get('skills', "")
    )

    # Call the buildProject method, passing required and optional parameters
    result = creator.createProject(creatorusername, title, description, tag, links ,memberDescription, memberLinks, memberContact)

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
    
# @app.route('/deleteProject', methods=['POST'])
# def deleteProject():
#     data = request.json
#     creatorusername = data.get('creatorusername')
#     title = data.get('title')

#     result = Project.deleteProject(creatorusername, title)

#     # Check if the result is an error
#     if "error" in result:
#         return jsonify(result), 400  # 400 for bad request (like duplicate entry)
#     else:
#         return jsonify(result), 201  # 201 for successful creation
    
@app.route('/archiveProject', methods=['POST'])
def archiveProject():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')

    if not creatorusername or not title:
        return jsonify({"error": "Missing creatorusername or title"}), 400

    result = Creator.archiveProject(creatorusername, title)

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

    result = Creator.unarchiveProject(creatorusername, title)

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
    
@app.route('/verifyMembership', methods=['POST', 'OPTIONS'])
def verifyMembership():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
    
    data = request.json
    memberusername = data.get('membersusername')
    creatorusername = data.get('creatorusername')
    title = data.get('title')

    # Check if any of the required fields are missing
    if not memberusername or not creatorusername or not title:
        return jsonify({"error": "Missing memberusername, creatorusername, or title"}), 400

    try:
        # Call the method in the Member model to check if the member is part of the project
        in_project = Member.verifyMembership(memberusername, title, creatorusername)

        if in_project:
            return jsonify({"status": "success", "message": f"Member {memberusername} is in the project {title}."}), 200
        else:
            return jsonify({"status": "failure", "message": f"Member {memberusername} is not in the project {title}."}), 404
    except Exception as e:
        print(f"Error checking joined project info: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/removeNotification', methods=['POST'])
def removeNotification():
    data = request.json
    notif_id = data.get('notificationid')
    result = Notification.removeNotification(notif_id)
    if result["status"] == "error":
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation

@app.route('/acceptNotification', methods=['POST'])
def acceptNotification():
    data = request.json
    notif_id = data.get('notificationid')
    result = Notification.acceptNotification(notif_id)
    if result["status"] == "error":
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation

@app.route('/retrieveNotifications', methods=['POST'])
def retrieveNotifications():
    data = request.json
    user = data.get('username')
    result = Notification.retrieveNotifications(user)
    if len(result)== 0:
        return result, 400   # 400 for bad request (like duplicate entry)
    else:
        return result, 201  # 201 for successful creation        

@app.route('/sendNotification', methods=['POST'])
def sendNotification():
    data = request.json
    touser = data.get('touserid')
    fromuser = data.get('fromuserid')
    type = data.get('messagetype')
    title = data.get('projectitle')
    result = Notification.sendNotification(touser, fromuser, type, title)
    if result["status"] == "error":
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation

'''
    Bookmark()

    Flask routes relating to the Bookmarks python class. Currently the data is coming
    in from postman and should be altered to recieve the information from the fronend.
    Currently only have add bookmark, retrieve bookmark, and view all bookmarks.
'''

@app.route('/verifyBookmark', methods=['POST'])
def verifyBookmark():
    data = request.json
    user = data.get('username')
    post = data.get('title')
    post_creator = data.get('creatorusername')
    user_bookmark = Bookmark(user)
    result = {"status": "success", "result": user_bookmark.verifyBookmark(post, post_creator)}
    return jsonify(result), 201

@app.route('/addBookmark', methods=['POST'])
def addBookmark():
    data = request.json
    user = data.get('username')
    post = data.get('title')
    post_creator = data.get('creatorusername')
    user_bookmark = Bookmark(user)
    result = user_bookmark.addBookmark(post, post_creator)
    if result["status"] == "error":
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation

@app.route('/retrieveBookmarks', methods=['POST'])
def retrieveBookmarks():
    data = request.json
    user = data.get('username')
    user_bookmark = Bookmark(user)
    print(user_bookmark.username, " Bookmarks: ")
    result = user_bookmark.retrieveBookmarks()

    print(result)
    if len(result) == 0 :
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 200  # 201 for successful creation

@app.route('/deleteBookmark', methods=['POST'])
def deleteBookmark():
    data = request.json
    user = data.get('username')
    post = data.get('title')
    post_creator = data.get('creatorusername')
    user_bookmark = Bookmark(user)
    result = user_bookmark.deleteBookmark(post, post_creator)
    if result["status"] == "error":
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation

@app.route('/projects/by_member', methods=['POST'])
def get_projects_by_member():
    data = request.json
    username = data.get('username')
    
    if not username:
        return jsonify({"error": "Username is required"}), 400

    result = Member.get_projects_by_member(username)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result), 200


if __name__ == "__main__":
    app.run(port=5001, debug=True)
