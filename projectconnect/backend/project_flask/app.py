from flask_cors import CORS
import psycopg2
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

## ACCOUNT ##
## make sure to find out if account exists 
@app.route('/register', methods=['POST'])
def register_account():
    data = request.json  

    account = Account(
        username=data.get('username'),
        displayName=data.get('displayName'),
        loginEmail=data.get('loginEmail'),
        password=data.get('password')
    )

    result = account.register()

    if 'error' in result:
        return jsonify(result), 400  
    else:
        return jsonify(result), 201 

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    check = data.get("check") 
    password = data.get("password")

    account = None
    
    if "@" in check:
        account = Account( username=None, displayName=None, loginEmail=check,password=None).get_account_by_email() 
    else:
        account = Account(username=check, displayName=None, loginEmail=None, password=None).get_account_by_username()  

    if not account:
        return jsonify({"error": "Incorrect username or email"}), 404

    if account['password'] != password:
        return jsonify({"error": "Incorrect password"}), 401

    # Successful login
    return jsonify({"message": "Login successful", "user": account['username']}), 200


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
    
## important ##
@app.route('/updateProfileFromEdit', methods=['POST'])
def update_profile_from_edit():
    data = request.json
    username = data.get("username")
    column = data.get("column")
    value = data.get("value")

    if not username or not column or value is None:
        return jsonify({"status": "error", "message": "Username, column, and value are required"}), 400

    try:
        user = User(username=username, displayName=None, loginEmail=None, password=None, aboutMe=None, contactInfo=None, skills=None)
        result = user.updateProfileFromEdit(column, value)  

        if "error" in result:
            return jsonify(result), 400  
        else:
            return jsonify(result), 200 
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# @app.route('/api/join-project', methods=['POST'])
# def join_project():
#     data = request.json
#     username = data.get("username")
#     project_title = data.get("project_title")

#     if not username or not project_title:
#         return jsonify({"error": "Missing username or project title"}), 400

#     result = User.join_project(username, project_title)

