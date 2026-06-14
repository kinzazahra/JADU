import cv2
import mediapipe as mp
import numpy as np
import base64

class HandGestureEngine:
    def __init__(self):
        # Initialize optimized MediaPipe Hands solution
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.65,
            min_tracking_confidence=0.5
        )
        
    def _calculate_distance(self, p1, p2) -> float:
        """Returns the Euclidean distance between two points."""
        return float(np.linalg.norm(np.array([p1.x, p1.y, p1.z]) - np.array([p2.x, p2.y, p2.z])))

    def process_base64_frame(self, base64_str: str) -> dict:
        """Decodes frame, passes it through MediaPipe, and extracts structural gesture actions."""
        try:
            # Decode base64 image data
            encoded_data = base64_str.split(',')[1] if ',' in base64_str else base64_str
            image_bytes = base64.b64decode(encoded_data)
            np_arr = np.frombuffer(image_bytes, dtype=np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                return {"gesture": "None", "confidence": 0.0}

            # Mirror frame and convert to RGB for MediaPipe inference
            frame_rgb = cv2.cvtColor(cv2.flip(frame, 1), cv2.COLOR_BGR2RGB)
            results = self.hands.process(frame_rgb)

            if not results.multi_hand_landmarks:
                return {"gesture": "None", "confidence": 0.0}

            landmarks = results.multi_hand_landmarks[0].landmark
            score = float(results.multi_handedness[0].classification[0].score)

            # Landmark references
            thumb_tip = landmarks[4]
            index_tip = landmarks[8]
            middle_tip = landmarks[12]
            ring_tip = landmarks[16]
            pinky_tip = landmarks[20]
            
            index_mcp = landmarks[5]
            middle_mcp = landmarks[9]
            ring_mcp = landmarks[13]
            pinky_mcp = landmarks[17]

            # Calculate primary tracking distances
            pinch_dist = self._calculate_distance(thumb_tip, index_tip)
            
            # Check if fingers are curled down relative to their base joint knuckles
            index_is_curled = index_tip.y > index_mcp.y
            middle_is_curled = middle_tip.y > middle_mcp.y
            ring_is_curled = ring_tip.y > ring_mcp.y
            pinky_is_curled = pinky_tip.y > pinky_mcp.y

            # Core gesture state machine assignment
            if index_is_curled and middle_is_curled and ring_is_curled and pinky_is_curled:
                detected_gesture = "Closed Fist"
            elif pinch_dist < 0.04:
                detected_gesture = "Index Pinch"
            elif not index_is_curled and not middle_is_curled and ring_is_curled and pinky_is_curled:
                detected_gesture = "Victory Sign"
            else:
                detected_gesture = "Open Palm"

            return {
                "gesture": detected_gesture,
                "confidence": round(score * 100, 1),
                "cursor": {
                    "x": float(index_tip.x),
                    "y": float(index_tip.y)
                }
            }
        except Exception as e:
            print(f"MediaPipe processing failure: {e}")
            return {"gesture": "Error", "confidence": 0.0}

# Global singleton instance
gesture_engine = HandGestureEngine()