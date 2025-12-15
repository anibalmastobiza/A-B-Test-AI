// 1. Randomización Factorial (2x2)
// Definimos los factores
const agents = ['Human', 'AI'];
const modalities = ['Text', 'AV']; // AV = Audio/Visual

// Asignación aleatoria independiente
const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
const assignedModality = modalities[Math.floor(Math.random() * modalities.length)];

// Guardamos la condición completa para el Excel
const conditionCode = `${assignedAgent}_${assignedModality}`; 

console.log("Condición asignada:", conditionCode);

// 2. Configuración del Estímulo
const config = {
    Human: { name: "Dr. Thorne", img: "url('img/doctor.jpg')" }, // Necesitas subir estas fotos a la carpeta img/
    AI: { name: "TheraBot AI", img: "url('img/robot.jpg')" }
};

const currentAgent = config[assignedAgent];

// Actualizar textos en pantalla
document.getElementById('agent-title').innerText = `Revisión del caso por ${currentAgent.name}`;
document.getElementById('agent-name-span').innerText = currentAgent.name;

// Configurar Avatar si la modalidad es AV
if (assignedModality === 'AV') {
    const visualContainer = document.getElementById('visual-container');
    const avatarDiv = document.getElementById('agent-visual');
    
    visualContainer.style.display = 'block'; // Mostrar contenedor
    avatarDiv.style.backgroundImage = currentAgent.img;
}

// 3. Función de Revelación (Acción)
function revealAction() {
    // Si es modalidad Audio/Visual, reproducimos audio
    if (assignedModality === 'AV') {
        speakText(`Alex, he mirado tus datos. Tus marcadores son estables. Centrémonos en mantener tu rutina hoy.`);
    }
    
    // Pasamos a la siguiente diapositiva
    // Pequeño delay si es audio para que parezca natural, o inmediato
    nextSlide('slide-action');
}

// Función TTS (Text-to-Speech) del navegador
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Forzamos español
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        console.log("El navegador no soporta audio.");
    }
}

// ... (Resto de funciones nextSlide, validateAndNext igual que antes)

// 4. Envío de Datos (Actualizado con rangos)
function submitData() {
    const data = {
        condition: conditionCode, // Ej: "Human_AV"
        agent_factor: assignedAgent,
        modality_factor: assignedModality,
        age_range: document.getElementById('age').value, // Ahora coge el rango
        // ... resto de campos
    };
    
    // ... fetch a Google Sheets
}
