import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.signal import find_peaks, savgol_filter
from scipy.spatial import distance

class ExerciseRepCounter:
    def __init__(self, csv_path):
        """
        Initialize the rep counter with pose data from a CSV file.
        
        Args:
            csv_path (str): Path to the CSV file with pose data
        """
        self.data = pd.read_csv(csv_path)
        self.frames = self.data['frame_number'].values
        self.num_frames = len(self.frames)
        print(f"Loaded {self.num_frames} frames of pose data")
        
        # Dictionary of landmark indices for different body parts
        self.landmarks = {
            'nose': 0,
            'left_shoulder': 11, 'right_shoulder': 12,
            'left_elbow': 13, 'right_elbow': 14,
            'left_wrist': 15, 'right_wrist': 16,
            'left_hip': 23, 'right_hip': 24,
            'left_knee': 25, 'right_knee': 26,
            'left_ankle': 27, 'right_ankle': 28
        }
    
    def get_landmark_coordinates(self, landmark_idx):
        """Get x, y, z coordinates for a specific landmark across all frames."""
        x = self.data[f'landmark_{landmark_idx}_x'].values
        y = self.data[f'landmark_{landmark_idx}_y'].values
        z = self.data[f'landmark_{landmark_idx}_z'].values
        visibility = self.data[f'landmark_{landmark_idx}_visibility'].values
        return x, y, z, visibility
    
    def calculate_joint_angle(self, point1, point2, point3):
        """Calculate the angle between three points (in degrees)."""
        # Convert to numpy arrays
        point1 = np.array(point1)
        point2 = np.array(point2)
        point3 = np.array(point3)
        
        # Calculate vectors
        vector1 = point1 - point2
        vector2 = point3 - point2
        
        # Calculate cosine of the angle
        cosine = np.dot(vector1, vector2) / (np.linalg.norm(vector1) * np.linalg.norm(vector2))
        # Clip to handle floating point errors
        cosine = np.clip(cosine, -1.0, 1.0)
        
        # Calculate angle in degrees
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
            # For elbow: shoulder -> elbow -> wrist
            point1_idx = self.landmarks[prefix + 'shoulder']
            point2_idx = self.landmarks[prefix + 'elbow']
            point3_idx = self.landmarks[prefix + 'wrist']
        elif joint_name == 'shoulder':
            # For shoulder: elbow -> shoulder -> hip
            point1_idx = self.landmarks[prefix + 'elbow']
            point2_idx = self.landmarks[prefix + 'shoulder']
            point3_idx = self.landmarks[prefix + 'hip']
        elif joint_name == 'knee':
            # For knee: hip -> knee -> ankle
            point1_idx = self.landmarks[prefix + 'hip']
            point2_idx = self.landmarks[prefix + 'knee']
            point3_idx = self.landmarks[prefix + 'ankle']
        elif joint_name == 'hip':
            # For hip: shoulder -> hip -> knee
            point1_idx = self.landmarks[prefix + 'shoulder']
            point2_idx = self.landmarks[prefix + 'hip']
            point3_idx = self.landmarks[prefix + 'knee']
        else:
            raise ValueError(f"Unknown joint name: {joint_name}")
        
        # Get coordinates for the three points
        p1x, p1y, _, _ = self.get_landmark_coordinates(point1_idx)
        p2x, p2y, _, _ = self.get_landmark_coordinates(point2_idx)
        p3x, p3y, _, _ = self.get_landmark_coordinates(point3_idx)
        
        # Calculate angle for each frame
        for i in range(self.num_frames):
            point1 = [p1x[i], p1y[i]]
            point2 = [p2x[i], p2y[i]]
            point3 = [p3x[i], p3y[i]]
            angle = self.calculate_joint_angle(point1, point2, point3)
            angles.append(angle)
        
        return np.array(angles)
    
    def calculate_vertical_movement(self, landmark_idx):
        """Track the vertical movement of a landmark over time."""
        _, y, _, _ = self.get_landmark_coordinates(landmark_idx)
        return y  # Note: in image coordinates, lower y means higher position
    
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
        """
        # Apply smoothing to reduce noise
        if smoothing and len(signal) > window_length:
            # Make window_length odd if it's even
            if window_length % 2 == 0:
                window_length += 1
            smoothed_signal = savgol_filter(signal, window_length, polyorder)
        else:
            smoothed_signal = signal
        
        # Adjust parameters based on exercise type
        if exercise_type == "pushup" or exercise_type == "squat":
            # For pushups and squats, we might be looking for valleys (minima)
            # so we invert the signal
            inverted_signal = -smoothed_signal
            peaks, _ = find_peaks(inverted_signal, prominence=prominence*np.std(inverted_signal), 
                               width=width, distance=distance_between_peaks)
        else:
            # For general case, look for maxima
            peaks, _ = find_peaks(smoothed_signal, prominence=prominence*np.std(smoothed_signal), 
                               width=width, distance=distance_between_peaks)
        
        return peaks, len(peaks), smoothed_signal
    
    def auto_detect_exercise_type(self):
        """
        Attempt to automatically identify the type of exercise being performed.
        This is a simplistic approach - more sophisticated methods would use
        machine learning.
        """
        # We'll calculate ranges of motion for key joints
        right_elbow_angles = self.get_angle_over_time('elbow', 'right')
        right_knee_angles = self.get_angle_over_time('knee', 'right')
        right_shoulder_angles = self.get_angle_over_time('shoulder', 'right')
        
        # Calculate range of motion (ROM) for each joint
        elbow_rom = np.max(right_elbow_angles) - np.min(right_elbow_angles)
        knee_rom = np.max(right_knee_angles) - np.min(right_knee_angles)
        shoulder_rom = np.max(right_shoulder_angles) - np.min(right_shoulder_angles)
        
        # Simple classification based on which joint shows the largest ROM
        if elbow_rom > knee_rom and elbow_rom > shoulder_rom:
            if np.mean(right_elbow_angles) > 90:  # Mostly extended arms
                return "bicep_curl"
            else:
                return "pushup"
        elif knee_rom > elbow_rom and knee_rom > shoulder_rom:
            return "squat"
        elif shoulder_rom > elbow_rom and shoulder_rom > knee_rom:
            return "shoulder_press"
        else:
            return "general"
    
    def count_reps(self, exercise_type=None):
        """
        Count repetitions for a given exercise type.
        If exercise_type is None, it will try to auto-detect.
        
        Returns:
            count: Number of repetitions
            exercise_type: Detected or specified exercise type
            signal: The processed signal used for counting
            peaks: Indices where repetitions were detected
        """
        if exercise_type is None:
            exercise_type = self.auto_detect_exercise_type()
            print(f"Auto-detected exercise type: {exercise_type}")
        
        if exercise_type == "bicep_curl":
            # For bicep curls, track elbow angle
            signal = self.get_angle_over_time('elbow', 'right')
            # Lower values mean more bent elbow
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                -signal, exercise_type, prominence=0.3, distance_between_peaks=15)
            
        elif exercise_type == "pushup":
            # For pushups, track vertical movement of shoulders or nose
            signal = self.calculate_vertical_movement(self.landmarks['nose'])
            # Higher values (lower position) at bottom of pushup
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                signal, exercise_type, prominence=0.15, distance_between_peaks=15)
            
        elif exercise_type == "squat":
            # For squats, track knee angle
            signal = self.get_angle_over_time('knee', 'right')
            # Lower values at bottom of squat
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                -signal, exercise_type, prominence=0.25, distance_between_peaks=20)
            
        elif exercise_type == "shoulder_press":
            # For shoulder press, track wrist height
            signal = self.calculate_vertical_movement(self.landmarks['right_wrist'])
            # Lower values (higher position) at top of press
            peaks, count, smoothed_signal = self.detect_reps_from_signal(
                -signal, exercise_type, prominence=0.2, distance_between_peaks=15)
            
        else:  # General case - try multiple signals and use the one with clearest peaks
            # Try several signals and see which gives the most reliable peaks
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
                # Try both original and inverted signal
                peaks1, count1, smoothed1 = self.detect_reps_from_signal(
                    sig, prominence=0.2, distance_between_peaks=15)
                peaks2, count2, smoothed2 = self.detect_reps_from_signal(
                    -sig, prominence=0.2, distance_between_peaks=15)
                
                # Use the one that detected more reps
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
        """Visualize the signal and detected repetitions."""
        plt.figure(figsize=(14, 6))
        plt.plot(signal, label='Smoothed Signal')
        plt.plot(peaks, signal[peaks], 'ro', label='Detected Repetitions')
        plt.title(f'Exercise: {exercise_type}, Repetitions: {len(peaks)}')
        plt.xlabel('Frame')
        plt.ylabel('Signal Value')
        plt.legend()
        plt.grid(True)
        plt.show()

# Example usage
if __name__ == "__main__":
    # Example with the pose data CSV
    csv_path = "pose_data.csv"
    
    counter = ExerciseRepCounter(csv_path)
    
    # Auto-detect and count reps
    count, exercise_type, signal, peaks = counter.count_reps()
    
    if signal is not None and peaks is not None:
        print(f"Detected {count} repetitions of {exercise_type}")
        counter.visualize_rep_counting(signal, peaks, exercise_type)
    else:
        print("Could not detect repetitions reliably.")