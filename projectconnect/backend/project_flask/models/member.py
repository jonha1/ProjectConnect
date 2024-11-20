import os
import psycopg2
from psycopg2.extras import RealDictCursor
from project_flask.models.user import User

class Member(User):
    def __init__(self, username, displayName, loginEmail, password, aboutMe, contactInfo, skills):
        super().__init__(username, displayName, loginEmail, password, aboutMe, contactInfo, skills)

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )
    
    def verifyMembership(username, project_title, creator):
        try:
            with Member.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT 1 FROM joinedProjects 
                        WHERE membersusername = %s AND projecttitle = %s AND creatorusername = %s
                    """, (username, project_title, creator))
                    return cursor.fetchone() is not None
        except Exception as e:
            print(f"Error checking membership: {e}")
            return False
        
    @staticmethod
    def leaveProject(username, project_title):
        # Remove the user from a project
        try:
            with Member.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        DELETE FROM joinedprojects
                        WHERE membersusername  = %s AND projecttitle = %s
                    """, (username, project_title))
                    conn.commit()
                    return {"message": f"User {username} left project {project_title} successfully."}
        except Exception as e:
            print(f"Error leaving project: {e}")
            return {"error": str(e)}