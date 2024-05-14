import cv2
from ultralytics import YOLO
import pandas as pd
import os

from tracker import *

class Parent():
    def __init__(self):
        self.yolo_model = YOLO("yolov5s.pt")
        self.coco_file_path = "coco.txt"
        self.tracker = Tracker()
        
        self.frame_skipper = 1
        
        self.MAIN_FONT = cv2.FONT_HERSHEY_SIMPLEX
        self.MAIN_FONT_SIZE = 0.6
        self.MAIN_THICKNESS = 2
        self.MAIN_RADIUS = 5
        
    def get_video_info(self, video_path):
        video = cv2.VideoCapture(video_path)

        fps = video.get(cv2.CAP_PROP_FPS)
        frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        duration_sec = frame_count / fps
        width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        _, video_extension = os.path.splitext(video_path)
        fourcc = int(video.get(cv2.CAP_PROP_FOURCC))
        fourcc_str = "".join(
            [
                chr((int(video.get(cv2.CAP_PROP_FOURCC)) >> 8 * i) & 0xFF)
                for i in range(4)
            ]
        )

        video.release()

        return {
            "fps": fps,
            "frame_count": frame_count,
            "duration_sec": duration_sec,
            "width": width,
            "height": height,
            "video_extension": video_extension,
            "fourcc": fourcc,
            "fourcc_str": fourcc_str,
        }
        
    def _get_shape_center(self, shape_points):
        shape_x_coordinates = [vertex[0] for vertex in shape_points]
        shape_y_coordinates = [vertex[1] for vertex in shape_points]

        shape_center_x = sum(shape_x_coordinates) / len(shape_points)
        shape_center_y = sum(shape_y_coordinates) / len(shape_points)

        shape_center = (int(shape_center_x), int(shape_center_y))
        return shape_center
        
    def _print_mouse_coordinates(self, event, x, y, flags, param):
        if event == cv2.EVENT_MOUSEMOVE:
            mouse_coordinates_values = [x, y]
            print(mouse_coordinates_values)
            
    def _convert_hexadecimal_bgr(self, color):
        return tuple(int(color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
        
    def _read_class_labels(self, class_labels_file_path):
        class_labels_file = open(class_labels_file_path, "r")
        class_labels_data = class_labels_file.read()
        return class_labels_data.split("\n")
    
    def _skip_frames(self, frame_skipper):
        frame_skipper += 1
        if self.frame_skipper % 2 != 0:
            return
        
    def _perform_object_detection(self, frame):
        detection_results = self.yolo_model.predict(frame)
        bounding_boxes = detection_results[0].boxes.data
        bounding_boxes_df = pd.DataFrame(bounding_boxes).astype("float")
        return bounding_boxes_df