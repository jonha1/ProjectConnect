import os
import psycopg2
from psycopg2.extras import RealDictCursor
from .user import User

class Member(User):
    def __init__(self, username, displayName, loginEmail, password, aboutMe, contactInfo, skills):
        super().__init__(username, displayName, loginEmail, password, aboutMe, contactInfo, skills)

    def get_db_connection(self):
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )
    
    def verifyMembership(self, project_title, creator):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT 1 FROM joinedProjects 
                        WHERE membersusername = %s AND projecttitle = %s AND creatorusername = %s
                    """, (self.username, project_title, creator))
                    return cursor.fetchone() is not None
        except Exception as e:
            print(f"Error checking membership: {e}")
            return False
        
    def leaveProject(self, project_title):
        # Remove the user from a project
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        DELETE FROM joinedprojects
                        WHERE membersusername  = %s AND projecttitle = %s
                    """, (self.username, project_title))
                    conn.commit()
                    return {"message": f"User {self.username} left project {project_title} successfully."}
        except Exception as e:
            print(f"Error leaving project: {e}")
            return {"error": str(e)}
    
    def get_projects_by_member(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT p.*
                        FROM joinedprojects jp
                        JOIN projects p ON jp.projecttitle = p.title
                        WHERE jp.membersusername = %s
                        ORDER BY p.dateposted DESC;
                    """, (self.username,))
                    
                    projects = cursor.fetchall()
                return {"status": "success", "projects": projects or []}
        except Exception as e:
            print(f"Error fetching joined projects for member '{self.username}': {e}")
            return {"status": "error", "message": f"Failed to fetch joined projects for member '{self.username}': {str(e)}"}
        
