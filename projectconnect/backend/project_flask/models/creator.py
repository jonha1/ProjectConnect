import os
import psycopg2
from psycopg2.extras import RealDictCursor
from project_flask.models.member import Member
from project_flask.models.project import Project


class Creator(Member):
    def __init__(self, username, displayName, loginEmail, password, aboutMe, contactInfo, skills):
        super().__init__(username, displayName, loginEmail, password, aboutMe, contactInfo, skills)

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )
    
    @staticmethod
    def deleteProject(creatorusername, title):
        return Project.deleteProject(creatorusername, title)
      
    def createProject(self, creatorusername, title, description, tag, links, contact, memberDescription, memberLinks, memberContact):
        try:
            # Validate that the creator exists in the database
            # with self.get_db_connection() as conn:
            #     with conn.cursor() as cursor:
            #         cursor.execute("""
            #             SELECT * FROM creators WHERE username = %s
            #         """, (creatorusername,))
            #         creator = cursor.fetchone()

            #         if not creator:
            #             return {"error": "Creator does not exist. Please register first."}

            # Delegate project creation to the Project class
            project_result = Project.buildProject(creatorusername, title, description,tag, links, contact ,memberDescription, memberLinks, memberContact)

            if "error" in project_result:
                return project_result  # Return any errors from the Project class

            return {
                "status": "success",
                "message": f"Project '{title}' created successfully.",
                "project": project_result.get("project"),
            }

        except Exception as e:
            print(f"Error in createProject: {e}")
            return {"error": f"Failed to create project: {str(e)}"}

    @staticmethod
    def archiveProject(creatorusername, title):
        return Project.archiveProject(creatorusername, title)
    
    @staticmethod
    def unarchiveProject(creatorusername, title):
        return Project.unarchiveProject(creatorusername, title)

    def inviteUser(self, username):
        pass