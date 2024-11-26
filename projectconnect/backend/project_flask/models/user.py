import os
import psycopg2
from psycopg2.extras import RealDictCursor

class User:
    def __init__(self, username=None, displayName=None, loginEmail=None, password=None, aboutMe=None, contactInfo=None, skills=None):
        self.username = username
        self.displayName = displayName
        self.loginEmail = loginEmail
        self.password = password
        self.aboutMe = aboutMe
        self.contactInfo = contactInfo
        self.skills = skills

    def get_db_connection(self):
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )

    def editSkills(self, new_skills):
        skills_list = [skill.strip() for skill in new_skills.split(",") if skill.strip()]
        all_skills = ", ".join(skills_list)

        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE users
                        SET skills = %s
                        WHERE username = %s
                        """,
                        (all_skills, self.username)
                    )
                    conn.commit()

            self.skills = all_skills
            return {"status": "success", "updatedSkills": all_skills}

        except Exception as e:
            print(f"Error updating skills for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def getSkills(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT skills FROM users WHERE username = %s
                        """,
                        (self.username,)
                    )
                    result = cursor.fetchone()

            if result:
                return {"status": "success", "skills": result["skills"]}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error fetching skills for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def editAboutMe(self, new_about_me):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE users 
                        SET aboutme = %s 
                        WHERE username = %s
                        RETURNING aboutme;
                        """,
                        (new_about_me, self.username)
                    )
                    updated_record = cursor.fetchone()
                    conn.commit()

            if updated_record:
                self.aboutMe = updated_record["aboutme"]
                return {"status": "success", "aboutme": self.aboutMe}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error updating aboutMe for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def getAboutMe(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT aboutme FROM users WHERE username = %s
                        """,
                        (self.username,)
                    )
                    result = cursor.fetchone()

            if result and "aboutme" in result:
                return {"status": "success", "aboutme": result["aboutme"]}
            else:
                return {"status": "error", "message": "No aboutMe found for the user"}
        except Exception as e:
            print(f"Error fetching aboutMe for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def editContactInfo(self, new_contact_info):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE users 
                        SET contactinfo = %s 
                        WHERE username = %s
                        RETURNING contactinfo;
                        """,
                        (new_contact_info, self.username)
                    )
                    updated_record = cursor.fetchone()
                    conn.commit()

            if updated_record:
                self.contactInfo = updated_record["contactinfo"]
                return {"status": "success", "contactinfo": self.contactInfo}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error updating contact info for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def getContactInfo(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT contactinfo FROM users WHERE username = %s
                        """,
                        (self.username,)
                    )
                    result = cursor.fetchone()

            if result and "contactinfo" in result:
                return {"status": "success", "contactinfo": result["contactinfo"]}
            else:
                return {"status": "error", "message": "No contact info found for the user"}
        except Exception as e:
            print(f"Error fetching contact info for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def getUserDetails(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                    cursor.execute("""
                        SELECT displayname, loginemail, aboutme, contactinfo, skills
                        FROM users
                        WHERE username = %s
                    """, (self.username,))
                    result = cursor.fetchone()

            if result:
                return {"status": "success", **result}
            else:
                return {"status": "error", "message": "User not found"}
        except Exception as e:
            print(f"Error fetching details for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def user_exists(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT 1 FROM users 
                        WHERE username = %s
                        LIMIT 1;
                    """, (self.username,))
                    result = cursor.fetchone()
                    return result is not None  
        except Exception as e:
            print(f"Error checking user existence for {self.username}: {e}")
            return False

    def updateProfileFromEdit(self, column, value):
        allowed_columns = {"aboutme", "contactinfo", "skills"}
    
        if column not in allowed_columns:
            return {"status": "error", "message": "Invalid column specified."}
    
        if not self.user_exists():
            return {"status": "error", "message": f"User '{self.username}' does not exist."}
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    query = f"""
                        UPDATE users 
                        SET {column} = %s
                        WHERE username = %s
                    """
                    cursor.execute(query, (value, self.username))
                    if cursor.rowcount > 0:
                        conn.commit()
                        return {"status": "success", "message": f"{column} updated successfully."}
                    else:
                        return {"status": "error", "message": "No rows updated."}
        except Exception as e:
            print(f"Error updating column '{column}' for {self.username}: {e}")
            return {"status": "error", "message": str(e)}

    def updateUserInfo(self, contact_info, skills, about_me):
        """Update multiple user details at once."""
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE users 
                        SET contactinfo = %s, skills = %s, aboutme = %s 
                        WHERE username = %s
                        """,
                        (contact_info, skills, about_me, self.username)
                    )
                    conn.commit()
            self.contactInfo = contact_info
            self.skills = skills
            self.aboutMe = about_me
            return {"status": "success", "message": "User info updated successfully"}
        except Exception as e:
            print(f"Error updating user info for {self.username}: {e}")
            return {"status": "error", "message": str(e)}
