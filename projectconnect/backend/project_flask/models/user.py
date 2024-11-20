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


    # def removeBookmark(self, creator_username, title):

    # def addBookmark(self, creator_username, title):


    
        
