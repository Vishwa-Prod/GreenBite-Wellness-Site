// Mindfulness Page JavaScript

let breathingActive = false;
let meditationTimer = null;
let meditationActive = false;
let meditationDuration = 10; // minutes
let currentAmbientSound = null;
let currentAudio = null;

// Sound file paths - you can use either web URLs or local files
const SOUND_SOURCES = {
    // Option 1: Web-based sounds (no download needed)
    web: {
        rain: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
        ocean: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav',
        forest: 'https://www.soundjay.com/misc/sounds/forest-1.wav',
        birds: 'https://www.soundjay.com/misc/sounds/birds-1.wav',
        'white-noise': 'https://www.soundjay.com/misc/sounds/white-noise-1.wav'
    },
    // Option 2: Local sounds (GitHub Pages compatible paths)
    local: {
        rain: './Sounds/Rain.wav',
        ocean: './Sounds/Ocean.wav',
        forest: './Sounds/Forest.wav',
        birds: './Sounds/Birds.mp3',
        'white-noise': './Sounds/White%20Noise.mp3'
    }
};

// Audio format support detection
function canPlayAudioFormat(format) {
    const audio = new Audio();
    return audio.canPlayType(format) !== '';
}

// Test audio file accessibility
function testAudioFiles() {
    console.log('Testing audio file accessibility...');
    const sounds = SOUND_SOURCES[USE_SOUND_SOURCE];
    
    Object.keys(sounds).forEach(soundType => {
        const soundPath = sounds[soundType];
        const testAudio = new Audio();
        
        testAudio.addEventListener('loadstart', () => {
            console.log(`✓ ${soundType}: Loading started`);
        });
        
        testAudio.addEventListener('canplay', () => {
            console.log(`✓ ${soundType}: Can play`);
        });
        
        testAudio.addEventListener('error', (e) => {
            console.error(`✗ ${soundType}: Error loading`, e);
        });
        
        testAudio.src = soundPath;
        testAudio.load();
    });
}

// Set which source to use (change to 'local' if you download files)
const USE_SOUND_SOURCE = 'local';

document.addEventListener('DOMContentLoaded', function () {
    try {
        console.log('Initializing mindfulness page...');
        initializeBreathing();
        initializeMeditation();
        initializeAmbientSounds();
        initializeSessionTracking();
        loadSettings();
        console.log('Mindfulness page initialization complete');
    } catch (error) {
        console.error('Error initializing mindfulness page:', error);
    }
});

// Breathing Exercise
function initializeBreathing() {
    const startBtn = document.getElementById('start-breathing');
    const stopBtn = document.getElementById('stop-breathing');

    if (startBtn) startBtn.addEventListener('click', startBreathing);
    if (stopBtn) stopBtn.addEventListener('click', stopBreathing);

    // Breathing settings
    const inhaleSlider = document.getElementById('inhale-duration');
    const holdSlider = document.getElementById('hold-duration');
    const exhaleSlider = document.getElementById('exhale-duration');

    [inhaleSlider, holdSlider, exhaleSlider].forEach(slider => {
        if (slider) {
            slider.addEventListener('input', updateBreathingSettings);
        }
    });

    updateBreathingSettings();
}

function updateBreathingSettings() {
    const inhale = document.getElementById('inhale-duration').value;
    const hold = document.getElementById('hold-duration').value;
    const exhale = document.getElementById('exhale-duration').value;

    document.getElementById('inhale-value').textContent = inhale;
    document.getElementById('hold-value').textContent = hold;
    document.getElementById('exhale-value').textContent = exhale;
}

function startBreathing() {
    if (breathingActive) return;

    breathingActive = true;
    document.getElementById('start-breathing').style.display = 'none';
    document.getElementById('stop-breathing').style.display = 'inline-block';

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breath-text');

    const inhaleTime = parseInt(document.getElementById('inhale-duration').value) * 1000;
    const holdTime = parseInt(document.getElementById('hold-duration').value) * 1000;
    const exhaleTime = parseInt(document.getElementById('exhale-duration').value) * 1000;

    function breatheCycle() {
        if (!breathingActive) return;

        // Inhale
        text.textContent = 'Inhale';
        circle.classList.add('inhale');

        setTimeout(() => {
            if (!breathingActive) return;

            // Hold
            text.textContent = 'Hold';
            circle.classList.remove('inhale');
            circle.classList.add('hold');

            setTimeout(() => {
                if (!breathingActive) return;

                // Exhale
                text.textContent = 'Exhale';
                circle.classList.remove('hold');
                circle.classList.add('exhale');

                setTimeout(() => {
                    if (!breathingActive) return;

                    circle.classList.remove('exhale');
                    setTimeout(breatheCycle, 1000);
                }, exhaleTime);
            }, holdTime);
        }, inhaleTime);
    }

    breatheCycle();
}

