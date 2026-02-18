// js/chatbot.js

// 1. Inyectamos el HTML dinámicamente al final del body
const chatbotHTML = `
<div id="ai-chat-launcher" style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; cursor: pointer;">
    <div style="background-color: #6f42c1; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <i class="fas fa-robot text-white" style="font-size: 24px;"></i>
    </div>
</div>

<div id="ai-chat-window" style="display: none; position: fixed; bottom: 90px; left: 20px; width: 320px; height: 450px; background: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); z-index: 9999; flex-direction: column; overflow: hidden; border: 1px solid #ddd; font-family: 'Roboto', sans-serif;">
    <div style="background: #0dcaf0; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
        <span><i class="fas fa-user-nurse me-2"></i>Asistente Enfermería</span>
        <span id="close-chat" style="cursor: pointer; font-size: 20px;">&times;</span>
    </div>
    <div id="chat-box" style="flex: 1; padding: 15px; overflow-y: auto; font-size: 13px; background: #f8f9fa; display: flex; flex-direction: column; gap: 10px;">
        <div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; color: #333; border-bottom-left-radius: 0;">
            ¡Hola! Soy el asistente virtual de la Facultad de Enfermería. ¿Tienes dudas sobre la admisión, el aula virtual o los programas?
        </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #eee; background: white;">
        <div class="input-group">
            <input type="text" id="user-msg" class="form-control form-control-sm" placeholder="Escribe tu consulta aquí...">
            <button id="send-btn" class="btn btn-sm btn-info text-white"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

// Insertamos el HTML en el documento
document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 2. Lógica de la IA (JavaScript puro)
const API_KEY = "AIzaSyDcA2sCiyS_EJVErU7vKL5YvKpDDviYRJk"; 

const launcher = document.getElementById('ai-chat-launcher');
const chatWin = document.getElementById('ai-chat-window');
const closeBtn = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userMsg = document.getElementById('user-msg');
const chatBox = document.getElementById('chat-box');

launcher.onclick = () => {
    chatWin.style.display = (chatWin.style.display === 'none' || chatWin.style.display === '') ? 'flex' : 'none';
};

closeBtn.onclick = () => { chatWin.style.display = 'none'; };

async function askAI(message) {
    if(!message.trim()) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Escribiendo...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Eres el asistente oficial de la Facultad de Enfermería de la UNICA. Responde brevemente: " + message }]
                }]
            })
        });

        const data = await response.json();
        document.getElementById(tempId).remove();

        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        
    } catch (e) {
        if(document.getElementById(tempId)) document.getElementById(tempId).remove();
        chatBox.innerHTML += `<div style="color: #dc3545; font-size: 11px; text-align: center; padding: 5px;">Error de conexión.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = () => askAI(userMsg.value);
userMsg.onkeypress = (e) => { if(e.key === 'Enter') askAI(userMsg.value); };
