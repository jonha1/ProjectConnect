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

    def verifyNotifExists(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    #see if that user already sent a notif
                    verify_query = """
                        SELECT * FROM notifications
                        WHERE touserid = %s
                        and fromuserid = %s
                        and messagetype = %s
                        and title = %s
                    """
                    cursor.execute(verify_query, (self.toUser, self.fromUser, self.messageType, self.title))
                    exists = cursor.fetchone()
                    if exists is None:
                        return False
                    return True
        except Exception as e:
            print(f"Error verifying if Notification has already been sent: {e}")
            return {"status":"error", "error": str(e)}

    def sendNotification(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    if self.verifyNotifExists():
                        return {"status": "success", "result": "notification has already been sent"}
                    #Invite: check to see the toUser is already in the members
                    if self.messageType == "Invite":
                        cursor.execute("""
                            SELECT FROM joinedprojects
                            WHERE membersusername = %s
                            and creatorusername = %s 
                            and projecttitle = %s
                        """, (self.toUser, self.fromUser, self.title))
                        exists = cursor.fetchone()
                        if exists is not None:
                            return {"status": "success", "result": "Invited user is already in the project"}
                        #print("Invitee not in the project already")
                    #Join: check to see if the fromUser is already in the members
                    elif self.messageType == "Join":
                        cursor.execute("""
                            SELECT FROM joinedprojects
                            WHERE membersusername = %s
                            and creatorusername = %s 
                            and projecttitle = %s
                        """, (self.fromUser, self.toUser, self.title))
                        exists = cursor.fetchone()
                        if exists is not None:
                            return {"status": "success", "result": "You have already joined the project"}
                        #print("Joiner not in the project already")
                    # all checks passed, can now send notif to the recipient
                    postgres_insert_query = """ 
                        INSERT INTO notifications 
                        (touserid, fromuserid, messagetype, title) 
                        VALUES (%s, %s, %s, %s) RETURNING *;
                    """
                    row_to_insert = (self.toUser, self.fromUser, self.messageType, self.title)
                    cursor.execute(postgres_insert_query, row_to_insert)
                    full_row = cursor.fetchone()
                    conn.commit()
                    return {"status": "success", "result": "notification sent!"}
        except Exception as e:
            print(f"Error sending notification: {e}")
            return {"status":"error", "error": str(e)}

    def retrieveNotifications(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM notifications 
                        WHERE touserid = %s
                        ORDER BY datesent
                    """, (self.toUser,))
                    result = cursor.fetchall()
                    allNotifs = []
                    for row in result:
                        fromUser = row['fromuserid']
                        toUser = row['touserid'] 
                        messageType = row['messagetype']
                        title = row['title']
                        notificationid = row['notificationid']
                        creator = ''
                        if messageType == 'Invite':
                            creator = fromUser
                        elif messageType == 'Join':
                            creator = toUser
                        elif "Invite Request" in messageType:
                            creator = toUser
                        elif "Join Request" in messageType:
                            creator = creator = fromUser
                        notif_dict = {"notificationid":notificationid,
                        "title": title, "messagetype": messageType,
                         "fromuserid": fromUser, "touserid": toUser, "creator": creator};
                        allNotifs.append(notif_dict)
                    return allNotifs #list of tuples, each tuple is a row ex. [("Will", timestamp, "Green Energy", "alice")]
        except Exception as e:
            print(f"Error checking bookmarks existence: {e}")
            return []

    def verifyNotification(self, notificationID):
        try:
            with self.get_db_connection() as conn:
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

    def removeNotification(self, notificationID):
        if self.verifyNotification(notificationID):
            try:
                with self.get_db_connection() as conn:
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

    def acceptNotification(self, notificationID):
        if self.verifyNotification(notificationID):
            try:
                with self.get_db_connection() as conn:
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
                        cursor.execute("""
                                INSERT INTO notifications
                                (touserid, fromuserid, messagetype, title)
                                VALUES (%s, %s, %s, %s) RETURNING *
                            """, (full_row['fromuserid'], full_row['touserid'], full_row['messagetype']+" Request Accepted", full_row['title']))
                        conn.commit()
                        self.removeNotification(notificationID)
                        return {"status": "success", "Project added": title}
            except Exception as e:
                print(f"Failure to accept notification: {e}")
                return {"status": "error", "error": str(e)}

    def rejectNotification(self, notificationID):
        if self.verifyNotification(notificationID):
            try:
                with self.get_db_connection() as conn:
                    with conn.cursor() as cursor:

                        postgres_get = """
                            SELECT * FROM notifications 
                            WHERE notificationid = %s
                        """
                        cursor.execute(postgres_get, (notificationID,))
                        full_row = cursor.fetchone()
                        if full_row['messagetype'] == 'Join' or full_row['messagetype'] == 'Invite':
                            cursor.execute("""
                                    INSERT INTO notifications
                                    (touserid, fromuserid, messagetype, title)
                                    VALUES (%s, %s, %s, %s) RETURNING *
                                """, (full_row['fromuserid'], full_row['touserid'], full_row['messagetype']+" Request Rejected", full_row['title']))
                            conn.commit()
                            self.removeNotification(notificationID)
                            return {"status": "success", "Project Rejected": full_row['title']}
                        else:
                            self.removeNotification(notificationID)
                            return {"status": "success", "Project Removed": notificationID}
            except Exception as e:
                print(f"Failure to reject notification: {e}")
                return {"status": "error", "error": str(e)}

