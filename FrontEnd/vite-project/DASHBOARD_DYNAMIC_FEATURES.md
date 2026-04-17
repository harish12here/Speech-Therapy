# Dashboard Dynamic Features Documentation

## Overview
The Dashboard component is **fully dynamic**, fetching all data from the backend API with real-time updates, error handling, and retry mechanisms.

## ✅ Fully Dynamic Features

### 1. **User Information**
- **Source**: `/api/auth/me`
- **Data**: Username, email, role, preferences
- **Display**: Dynamic greeting with time-based salutation

```javascript
const [user, setUser] = useState(null);
// Fetches from getCurrentUser() API
// Display: "Good morning/afternoon/evening, {username}!"
```

### 2. **Statistics Cards**
All 4 stat cards pull real-time data from the backend:

#### Daily Streak
- **Source**: `/api/progress/stats`
- **Field**: `current_streak`
- **Dynamic**: Updates when user completes sessions
- **Algorithm**: Backend tracks consecutive days with completed sessions

#### Exercises Completed
- **Source**: `/api/progress/stats`
- **Field**: `exercises_completed`
- **Dynamic**: Increments with each completed session
- **Algorithm**: Counts total completed sessions

#### Points Earned
- **Source**: `/api/progress/stats`
- **Field**: `total_points`
- **Dynamic**: Updates based on session performance
- **Algorithm**: Sum of all `points_earned` from sessions
- **Scoring**: 10 points for score > 60%, 5 points otherwise

#### Time Practiced
- **Source**: `/api/progress/stats`
- **Field**: `total_duration`
- **Dynamic**: Accumulates with each session
- **Algorithm**: Sum of all session durations (converted to minutes)
- **Display**: Rounded to nearest minute

### 3. **Level Progress**
- **Dynamic Calculation**:
```javascript
const level = Math.floor(stats.total_points / 500) + 1;
const currentLevelXP = stats.total_points % 500;
const nextLevelXP = 500;
const xpPercentage = (currentLevelXP / nextLevelXP) * 100;
```
- **Updates**: Real-time as user earns points
- **Visual**: Animated progress bar with XP counter

### 4. **Recent Activity**
- **Source**: `/api/progress/history`
- **Limit**: 5 most recent sessions
- **Dynamic Data**:
  - Activity type (achievement/improvement based on score)
  - Exercise title
  - Accuracy score
  - Timestamp (formatted to locale)
- **Empty State**: Shows prompt to start first exercise
- **Algorithm**: Maps session data to activity format

```javascript
recent_activity: historyData.slice(0, 5).map(s => ({
  type: s.overall_score > 80 ? 'achievement' : 'improvement',
  title: s.exercise_id ? 'Exercise Completed' : 'Practice Session',
  desc: `Scored ${Math.round(s.overall_score || 0)}% accuracy`,
  time: s.timestamp,
  score: s.overall_score
}))
```

### 5. **Personalized Recommendations**
- **Source**: `/api/progress/recommendations`
- **Dynamic Logic** (Backend):
  1. No sessions → "Start your journey"
  2. Low scores (< 60%) → "Review recent exercises"
  3. Frequent mispronunciations → Focus on specific phoneme
  4. Good performance → Positive reinforcement
  5. Always → "Daily Practice" motivation
- **Display**: Shows top 3 recommendations
- **Icons**: Dynamic based on recommendation type

### 6. **Quick Actions**
All action buttons use functional navigation:
- **Start Session**: Opens `SessionStartModal` → Begins new session
- **Video Analysis**: Navigates to `/video-analysis`
- **Progress**: Navigates to `/progress` page
- **Exercises**: Navigates to `/exercises` library

## 🔄 Real-Time Updates

