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
    
    @staticmethod
    def editSkills(username, new_skills):
        # Parse and clean the new skills
        skills_list = [skill.strip() for skill in new_skills.split(",") if skill.strip()]
        all_skills = ", ".join(skills_list)

        try:
            with User.get_db_connection() as conn:
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

            return {"status": "success", "updatedSkills": all_skills}

        except Exception as e:
            print(f"Error updating skills: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def getSkills(username):
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT skills FROM users WHERE username = %s
                        """,
                        (username,)
                    )
                    result = cursor.fetchone()

            if result:
                return {"status": "success", "skills": result["skills"]}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error fetching skills for user {username}: {e}")
            return {"status": "error", "message": str(e)}


    @staticmethod
    def editAboutMe(username, new_about_me):
        try:
            with User.get_db_connection() as conn:
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
                return {"status": "success", "aboutme": updated_record["aboutme"]}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error updating aboutMe for user {username}: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def getAboutMe(username, loginEmail):
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT aboutme FROM users WHERE username = %s AND loginEmail = %s
                        """,
                        (username, loginEmail)
                    )
                    result = cursor.fetchone()

            if result and "aboutme" in result:
                return {"status": "success", "aboutme": result["aboutme"]}
            else:
                return {"status": "error", "message": "No aboutMe found for the user"}
        except Exception as e:
            print(f"Error fetching aboutMe for user {username}: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def editContactInfo(username, new_contact_info):
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE users 
                        SET contactinfo = %s 
                        WHERE username = %s
                        RETURNING contactinfo;
                        """,
                        (new_contact_info, username)
                    )
                    updated_record = cursor.fetchone()
                    conn.commit()

            if updated_record:
                return {"status": "success", "contactinfo": updated_record["contactinfo"]}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error updating contact info for user {username}: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def getContactInfo(username, loginEmail):
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT contactinfo FROM users WHERE username = %s AND loginEmail = %s
                        """,
                        (username, loginEmail)
                    )
                    result = cursor.fetchone()

            if result and "contactinfo" in result:
                return {"status": "success", "contactinfo": result["contactinfo"]}
            else:
                return {"status": "error", "message": "No contact info found for the user"}
        except Exception as e:
            print(f"Error fetching contact info for user {username}: {e}")
            return {"status": "error", "message": str(e)}
    
    @staticmethod
    def getUserDetails(username):
        try:
            with User.get_db_connection() as conn:
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                    cursor.execute("""
                        SELECT displayname, loginemail, aboutme, contactinfo, skills
                        FROM users
                        WHERE username = %s
                    """, (username,))
                    result = cursor.fetchone()

            if result:
                return {"status": "success", **result}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error fetching details for user {username}: {e}")
            return {"status": "error", "message": str(e)}

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
        
    @staticmethod
    def updateUserInfo(username, contact_info, skills, about_me):
        if not username:
            return {"status": "error", "message": "Username is required"}
        
        try:
            with User.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE users 
                        SET contactinfo = %s, skills = %s, aboutme = %s 
                        WHERE username = %s
                        """,
                        (contact_info, skills, about_me, username)
                    )
                    conn.commit()
            return {"status": "success", "message": "User info updated successfully"}
        except Exception as e:
            print(f"Error updating user info for {username}: {e}")
            return {"status": "error", "message": str(e)}


       

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


    
        