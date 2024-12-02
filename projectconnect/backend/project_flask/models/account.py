import os
import psycopg2
from psycopg2.extras import RealDictCursor

class Account:
    def __init__(self, username, displayName, loginEmail, password):
        self.username = username
        self.displayName = displayName
        self.loginEmail = loginEmail
        self.password = password

    def get_db_connection(self):
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )

    def account_exists(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM users 
                        WHERE username = %s OR loginEmail = %s
                    """, (self.username, self.loginEmail))
                    result = cursor.fetchone()
                    return result is not None  
        except Exception as e:
            print(f"Error checking account existence: {e}")
            return False 
    
    def get_email_by_username(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT loginemail FROM users 
                        WHERE username = %s
                    """, (self.username,))
                    result = cursor.fetchone()
                    return result if result else None
        except Exception as e:
            print(f"Error retrieving email by username: {e}")
            return None

    def get_account_by_email(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT username, loginEmail, password FROM users 
                        WHERE loginEmail = %s
                    """, (self.loginEmail,))
                    result = cursor.fetchone()
                    return result if result else None
        except Exception as e:
            print(f"Error retrieving account by email: {e}")
            return None

    def get_account_by_username(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT username, loginEmail, password FROM users 
                        WHERE username = %s
                    """, (self.username,))
                    result = cursor.fetchone()
                    return result if result else None
        except Exception as e:
            print(f"Error retrieving account by username: {e}")
            return None

    def register(self):
        if self.account_exists():
            return {"error": "Account with this username or email already exists."}
        
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO users (username, displayName, loginEmail, password)
                        VALUES (%s, %s, %s, %s) RETURNING *;
                    """, (self.username, self.displayName, self.loginEmail, self.password))
                    new_account = cursor.fetchone()
                    conn.commit()
                    return new_account  
        except Exception as e:
            print(f"Error registering account: {e}")
            return {"error": str(e)}  
