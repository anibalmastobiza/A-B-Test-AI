// 1. Configuration
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
const PROLIFIC_COMPLETION_URL = 'https://app.prolific.co/submissions/complete?cc=YOUR_CODE';

// 2. Randomization (A/B Test)
const conditions = ['Human', 'AI'];
const assignedCondition = conditions[Math.floor(Math.random() * conditions.length)];

// 3. Setup Content based on Condition
const agentName = assignedCondition === 'Human' ? 'Dr. Thorne' : 'TheraBot AI';
document.getElementById('agent-name').innerText = agentName;
document.getElementById('agent-title').innerText = `Case Review by ${agentName}`;

// Set Avatar Image (Placeholder logic)
const avatarDiv = document.getElementById('agent-visual');
if(assignedCondition === 'Human') {
    // You would insert a real image URL here
    avatarDiv.style.backgroundImage = "url('path/to/doctor_face.jpg')"; 
} else {
    avatarDiv.style.backgroundImage = "url('path/to/robot_face.jpg')";
}

// 4. Navigation Logic
function nextSlide(id) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function validateAndNext(nextId) {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    if(!age || !gender) {
        alert("Please answer all questions to proceed.");
        return;
    }
    nextSlide(nextId);
}

// 5. Browser Audio Logic (Web Speech API)
function playAudioAndReveal() {
    const textToSay = "Alex, I've looked at your data. Your recovery markers are stable. Let's focus on maintaining your routine today.";
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(textToSay);
    
    // Adjust voice based on condition if possible, or keep neutral
    // Note: Browser voices vary by user OS.
    utterance.rate = 0.9; // Slightly slower for gravity
    
    // Play audio
    window.speechSynthesis.speak(utterance);
    
    // Move to next slide immediately or after delay
    nextSlide('slide-action');
}

// 6. Data Submission
function submitData() {
    // Collect data
    const data = {
        condition: assignedCondition,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        experience: document.getElementById('experience').value,
        moral_rating: document.querySelector('input[name="moral"]:checked')?.value,
        trust_rating: document.querySelector('input[name="trust"]:checked')?.value,
        timestamp: new Date().toISOString()
    };

    if(!data.moral_rating || !data.trust_rating) {
        alert("Please answer all questions.");
        return;
    }

    // Send to Google Sheets via fetch (POST)
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', 
        mode: 'no-cors', // Important for Google Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        // Redirect to Prolific
        window.location.href = PROLIFIC_COMPLETION_URL;
    }).catch(err => {
        console.error('Error:', err);
        // Redirect anyway to ensure payment? Or show error.
        window.location.href = PROLIFIC_COMPLETION_URL;
    });
}
