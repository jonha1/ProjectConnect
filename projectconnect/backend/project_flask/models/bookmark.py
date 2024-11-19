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
            return {"status": "error", "error": str(e)}

    def retrieveBookmarks(self):
        try:
            with Bookmark.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM bookmarks 
                        WHERE username = %s
                    """, (self.username,))
                    result = cursor.fetchall()
                    print(result)
                    all_bookmarks = []
                    for row in result:
                        print("row: ", row)
                        creator = row['creatorusername']
                        title = row['title']
                        print(creator, title)
                        cursor.execute("""
                        SELECT * FROM projects 
                        WHERE creatorusername = %s
                        and title = %s
                         """, (creator, title))
                        print("-----------------------------")
                        project_row = cursor.fetchone()
                        print(project_row)
                        description = project_row['description']
                        print(description)
                        bookmark_dict = {"title": title, "description": description, "creatorusername": creator}
                        all_bookmarks.append(bookmark_dict)
                    return all_bookmarks #list of tuples, each tuple is a row ex.[ ["alice","Green Energy","testing"], ]
        except Exception as e:
            print(f"Error checking bookmarks existence: {e}")
            return []

    def deleteBookmark(self, title, creatorUsername):
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