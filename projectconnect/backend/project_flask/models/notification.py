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

    @staticmethod
    def verifyNotifExists(ToUserID, FromUser, MessageType, Title):
        try:
            with Notification.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    #see if that user already sent a notif
                    verify_query = """
                        SELECT * FROM notifications
                        WHERE touserid = %s
                        and fromuserid = %s
                        and messagetype = %s
                        and title = %s
                    """
                    cursor.execute(verify_query, (ToUserID, FromUser, MessageType, Title))
                    exists = cursor.fetchone()
                    if exists is None:
                        return False
                    return True
        except Exception as e:
            print(f"Error verifying if Notification has already been sent: {e}")
            return {"status":"error", "error": str(e)}

    @staticmethod
    def sendNotification(ToUserID, FromUser, MessageType, Title):
        try:
            with Notification.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    if Notification.verifyNotifExists(ToUserID, FromUser, MessageType, Title):
                        return {"status": "success", "result": "notification has already been sent"}
                    #Invite: check to see the toUser is already in the members
                    if MessageType == "Invite":
                        cursor.execute("""
                            SELECT FROM joinedprojects
                            WHERE membersusername = %s
                            and creatorusername = %s 
                            and projecttitle = %s
                        """, (ToUserID, FromUser, Title))
                        exists = cursor.fetchone()
                        if exists is not None:
                            return {"status": "success", "result": "Invited user is already in the project"}
                        print("Invitee not in the project already")
                    #Join: check to see if the fromUser is already in the members
                    elif MessageType == "Join":
                        cursor.execute("""
                            SELECT FROM joinedprojects
                            WHERE membersusername = %s
                            and creatorusername = %s 
                            and projecttitle = %s
                        """, (FromUser, ToUserID, Title))
                        exists = cursor.fetchone()
                        if exists is not None:
                            return {"status": "success", "result": "You have already joined the project"}
                        print("Joiner not in the project already")
                    # all checks passed, can now send notif to the recipient
                    postgres_insert_query = """ 
                        INSERT INTO notifications 
                        (touserid, fromuserid, messagetype, title) 
                        VALUES (%s, %s, %s, %s) RETURNING *;
                    """
                    row_to_insert = (ToUserID, FromUser, MessageType, Title)
                    cursor.execute(postgres_insert_query, row_to_insert)
                    full_row = cursor.fetchone()
                    conn.commit()
                    return {"status": "success", "result": "notification sent!"}
        except Exception as e:
            print(f"Error sending notification: {e}")
            return {"status":"error", "error": str(e)}

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

    @staticmethod
    def checkProjectExist(ToUserID,FromUserID, messageType, title):
        try:
            with Notification.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    if messageType == "Invite":
                        cursor.execute("""
                            SELECT * FROM projects
                            WHERE creatorusername = %s
                            and title = %s
                        """,(FromUserID, title))
                        result = cursor.fetchall()
                        print(FromUserID, title, result)
                        return len(result) != 0 
                    elif messageType == "Join":
                        cursor.execute("""
                            SELECT * FROM projects
                            WHERE creatorusername = %s
                            and title = %s
                        """,(ToUserID, title))
                        result = cursor.fetchall()
                        print(ToUserID, title, result)
                        return len(result) != 0
                    else:
                        return True

        except Exception as e:
            print(f"Error checking project existence: {e}")
            return False

    @staticmethod
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
                        project_exists = Notification.checkProjectExist(toUser, fromUser, messageType, title)
                        print(project_exists, title)
                        if not project_exists:
                            print("removing", notificationid)
                            Notification.removeNotification(notificationid)
                        else:
                            notif_dict = {"notificationid":notificationid,
                            "title": title, "messagetype": messageType,
                             "fromuserid": fromUser, "touserid": toUser};
                            allNotifs.append(notif_dict)
                    return allNotifs #list of tuples, each tuple is a row ex. [("Will", timestamp, "Green Energy", "alice")]
        except Exception as e:
            print(f"Error checking notification existence: {e}")
            return []


