import os
import psycopg2
from psycopg2.extras import RealDictCursor

class User:
    def __init__(self, username, displayName, loginEmail, password, aboutMe, contactInfo, skills):
        self.username = username
        self.displayName = displayName
        self.loginEmail = loginEmail
        self.password = password  
        self.aboutMe = aboutMe
        self.contactInfo = contactInfo
        self.skills = skills

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )
    
    def editSkills(self, new_skills):
        self.skills = new_skills

    def getSkills(self):
        return self.skills

    def editAboutMe(self, new_about_me):
        self.aboutMe = new_about_me

    def getAboutMe(self):
        return self.aboutMe

    def editContactInfo(self, new_contact_info):
        self.contactInfo = new_contact_info

    def getContactInfo(self):
        return self.contactInfo

    def getDisplayName(self):
        return self.displayName

    
    @staticmethod
    def user_exists(username):
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT 1 FROM users 
                        WHERE username = %s
                        LIMIT 1;
                    """, (username,))  # Ensure the parameter is passed as a tuple
                    result = cursor.fetchone()
                    return result is not None  # True if user exists, False otherwise
        except Exception as e:
            print(f"Error checking user existence for username '{username}': {e}")
            return False

    
    @staticmethod
    def updateProfileFromEdit(username, column, value):
        allowed_columns = {"aboutme", "contactinfo", "skills"}
    
        if column not in allowed_columns:
            return {"status": "error", "message": "Invalid column specified."}
    
        if not User.user_exists(username):
            return {"status": "error", "message": f"User '{username}' does not exist."}
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # Use dynamic SQL safely by specifying the column name
                    query = f"""
                        UPDATE users 
                        SET {column} = %s
                        WHERE username = %s
                    """
                    cursor.execute(query, (value, username))
                    if cursor.rowcount > 0:  # Check if any rows were updated
                        conn.commit()
                        return {"status": "success", "message": f"{column} updated successfully."}
                    else:
                        return {"status": "error", "message": "No rows updated. Please check the username and column."}
        except Exception as e:
            print(f"Error updating column '{column}' for user '{username}': {e}")
            return {"status": "error", "message": f"Failed to update column '{column}' for user '{username}': {str(e)}"}

       

    def join_project(username, project_title):
        from project_flask.models.member import Member
        # Check if the user is already a member of the project
        if Member.inProject(username, project_title):
            return {"error": "User is already a member of this project."}
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT creatorusername FROM projects
                        WHERE title = %s
                    """, (project_title,))
                    creator_result = cursor.fetchone()
                    
                    if not creator_result:
                        return {"error": "Project not found."}
                    
                    creatorname = creator_result['creatorusername']

                    cursor.execute("""
                        INSERT INTO joinedprojects (membersusername, creatorusername, projecttitle, datejoined)
                        VALUES (%s, %s, %s, CURRENT_TIMESTAMP) RETURNING *;
                    """, (username, creatorname, project_title))
                    
                    new_membership = cursor.fetchone()
                    conn.commit()
                    return new_membership
        except Exception as e:
            print(f"Error joining project: {e}")
            return {"error": str(e)}


    
        
