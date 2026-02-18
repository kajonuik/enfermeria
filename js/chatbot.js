// 1. DISEÑO DEL CHAT (Inyección de HTML)
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
            ¡Hola! Soy el asistente de la Facultad de Enfermería UNICA. Tengo información sobre la malla curricular, la Decana Dra. Susana Alvarado y más. ¿Qué deseas consultar?
        </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #eee; background: white;">
        <div class="input-group" style="display: flex; gap: 5px;">
            <input type="text" id="user-msg" class="form-control" style="font-size: 13px;" placeholder="Escribe aquí...">
            <button id="send-btn" class="btn btn-info text-white" style="padding: 5px 15px;"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 2. CONFIGURACIÓN DE LA API
const API_KEY = "AIzaSyDcA2sCiyS_EJVErU7vKL5YvKpDDviYRJk"; 

// Toda la información que nos dio AI Studio se queda aquí como "instrucción de sistema"
const FACULTAD_CONTEXT = `
Contexto: Facultad de Enfermería de la UNICA (Ica, Perú).
Decana: Dra. Susana Alvarado Alfaro.
Historia: Creada oficialmente el 31 de octubre de 1984.
Malla Curricular: 10 ciclos. Desde Biología en el Ciclo 1 hasta Tesis y Prácticas en el Ciclo 10.
Instrucciones: Eres un asistente amable. Responde basándote en esta info. Si no sabes, invita a ir a la Ciudad Universitaria.
`;

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

