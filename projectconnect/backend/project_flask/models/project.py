import os
import psycopg2
from psycopg2.extras import RealDictCursor

class Project:
    def __init__(self, creatorusername, title, description, links, contact, memberDescription, memberLinks, memberContactInfo, dateposted, isarchived, tag):
        self.creatorusername = creatorusername
        self.title = title
        self.description = description
        self.links = links
        self.contact = contact 
        self.memberDescription = memberDescription
        self.memberLinks = memberLinks
        self.memberContactInfo = memberContactInfo
        self.dateposted = dateposted
        self.isarchived = isarchived
        self.tag = tag

    def get_db_connection(self):
        return psycopg2.connect(
            os.getenv("DATABASE_URL"),  
            cursor_factory=RealDictCursor
        )

    def project_exists(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT 1 FROM projects 
                        WHERE creatorusername = %s AND title = %s
                        LIMIT 1;
                    """, (self.creatorusername, self.title))
                    result = cursor.fetchone()
                    return result is not None  # True if project exists with both creatorusername and title
        except Exception as e:
            print(f"Error checking project existence: {e}")
            return False


    def buildProject(self):
        # Check if a project with the same creatorusername and title already exists
        if self.project_exists():
            return {"error": "A project with this creatorusername and title already exists."}

        # Define required fields
        fields = ["creatorusername", "title", "description", "tag", "links", "contact", "memberdescription", "memberlinks","membercontactinfo"]
        values = [self.creatorusername, self.title, self.description, self.tag, self.links, self.contact, self.memberDescription, self.memberLinks, self.memberContact]
        
        # Dynamically build the SQL query based on available fields
        field_names = ", ".join(fields)
        placeholders = ", ".join(["%s"] * len(fields))

        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    query = f"""
                        INSERT INTO projects ({field_names})
                        VALUES ({placeholders}) RETURNING *;
                    """
                    cursor.execute(query, values)
                    new_project = cursor.fetchone()
                    conn.commit()
                    return {"status": "success", "project": new_project}  # Return the new project data
        except Exception as e:
            print(f"Error building project: {e}")
            return {"error": f"Failed to build project: {str(e)}"}
        
    
    def getProjectInfo(self):
        print("before")
        if not self.project_exists():
            return {"error": "A project with this creatorusername and title doesn't exists."}
        print("after")
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM projects 
                        WHERE creatorusername = %s AND title = %s
                        LIMIT 1;
                    """, (self.creatorusername, self.title))
                    result = cursor.fetchone()
                    conn.commit()
                    return {"status": "success", "project": result}  
        except Exception as e:
            print(f"Error building project: {e}")
            return {"error": f"Failed to build project: {str(e)}"}
        
    def deleteProject(self):
        # Check if the project exists before trying to delete
        if not self.project_exists():
            return {"error": "A project with this creatorusername and title doesn't exist."}

        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # Delete the project where creatorusername and title match the provided values
                    cursor.execute("""
                        DELETE FROM projects
                        WHERE creatorusername = %s AND title = %s
                        RETURNING *;
                    """, (self.creatorusername, self.title))
                    deleted_project = cursor.fetchone()  # This will fetch the deleted project details
                    conn.commit()
                    
                    if deleted_project:
                        return {"status": "success", "project": deleted_project}
                    else:
                        return {"error": "Project not found or already deleted."}
        except Exception as e:
            print(f"Error deleting project: {e}")
            return {"error": f"Failed to delete project: {str(e)}"}
        
    def archiveProject(self):
        # Check if the project exists before trying to archive it
        if not self.project_exists():
            return {"error": f"A project with creatorusername '{self.creatorusername}' and title '{self.title}' doesn't exist."}

        isarchived = "true"
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # First, check if the project is already archived
                    cursor.execute("""
                        SELECT isarchived FROM projects
                        WHERE creatorusername = %s AND title = %s and isarchived = %s;
                    """, (self.creatorusername, self.title, isarchived))
                    
                    project = cursor.fetchone()
                    
                    # If the project exists, check if it is already archived
                    if project and project[0]:  # project[0] corresponds to the isarchived value
                        return {"message": f"The project '{self.title}' by '{self.creatorusername}' is already archived."}
                    
                    # Archive the project if it’s not already archived
                    cursor.execute("""
                        UPDATE projects
                        SET isarchived = true
                        WHERE creatorusername = %s AND title = %s
                        RETURNING *;
                    """, (self.creatorusername, self.title))
                    
                    archived_project = cursor.fetchone()  # Fetch the updated project details
                    conn.commit()
                    
                    if archived_project:
                        return {"status": "success", "project": archived_project}
                    else:
                        return {"error": "Project not found or already archived."}
        except Exception as e:
            print(f"Error archiving project for creator '{self.creatorusername}' and title '{self.title}': {e}")
            return {"error": f"Failed to archive project '{self.title}' by '{self.creatorusername}'"}
        
    def unarchiveProject(self):
        # Check if the project exists before trying to archive it
        if not self.project_exists():
            return {"error": f"A project with creatorusername '{self.creatorusername}' and title '{self.title}' doesn't exist."}

        isarchived = "false"
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    # First, check if the project is already archived
                    cursor.execute("""
                        SELECT isarchived FROM projects
                        WHERE creatorusername = %s AND title = %s and isarchived = %s;
                    """, (self.creatorusername, self.title, isarchived))
                    
                    project = cursor.fetchone()
                    
                    # If the project exists, check if it is already archived
                    if project and project[0]:  # project[0] corresponds to the isarchived value
                        return {"message": f"The project '{self.title}' by '{self.creatorusername}' is already unarchived."}
                    
                    # Archive the project if it’s not already archived
                    cursor.execute("""
                        UPDATE projects
                        SET isarchived = false
                        WHERE creatorusername = %s AND title = %s
                        RETURNING *;
                    """, (self.creatorusername, self.title))
                    
                    archived_project = cursor.fetchone()  # Fetch the updated project details
                    conn.commit()
                    
                    if archived_project:
                        return {"status": "success", "project": archived_project}
                    else:
                        return {"error": "Project not found or already unarchived."}
        except Exception as e:
            print(f"Error unarchiving project for creator '{self.creatorusername}' and title '{self.title}': {e}")
            return {"error": f"Failed to unarchive project '{self.title}' by '{self.creatorusername}'"}
    
    def findProjects(self, searchQuery):
        if searchQuery == "" and self.tag == "": # all projects
            try:
                with self.get_db_connection() as conn:
                    with conn.cursor() as cursor:
                        cursor.execute("""
                            SELECT * FROM projects
                            WHERE isarchived = false
                            ORDER BY dateposted DESC;
                        """, ())

                        result = cursor.fetchall()
                        return result if result else []  # Return list of projects or empty list
            except Exception as e:
                print(f"Error retrieving projects: {e}")
                return {"error": str(e)}
        elif self.tag == "":  # Only searchQuery is used
            try:
                with self.get_db_connection() as conn:
                    with conn.cursor() as cursor:
                        # Fetch projects that match search query
                        # ILIKE = case INsensitive
                        cursor.execute("""
                            SELECT * FROM projects 
                            WHERE (creatorusername ILIKE %s OR title ILIKE %s OR description ILIKE %s)
                            AND isarchived = false
                            ORDER BY dateposted DESC;
                        """, (f"%{searchQuery}%", f"%{searchQuery}%", f"%{searchQuery}%"))

                        result = cursor.fetchall()
                        return result if result else []  # Return list of projects or empty list
            except Exception as e:
                print(f"Error retrieving projects: {e}")
                return {"error": str(e)}
        elif searchQuery == "":  # only tag, aka homepagecards
            try:
                with self.get_db_connection() as conn:
                    with conn.cursor() as cursor:
                        # Ensure tag is passed as a tuple
                        cursor.execute("""
                            SELECT * FROM projects 
                            WHERE LOWER(tag) = %s and isarchived = false
                            ORDER BY dateposted DESC;
                        """, (self.tag.lower(),)) 

                        result = cursor.fetchall()
                        return result if result else []  # Return list of projects or empty list
            except Exception as e:
                print(f"Error retrieving projects: {e}")
                return {"error": str(e)}
        else:  # search query and tag
            try:
                with self.get_db_connection() as conn:
                    with conn.cursor() as cursor:
                        # Fetch projects that match search query
                        # ILIKE = case INsensitive
                        cursor.execute("""
                            SELECT * FROM projects 
                            WHERE (creatorusername ILIKE %s OR title ILIKE %s OR description ILIKE %s)
                            AND (LOWER(tag) = %s) AND isarchived = false
                            ORDER BY dateposted DESC;
                        """, (f"%{searchQuery}%", f"%{searchQuery}%", f"%{searchQuery}%", self.tag.lower()))

                        result = cursor.fetchall()
                        return result if result else []  # Return list of projects or empty list
            except Exception as e:
                print(f"Error retrieving projects: {e}")
                return {"error": str(e)}
            
    def get_projects_by_creator(self):
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT * FROM projects
                        WHERE creatorusername = %s
                        ORDER BY dateposted DESC;
                    """, (self.creatorusername,))
                    
                    projects = cursor.fetchall()  
                    
                    return {"status": "success", "projects": projects or []}
        except Exception as e:
            print(f"Error fetching projects for creator '{self.creatorusername}': {e}")
            return {"error": f"Failed to fetch projects for creator '{self.creatorusername}': {str(e)}"}
        
    def updateProjectDetails(self, updates):
        if not updates:
            return {"status": "error", "message": "No updates provided."}
        
        try:
            # Build the dynamic SQL query based on the updates
            set_clause = ", ".join([f"{key} = %s" for key in updates.keys()])
            values = list(updates.values())
            values.extend([self.creatorusername, self.title])  # Add WHERE clause values

            query = f"""
                UPDATE projects
                SET {set_clause}
                WHERE creatorusername = %s AND title = %s
            """

            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(query, values)
                    if cursor.rowcount > 0:
                        conn.commit()
                        return {"status": "success", "message": "Project details updated successfully."}
                    else:
                        return {"status": "error", "message": "No matching project found or no changes made."}
        except Exception as e:
            print(f"Error updating project: {e}")
            return {"status": "error", "message": f"Database error: {str(e)}"}










    






    


