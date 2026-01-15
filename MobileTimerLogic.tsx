
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  AppState, 
  Alert, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';

/**
 * Mobile Study Timer Logic (React Native / TypeScript)
 * Implementation for FocusFlow Focus Mode
 */

interface Props {
  subject: string;
  onSessionComplete: (duration: number) => void;
}

const MobileStudyTimer: React.FC<Props> = ({ subject, onSessionComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const appState = useRef(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 1. Setup AppState listener to detect minimizing/switching apps
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) && 
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {
        // App is minimized or user switched apps
        if (isActive) {
          pauseTimer();
          triggerFocusAlert();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const triggerFocusAlert = () => {
    Alert.alert(
      "Focus Interrupted!",
      "You left the study session. The timer has been paused. Stay focused to achieve your goals!",
      [{ text: "Continue Studying", style: "default" }]
    );
  };

  const startTimer = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerCard}>
        <Text style={styles.subjectText}>{subject}</Text>
        <Text style={styles.timeText}>{formatTime(seconds)}</Text>
        
        <TouchableOpacity 
          style={[styles.button, isActive ? styles.buttonStop : styles.buttonStart]} 
          onPress={isActive ? pauseTimer : startTimer}
        >
          <Text style={styles.buttonText}>{isActive ? 'Take Break' : 'Start Focus'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCard: {
    padding: 40,
    backgroundColor: '#1e293b',
    borderRadius: 30,
    alignItems: 'center',
    width: '85%',
  },
  subjectText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'Courier', // Using monospaced font for timer
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#6366f1',
  },
  buttonStop: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default MobileStudyTimer;
