// ================= CONFIGURATION =================
// PEGA AQUÍ TU URL DE GOOGLE SCRIPT SI LA TIENES, SI NO, DÉJALO ASÍ
const GOOGLE_SCRIPT_URL = 'URL_PENDIENTE'; 
const PROLIFIC_COMPLETION_URL = 'https://app.prolific.co/submissions/complete?cc=TU_CODIGO';

// ================= EXPERIMENTAL LOGIC =================
const agents = ['Human', 'AI'];
const modalities = ['Text', 'AV']; 

const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
const assignedModality = modalities[Math.floor(Math.random() * modalities.length)];
const conditionCode = `${assignedAgent}_${assignedModality}`;
console.log(`Condition: ${conditionCode}`);

// CONFIGURACIÓN DE IMÁGENES (Corregido para archivos en la raíz)
const config = {
    Human: { 
        name: "Dr. Thorne", 
        imgUrl: "url('doctor.jpg')" // CAMBIO: Quitada la carpeta img/
    },
    AI: { 
        name: "TheraBot AI", 
        imgUrl: "url('robot.jpg')"  // CAMBIO: Quitada la carpeta img/
    }
};

const currentConfig = config[assignedAgent];

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('agent-title').innerText = `Case Review by ${currentConfig.name}`;
    document.getElementById('agent-name-span').innerText = currentConfig.name;

    if (assignedModality === 'AV') {
        document.getElementById('visual-container').style.display = 'block'; 
        document.getElementById('agent-visual').style.backgroundImage = currentConfig.imgUrl;
        
        const miniAvatar = document.getElementById('agent-display-area-small');
        miniAvatar.className = 'avatar-circle';
        miniAvatar.style.width = '80px';    
        miniAvatar.style.height = '80px';
        miniAvatar.style.backgroundImage = currentConfig.imgUrl;
    }
});

// ================= NAVIGATION =================
function nextSlide(id) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function validateAndNext(nextId) {
    if(!document.getElementById('age').value || !document.getElementById('gender').value) {
        alert("Please answer all questions.");
        return;
    }
    nextSlide(nextId);
}

// ================= AUDIO LOGIC =================
function revealAction() {
    if (assignedModality === 'AV') {
        if (assignedAgent === 'Human') {
            // CAMBIO: Quitada la carpeta audio/ porque el archivo está suelto
            const audio = new Audio('doctor.mp3');
            audio.play().catch(e => console.error("Audio error:", e));
        } else {
            const text = "Alex, I've reviewed your recent data. Your recovery markers look stable. Let's just focus on maintaining your positive routine today.";
            speakRobotic(text);
        }
    }

    const delay = (assignedModality === 'AV' && assignedAgent === 'Human') ? 800 : 500;
    setTimeout(() => {
        nextSlide('slide-action');
    }, delay);
}

function speakRobotic(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.9; 
        
        const voices = window.speechSynthesis.getVoices();
        const aiVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
        if(aiVoice) utterance.voice = aiVoice;
        utterance.pitch = 1.05; 

        window.speechSynthesis.speak(utterance);
    }
}

// ================= DATA SUBMISSION =================
function submitData() {
    const moral = document.querySelector('input[name="moral"]:checked')?.value;
    const trust = document.querySelector('input[name="trust"]:checked')?.value;

    if (!moral || !trust) {
        alert("Please answer both questions.");
        return;
    }

    nextSlide('slide-loading');

    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('PROLIFIC_PID') || 'anonymous';

    const data = {
        prolific_id: pid,
        condition: conditionCode,
        agent: assignedAgent,
        modality: assignedModality,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        moral_rating: moral,
        trust_rating: trust,
        timestamp: new Date().toISOString()
    };

    if (GOOGLE_SCRIPT_URL.includes("URL_PENDIENTE")) {
        console.log("Simulando envío:", data);
        setTimeout(() => window.location.href = PROLIFIC_COMPLETION_URL, 1500);
    } else {
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => window.location.href = PROLIFIC_COMPLETION_URL)
        .catch(() => window.location.href = PROLIFIC_COMPLETION_URL);
    }
}
