from flask_folder.services.supabase_client import supabase_client

class Account:
    def __init__(self, username, loginEmail, password):
        self.username = username
        self.loginEmail = loginEmail
        self.password = password  

    @staticmethod
    def account_exists(username, loginEmail):
        try:
            # Query to check if there is a user with the given username or login email
            response = supabase_client.table('users').select('*').or_(
                f'username.eq.{username},loginEmail.eq.{loginEmail}'
            ).execute()
            
            # Return True if an account exists
            return response.status_code == 200 and len(response.data) > 0
        except Exception as e:
            return False  # In case of an exception, assume no account exi

    @staticmethod
    def register(username, loginemail, password):
        if Account.account_exists(username, loginemail):
            return {"error": "Account with this username or email already exists."} 
   
        try:
            response = supabase_client.table('users').insert({
                "username": username,
                "loginemail": loginemail,
                "password": password 
            }).execute()
            
            if response.data:
                return {"message": "Account successfully created", "user": response.data}
            else:
                # If there's an error in the response, return the error message
                return {"error": response.error or "Unknown error occurred"}
        except Exception as e:
            return {"error": str(e)}  # Catch any other exceptions and return them