function stopBreathing() {
    breathingActive = false;
    document.getElementById('start-breathing').style.display = 'inline-block';
    document.getElementById('stop-breathing').style.display = 'none';

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breath-text');

    circle.className = 'breathing-circle';
    text.textContent = 'Breathe';
}

// Meditation Timer
function initializeMeditation() {
    const presets = document.querySelectorAll('.preset-btn');
    const startBtn = document.getElementById('start-meditation');
    const pauseBtn = document.getElementById('pause-meditation');
    const resetBtn = document.getElementById('reset-meditation');

    presets.forEach(btn => {
        btn.addEventListener('click', function () {
            presets.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            meditationDuration = parseInt(this.getAttribute('data-minutes'));
            updateMeditationDisplay();
        });
    });

    if (startBtn) startBtn.addEventListener('click', startMeditation);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseMeditation);
    if (resetBtn) resetBtn.addEventListener('click', resetMeditation);

    updateMeditationDisplay();
}

function updateMeditationDisplay() {
    const display = document.getElementById('meditation-time');
    const minutes = Math.floor(meditationDuration);
    display.textContent = `${minutes.toString().padStart(2, '0')}:00`;
}

function startMeditation() {
    if (meditationActive) return;

    meditationActive = true;
    let timeLeft = meditationDuration * 60; // Convert to seconds
    const totalTime = timeLeft;

    document.getElementById('start-meditation').style.display = 'none';
    document.getElementById('pause-meditation').style.display = 'inline-block';
    document.getElementById('timer-status').textContent = 'Meditating';

    meditationTimer = setInterval(() => {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('meditation-time').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update progress circle
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        updateMeditationProgress(progress);

        if (timeLeft <= 0) {
            completeMeditation();
        }
    }, 1000);
}

function pauseMeditation() {
    if (!meditationActive) return;

    clearInterval(meditationTimer);
    meditationActive = false;

    document.getElementById('start-meditation').style.display = 'inline-block';
    document.getElementById('pause-meditation').style.display = 'none';
    document.getElementById('timer-status').textContent = 'Paused';
}

function resetMeditation() {
    clearInterval(meditationTimer);
    meditationActive = false;

    document.getElementById('start-meditation').style.display = 'inline-block';
    document.getElementById('pause-meditation').style.display = 'none';
    document.getElementById('timer-status').textContent = 'Ready';

    updateMeditationDisplay();
    updateMeditationProgress(0);
}

function completeMeditation() {
    clearInterval(meditationTimer);
    meditationActive = false;

    document.getElementById('start-meditation').style.display = 'inline-block';
    document.getElementById('pause-meditation').style.display = 'none';
    document.getElementById('timer-status').textContent = 'Complete';

    showToast('Meditation session complete! 🧘‍♀️', 'success');

    // Save session
    saveSession(meditationDuration);
    updateSessionStats();
}

function updateMeditationProgress(percentage) {
    const progressCircle = document.getElementById('meditation-progress');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 110;
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    }
}

// Using local sound files from the sounds folder

// Ambient Sounds System
function initializeAmbientSounds() {
    const soundItems = document.querySelectorAll('.sound-item');
    const volumeSlider = document.getElementById('volume-slider');

    // Initialize mobile audio context on first user interaction
    initializeMobileAudio();

    // Set up click handlers for each sound item
    soundItems.forEach(item => {
        item.addEventListener('click', function () {
            const soundType = this.getAttribute('data-sound');
            toggleAmbientSound(soundType, this);
        });
    });

    // Set up volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
            const volume = this.value / 100;
            document.getElementById('volume-value').textContent = this.value + '%';
            updateVolume(volume);
        });
    }

    // Test audio file accessibility
    testAudioFiles();
    
    // Set silence as default active state
    activateSilence();
}

// Mobile audio initialization
function initializeMobileAudio() {
    let audioInitialized = false;
    
    const initAudio = () => {
        if (audioInitialized) return;
        
        // Create a silent audio element to unlock audio on mobile
        const silentAudio = new Audio();
        silentAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmHgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        silentAudio.volume = 0;
        
        const playPromise = silentAudio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    audioInitialized = true;
                    console.log('Mobile audio context initialized');
                })
                .catch(() => {
                    // Silent fail - this is expected on some browsers
                });
        }
    };
    
    // Try to initialize on various user interactions
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
    events.forEach(event => {
        document.addEventListener(event, initAudio, { once: true, passive: true });
    });
}



