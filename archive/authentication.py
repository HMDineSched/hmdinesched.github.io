import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

def authenticate_google_api(api_name, api_version, scopes, token_filename='token.json'):
    """
    Authenticates with a Google API and returns a service object.

    Args:
        api_name (str): The name of the API (e.g., 'gmail', 'drive').
        api_version (str): The version of the API (e.g., 'v1', 'v3').
        scopes (list): A list of API scopes required for the application.
        token_filename (str): The name of the file to store/load the user's access token.

    Returns:
        googleapiclient.discovery.Resource: The authenticated service object.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(token_filename):
        creds = Credentials.from_authorized_user_file(token_filename, scopes)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', scopes)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(token_filename, 'w') as token:
            token.write(creds.to_json())
    
    service = build(api_name, api_version, credentials=creds)
    return service

if __name__ == '__main__':
    # --- Test Cases for Authentication Module ---

    # Test Gmail API authentication
    GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
    print("Attempting to authenticate Gmail API...")
    try:
        gmail_service = authenticate_google_api('gmail', 'v1', GMAIL_SCOPES, token_filename='gmail_token.json')
        # If authentication is successful, you can try a simple API call
        profile = gmail_service.users().getProfile(userId='me').execute()
        print(f"Gmail authentication successful! User email: {profile['emailAddress']}")
    except Exception as e:
        print(f"Gmail authentication failed: {e}")

    print("\n" + "="*50 + "\n")

    # Test Google Drive API authentication
    DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    print("Attempting to authenticate Google Drive API...")
    try:
        drive_service = authenticate_google_api('drive', 'v3', DRIVE_SCOPES, token_filename='drive_token.json')
        # If authentication is successful, try a simple API call
        about = drive_service.about().get(fields="user").execute()
        print(f"Google Drive authentication successful! User display name: {about['user']['displayName']}")
    except Exception as e:
        print(f"Google Drive authentication failed: {e}")

    print("\n--- Authentication tests complete. ---")
