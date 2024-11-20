import os
import psycopg2
from psycopg2.extras import RealDictCursor
from project_flask.models.member import Member

class Creator(Member):
    def __init__(self, username, displayName, loginEmail, password, aboutMe, contactInfo, skills):
        super().__init__(username, displayName, loginEmail, password, aboutMe, contactInfo, skills)

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )

    # Placeholder methods
    def archiveProject(self, creatorusername, title):
        pass

    #Delete a project from the database
    def deleteProject(self, creatorusername, title):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # Check if the project exists and the creator matches
                    cursor.execute("""
                        SELECT * FROM projects
                        WHERE creatorusername = %s AND title = %s
                    """, (creatorusername, title))
                    
                    project = cursor.fetchone()
                    
                    if not project:
                        return {"error": f"Project '{title}' not found or you are not the creator."}
                    
                    # Delete the project
                    cursor.execute("""
                        DELETE FROM projects
                        WHERE creatorusername = %s AND title = %s
                    """, (creatorusername, title))
                    
                    conn.commit()
                    return {"message": f"Project '{title}' deleted successfully."}
        except Exception as e:
            print(f"Error deleting project: {e}")
            return {"error": str(e)}

    def inviteUser(self, username):
        pass

    def createProject(self, creatorusername, title, description):
        pass