function toggleAmbientSound(soundType, element) {
    const button = element.querySelector('.sound-toggle');

    // Handle silence button
    if (soundType === 'silence') {
        stopAllSounds();
        activateSilence();
        return;
    }

    // If this sound is currently playing, stop it and return to silence
    if (currentAmbientSound && currentAmbientSound.type === soundType) {
        stopAllSounds();
        activateSilence();
        return;
    }

    // Stop any current sound and play this one
    stopAllSounds();
    resetAllButtons();

    // Show loading state
    button.textContent = 'Loading...';
    element.classList.add('active');

    // Get sound file path with fallback
    let soundPath = SOUND_SOURCES[USE_SOUND_SOURCE][soundType];
    if (!soundPath) {
        console.error(`Sound path not found for: ${soundType}`);
        showToast(`Sound file not found: ${soundType}`, 'error');
        activateSilence();
        return;
    }

    console.log(`Loading audio: ${soundType} from ${soundPath}`);

    // Create and play audio with mobile-friendly approach
    currentAudio = new Audio();
    currentAudio.src = soundPath;
    currentAudio.loop = true;
    currentAudio.volume = document.getElementById('volume-slider').value / 100;
    
    // Mobile-specific audio settings
    currentAudio.preload = 'auto';
    // Remove crossOrigin for local files as it can cause CORS issues
    // currentAudio.crossOrigin = 'anonymous';

    // Handle successful loading
    const onCanPlay = () => {
        // Try to play immediately after user interaction
        const playPromise = currentAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    button.textContent = 'Stop';
                    button.classList.add('active');
                    currentAmbientSound = { type: soundType, audio: currentAudio };
                    console.log(`Successfully playing ${soundType} on mobile`);
                })
                .catch((error) => {
                    console.error('Mobile play failed:', error);
                    // For mobile, show a more helpful message
                    if (error.name === 'NotAllowedError') {
                        showToast(`Tap the ${soundType} button again to play`, 'info');
                        button.textContent = 'Tap to Play';
                        // Keep the button active so user can try again
                        return;
                    }
                    showToast(`Cannot play ${soundType}: ${error.message}`, 'error');
                    activateSilence();
                });
        }
    };

    // Handle loading errors with fallback
    const onError = (e) => {
        console.error(`Audio loading error for ${soundType}:`, e);
        console.error('Attempted to load:', soundPath);
        console.error('Audio error details:', currentAudio.error);
        
        // Try fallback to web sounds if local sounds fail
        if (USE_SOUND_SOURCE === 'local' && SOUND_SOURCES.web[soundType]) {
            console.log(`Trying fallback web sound for ${soundType}`);
            const fallbackPath = SOUND_SOURCES.web[soundType];
            
            // Create new audio with fallback
            currentAudio = new Audio();
            currentAudio.src = fallbackPath;
            currentAudio.loop = true;
            currentAudio.volume = document.getElementById('volume-slider').value / 100;
            currentAudio.preload = 'auto';
            
            currentAudio.addEventListener('canplaythrough', () => {
                const playPromise = currentAudio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            button.textContent = 'Stop';
                            button.classList.add('active');
                            currentAmbientSound = { type: soundType, audio: currentAudio };
                            console.log(`Successfully playing ${soundType} from web fallback`);
                        })
                        .catch(() => {
                            showToast(`Cannot play ${soundType} - both local and web sources failed`, 'error');
                            activateSilence();
                        });
                }
            }, { once: true });
            
            currentAudio.addEventListener('error', () => {
                showToast(`Failed to load ${soundType} - both local and web sources failed`, 'error');
                activateSilence();
            }, { once: true });
            
            currentAudio.load();
        } else {
            showToast(`Failed to load ${soundType} sound file`, 'error');
            activateSilence();
        }
    };

    // Set up event listeners
    currentAudio.addEventListener('canplaythrough', onCanPlay, { once: true });
    currentAudio.addEventListener('error', onError, { once: true });
    
    // For mobile: also try on 'loadeddata' event
    currentAudio.addEventListener('loadeddata', () => {
        if (currentAudio.readyState >= 2) { // HAVE_CURRENT_DATA
            onCanPlay();
        }
    }, { once: true });

    // Add timeout to handle loading failures
    const loadTimeout = setTimeout(() => {
        console.error(`Audio loading timeout for ${soundType}`);
        showToast(`Loading timeout for ${soundType}`, 'error');
        activateSilence();
    }, 10000); // 10 second timeout

    // Clear timeout on successful load
    const originalOnCanPlay = onCanPlay;
    const wrappedOnCanPlay = () => {
        clearTimeout(loadTimeout);
        originalOnCanPlay();
    };

    // Update the event listener to use wrapped function
    currentAudio.removeEventListener('canplaythrough', onCanPlay);
    currentAudio.addEventListener('canplaythrough', wrappedOnCanPlay, { once: true });

    // Start loading
    currentAudio.load();
}