#     if "error" in result:
#         return jsonify(result), 400
#     else:
#         return jsonify(result), 201

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
def getEmailByUser():
    data = request.json
    username = data.get("username")

    # Validate input
    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    try:
        print(f"Attempting to fetch email for username: {username}")
        
        user = User(username=username, displayName=None, loginEmail=None, password=None, aboutMe=None, contactInfo=None, skills=None)
        
        email_result = user.get_email_by_username()

        if email_result:
            email = email_result['loginemail']
            return jsonify({"email": email}), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404
    except Exception as e:
        print(f"Error in getEmailByUser endpoint: {e}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

    
## USER ##
@app.route('/api/editSkills', methods=['POST'])
def edit_skills():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    newSkills = data.get("skills")

    if not username or not newSkills:
        return jsonify({"error": "Username and skills are required"}), 400

    account = Account(username=username, displayName=None, loginEmail=loginEmail, password=None)

    if not account.account_exists():
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        user = User(username=username, displayName=None, loginEmail=loginEmail, password=None, aboutMe=None, contactInfo=None, skills=None)
        response = user.editSkills(newSkills)

        if response["status"] == "success":
            return jsonify(response), 200
        else:
            return jsonify(response), 400

    except Exception as e:
        print(f"Error in edit_skills API: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

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

    user = User( username=username, displayName=None, loginEmail=loginEmail, password=None, aboutMe=None, contactInfo=None, skills=None)

    result = user.editAboutMe(new_about_me)

    if "status" in result and result["status"] == "success":
        return jsonify(result), 200
    else:
        return jsonify(result), 400

@app.route('/api/getAboutMe', methods=['POST'])
def get_about_me():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")

    account = Account(username=username, loginEmail=loginEmail, password=None)

    if not username or not loginEmail:
        return jsonify({"status": "error", "message": "Username and loginEmail are required"}), 400

    if not account.account_exists():
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        user = User(username=username, displayName=None, loginEmail=loginEmail, password=None, aboutMe=None, contactInfo=None, skills=None)
        
        response = user.getAboutMe()

        if response["status"] == "success":
            return jsonify(response), 200
        else:
            return jsonify(response), 404
    except Exception as e:
        print(f"Error in get_about_me API: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    
@app.route('/api/editContactInfo', methods=['POST'])
def edit_Contact_Info():
    data = request.json
    username = data.get("username")
    loginEmail = data.get("loginEmail")
    newContactInfo = data.get("contactInfo")

    if not username or not newContactInfo:
        return jsonify({"status": "error", "message": "Both username and contactInfo are required"}), 400

    account = Account(username=username, displayName=None, loginEmail=loginEmail, password=None)

    if not account.account_exists(username,loginEmail):
        return jsonify({"error": "Invalid credentials"}), 401
    try:
        user = User(username=username, displayName=None, loginEmail=loginEmail, password=None, aboutMe=None, contactInfo=None, skills=None)

        response = user.editContactInfo(newContactInfo)
        if response:
            return jsonify({"status": "success", "contactinfo": response["contactinfo"]}), 200
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

    account = Account(username=username, displayName=None,loginEmail=loginEmail, password=None)

    account_exists = account.account_exists()  
    if account_exists["status"] != "success":
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    user = User(username=username, displayName=None, loginEmail=loginEmail, password=None, aboutMe=None, contactInfo=None, skills=None)
    contact_info_result = user.getContactInfo()

    if contact_info_result["status"] == "success":
        return jsonify(contact_info_result), 200
    else:
        return jsonify(contact_info_result), 404

## important ##
@app.route('/api/getUserDetails', methods=['POST'])
def get_user_details():
    try:
        data = request.json
        username = data.get("username")
        print(f"Received request for username: {username}")

        if not username:
            return jsonify({"status": "error", "message": "Username is required"}), 400

        user = User(username=username, displayName=None, loginEmail=None, password=None, aboutMe=None, contactInfo=None, skills=None)

        result = user.getUserDetails()

        if result.get("status") == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 404  # User not found or other errors
    except Exception as e:
        print(f"Error fetching user details: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/updateUserInfo', methods=['POST'])
def update_user_info():
    data = request.json
    username = data.get("username")
    contact_info = data.get("contactInfo")
    skills = data.get("skills")
    about_me = data.get("aboutMe")

    user = User(username=username, displayName=None, loginEmail=None, password=None, aboutMe=about_me, contactInfo=contact_info, skills=skills)
    result = user.updateUserInfo(username, contact_info, skills, about_me)

    if result["status"] == "success":
        return jsonify(result), 200
    else:
        return jsonify(result), 400 if result.get("message") == "Username is required" else 500
    
# Project API's
@app.route('/buildProject', methods=['POST'])
def buildProject():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')
    description = data.get('description')
    tag = data.get('tag')
    contact = data.get('contact', None)
    links= data.get('links', None)

    memberDescription= data.get('memberDescription', None)
    memberLinks= data.get('memberLinks', None)
    memberContact= data.get('memberContact', None)
    if not all([creatorusername, title, description, tag]):
        return jsonify({"error": "Missing required fields: 'creatorusername', 'title', 'description', or 'tag'"}), 400
   
    creator = Creator(
        username=creatorusername,
        displayName= None,
        loginEmail= None,
        password = None, 
        aboutMe= None, 
        contactInfo= None,
        skills= None
    )

    # Call the buildProject method, passing required and optional parameters
    result = creator.createProject(title, description, tag, links , contact, memberDescription, memberLinks, memberContact)

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
    
    project = Project(
        creatorusername = creatorusername,
        title = title,
        description = None,
        links = None,
        contact = None,
        memberDescription = None,
        memberLinks = None,
        memberContactInfo = None, 
        dateposted = None,
        isarchived = None,
        tag = None
    )

    result = project.getProjectInfo()

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
    
    project = Project(
        creatorusername = None,
        title = None,
        description = None,
        links = None,
        contact = None,
        memberDescription = None,
        memberLinks = None,
        memberContactInfo = None, 
        dateposted = None,
        isarchived = None,
        tag = tag
    )

    result = project.findProjects(searchQuery)

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
        
        project = Project(
            creatorusername = creatorusername,
            title = None,
            description = None,
            links = None,
            contact = None,
            memberDescription = None,
            memberLinks = None,
            memberContactInfo = None, 
            dateposted = None,
            isarchived = None,
            tag = None
        )

        response = project.get_projects_by_creator()

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
        return jsonify({"status": "failure", "message": "Missing required fields"}), 400

    try:
        # Check if the member is part of the project
        in_project = Member.verifyMembership(memberusername, title, creatorusername)

        # Always return a 200 status with success message
        if in_project:
            return jsonify({
                "status": "success",
                "message": f"Member {memberusername} is in the project {title}."
            }), 200
        else:
            return jsonify({
                "status": "success",
                "message": f"Member {memberusername} is not in the project {title}."
            }), 200
    except Exception as e:
        print(f"Error checking membership: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    
@app.route('/editProject', methods=['POST'])
def edit_project():
    data = request.json
    creatorusername = data.get('creatorusername')
    title = data.get('title')
    new_details = data.get('new_details') 

    if not creatorusername or not title or not new_details:
        return jsonify({"error": "Missing required fields"}), 400

    result = Creator.editPost(creatorusername, title, new_details)

    if "error" in result:
        return jsonify(result), 400
    else:
        return jsonify(result), 200
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

@app.route('/rejectNotification', methods=['POST'])
def rejectNotification():
    data = request.json
    notif_id = data.get('notificationid')
    result = Notification.rejectNotification(notif_id)
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
    return result, 201  # 201 for successful creation        

@app.route('/sendNotification', methods=['POST'])
def sendNotification():
    data = request.json
    touser = data.get('touserid')
    fromuser = data.get('fromuserid')
    messagetype = data.get('messagetype')
    title = data.get('projectitle')
    result = Notification.sendNotification(touser, fromuser, messagetype, title)
    if result["status"] == "error":
        return jsonify(result), 400  # 400 for bad request (like duplicate entry)
    else:
        return jsonify(result), 201  # 201 for successful creation

@app.route('/verifyNotif', methods=['POST'])
def verifyNotif():
    data = request.json
    touser = data.get('touserid')
    fromuser = data.get('fromuserid')
    messagetype = data.get('messagetype')
    title = data.get('projectitle')
    result = Notification.verifyNotifExists(touser, fromuser, messagetype, title)
    return jsonify({"status": "success", "result": result}), 201  # 400 for bad request (like duplicate entry)


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
    print(user)
    user_bookmark = Bookmark(user)
    print(user_bookmark.username, " Bookmarks: ")
    result = user_bookmark.retrieveBookmarks()

    print(result)
    return jsonify(result), 201  # 201 for successful creation

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

@app.route('/updateProjectDetails', methods=['POST', 'OPTIONS'])
def updateProjectDetails():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
    
    # Parse JSON data from the request body
    data = request.json
    creatorusername = data.get('creatorusername', "")
    title = data.get('title', "")
    updates = data.get('updates', {})

    if not creatorusername or not title:
        return jsonify({"status": "error", "message": "Missing required fields: creatorusername or title."}), 400
    
    project = Project(
        creatorusername = creatorusername,
        title = title,
        description = None,
        links = None,
        contact = None,
        memberDescription = None,
        memberLinks = None,
        memberContactInfo = None, 
        dateposted = None,
        isarchived = None,
        tag = None
    )

    result = project.updateProjectDetails(updates)

    # Check if the result is an error
    if "error" in result:
        return jsonify(result), 400  # Bad request if there's an error
    else:
        return jsonify(result), 200  # Return success message with 200 OK



if __name__ == "__main__":
    app.run(port=5001, debug=True)
