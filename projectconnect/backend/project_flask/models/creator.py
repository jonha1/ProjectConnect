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

    def inviteUser(self, username):
        pass