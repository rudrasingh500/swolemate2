import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import mediapipe as mp
import cv2
from scipy.signal import find_peaks, savgol_filter
from scipy.spatial import distance
import os
import argparse

class ExerciseRepProcessor:
    def __init__(self):
        """
        Initialize the rep processor with MediaPipe Pose detection.
        """
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(static_image_mode=False)
        self.data = None
        self.frames = None
        self.num_frames = 0
        
        self.landmarks = {
            'nose': 0,
            'left_shoulder': 11, 'right_shoulder': 12,
            'left_elbow': 13, 'right_elbow': 14,
            'left_wrist': 15, 'right_wrist': 16,
            'left_hip': 23, 'right_hip': 24,
            'left_knee': 25, 'right_knee': 26,
            'left_ankle': 27, 'right_ankle': 28
        }
    
    def extract_poses(self, video_path, rep_threshold=0.6, min_rep_duration=15, smoothing_window=5):
        """
        Extract pose landmarks from a video file.
        
        Args:
            video_path (str): Path to the input video
            rep_threshold (float): Threshold for detecting rep movements
            min_rep_duration (int): Minimum duration of a rep
            smoothing_window (int): Window size for data smoothing
        
        Returns:
            pd.DataFrame: DataFrame with pose landmark data
        """
        cap = cv2.VideoCapture(video_path)
        data = []
        
        frame_count = 0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        print(f"Total frames in video: {total_frames}")

        landmark_indices = list(range(33))

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_rgb = cv2.cvtColor(cv2.resize(frame, (1000, 1000)), cv2.COLOR_BGR2RGB)
            results = self.pose.process(frame_rgb)

            if results.pose_landmarks:
                landmarks_row = []
                for idx in landmark_indices:
                    l = results.pose_landmarks.landmark[idx]
                    landmarks_row.extend([l.x, l.y, l.z, l.visibility])
                landmarks_row.append(frame_count)
                data.append(landmarks_row)

            frame_count += 1

        cap.release()
        print(f"Processed {frame_count} frames.")

        if not data:
            print("No pose data detected in video")
            return None

        cols = []
        for idx in landmark_indices:
            cols.extend([f'landmark_{idx}_x', f'landmark_{idx}_y', 
                         f'landmark_{idx}_z', f'landmark_{idx}_visibility'])
        cols.append('frame_number')
        
        df = pd.DataFrame(data, columns=cols)
        
        csv_path = video_path.replace('.mov', '_pose_data.csv')
        df.to_csv(csv_path, index=False)
        print(f"Pose data saved to {csv_path}")
        
        return df
    
    def get_landmark_coordinates(self, landmark_idx):
        """
        Get x, y, z coordinates for a specific landmark across all frames.
        
        Args:
            landmark_idx (int): Index of the landmark
        
        Returns:
            tuple: x, y, z coordinates and visibility for the landmark
        """
        x = self.data[f'landmark_{landmark_idx}_x'].values
        y = self.data[f'landmark_{landmark_idx}_y'].values
        z = self.data[f'landmark_{landmark_idx}_z'].values
        visibility = self.data[f'landmark_{landmark_idx}_visibility'].values
        return x, y, z, visibility
    
    def calculate_joint_angle(self, point1, point2, point3):
        """
        Calculate the angle between three points (in degrees).
        
        Args:
            point1 (list): Coordinates of the first point
            point2 (list): Coordinates of the second point (vertex)
            point3 (list): Coordinates of the third point
        
        Returns:
            float: Angle in degrees
        """
        point1 = np.array(point1)
        point2 = np.array(point2)
        point3 = np.array(point3)
        
        vector1 = point1 - point2
        vector2 = point3 - point2
        
        cosine = np.dot(vector1, vector2) / (np.linalg.norm(vector1) * np.linalg.norm(vector2))
        cosine = np.clip(cosine, -1.0, 1.0)
        
        angle = np.degrees(np.arccos(cosine))
        return angle
    
    def get_angle_over_time(self, joint_name, side='right'):
        """
        Calculate joint angles over time for common joints.
        
        Args:
            joint_name (str): One of 'elbow', 'shoulder', 'knee', 'hip'
            side (str): 'left' or 'right'
            
        Returns:
            np.array: Array of angles for each frame
        """
        prefix = f"{side}_"
        angles = []
        
        if joint_name == 'elbow':
            point1_idx = self.landmarks[prefix + 'shoulder']
            point2_idx = self.landmarks[prefix + 'elbow']
            point3_idx = self.landmarks[prefix + 'wrist']
        elif joint_name == 'shoulder':
            point1_idx = self.landmarks[prefix + 'elbow']
            point2_idx = self.landmarks[prefix + 'shoulder']
            point3_idx = self.landmarks[prefix + 'hip']
        elif joint_name == 'knee':
            point1_idx = self.landmarks[prefix + 'hip']
            point2_idx = self.landmarks[prefix + 'knee']
            point3_idx = self.landmarks[prefix + 'ankle']
        elif joint_name == 'hip':
            point1_idx = self.landmarks[prefix + 'shoulder']
            point2_idx = self.landmarks[prefix + 'hip']
            point3_idx = self.landmarks[prefix + 'knee']
        else:
            raise ValueError(f"Unknown joint name: {joint_name}")
        
        p1x, p1y, _, _ = self.get_landmark_coordinates(point1_idx)
        p2x, p2y, _, _ = self.get_landmark_coordinates(point2_idx)
        p3x, p3y, _, _ = self.get_landmark_coordinates(point3_idx)
        
        for i in range(self.num_frames):
            point1 = [p1x[i], p1y[i]]
            point2 = [p2x[i], p2y[i]]
            point3 = [p3x[i], p3y[i]]
            angle = self.calculate_joint_angle(point1, point2, point3)
            angles.append(angle)
        
        return np.array(angles)
    
    def calculate_vertical_movement(self, landmark_idx):
        """
        Track the vertical movement of a landmark over time.
        
        Args:
            landmark_idx (int): Index of the landmark to track
        
        Returns:
            np.array: Y-coordinates of the landmark
        """
        _, y, _, _ = self.get_landmark_coordinates(landmark_idx)
        return y
    
    def detect_reps_from_signal(self, signal, exercise_type="general", 
                               smoothing=True, window_length=15, polyorder=3,
                               prominence=0.1, width=5, distance_between_peaks=10):
        """
        Detect repetitions from a time series signal.
        
        Args:
            signal: The signal to analyze (joint angle or position)
            exercise_type: Type of exercise for specialized detection
            smoothing: Whether to apply smoothing to the signal
            window_length: Window length for Savitzky-Golay filter
            polyorder: Polynomial order for Savitzky-Golay filter
            prominence: Required prominence of peaks
            width: Required width of peaks
            distance_between_peaks: Minimum frames between peaks
            
        Returns:
            peaks: Indices of detected peaks
            count: Number of repetitions
            smoothed_signal: Processed signal
        """
        if smoothing and len(signal) > window_length:
            if window_length % 2 == 0:
                window_length += 1
            smoothed_signal = savgol_filter(signal, window_length, polyorder)
        else:
            smoothed_signal = signal
        
        if exercise_type in ["pushup", "squat"]:
            inverted_signal = -smoothed_signal
            peaks, _ = find_peaks(inverted_signal, prominence=prominence*np.std(inverted_signal), 
                               width=width, distance=distance_between_peaks)
        else:
            peaks, _ = find_peaks(smoothed_signal, prominence=prominence*np.std(smoothed_signal), 
                               width=width, distance=distance_between_peaks)
        
        return peaks, len(peaks), smoothed_signal
    
    def auto_detect_exercise_type(self):
        """
        Attempt to automatically identify the type of exercise being performed.
        
        Returns:
            str: Detected exercise type
        """
        right_elbow_angles = self.get_angle_over_time('elbow', 'right')
        right_knee_angles = self.get_angle_over_time('knee', 'right')
        right_shoulder_angles = self.get_angle_over_time('shoulder', 'right')
        
        elbow_rom = np.max(right_elbow_angles) - np.min(right_elbow_angles)
        knee_rom = np.max(right_knee_angles) - np.min(right_knee_angles)
        shoulder_rom = np.max(right_shoulder_angles) - np.min(right_shoulder_angles)
        
        if elbow_rom > knee_rom and elbow_rom > shoulder_rom:
            if np.mean(right_elbow_angles) > 90:
                return "bicep_curl"
            else:
                return "pushup"
        elif knee_rom > elbow_rom and knee_rom > shoulder_rom:
            return "squat"
        elif shoulder_rom > elbow_rom and shoulder_rom > knee_rom:
            return "shoulder_press"
        else:
            return "general"
    
    def count_reps(self, csv_path=None, df=None, exercise_type=None):
        """
        Count repetitions using pose data.
        
        Args:
            csv_path (str): Path to CSV file with pose data
            df (pd.DataFrame): Optional DataFrame with pose data
            exercise_type (str): Optional exercise type to override auto-detection
        
        Returns:
            tuple: Number of reps, detected exercise type, signal, peaks
        """
        if df is None:
            if csv_path is None:
                raise ValueError("Must provide either CSV path or DataFrame")
            self.data = pd.read_csv(csv_path)
        else:
            self.data = df
        
        self.frames = self.data['frame_number'].values
        self.num_frames = len(self.frames)
        print(f"Loaded {self.num_frames} frames of pose data")
        
        if exercise_type is None:
            exercise_type = self.auto_detect_exercise_type()
            print(f"Auto-detected exercise type: {exercise_type}")
        
        if exercise_type == "bicep_curl":
            signal = self.get_angle_over_time('elbow', 'right')
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                -signal, exercise_type, prominence=0.3, distance_between_peaks=15)
            
        elif exercise_type == "pushup":
            signal = self.calculate_vertical_movement(self.landmarks['nose'])
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                signal, exercise_type, prominence=0.15, distance_between_peaks=15)
            
        elif exercise_type == "squat":
            signal = self.get_angle_over_time('knee', 'right')
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                -signal, exercise_type, prominence=0.25, distance_between_peaks=20)
            
        elif exercise_type == "shoulder_press":
            signal = self.calculate_vertical_movement(self.landmarks['right_wrist'])
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                -signal, exercise_type, prominence=0.5, distance_between_peaks=15)
        else:
            signals = {
                "right_elbow": self.get_angle_over_time('elbow', 'right'),
                "right_knee": self.get_angle_over_time('knee', 'right'),
                "right_shoulder": self.get_angle_over_time('shoulder', 'right'),
                "right_wrist_y": self.calculate_vertical_movement(self.landmarks['right_wrist']),
                "nose_y": self.calculate_vertical_movement(self.landmarks['nose'])
            }
            
            best_count = 0
            best_signal = None
            best_peaks = None
            best_smoothed = None
            
            for name, sig in signals.items():
                peaks1, count1, smoothed1 = self.detect_reps_from_signal(
                    sig, prominence=0.2, distance_between_peaks=15)
                peaks2, count2, smoothed2 = self.detect_reps_from_signal(
                    -sig, prominence=0.2, distance_between_peaks=15)
                
                if count1 >= count2 and count1 > best_count:
                    best_count = count1
                    best_signal = sig
                    best_peaks = peaks1
                    best_smoothed = smoothed1
                    best_name = name + " (normal)"
                elif count2 > count1 and count2 > best_count:
                    best_count = count2
                    best_signal = -sig
                    best_peaks = peaks2
                    best_smoothed = smoothed2
                    best_name = name + " (inverted)"
            
            if best_signal is not None:
                print(f"Best signal for rep counting: {best_name}")
                signal = best_signal
                count = best_count
                peaks = best_peaks
                smoothed_signal = best_smoothed
            else:
                print("Could not detect any reliable repetition pattern")
                return 0, exercise_type, None, None
        
        return count, exercise_type, smoothed_signal, peaks
    
    def visualize_rep_counting(self, signal, peaks, exercise_type):
        """
        Visualize the signal and detected repetitions.
        
        Args:
            signal (np.array): Processed signal
            peaks (np.array): Indices of detected peaks
            exercise_type (str): Type of exercise
        """
        plt.figure(figsize=(14, 6))
        plt.plot(signal, label='Smoothed Signal')
        plt.plot(peaks, signal[peaks], 'ro', label='Detected Repetitions')
        plt.title(f'Exercise: {exercise_type}, Repetitions: {len(peaks)}')
        plt.xlabel('Frame')
        plt.ylabel('Signal Value')
        plt.legend()
        plt.grid(True)
        plt.show()
    
    def process_video(self, video_path, exercise_type=None):
        """
        Complete pipeline to process video and count reps.
        
        Args:
            video_path (str): Path to input video
            exercise_type (str, optional): Specific exercise type
        
        Returns:
            tuple: Number of reps, detected exercise type, signal, peaks
        """
        pose_df = self.extract_poses(video_path)
        
        if pose_df is None:
            print("Could not extract pose data")
            return 0, None, None, None
        
        return self.count_reps(df=pose_df, exercise_type=exercise_type)

    def split_video(self, video_path, signal, exercise_type):
        """
        Split video into individual reps based on detected troughs.
        
        Args:
            video_path (str): Path to input video
            signal (np.array): Processed signal
            exercise_type (str): Type of exercise
        """
        
        base_name = os.path.splitext(os.path.basename(video_path))[0]
        output_dir = os.path.join(os.path.dirname(video_path), f"{base_name}_reps")
        
        os.makedirs(output_dir, exist_ok=True)
        
        cap = cv2.VideoCapture(video_path)
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        troughs, _ = find_peaks(-signal, distance=25)
        
        for i in range(len(troughs)-1):
            start_frame = troughs[i]
            end_frame = min(len(signal), troughs[i+1])
            
            output_path = os.path.join(output_dir, f"rep_{i+1}.mp4")
            
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
            
            cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
            
            for frame_num in range(start_frame, end_frame):
                ret, frame = cap.read()
                if not ret:
                    break
                out.write(frame)
            
            out.release()
            print(f"Saved rep {i+1} to {output_path} with {end_frame - start_frame} frames from {start_frame} to {end_frame}")
        
        cap.release()
        
        print(f"Split {len(troughs)-1} reps into separate videos in {output_dir}")

def main(video_path, exercise_type):
    processor = ExerciseRepProcessor()
    count, exercise_type, signal, peaks = processor.process_video(video_path, exercise_type)
    
    if signal is not None and peaks is not None:
        print(f"Detected {count} repetitions of {exercise_type}")
        processor.visualize_rep_counting(signal, peaks, exercise_type)

        processor.split_video(video_path, signal, exercise_type)
    else:
        print("Could not detect repetitions reliably.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process exercise reps from a video.")
    parser.add_argument("video_path", type=str, help="Path to the input video file")
    parser.add_argument("exercise_type", type=str, help="Type of exercise")
    
    args = parser.parse_args()
    main(args.video_path, args.exercise_type)
