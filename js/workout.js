// Workout Page JavaScript

// Exercise database (simplified)
const exerciseDatabase = {
    chest: {
        bodyweight: [
            { name: 'Push-ups', description: 'Classic bodyweight exercise', reps: '10-15', icon: '💪' },
            { name: 'Diamond Push-ups', description: 'Narrow grip push-ups', reps: '8-12', icon: '💎' }
        ],
        dumbbells: [
            { name: 'Dumbbell Press', description: 'Chest exercise with dumbbells', reps: '8-12', icon: '🏋️' }
        ]
    },
    back: {
        bodyweight: [
            { name: 'Pull-ups', description: 'Back and bicep exercise', reps: '5-10', icon: '🎯' },
            { name: 'Superman', description: 'Lower back exercise', reps: '12-20', icon: '🦸' }
        ]
    },
    core: {
        bodyweight: [
            { name: 'Plank', description: 'Core strengthening hold', reps: '30-60s', icon: '🏴' },
            { name: 'Crunches', description: 'Abdominal exercise', reps: '15-25', icon: '🌙' }
        ]
    },
    legs: {
        bodyweight: [
            { name: 'Squats', description: 'Lower body exercise', reps: '15-25', icon: '🏃' },
            { name: 'Lunges', description: 'Single leg exercise', reps: '10-15', icon: '🦵' }
        ]
    }
};

let currentWorkout = [];
let workoutTimer = null;
let currentExerciseIndex = 0;
let timeRemaining = 0;
let totalTime = 0;
let isSoundEnabled = true;
let isPaused = false;
let isResting = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeWorkoutForm();
    initializeSoundControls();
});

function initializeWorkoutForm() {
    const form = document.getElementById('workout-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateWorkout();
    });
}

