// ================= CONFIGURATION =================
// 1. URL for Google Sheets (Google Apps Script Web App URL)
const GOOGLE_SCRIPT_URL = 'PON_AQUI_TU_URL_DE_GOOGLE_SCRIPT';

// 2. Prolific Completion URL
const PROLIFIC_COMPLETION_URL = 'https://app.prolific.co/submissions/complete?cc=TU_CODIGO_AQUI';


// ================= EXPERIMENTAL LOGIC (2x2) =================
// Factors
const agents = ['Human', 'AI'];
const modalities = ['Text', 'AV']; // AV = Audio/Visual

// Random Assignment
const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
const assignedModality = modalities[Math.floor(Math.random() * modalities.length)];

// Unique code for analysis (e.g., "AI_AV")
const conditionCode = `${assignedAgent}_${assignedModality}`;
console.log(`Participant assigned to: ${conditionCode}`);

// Content Configuration
// IMPORTANT: Ensure you have 'img/doctor.jpg' and 'img/robot.jpg' or these will be blank.
const config = {
    Human: { 
        name: "Dr. Thorne", 
        title: "Senior Psychiatrist",
        imgUrl: "url('img/doctor.jpg')" 
    },
    AI: { 
        name: "TheraBot AI", 
        title: "Advanced Therapeutic System",
        imgUrl: "url('img/robot.jpg')" 
    }
};

const currentAgentConfig = config[assignedAgent];


// ================= INITIALIZATION =================
// Runs when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // 1. Set Text Elements
    const titleEl = document.getElementById('agent-title');
    const nameSpan = document.getElementById('agent-name-span');
    
    if(titleEl) titleEl.innerText = `Case Review by ${currentAgentConfig.name}`;
    if(nameSpan) nameSpan.innerText = currentAgentConfig.name;

    // 2. Set Visual Elements (Only if condition is AV)
    if (assignedModality === 'AV') {
        const visualContainer = document.getElementById('visual-container');
        const avatarDiv = document.getElementById('agent-visual');
        const miniAvatar = document.getElementById('agent-display-area-small');
        
        if(visualContainer) visualContainer.style.display = 'block'; 
        
        if(avatarDiv) avatarDiv.style.backgroundImage = currentAgentConfig.imgUrl;
        
        if(miniAvatar) {
            miniAvatar.className = 'avatar-circle';
            miniAvatar.style.width = '80px';    
            miniAvatar.style.height = '80px';
            miniAvatar.style.backgroundImage = currentAgentConfig.imgUrl;
        }
    }
});


// ================= NAVIGATION FUNCTIONS =================

function nextSlide(id) {
    // Hide all slides
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    
    // Show target slide
    const targetSlide = document.getElementById(id);
    if(targetSlide) {
        targetSlide.classList.add('active');
        window.scrollTo(0, 0); // Scroll to top
    } else {
        console.error("Slide not found:", id);
    }
}

function validateAndNext(nextId) {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    
    if(!age || !gender) {
        alert("Please select both your age range and gender to continue.");
        return;
    }
    nextSlide(nextId);
}


// ================= STIMULI & AUDIO =================

function revealAction() {
    // Play audio only if in AV condition
    if (assignedModality === 'AV') {
        const textToSpeak = "Alex, I've reviewed your recent data. Your recovery markers look stable. Let's just focus on maintaining your positive routine today.";
        speakText(textToSpeak);
    }
    
    // Slight delay for effect, then move to action
    setTimeout(() => {
        nextSlide('slide-action');
    }, 400);
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        // Stop any previous speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.95; 

        // Optional: Try to change voice based on agent
        const voices = window.speechSynthesis.getVoices();
        // This is a basic attempt to find a Google voice, falls back to default
        const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
        if(preferredVoice) utterance.voice = preferredVoice;

        if (assignedAgent === 'AI') {
            utterance.pitch = 1.1; // Slightly higher/robotic
        }

        window.speechSynthesis.speak(utterance);
    }
}


// ================= DATA SUBMISSION =================

function submitData() {
    // 1. Get Values
    const moral = document.querySelector('input[name="moral"]:checked')?.value;
    const trust = document.querySelector('input[name="trust"]:checked')?.value;

    if (!moral || !trust) {
        alert("Please answer both questions to complete the study.");
        return;
    }

    // 2. Show loading screen
    nextSlide('slide-loading');

    // 3. Prepare Data
    // Get Prolific ID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const prolificID = urlParams.get('PROLIFIC_PID') || 'anonymous';

    const data = {
        prolific_id: prolificID,
        condition: conditionCode,
        agent: assignedAgent,
        modality: assignedModality,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        moral_rating: moral,
        trust_rating: trust,
        timestamp: new Date().toISOString()
    };

    console.log("Submitting:", data);

    // 4. Send to Google Sheets and Redirect
    // NOTE: 'no-cors' mode is required for Google Scripts but means we can't read the response.
    // We assume success and redirect.
    
    if (GOOGLE_SCRIPT_URL.includes("GOOGLE_SCRIPT")) {
        // If user hasn't set the URL yet, simulate delay then redirect
        console.warn("Google Script URL not set. Simulating...");
        setTimeout(() => {
            window.location.href = PROLIFIC_COMPLETION_URL;
        }, 1500);
    } else {
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Success - Redirect to Prolific
            window.location.href = PROLIFIC_COMPLETION_URL;
        })
        .catch(err => {
            console.error("Error:", err);
            // Redirect anyway so participant gets paid
            window.location.href = PROLIFIC_COMPLETION_URL;
        });
    }
}
