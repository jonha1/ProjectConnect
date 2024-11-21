import os
import psycopg2
from psycopg2.extras import RealDictCursor

class Notification:
    def __init__(self, toUser=None, fromUser=None, messageType=None, title=None):
        self.toUser = toUser
        self.fromUser = fromUser
        self.messageType = messageType
        self.title = title

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
                        ORDER BY datesent
                    """, (username,))
                    result = cursor.fetchall()
                    allNotifs = []
                    for row in result:
                        fromUser = row['fromuserid']
                        toUser = row['touserid'] 
                        messageType = row['messagetype']
                        title = row['title']
                        notificationid = row['notificationid']
                        notif_dict = {"notificationid":notificationid,
                        "title": title, "messagetype": messageType,
                         "fromuserid": fromUser, "touserid": toUser};
                        allNotifs.append(notif_dict)
                    return allNotifs #list of tuples, each tuple is a row ex. [("Will", timestamp, "Green Energy", "alice")]
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
    def removeNotification(notificationID):
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
                return {"status": "error", "error": str(e)}

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
                        
                        if full_row['messagetype'] == 'Invite':
                            member = full_row['touserid']
                            creator = full_row['fromuserid']
                            title = full_row['title']
                            result = cursor.execute("""
                                INSERT into joinedprojects
                                (membersusername, creatorusername, projecttitle)
                                VALUES (%s, %s, %s) RETURNING *
                            """, (member, creator, title))
                        elif full_row['messagetype'] == 'Join':
                            member = full_row['fromuserid']
                            creator = full_row['touserid']
                            title = full_row['title']
                            result = cursor.execute("""
                                INSERT INTO joinedprojects
                                (membersusername, creatorusername, projecttitle)
                                VALUES (%s, %s, %s) RETURNING *
                            """, (member, creator, title))
                        '''
                        else if full_row['messagetype'] == [new notification types]:

                        '''    
                        return {"status": "success", "Project added": title}
            except Exception as e:
                print(f"Failure to remove notification: {e}")
                return {"status": "error", "error": str(e)}