function generateWorkout() {
    const preferences = gatherPreferences();
    
    if (!validatePreferences(preferences)) {
        showToast('Please select body parts and equipment', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('#workout-form button');
    showLoading(submitBtn, true);
    
    setTimeout(() => {
        currentWorkout = createWorkoutPlan(preferences);
        displayWorkout();
        showLoading(submitBtn, false);
    }, 1000);
}

function gatherPreferences() {
    return {
        bodyParts: Array.from(document.querySelectorAll('input[name="bodyParts"]:checked')).map(cb => cb.value),
        equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value),
        duration: parseInt(document.getElementById('workout-duration').value),
        intensity: document.getElementById('workout-intensity').value
    };
}

function validatePreferences(prefs) {
    return prefs.bodyParts.length > 0 && prefs.equipment.length > 0;
}

function createWorkoutPlan(prefs) {
    const workout = [];
    const exerciseCount = Math.floor(prefs.duration / 5);
    
    prefs.bodyParts.forEach(bodyPart => {
        const availableEquipment = prefs.equipment.filter(eq => 
            exerciseDatabase[bodyPart] && exerciseDatabase[bodyPart][eq]
        );
        
        if (availableEquipment.length > 0) {
            const equipment = availableEquipment[0];
            const exercises = exerciseDatabase[bodyPart][equipment];
            const exercise = exercises[Math.floor(Math.random() * exercises.length)];
            
            workout.push({
                ...exercise,
                bodyPart,
                workTime: 30,
                restTime: 30
            });
        }
    });
    
    return workout.slice(0, exerciseCount);
}

function displayWorkout() {
    const display = document.getElementById('workout-display');
    const container = document.getElementById('workout-exercises');
    
    if (!display || !container) return;
    
    display.style.display = 'block';
    
    const html = currentWorkout.map(exercise => `
        <div class="exercise-card">
            <div class="exercise-header">
                <div class="exercise-icon">${exercise.icon}</div>
                <div class="exercise-info">
                    <h4>${exercise.name}</h4>
                    <span class="exercise-target">${exercise.bodyPart.toUpperCase()}</span>
                </div>
            </div>
            <p class="exercise-description">${exercise.description}</p>
            <div class="exercise-details">
                <span class="exercise-reps">${exercise.reps}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    document.getElementById('start-workout').onclick = startWorkout;
    document.getElementById('regenerate-workout').onclick = generateWorkout;
}

function startWorkout() {
    if (currentWorkout.length === 0) return;
    
    // Reset all states
    currentExerciseIndex = 0;
    isPaused = false;
    isResting = false;
    
    // Reset pause button
    const pauseBtn = document.getElementById('pause-timer');
    pauseBtn.textContent = 'Pause';
    pauseBtn.className = 'btn btn-secondary';
    
    // Show timer section
    const timerSection = document.getElementById('workout-timer');
    timerSection.style.display = 'block';
    timerSection.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize circle progress
    initializeCircleProgress();
    
    startExercise();
}

function initializeCircleProgress() {
    const progressCircle = document.getElementById('timer-progress');
    if (!progressCircle) return;
    
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    
    // Set initial circle properties
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
    progressCircle.setAttribute('stroke', 'url(#timerGradient)');
}

function startExercise() {
    if (currentExerciseIndex >= currentWorkout.length) {
        completeWorkout();
        return;
    }
    
    const exercise = currentWorkout[currentExerciseIndex];
    document.getElementById('current-exercise-name').textContent = exercise.name;
    document.getElementById('current-exercise-description').textContent = exercise.description;
    
    // Update exercise progress
    document.getElementById('current-exercise-number').textContent = currentExerciseIndex + 1;
    document.getElementById('total-exercises').textContent = currentWorkout.length;
    
    // Update progress bar
    const progressPercentage = ((currentExerciseIndex) / currentWorkout.length) * 100;
    document.getElementById('workout-progress-fill').style.width = `${progressPercentage}%`;
    
    timeRemaining = exercise.workTime;
    totalTime = exercise.workTime;
    isResting = false;
    document.getElementById('timer-label').textContent = 'Work';
    updateCircleProgress();
    startTimer();
}

function startTimer() {
    if (isPaused) return;
    
    workoutTimer = setInterval(() => {
        if (isPaused) return;
        
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(workoutTimer);
            workoutTimer = null;
            
            if (!isResting) {
                // Start rest period
                startRestPeriod();
            } else {
                // Move to next exercise
                currentExerciseIndex++;
                setTimeout(startExercise, 500);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update circle progress
    updateCircleProgress();
}

function updateCircleProgress() {
    const progressCircle = document.getElementById('timer-progress');
    if (!progressCircle) return;
    
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate progress (how much time has elapsed)
    const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
    const strokeDashoffset = circumference * (1 - progress);
    
    // Set the circle properties
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = strokeDashoffset;
    
    // Change color based on rest/work state
    if (isResting) {
        progressCircle.setAttribute('stroke', 'url(#timerGradientRest)');
    } else {
        progressCircle.setAttribute('stroke', 'url(#timerGradient)');
    }
    
    // Add pulse effect when time is running low
    const timerText = document.querySelector('.timer-text');
    if (timeRemaining <= 5 && timeRemaining > 0) {
        timerText.classList.add('pulse');
        progressCircle.style.animation = 'timerUrgent 0.5s ease-in-out infinite alternate';
    } else {
        timerText.classList.remove('pulse');
        progressCircle.style.animation = 'timerGlow 2s ease-in-out infinite alternate';
    }
}

function startRestPeriod() {
    if (currentExerciseIndex >= currentWorkout.length - 1) {
        // Last exercise, no rest needed
        currentExerciseIndex++;
        setTimeout(startExercise, 500);
        return;
    }
    
    const exercise = currentWorkout[currentExerciseIndex];
    timeRemaining = exercise.restTime;
    totalTime = exercise.restTime;
    isResting = true;
    document.getElementById('timer-label').textContent = 'Rest';
    document.getElementById('current-exercise-name').textContent = 'Rest Time';
    document.getElementById('current-exercise-description').textContent = 'Take a break before the next exercise';
    
    updateCircleProgress();
    startTimer();
}

function completeWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    
    // Reset states
    isPaused = false;
    isResting = false;
    
    // Reset button text
    const pauseBtn = document.getElementById('pause-timer');
    pauseBtn.textContent = 'Pause';
    pauseBtn.className = 'btn btn-secondary';
    
    // Update progress to 100%
    document.getElementById('workout-progress-fill').style.width = '100%';
    
    // Hide timer section after a delay
    setTimeout(() => {
        document.getElementById('workout-timer').style.display = 'none';
    }, 3000);
    
    showToast('Workout completed! 🎉', 'success');
}

function initializeSoundControls() {
    const toggle = document.getElementById('sound-toggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            isSoundEnabled = !isSoundEnabled;
            document.getElementById('sound-icon').textContent = isSoundEnabled ? '🔊' : '🔇';
        });
    }
}

// Timer controls
document.addEventListener('DOMContentLoaded', function() {
    const pauseBtn = document.getElementById('pause-timer');
    const skipBtn = document.getElementById('skip-exercise');
    const stopBtn = document.getElementById('stop-workout');
    
    if (pauseBtn) {
        pauseBtn.onclick = togglePause;
    }
    
    if (skipBtn) {
        skipBtn.onclick = skipExercise;
    }
    
    if (stopBtn) {
        stopBtn.onclick = stopWorkout;
    }
});

function togglePause() {
    const pauseBtn = document.getElementById('pause-timer');
    
    if (isPaused) {
        // Resume
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        pauseBtn.className = 'btn btn-secondary';
        startTimer();
    } else {
        // Pause
        isPaused = true;
        pauseBtn.textContent = 'Play';
        pauseBtn.className = 'btn btn-primary';
        if (workoutTimer) {
            clearInterval(workoutTimer);
            workoutTimer = null;
        }
    }
}

function skipExercise() {
    // Clear current timer
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    
    // Reset pause state
    isPaused = false;
    const pauseBtn = document.getElementById('pause-timer');
    pauseBtn.textContent = 'Pause';
    pauseBtn.className = 'btn btn-secondary';
    
    // Move to next exercise
    if (isResting) {
        // If currently resting, skip to next exercise
        currentExerciseIndex++;
        startExercise();
    } else {
        // If currently exercising, skip to rest or next exercise
        if (currentExerciseIndex < currentWorkout.length - 1) {
            startRestPeriod();
        } else {
            currentExerciseIndex++;
            startExercise();
        }
    }
}

function stopWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    
    // Reset states
    isPaused = false;
    isResting = false;
    currentExerciseIndex = 0;
    
    // Reset button text
    const pauseBtn = document.getElementById('pause-timer');
    pauseBtn.textContent = 'Pause';
    pauseBtn.className = 'btn btn-secondary';
    
    // Hide timer section
    document.getElementById('workout-timer').style.display = 'none';
    
    showToast('Workout stopped', 'info');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createWorkoutPlan, exerciseDatabase };
}