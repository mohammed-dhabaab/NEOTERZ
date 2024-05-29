from flask import Flask, jsonify
from flask_cors import CORS
from azure.storage.blob import BlobServiceClient
from flask import Flask, request, redirect, send_file, make_response, send_from_directory, abort
from dotenv import load_dotenv
import os
import subprocess
import json
load_dotenv()

app=Flask(__name__)
CORS(app)

connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
container_name = "videos" 

# create blob service client to interact with the cloud storage 
blob_service_client = BlobServiceClient.from_connection_string(conn_str=connect_str) 
try:
    container_client = blob_service_client.get_container_client(container=container_name) # make connection with the container

except Exception as e:
    print(e)
    print("Creating container...")
    container_client = blob_service_client.create_container(container_name) # create a container in the storage account (if it does not exist)

@app.route('/get-and-process-video', methods=['POST'])
def get_and_process_video():
    # make sure to get user_preferences data
    try:
        print('arraived')
        user_preferences = request.get_json()
        if not user_preferences:
            return jsonify({"error": "No data provided"}), 400
        
        video_name = user_preferences.get('video_path')
        if not video_name:
            return jsonify({"error": "Video path is missing"}), 400
        
        # Setup and download blob
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=video_name)
        with open(video_name, "wb") as my_blob:
            download_stream = blob_client.download_blob()
            my_blob.write(download_stream.readall())
        with open('user_preferences.json','w') as f:
        # save user_preferences file
            json.dump(user_preferences, f, indent=4)
        
        # start AI processing
        subprocess.run(["python", "main.py"], check=True)
        directory = os.getcwd()
        video_path = os.path.join(directory, "Visitors Counter.mp4")
        if not os.path.isfile(video_path):
          abort(404, description="Video not found")
        
        return send_from_directory(directory,"Visitors Counter.mp4", as_attachment=False, mimetype='video/mp4')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/uploade-video', methods=['POST'])
def upload_video_to_blob():
    try:
        # Create a blob service client
        blob_service_client = BlobServiceClient.from_connection_string(connect_str)

        # Get a blob client using the local file name as the name for the blob
        blob_client = blob_service_client.get_blob_client(container=container_name, blob="Result.mp4")

        # Upload the file
        with open("Visitors Counter.mp4", "rb") as data:
            blob_client.upload_blob(data, overwrite=True)
            
        return jsonify({"message": "File was uploaded successfully"}), 200
  
    except Exception as ex:
        print('Error:', ex)

if __name__=="__main__":
    app.run(debug=True, host="0.0.0.0", port=8080, threaded=True)
