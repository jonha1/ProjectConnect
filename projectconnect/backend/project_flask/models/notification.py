import os
import psycopg2
from psycopg2.extras import RealDictCursor

class Notification:
    def __init__(self, toUser=None, fromUser=None, messageType=None, title=None):
        self.notificationID = None
        self.toUser = toUser
        self.fromUser = fromUser
        self.messageType = messageType
        self.title = title
        self.dateSent = None

    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )

    def sendNotification(ToUserID, FromUser, MessageType, Title):
        #self.toUser = ToUserID
        #self.messageType = MessageType
        #self.title = Title
        try:
            with Notification.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    postgres_insert_query = """ 
                        INSERT INTO notifications 
                        (touserid, fromuserid, messagetype, title) 
                        VALUES (%s, %s, %s, %s) RETURNING *;
                    """
                    row_to_insert = (ToUserID, FromUser, MessageType, Title)
                    cursor.execute(postgres_insert_query, row_to_insert)
                    full_row = cursor.fetchone()
                    #self.notificationID = full_row[0]
                    #self.dateSent = full_row[5]
                    conn.commit()
                    return {"status": "success", "notification": full_row}
        except Exception as e:
            print(f"Error sending notification: {e}")
            return {"error": str(e)}

    def retrieveNotifications(username):
        try:
            with Notification.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM notifications 
                        WHERE touserid = %s
                    """, (username,))
                    result = cursor.fetchall()
                    return result #list of tuples, each tuple is a row ex. [("Will", timestamp, "Green Energy", "alice")]
        except Exception as e:
            print(f"Error checking bookmarks existence: {e}")
            return []

    @staticmethod
    def verifyNotification(notificationID):
        try:
            with Notification.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM notifications 
                        WHERE notificationid = %s
                    """, (notificationID,))
                    result = cursor.fetchone()
                    return result is not None
        except Exception as e:
            print(f"Error checking notification existence: {e}")
            return False

    @staticmethod
    def rejectNotification(notificationID):
        if Notification.verifyNotification(notificationID):
            try:
                with Notification.get_db_connection() as conn:
                    with conn.cursor() as cursor:
                        postgres_delete = """
                            DELETE FROM notifications 
                            WHERE notificationid = %s
                        """
                        cursor.execute(postgres_delete, (notificationID,))
                        conn.commit()
                        return {"status": "success", "deleted": notificationID}
            except Exception as e:
                print(f"Failure to remove notification: {e}")
                return {"error": str(e)}

    @staticmethod
    def acceptNotification(notificationID):
        if Notification.verifyNotification(notificationID):
            try:
                with Notification.get_db_connection() as conn:
                    with conn.cursor() as cursor:

                        postgres_get = """
                            SELECT * FROM notifications 
                            WHERE notificationid = %s
                        """
                        cursor.execute(postgres_get, (notificationID,))
                        full_row = cursor.fetchone()
                        '''
                        using the full_row, need to manipulate the the associating
                        projects object with the senders id and add to the members 
                        the recipient user id of this notification.

                        '''
                        postgres_delete = """
                            DELETE FROM notifications 
                            WHERE notificationid = %s
                        """
                        cursor.execute(postgres_delete, (notificationID,))
                        conn.commit()
                        return {"status": "success", "deleted": notificationID}
            except Exception as e:
                print(f"Failure to remove notification: {e}")
                return {"error": str(e)}
