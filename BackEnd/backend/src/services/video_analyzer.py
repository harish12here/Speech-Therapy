#backend\src\services\video_analyzer.py
import random
import time

class VideoAnalyzer:
    """
    Mock service to analyze child activities from video.
    In a real application, this would use Computer Vision models like OpenPose, YOLO, or specialized action recognition models.
    """
    
    def analyze_video(self, file_path: str) -> dict:
        """
        Simulate video analysis with detailed reporting.
        """
        # Simulate processing time
        time.sleep(2)
        
        activities = [
            "Playing with blocks",
            "Drawing or Coloring",
            "Reading a book",
            "Social interaction with peers",
            "Physical exercise (Jump/Run)",
            "Solving a puzzle",
            "Speaking practice"
        ]
        
        emotions = ["Happy", "Focused", "Neutral", "Curious", "Frustrated"]
        attention_spans = ["High", "Medium", "Low", "Fluctuating"]
        
        detected_activity = random.choice(activities)
        detected_emotion = random.choice(emotions)
        attention = random.choice(attention_spans)
        
        # Extended Mock Metrics
        interaction_score = random.randint(65, 95)
        
        # Generate detailed report text
        report_templates = [
            "The child showed great enthusiasm during the {activity}. Visual engagement was {attention} throughout the session. Key observations include steady hand-eye coordination and consistent response to auditory cues. However, there were moments of hesitation when articulating complex sounds.",
            "During the {activity} session, the child appeared {emotion}. Attention levels were {attention}, suggesting a need for more interactive stimuli. The child successfully completed basic tasks but struggled with multi-step instructions.",
            "Analysis of the {activity} video reveals a {emotion} demeanor. The child demonstrated strong focus initially, though it fluctuated towards the end. Physical gestures were used effectively to communicate, supplementing verbal attempts.",
        ]
        
        detailed_report = random.choice(report_templates).format(
            activity=detected_activity.lower(), 
            emotion=detected_emotion.lower(), 
            attention=attention.lower()
        )
        
        # Improvement Areas
        improvement_pool = [
            "Pronunciation of 'r' and 'l' sounds",
            "Maintaining eye contact during conversation",
            "Volume control in excited states",
            "Completing sentences without rushing",
            "Lip rounding for 'o' and 'u' sounds",
            "Pacing of speech",
            "Clarity of consonant clusters"
        ]
        needs_improvement = random.sample(improvement_pool, 3)

        # Phoneme Mastery Data (Mock)
        phonemes = ['b', 'd', 'g', 'p', 't', 'k', 'm', 'n', 's', 'z', 'l', 'r']
        phoneme_mastery = []
        for p in phonemes:
            phoneme_mastery.append({
                "phoneme": f"/{p}/",
                "score": random.randint(40, 100),
                "status": "Mastered" if random.random() > 0.4 else "Developing"
            })
            
        # Accuracy Trend Data (Mock timeline)
        accuracy_trend = []
        base_score = random.randint(50, 80)
        for i in range(1, 11): # 10 data points
            change = random.randint(-5, 10)
            base_score = max(0, min(100, base_score + change))
            accuracy_trend.append({
                "time_segment": f"{i}m",
                "accuracy": base_score
            })
        
        return {
            "success": True,
            "activity_detected": detected_activity,
            "emotion_detected": detected_emotion,
            "attention_level": attention,
            "interaction_score": interaction_score,
            "detailed_report": detailed_report,
            "needs_improvement": needs_improvement,
            "phoneme_mastery": phoneme_mastery,
            "accuracy_trend": accuracy_trend,
            "feedback": f"Overall performance is {attention} with good signs of {detected_emotion} engagement.", # Keeping simple feedback for legacy support if needed
            "timestamp": time.strftime("%H:%M:%S"),
            "posture_analysis": "Good sitting posture" if random.random() > 0.3 else "Needs posture correction",
            "eye_contact": "Consistent" if random.random() > 0.4 else "Intermittent"
        }
