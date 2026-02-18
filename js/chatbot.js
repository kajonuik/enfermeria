async function askAI() {
    const message = userMsg.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div style="background: #6f42c1; color: white; padding: 10px; border-radius: 10px; align-self: flex-end; max-width: 85%; border-bottom-right-radius: 0;">${message}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userMsg.value = "";

    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${tempId}" style="background: #eee; padding: 10px; border-radius: 10px; align-self: flex-start; font-style: italic; color: #777;">Consultando al asistente...</div>`;
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
        
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();

        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            chatBox.innerHTML += `<div style="background: #e9ecef; padding: 10px; border-radius: 10px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 0;">${aiText}</div>`;
        } else {
            throw new Error("Respuesta vacía");
        }
        
    } catch (e) {
        console.error("Error:", e);
        const loadingElement = document.getElementById(tempId);
        if (loadingElement) loadingElement.remove();
        chatBox.innerHTML += `<div style="color: red; font-size: 11px; text-align: center; padding: 5px;">Error de conexión con el servidor.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
