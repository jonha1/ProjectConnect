import os
import psycopg2
from psycopg2.extras import RealDictCursor

class Account:
    def __init__(self, username, loginEmail, password):
        self.username = username
        self.loginEmail = loginEmail
        self.password = password

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )

    @staticmethod
    def account_exists(username, loginEmail):
        try:
            with Account.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM users 
                        WHERE username = %s OR loginEmail = %s
                    """, (username, loginEmail))
                    result = cursor.fetchone()
                    return result is not None  
        except Exception as e:
            print(f"Error checking account existence: {e}")
            return False 

    @staticmethod
    def register(username, loginEmail, password):
        if Account.account_exists(username, loginEmail):
            return {"error": "Account with this username or email already exists."}
        
        try:
            with Account.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO users (username, loginEmail, password)
                        VALUES (%s, %s, %s) RETURNING *;
                    """, (username, loginEmail, password))
                    new_account = cursor.fetchone()
                    conn.commit()  
                    return new_account  
        except Exception as e:
            print(f"Error registering account: {e}")
            return {"error": str(e)}  

