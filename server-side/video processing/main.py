from visitors_counter_v2 import VisitorsCounter
from theft_detector_v2 import TheftDetector
import json


def get_user_preferences():
    with open('user_preferences.json', 'r') as pref_file:
        user_preferences = json.load(pref_file)
        print('1 ', user_preferences)
    return user_preferences

if __name__ == "__main__":
    user_preferences = get_user_preferences()
    print('2 ', user_preferences)
    
    if user_preferences["program"] == "Visitors Counter":
        visitors_counter = VisitorsCounter(user_preferences, user_preferences["video_path"], show_video=True)
        visitors_counter.run()
                
    elif user_preferences["program"] == "Theft Detector":
        theft_detector = TheftDetector(user_preferences, user_preferences["video_path"], show_video=True)
        theft_detector.run()
    
    else:
        print("Unknown program:", user_preferences["program"])