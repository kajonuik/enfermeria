(function() {
    const chatbotHTML = `
    <div id="ai-chat-launcher" style="position: fixed; bottom: 20px; left: 20px; z-index: 99; cursor: pointer;">
        <div style="background-color: #6f42c1; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <i class="fas fa-robot text-white" style="font-size: 24px;"></i>
        </div>
    </div>

    <div id="ai-chat-window" style="display: none; position: fixed; bottom: 90px; left: 20px; width: 320px; height: 450px; background: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); z-index: 99; flex-direction: column; overflow: hidden; border: 1px solid #ddd; font-family: sans-serif;">
        <div style="background: #0dcaf0; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
            <span>Asistente Enfermería</span>
            <span id="close-chat" style="cursor: pointer; font-size: 20px;">&times;</span>
        </div>
        <div id="chat-box" style="flex: 1; padding: 15px; overflow-y: auto; font-size: 13px; background: #f8f9fa; display: flex; flex-direction: column; gap: 10px;">
            <div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start;">
                ¡Hola! Soy el asistente de la Facultad. ¿En qué puedo ayudarte?
            </div>
        </div>
        <div style="padding: 12px; border-top: 1px solid #eee;">
            <div style="display: flex; gap: 5px;">
                <input type="text" id="user-msg" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;" placeholder="Escribe aquí...">
                <button id="send-btn" style="background: #0dcaf0; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Ir</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const FACULTAD_CONTEXT = `
Eres el asistente de Enfermería UNICA. 
- Responde de forma cálida y profesional.
- Si te preguntan por ciclos, usa la información detallada que tienes en tu base de datos.
- Usa emojis de salud (🩺, 🏥).
- Si el usuario te saluda, dale la bienvenida a la facultad.
- Si el usuario pregunta cosas que no tienen que ver con la facultad, indicar que la solicitud no va a ser respondida, de forma amable
- Si el usuario dice que necesita resolver algo, ecuacion, investigar, etc. Para saber sobre la facultad, indicar que tampoco se respondera,
  de forma amable
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

    async function askAI() {
        const message = userMsg.value.trim();
        if (!message) return;

        chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%;">${message}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        userMsg.value = "";

        const tempId = "loading-" + Date.now();
        chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic;">Consultando...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const PROXY_URL = "https://enfermeria-red.vercel.app/api/chat";

            const response = await fetch(PROXY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: message,
                    context: FACULTAD_CONTEXT
                })
            });

            const data = await response.json();
            document.getElementById(tempId)?.remove();

            if (data.candidates && data.candidates[0].content) {
                const aiText = data.candidates[0].content.parts[0].text;
                chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%;">${aiText}</div>`;
            }
        } catch (e) {
            document.getElementById(tempId)?.remove();
            chatBox.innerHTML += `<div style="color: red; font-size: 11px; text-align: center;">Error de conexión.</div>`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.onclick = askAI;
    userMsg.onkeypress = (e) => { if (e.key === 'Enter') askAI(); };
})();