// 3. FUNCIÓN DE LLAMADA A LA IA
async function askAI() {
    const message = userMsg.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Consultando datos de la UNICA...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Usamos gemini-1.5-flash porque el 3-flash-preview suele dar 404 en llamadas directas de navegador
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: FACULTAD_CONTEXT }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();

        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        
    } catch (e) {
        console.error("Error:", e);
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();
        chatBox.innerHTML += `<div style="color: #dc3545; font-size: 11px; text-align: center; padding: 5px;">Error de conexión. Prueba de nuevo en un momento.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = askAI;
userMsg.onkeypress = (e) => { if (e.key === 'Enter') askAI(); };// 1. DISEÑO DEL CHAT (Inyección de HTML)
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
            ¡Hola! Soy el asistente de la Facultad de Enfermería UNICA. Tengo información sobre la malla curricular, la Decana Dra. Susana Alvarado y más. ¿Qué deseas consultar?
        </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #eee; background: white;">
        <div class="input-group" style="display: flex; gap: 5px;">
            <input type="text" id="user-msg" class="form-control" style="font-size: 13px;" placeholder="Escribe aquí...">
            <button id="send-btn" class="btn btn-info text-white" style="padding: 5px 15px;"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 2. CONFIGURACIÓN DE LA API
const API_KEY = "AIzaSyDcA2sCiyS_EJVErU7vKL5YvKpDDviYRJk"; 

// Toda la información que nos dio AI Studio se queda aquí como "instrucción de sistema"
const FACULTAD_CONTEXT = `
Contexto: Facultad de Enfermería de la UNICA (Ica, Perú).
Decana: Dra. Susana Alvarado Alfaro.
Historia: Creada oficialmente el 31 de octubre de 1984.
Malla Curricular: 10 ciclos. Desde Biología en el Ciclo 1 hasta Tesis y Prácticas en el Ciclo 10.
Instrucciones: Eres un asistente amable. Responde basándote en esta info. Si no sabes, invita a ir a la Ciudad Universitaria.
`;

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

// 3. FUNCIÓN DE LLAMADA A LA IA
async function askAI() {
    const message = userMsg.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Consultando datos de la UNICA...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Usamos gemini-1.5-flash porque el 3-flash-preview suele dar 404 en llamadas directas de navegador
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: FACULTAD_CONTEXT }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();

        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        
    } catch (e) {
        console.error("Error:", e);
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();
        chatBox.innerHTML += `<div style="color: #dc3545; font-size: 11px; text-align: center; padding: 5px;">Error de conexión. Prueba de nuevo en un momento.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = askAI;
userMsg.onkeypress = (e) => { if (e.key === 'Enter') askAI(); };// 1. DISEÑO DEL CHAT (Inyección de HTML)
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
            ¡Hola! Soy el asistente de la Facultad de Enfermería UNICA. Tengo información sobre la malla curricular, la Decana Dra. Susana Alvarado y más. ¿Qué deseas consultar?
        </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #eee; background: white;">
        <div class="input-group" style="display: flex; gap: 5px;">
            <input type="text" id="user-msg" class="form-control" style="font-size: 13px;" placeholder="Escribe aquí...">
            <button id="send-btn" class="btn btn-info text-white" style="padding: 5px 15px;"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 2. CONFIGURACIÓN DE LA API
const API_KEY = "AIzaSyDcA2sCiyS_EJVErU7vKL5YvKpDDviYRJk"; 

// Toda la información que nos dio AI Studio se queda aquí como "instrucción de sistema"
const FACULTAD_CONTEXT = `
Contexto: Facultad de Enfermería de la UNICA (Ica, Perú).
Decana: Dra. Susana Alvarado Alfaro.
Historia: Creada oficialmente el 31 de octubre de 1984.
Malla Curricular: 10 ciclos. Desde Biología en el Ciclo 1 hasta Tesis y Prácticas en el Ciclo 10.
Instrucciones: Eres un asistente amable. Responde basándote en esta info. Si no sabes, invita a ir a la Ciudad Universitaria.
`;

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

// 3. FUNCIÓN DE LLAMADA A LA IA
async function askAI() {
    const message = userMsg.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Consultando datos de la UNICA...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Usamos gemini-1.5-flash porque el 3-flash-preview suele dar 404 en llamadas directas de navegador
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: FACULTAD_CONTEXT }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();

        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        
    } catch (e) {
        console.error("Error:", e);
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();
        chatBox.innerHTML += `<div style="color: #dc3545; font-size: 11px; text-align: center; padding: 5px;">Error de conexión. Prueba de nuevo en un momento.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = askAI;
userMsg.onkeypress = (e) => { if (e.key === 'Enter') askAI(); };// 1. DISEÑO DEL CHAT (Inyección de HTML)
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
            ¡Hola! Soy el asistente de la Facultad de Enfermería UNICA. Tengo información sobre la malla curricular, la Decana Dra. Susana Alvarado y más. ¿Qué deseas consultar?
        </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #eee; background: white;">
        <div class="input-group" style="display: flex; gap: 5px;">
            <input type="text" id="user-msg" class="form-control" style="font-size: 13px;" placeholder="Escribe aquí...">
            <button id="send-btn" class="btn btn-info text-white" style="padding: 5px 15px;"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 2. CONFIGURACIÓN DE LA API
const API_KEY = "AIzaSyDcA2sCiyS_EJVErU7vKL5YvKpDDviYRJk"; 

// Toda la información que nos dio AI Studio se queda aquí como "instrucción de sistema"
const FACULTAD_CONTEXT = `
Contexto: Facultad de Enfermería de la UNICA (Ica, Perú).
Decana: Dra. Susana Alvarado Alfaro.
Historia: Creada oficialmente el 31 de octubre de 1984.
Malla Curricular: 10 ciclos. Desde Biología en el Ciclo 1 hasta Tesis y Prácticas en el Ciclo 10.
Instrucciones: Eres un asistente amable. Responde basándote en esta info. Si no sabes, invita a ir a la Ciudad Universitaria.
`;

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

// 3. FUNCIÓN DE LLAMADA A LA IA
async function askAI() {
    const message = userMsg.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Consultando datos de la UNICA...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Usamos gemini-1.5-flash porque el 3-flash-preview suele dar 404 en llamadas directas de navegador
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: FACULTAD_CONTEXT }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();

        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        
    } catch (e) {
        console.error("Error:", e);
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();
        chatBox.innerHTML += `<div style="color: #dc3545; font-size: 11px; text-align: center; padding: 5px;">Error de conexión. Prueba de nuevo en un momento.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = askAI;
userMsg.onkeypress = (e) => { if (e.key === 'Enter') askAI(); };// 1. DISEÑO DEL CHAT (Inyección de HTML)
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
            ¡Hola! Soy el asistente de la Facultad de Enfermería UNICA. Tengo información sobre la malla curricular, la Decana Dra. Susana Alvarado y más. ¿Qué deseas consultar?
        </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #eee; background: white;">
        <div class="input-group" style="display: flex; gap: 5px;">
            <input type="text" id="user-msg" class="form-control" style="font-size: 13px;" placeholder="Escribe aquí...">
            <button id="send-btn" class="btn btn-info text-white" style="padding: 5px 15px;"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 2. CONFIGURACIÓN DE LA API
const API_KEY = "AIzaSyDcA2sCiyS_EJVErU7vKL5YvKpDDviYRJk"; 

// Toda la información que nos dio AI Studio se queda aquí como "instrucción de sistema"
const FACULTAD_CONTEXT = `
Contexto: Facultad de Enfermería de la UNICA (Ica, Perú).
Decana: Dra. Susana Alvarado Alfaro.
Historia: Creada oficialmente el 31 de octubre de 1984.
Malla Curricular: 10 ciclos. Desde Biología en el Ciclo 1 hasta Tesis y Prácticas en el Ciclo 10.
Instrucciones: Eres un asistente amable. Responde basándote en esta info. Si no sabes, invita a ir a la Ciudad Universitaria.
`;

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

// 3. FUNCIÓN DE LLAMADA A LA IA
async function askAI() {
    const message = userMsg.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Consultando datos de la UNICA...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Usamos gemini-1.5-flash porque el 3-flash-preview suele dar 404 en llamadas directas de navegador
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: FACULTAD_CONTEXT }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();

        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        
    } catch (e) {
        console.error("Error:", e);
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();
        chatBox.innerHTML += `<div style="color: #dc3545; font-size: 11px; text-align: center; padding: 5px;">Error de conexión. Prueba de nuevo en un momento.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = askAI;
userMsg.onkeypress = (e) => { if (e.key === 'Enter') askAI(); };
