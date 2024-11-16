import os
import psycopg2
from psycopg2.extras import RealDictCursor
from project_flask.models.project import Project

class Bookmark:
    def __init__(self, user):
        self.username = user
        #self.bookmarkedPost = set() # post objects

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )

    def addBookmark(self, title, creatorUsername):
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    postgres_insert_query = """ 
                        INSERT INTO bookmarks 
                        (username, title, creatorusername) 
                        VALUES (%s, %s, %s) RETURNING *;
                    """
                    row_to_insert = (self.username, title, creatorUsername)
                    cursor.execute(postgres_insert_query, row_to_insert)
                    full_row = cursor.fetchone()
                    conn.commit()
                    print("got here")
                    return {"status": "success", "bookmark": full_row}
        except Exception as e:
            print(f"Error adding bookmark: {e}")
            return {"error": str(e)}

    @staticmethod
    def retrieveBookmarks(self):
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM bookmarks 
                        WHERE username = %s
                    """, (self.username,))
                    result = cursor.fetchall()
                    return result #list of tuples, each tuple is a row ex. [("Will", timestamp, "Green Energy", "alice")]
        except Exception as e:
            print(f"Error checking bookmarks existence: {e}")
            return False

    @staticmethod
    def removeBookmark(title, creatorUsername):
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    postgres_delete = """
                        DELETE FROM bookmarks 
                        WHERE username = %s,
                        title = %s,
                        creatorusername = %s
                    """
                    cursor.execute(postgres_delete, (self.username, title, creatorUsername,))
                    conn.commit()
                    return {"status": "success", "deleted_post": title}
        except Exception as e:
            print(f"Failure to remove bookmark: {e}")
            return {"error": str(e)}