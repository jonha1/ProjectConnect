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

    def deleteProject(self, creatorusername, title):
        pass

    def inviteUser(self, username):
        pass

    def createProject(self, creatorusername, title, description):
        pass