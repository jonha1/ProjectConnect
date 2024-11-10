# app/services/supabase_client.py

from supabase import create_client, Client

# Replace with your actual Supabase URL and API Key
url = "https://vkutknnonriybpwvhhkg.supabase.co/"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdXRrbm5vbnJpeWJwd3ZoaGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3ODQzNzgsImV4cCI6MjA0NTM2MDM3OH0.FpHNxIuU4jkNk_361Fw8gZctHCXeZ0WXUluD9s0AGP8"

supabase_client: Client = create_client(url, key)
