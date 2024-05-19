import cv2
import numpy as np
import cvzone

from tracker import *
from parent import Parent

class VisitorsCounter(Parent):
    def __init__(self, user_preferences, input_video_path="video.mp4", show_video=True):
        super().__init__() 

        self.input_video_path = input_video_path
        self.user_preferences = user_preferences
        self.show_video = show_video
        
        self.input_video_info = self.get_video_info(self.input_video_path)
        self.frame_size = (1020, 500)
        self.window_name = "Visitors Counter"
        
        
        self._initialize_styling()
        
        self._initialize_areas()

        self.entering_people = {}
        self.entering_counter = set()
        self.exiting_people = {}
        self.exiting_counter = set()
        
        self._initialize_output_video()
        

    def run(self):
        self._initialize_video()
        class_labels = self._read_class_labels(self.coco_file_path)
        
        self.cap = cv2.VideoCapture(self.input_video_path)

        
        while True:
            ret, frame = self.cap.read()

            if not ret:
                break

            resized_frame = cv2.resize(frame, self.frame_size)
            
            self._draw_areas(resized_frame)

            detection_results = self._perform_object_detection(resized_frame)

            people_rectangles = []

            for index, row in detection_results.iterrows():
                x1 = int(row[0])
                y1 = int(row[1])
                x2 = int(row[2])
                y2 = int(row[3])
                class_index = int(row[5])
                class_label = class_labels[class_index]

                if "person" in class_label:
                    people_rectangles.append([x1, y1, x2, y2])

            bbox_id = self.tracker.update(people_rectangles)
            for bbox in bbox_id:
                x3, y3, x4, y4, id = bbox
                
                # Entering counter
                result1 = cv2.pointPolygonTest(self.area2, (x4, y4), False)
                if result1 >= 0:
                    self.entering_people[id] = (x4, y4)
                                
                if id in self.entering_people:
                    result2 = cv2.pointPolygonTest(self.area1, (x4, y4), False)
                    if result2 >= 0:
                        self.entering_counter.add(id)
                        self._draw_detection(resized_frame, id, x3, y3, x4, y4)

                # Exiting counter
                result3 = cv2.pointPolygonTest(self.area1, (x4, y4), False)
                if result3 >= 0:
                    self.exiting_people[id] = (x4, y4)

                if id in self.exiting_people:
                    result4 = cv2.pointPolygonTest(self.area2, (x4, y4), False)
                    if result4 >= 0:
                        self.exiting_counter.add(id)
                        self._draw_detection(resized_frame, id, x3, y3, x4, y4)

            self._display_counters(resized_frame)

            self.output_video.write(resized_frame)
            
            if self.show_video:
                cv2.imshow(self.window_name, resized_frame)

            if cv2.waitKey(1) & 0xFF == 27  or cv2.getWindowProperty(self.window_name, cv2.WND_PROP_VISIBLE) < 1:
                break

        self.cap.release()
        cv2.destroyAllWindows()
        self.output_video.release()
        
    def _initialize_styling(self):
        self.person_rectangle_color = (0, 0, 255)
        self.conuting_point_color = (255, 0, 255)
        
        self.entering_color = self._convert_hexadecimal_bgr(self.user_preferences["areas"][0]["color"])
        self.entering_counter_position = (60, 80)
        self.entering_counter_color = self.entering_color
        
        self.exiting_color = self._convert_hexadecimal_bgr(self.user_preferences["areas"][1]["color"])
        self.exiting_counter_position = (60, 120)
        self.exiting_counter_color = self.exiting_color

    def _initialize_areas(self):
        self.area1_color = self.entering_color
        self.area1_thickness = self.MAIN_THICKNESS
        self.area1_vertices = self.user_preferences["areas"][0]["points"]
        self.area1 = np.array(self.area1_vertices, np.int32)
        self.area1_center = self._get_shape_center(self.area1_vertices)

        self.area2_color = self.exiting_color
        self.area2_thickness = self.MAIN_THICKNESS
        self.area2_vertices = self.user_preferences["areas"][1]["points"]
        self.area2 = np.array(self.area2_vertices, np.int32)
        self.area2_center = self._get_shape_center(self.area2_vertices)

    def _initialize_output_video(self):
        self.output_file = self.window_name + self.input_video_info["video_extension"]
        self.fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        self.fps = self.input_video_info["fps"]

        self.output_video = cv2.VideoWriter(self.output_file, self.fourcc, self.fps, self.frame_size)
    

    def _initialize_video(self):
        cv2.namedWindow(self.window_name)
        cv2.setMouseCallback(self.window_name, self._print_mouse_coordinates)
        
        
    def _draw_areas(self, frame):
        cv2.polylines(frame, [self.area1], True, self.area1_color, self.area1_thickness)
        cv2.putText(frame, str("Enter"), self.area1_center, self.MAIN_FONT, self.MAIN_FONT_SIZE, self.area1_color, 1)

        cv2.polylines(frame, [self.area2], True, self.area2_color, self.area2_thickness)
        cv2.putText(frame, str("Exit"), self.area2_center, self.MAIN_FONT, self.MAIN_FONT_SIZE, self.area2_color, 1)
    

    def _draw_detection(self, frame, id, x3, y3, x4, y4):
            cv2.rectangle(
                frame,
                (x3, y3),
                (x4, y4),
                self.person_rectangle_color,
                self.MAIN_THICKNESS,
            )
            cv2.circle(frame, (x4, y4), self.MAIN_RADIUS, self.conuting_point_color, -1)
            cvzone.putTextRect(
                frame,
                str(id),
                (x3 + 9, y3 - 10),
                scale=self.MAIN_FONT_SIZE,
                thickness=self.MAIN_THICKNESS,
                colorT=(255, 255, 255),
                colorR=(0, 0, 255),
                font=self.MAIN_FONT,
            )

    def _display_counters(self, frame):
        cv2.putText(
            frame,
            "Entering: " + str(len(self.entering_counter)),
            self.entering_counter_position,
            self.MAIN_FONT,
            self.MAIN_FONT_SIZE,
            self.entering_counter_color,
            self.MAIN_THICKNESS,
        )
        cv2.putText(
            frame,
            "Exiting: " + str(len(self.exiting_counter)),
            self.exiting_counter_position,
            self.MAIN_FONT,
            self.MAIN_FONT_SIZE,
            self.exiting_counter_color,
            self.MAIN_THICKNESS,
        )
        