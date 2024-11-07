from app.services.supabase_client import supabase_client

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
    def register(username, loginEmail, password):
        if Account.account_exists(username, loginEmail):
            return {"error": "Account with this username or email already exists."} 
   
        try:
            response = supabase_client.table('users').insert({
                "username": username,
                "loginEmail": loginEmail,
                "password": password 
            }).execute()
            
            if response.status_code == 201:
                return response.data  
            else:
                return {"error": response.error}  
        except Exception as e:
            return {"error": str(e)}  
