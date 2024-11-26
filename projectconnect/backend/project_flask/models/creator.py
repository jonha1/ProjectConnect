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

    @staticmethod
    def archiveProject(creatorusername, title):
        return Project.archiveProject(creatorusername, title)
    
    @staticmethod
    def unarchiveProject(creatorusername, title):
        return Project.unarchiveProject(creatorusername, title)

    @staticmethod
    def editPost(creatorusername, title, new_details):
        try:
            with Creator.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # Check if the project exists and is owned by the creator
                    cursor.execute("""
                        SELECT * FROM projects
                        WHERE creatorusername = %s AND title = %s;
                    """, (creatorusername, title))
                    project = cursor.fetchone()

                    if not project:
                        return {"error": f"Project '{title}' by '{creatorusername}' does not exist."}

                    # Update the project with new details
                    update_fields = []
                    update_values = []

                    for key, value in new_details.items():
                        if value is not None:  # Only update fields with new values
                            update_fields.append(f"{key} = %s")
                            update_values.append(value)

                    if update_fields:
                        query = f"""
                            UPDATE projects
                            SET {', '.join(update_fields)}
                            WHERE creatorusername = %s AND title = %s
                            RETURNING *;
                        """
                        cursor.execute(query, update_values + [creatorusername, title])
                        updated_project = cursor.fetchone()
                        conn.commit()

                        return {"status": "success", "project": updated_project}
                    else:
                        return {"error": "No new details provided to update."}

        except Exception as e:
            print(f"Error updating project '{title}' by '{creatorusername}': {e}")
            return {"error": f"An error occurred: {str(e)}"}


    def createProject(self, creatorusername, title, description, tag, links, contact, memberDescription, memberLinks, memberContact):
        try:

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

