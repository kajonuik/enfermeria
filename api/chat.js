export default async function handler(req, res) {
    // Configuración de cabeceras CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const DATA_FACULTAD = `
HISTORIA Y AUTORIDADES:
- Fundada: 31 de octubre de 1984. 48 años de trayectoria.
- Decana Actual: Dra. Susana Alvarado Alfaro.
- Hito: En 1990 la Lic. Ángela Guerra Negri fue la primera enfermera en ser Decana.

MALLA CURRICULAR DETALLADA:
- Ciclo 1: Estrategia del Aprendizaje, Matemática, Defensa Nacional, Biología, Lenguaje.
- Ciclo 2: Informática/Bioestadística, Gestión de Riesgos, Química, Salud Comunitaria, Psicología.
- Ciclo 3: Anatomía, Intro a Enfermería, Sociología, Relaciones Humanas, Bioquímica, Fundamentos de Enfermería.
- Ciclo 4: Metodología de Atención, Microbiología, Fisiología, Nutrición, Epistemología.
- Ciclo 5: Crecimiento y Desarrollo del Niño, Inmunizaciones, Salud Comunitaria, Farmacología.
- Ciclo 6: Estadística, Epidemiología, Salud Pública, Salud Ocupacional, Salud Mental, Ética.
- Ciclo 7: Metodología de Investigación, Semiología, Salud del Niño/Adolescente, Salud Mujer, Salud Joven/Adulto.
- Ciclo 8: Neonato, Adulto Mayor, Urgencias y Cuidados Críticos, Proyecto de Investigación, Liderazgo.
- Ciclo 9: Seminario de Tesis, Gerencia en Salud, Prácticas I (Comunitaria).
- Ciclo 10: Salud Familiar, Enfermería Clínica, Prácticas II (Hospitalización), Tesis.

CONTACTO:
- Teléfono: (056) 407126 Anexo 101.
- Email: enfermeria.mesadepartes@unica.edu.pe
- Horario: Lun-Vie 8am a 3pm.
`;

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { message, context } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;
        const MODEL_NAME = "gemini-3-pro";

        // Combinamos la DATA del servidor con las INSTRUCCIONES y el MENSAJE
        const fullPrompt = `CONTEXTO INSTITUCIONAL:\n${DATA_FACULTAD}\n\nINSTRUCCIONES DE COMPORTAMIENTO:\n${context}\n\nPREGUNTA DEL USUARIO:\n${message}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });

        const data = await response.json();

        // Enviamos la respuesta final al chat
        return res.status(200).json(data);

    } catch (error) {
        console.error("Error en el Proxy:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
