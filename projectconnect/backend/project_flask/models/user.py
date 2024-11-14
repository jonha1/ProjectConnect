import os
import psycopg2
from psycopg2.extras import RealDictCursor

#@staticmethod should only be used for methods that don’t need access to instance-specific data (i.e., don’t use self)
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
    
    def editSkills(self, new_skills):
        self.skills = new_skills

    def getSkills(self):
        return self.skills

    def editAboutMe(self, new_about_me):
        self.aboutMe = new_about_me

    def getAboutMe(self):
        return self.aboutMe

    def editContactInfo(self, new_contact_info):
        self.contactInfo = new_contact_info

    def getContactInfo(self):
        return self.contactInfo

    def getDisplayName(self):
        return self.displayName
    
    def addBookmark(self, creator_username, title):

    def removeBookmark(self, creator_username, title):

    def joinProject(self, creator_username, title):
        