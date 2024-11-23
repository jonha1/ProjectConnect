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

    def verifyBookmark(self, title, creatorusername):
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM bookmarks 
                        WHERE username = %s
                        and title = %s
                        and creatorusername = %s
                    """, (self.username, title, creatorusername))
                    result = cursor.fetchone()
                    return result is not None
        except Exception as e:
            print(f"Error checking notification existence: {e}")
            return False

    def addBookmark(self, title, creatorUsername):
        if(self.verifyBookmark(title,creatorUsername)):
            print("bookmark already exists")
            return self.deleteBookmark(title,creatorUsername) 
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
            return {"status": "error", "error": str(e)}

    def retrieveBookmarks(self):
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # Retrieve all bookmarks for the user
                    cursor.execute("""
                        SELECT creatorusername, title FROM bookmarks 
                        WHERE username = %s
                    """, (self.username,))
                    result = cursor.fetchall()

                    all_bookmarks = []
                    for row in result:
                        creator = row['creatorusername']
                        title = row['title']

                        # Retrieve the description of the project
                        cursor.execute("""
                            SELECT description FROM projects 
                            WHERE creatorusername = %s AND title = %s
                        """, (creator, title))
                        project_row = cursor.fetchone()

                        # Handle cases where project description might be missing
                        description = project_row['description'] if project_row else "No description available"

                        # Build the bookmark dictionary
                        bookmark_dict = {
                            "title": title,
                            "description": description,
                            "creatorusername": creator,
                        }
                        print("bookmark dict: ", bookmark_dict)  # Log each bookmark for debugging
                        all_bookmarks.append(bookmark_dict)

                    # Return all bookmarks
                    return {"status": "success", "bookmarks": all_bookmarks}

        except Exception as e:
            print(f"Error retrieving bookmarks: {e}")
            return {"status": "error", "message": "Failed to retrieve bookmarks"}

    def deleteBookmark(self, title, creatorUsername):
        print("deleting the bookmark now")
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    postgres_delete = """
                        DELETE FROM bookmarks 
                        WHERE username = %s
                        and title = %s
                        and creatorusername = %s
                    """
                    cursor.execute(postgres_delete, (self.username, title, creatorUsername,))
                    conn.commit()
                    return {"status": "success", "deleted_post": title}
        except Exception as e:
            print(f"Failure to remove bookmark: {e}")
            return {"status": "error", "error": str(e)}