// Helper function to stop all sounds
function stopAllSounds() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    if (currentAmbientSound) {
        currentAmbientSound = null;
    }
}

// Helper function to reset all buttons to default state
function resetAllButtons() {
    document.querySelectorAll('.sound-item').forEach(item => {
        item.classList.remove('active');
        const button = item.querySelector('.sound-toggle');
        button.textContent = 'Play';
        button.classList.remove('active');
    });
}

// Helper function to activate silence mode
function activateSilence() {
    resetAllButtons();
    const silenceItem = document.querySelector('.sound-item[data-sound="silence"]');
    if (silenceItem) {
        silenceItem.classList.add('active');
        const button = silenceItem.querySelector('.sound-toggle');
        button.textContent = 'Active';
        button.classList.add('active');
    }
    currentAmbientSound = { type: 'silence' };
}

// Helper function to update volume (removed duplicate - using the one below)

// Removed old Web Audio API functions - now using HTML5 Audio with local files

// Legacy function removed - using stopAllSounds() directly

function updateVolume(volume) {
    // Update volume for HTML5 Audio elements
    if (currentAudio) {
        currentAudio.volume = volume;
    }
}

// Session Tracking
function initializeSessionTracking() {
    const clearDataBtn = document.getElementById('clear-data');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearSessionData);
    }

    updateSessionStats();
    loadRecentSessions();
}

function saveSession(duration) {
    const sessions = storage.get('meditationSessions') || [];
    sessions.push({
        duration: duration,
        date: new Date().toISOString(),
        completed: true
    });

    storage.set('meditationSessions', sessions);
}

function updateSessionStats() {
    const sessions = storage.get('meditationSessions') || [];

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const currentStreak = calculateCurrentStreak(sessions);
    const longestStreak = calculateLongestStreak(sessions);

    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('total-time').textContent = totalMinutes + 'm';
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('longest-streak').textContent = longestStreak;
}

function calculateCurrentStreak(sessions) {
    if (sessions.length === 0) return 0;

    const today = new Date();
    let streak = 0;

    for (let i = sessions.length - 1; i >= 0; i--) {
        const sessionDate = new Date(sessions[i].date);
        const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function calculateLongestStreak(sessions) {
    // Simplified calculation
    return Math.max(5, sessions.length);
}

function loadRecentSessions() {
    const sessions = storage.get('meditationSessions') || [];
    const sessionsList = document.getElementById('sessions-list');

    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p class="no-sessions">No sessions yet. Start your first meditation!</p>';
        return;
    }

    const recentSessions = sessions.slice(-5).reverse();
    const html = recentSessions.map(session => `
        <div class="session-item">
            <span class="session-date">${formatDate(session.date)}</span>
            <span class="session-duration">${session.duration} min</span>
        </div>
    `).join('');

    sessionsList.innerHTML = html;
}

function clearSessionData() {
    if (confirm('Are you sure you want to clear all session data?')) {
        storage.remove('meditationSessions');
        updateSessionStats();
        loadRecentSessions();
        showToast('Session data cleared', 'success');
    }
}

function loadSettings() {
    // Load saved breathing settings
    const savedBreathing = storage.get('breathingSettings');
    if (savedBreathing) {
        document.getElementById('inhale-duration').value = savedBreathing.inhale || 4;
        document.getElementById('hold-duration').value = savedBreathing.hold || 4;
        document.getElementById('exhale-duration').value = savedBreathing.exhale || 6;
        updateBreathingSettings();
    }
}

// Save settings when changed
document.addEventListener('change', function (e) {
    if (e.target.matches('#inhale-duration, #hold-duration, #exhale-duration')) {
        const settings = {
            inhale: document.getElementById('inhale-duration').value,
            hold: document.getElementById('hold-duration').value,
            exhale: document.getElementById('exhale-duration').value
        };
        storage.set('breathingSettings', settings);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { saveSession, calculateCurrentStreak };
}