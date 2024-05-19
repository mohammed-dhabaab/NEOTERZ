import cv2
import numpy as np
import os
import cvzone
from datetime import datetime

from tracker import *
from parent import Parent

class TheftDetector(Parent):
    def __init__(self, user_preferences, input_video_path="video.mp4", show_video=True):
        super().__init__()
        self.input_video_path = input_video_path
        self.user_preferences = user_preferences
        self.show_video = show_video
        
        self.input_video_info = self.get_video_info(self.input_video_path)
        self.window_name = "Theft Detector"
        
        self._initialize_styling()
        
        self.areas = []
        self._initialize_areas()

        self._initialize_output_video()

    def run(self):
        if self.show_video:
            self._initialize_video()
            
        class_labels = self._read_class_labels(self.coco_file_path)

        self.cap = cv2.VideoCapture(self.input_video_path)

        threat_detected = False
        
        while True:
            ret, frame = self.cap.read()

            if not ret:
                break

            self._draw_areas(frame)

            detection_results = self._perform_object_detection(frame)

            for index, row in detection_results.iterrows():

                top_left = (int(row[0]), int(row[1]))
                bottom_right = (int(row[2]), int(row[3]))
                top_right = (int(row[2]), int(row[1]))
                bottom_left = (int(row[0]), int(row[3]))

                detected_corners = [top_left, top_right, bottom_right, bottom_left]
                class_index = int(row[5])
                class_label = class_labels[class_index]


                if "person" in class_label:
                    self._draw_detection(frame, "Person", detected_corners)

                    check = False
                    for area in self.areas:
                        if any(cv2.pointPolygonTest(area, point, measureDist=False) >= 0 for point in detected_corners):
                            check = True
                            break
                    
                    if check:
                        print("WARNING: Detect a Potential Threat!!!")
                        self.detected_rectangle_color = self.area_color = self.warning_color
                        self._display_warning_text(frame)
                    
                    # Capture the threat when enters the area
                    if check and not threat_detected:
                        self._capture_threat(frame)
                        threat_detected = True
                    
                    # Capture the threat when leaves the area
                    if not check and threat_detected:
                        self._capture_threat(frame)
                        threat_detected = False  

            self.output_video.write(frame)

            if self.show_video:
                cv2.imshow(self.window_name, frame)
            
            if (
                cv2.waitKey(1) & 0xFF == 27
                or cv2.getWindowProperty(self.window_name, cv2.WND_PROP_VISIBLE) < 1
            ):
                break

        self.cap.release()
        cv2.destroyAllWindows()
        self.output_video.release()

    def _initialize_styling(self):
        self.warning_text = "WARNING: Detect a Potential Threat!!!"
        self.warning_text_position = (40, 150)
        self.warning_color = (0, 0, 255)
        self.safe_color = (0, 255, 0)

        self.detection_point_color = (0, 255, 255)
        self.detected_rectangle_color = self.safe_color
        self.area_color = self.safe_color

    def _initialize_areas(self):
        self.area_color = self.area_color
        self.area_thickness = self.MAIN_THICKNESS
        
        for area in self.user_preferences["areas"]:
            self.areas.append(np.array(area["points"], np.int32))

    def _initialize_output_video(self):
        self.output_file = self.window_name + self.input_video_info["video_extension"]
        
        self.output_fourcc = cv2.VideoWriter_fourcc(*'avc1')
        
        self.output_fps = self.input_video_info["fps"]
        self.output_video = cv2.VideoWriter(
            self.output_file,
            self.output_fourcc,
            self.output_fps,
            (self.input_video_info["width"], self.input_video_info["height"]),
        )

    def _initialize_video(self):
        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(
            self.window_name,
            self.input_video_info["width"],
            self.input_video_info["height"],
        )
        cv2.setMouseCallback(self.window_name, self._print_mouse_coordinates)

    def _draw_areas(self, frame):
        for area in self.areas:
            cv2.polylines(frame, [area], True, self.area_color, self.area_thickness)
            cv2.putText(
                frame,
                str("1"),
                self._get_shape_center(area),
                self.MAIN_FONT,
                self.MAIN_FONT_SIZE,
                self.area_color,
                1,
            )

    def _draw_detection(self, frame, object_type, detected_corners):
        cv2.rectangle(
            frame,
            detected_corners[0],
            detected_corners[2],
            self.detected_rectangle_color,
            self.MAIN_THICKNESS,
        )

        cvzone.putTextRect(
            frame,
            object_type,
            (detected_corners[0][0] + 9, detected_corners[0][1] - 10),
            scale=self.MAIN_FONT_SIZE,
            thickness=self.MAIN_THICKNESS,
            colorT=(255, 255, 255),
            colorR=self.detected_rectangle_color,
            font=self.MAIN_FONT,
        )

    def _display_warning_text(self, frame):
        cv2.putText(
            frame,
            self.warning_text,
            self.warning_text_position,
            self.MAIN_FONT,
            self.MAIN_FONT_SIZE,
            self.warning_color,
            self.MAIN_THICKNESS,
        )


    def _capture_threat(self, frame):
        threats_folder = "Threats"
        os.makedirs(threats_folder, exist_ok=True)
        
        formatted_datetime = datetime.now().strftime("%Y-%m-%d %H-%M-%S.%f")[:-4]
        capture_name = f"Threat {formatted_datetime}.jpg"
        
        capture_path = os.path.join(threats_folder, capture_name)
        print(capture_path)
        cv2.imwrite(capture_path, frame)
        print("Threat captured as", capture_name)
        