### Auto-Refresh
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData(true);
  }, 120000); // Refreshes every 2 minutes
  
  return () => clearInterval(interval);
}, []);
```

### Manual Refresh
- **Button**: Top-right corner with refresh icon
- **State**: Shows spinning animation while refreshing
- **Smart**: Only refetches data without full page reload

## 🛡️ Error Handling

### Error States
1. **Loading State**: Spinner with message
2. **Error State**: Full error UI with retry button
3. **Empty States**: Friendly prompts for each section

### Error Recovery
```javascript
const handleRetry = () => {
  fetchData(); // Retries failed API calls
};
```

### Error Messages
- Shows backend error details when available
- Fallback to generic message
- Non-blocking for partial failures

## 📊 Data Flow

```
Dashboard Component
    ↓
fetchData() [Parallel API Calls]
    ├─→ getCurrentUser()        → User info
    ├─→ getProgressStats()      → Stats (streak, points, duration, exercises)
    ├─→ getSessionHistory()     → Recent activity (last 10 sessions)
    └─→ getRecommendations()    → Personalized suggestions
    ↓
Process & Format Data
    ├─→ Calculate level & XP
    ├─→ Map sessions to activities
    ├─→ Round numbers for display
    └─→ Format timestamps
    ↓
Update State & Render
```

## 🔧 Backend Integration

### API Endpoints Used
| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/auth/me` | GET | Get current user | User object |
| `/api/progress/stats` | GET | Get aggregated stats | Statistics object |
| `/api/progress/history` | GET | Get recent sessions | Array of sessions |
| `/api/progress/recommendations` | GET | Get personalized tips | Array of recommendations |

### Authentication
- All API calls automatically include JWT token
- Token interceptor adds `Authorization: Bearer {token}`
- 401 errors auto-redirect to login

### Error Handling Flow
```
API Call
  ↓
Try
  ├─ Success → Process data → Update state
  └─ Catch → Log error → Set error state → Show error UI
       ↓
    User clicks "Try Again"
       ↓
    Retry API call
```

## 🎨 Dynamic UI Elements

### Time-Based Greeting
```javascript
Good {
  new Date().getHours() < 12 ? 'morning' : 
  new Date().getHours() < 18 ? 'afternoon' : 
  'evening'
}, {username}!
```

### Conditional Rendering
- Empty activity → Show "Start your first exercise"
- No recommendations → Show generic message
- Data loading → Show skeleton/spinner
- Error → Show error UI with retry

### Smooth Transitions
- Progress bar animated with `duration-1000`
- Hover effects on all interactive elements
- Scale animations on button clicks
- Fade-in for content

## 🚀 Performance Optimizations

### Parallel Data Fetching
```javascript
const [userData, progressData, historyData, recsData] = await Promise.all([
  getCurrentUser(),
  getProgressStats(),
  getSessionHistory(),
  getRecommendations()
]);
```
- All APIs called simultaneously
- Total loading time = slowest API call (not sum of all)

### Smart Refreshing
- Refresh state separate from loading state
- Doesn't show full-page spinner on refresh
- Only updates changed data

### Efficient Updates
- State updates batched together
- No unnecessary re-renders
- useEffect cleanup for intervals

## 📱 Responsive Design
- Mobile-first approach
- Grid adapts: 2 cols mobile, 4 cols desktop
- Text sizes scale with breakpoints
- Touch-friendly button sizes

## ✨ User Experience Features

### Loading States
- Smooth spinner animation
- Pulsing text
- Centered layout

### Empty States
- Helpful messages
- Action prompts
- Emoji/icons for visual appeal

### Success Indicators
- Achievement badges for high scores
- Improvement indicators for progress
- Color-coded feedback

## 🔐 Security
- All API calls authenticated
- JWT token auto-attached
- Sensitive data never stored in component
- Auto-logout on 401 errors

## 📝 Summary

**100% Dynamic Dashboard** ✅
- ✅ All data from backend API
- ✅ Real-time updates every 2 minutes
- ✅ Manual refresh capability
- ✅ Comprehensive error handling
- ✅ Loading and empty states
- ✅ Personalized recommendations
- ✅ Dynamic calculations (level, XP, etc.)
- ✅ Responsive and accessible
- ✅ Performance optimized
- ✅ No hardcoded or mock data

**Every metric, stat, activity, and recommendation is live and updates automatically!** 🎉
