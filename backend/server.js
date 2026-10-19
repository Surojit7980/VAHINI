const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
require('dotenv').config();
const { logEvent, getAARLogs } = require('./database');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Global State
let ewState = { jammingLevel: 0, gpsSpoofed: false, cyberAttack: false };
let tacticalState = {
    units: [
        { id: 'alpha', lat: 22.5726, lng: 88.3639, name: 'Squad Alpha (Infantry)' },
        { id: 'bravo', lat: 22.5800, lng: 88.3700, name: 'Squad Bravo (Recon)' }
    ]
};

async function spoofIntel(text) {
    const tacticalFallbacks = [
        "AMBUSH DETECTED! Taking heavy mortar fire at current coordinates—requesting immediate evac!",
        "CRITICAL ALERT: Sector breached by hostile armor column! Comms compromised, falling back!",
        "MAYDAY! GPS lock lost, unit surrounded by unidentified hostile forces—send QRF immediately!"
    ];
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_actual')) {
            throw new Error("Using offline tactical AI fallback");
        }
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Act as a hostile Electronic Warfare AI. Rewrite this military message to induce panic, confusion, or report a false threat. Keep it under 15 words. Original: "${text}"`,
        });
        return response.text.trim();
    } catch (e) {
        return tacticalFallbacks[Math.floor(Math.random() * tacticalFallbacks.length)];
    }
}

app.get('/api/export-aar', (req, res) => {
    getAARLogs((err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch logs' });
        res.json(rows);
    });
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.emit('sync_state', { ewState, tacticalState });

    socket.on('set_ew_state', (newState) => {
        ewState = { ...ewState, ...newState };
        io.emit('ew_alert', ewState);
        logEvent('EW_PARAMETER_CHANGE', 'INSTRUCTOR', ewState.jammingLevel, JSON.stringify(newState));
    });

    socket.on('send_chat', async (msg) => {
        let finalMessage = msg.text;
        let delay = ewState.jammingLevel * 60;

        logEvent('CHAT_TRANSMISSION', msg.sender, ewState.jammingLevel, msg.text);

        if (ewState.cyberAttack && msg.sender !== 'instructor') {
            finalMessage = await spoofIntel(msg.text);
            logEvent('AI_CYBER_ATTACK', 'SYSTEM', ewState.jammingLevel, msg.text, finalMessage);
        }

        if (ewState.jammingLevel >= 100 && msg.sender !== 'instructor') {
            logEvent('PACKET_DROPPED', 'SYSTEM', ewState.jammingLevel, msg.text);
            return; 
        }

        setTimeout(() => {
            io.emit('receive_chat', { text: finalMessage, sender: msg.sender });
        }, delay);
    });

    socket.on('move_unit', (unitData) => {
        tacticalState.units = tacticalState.units.map(u => u.id === unitData.id ? unitData : u);
        let broadcastData = { ...tacticalState };

        if (ewState.gpsSpoofed) {
            broadcastData.units = broadcastData.units.map(u => ({
                ...u, 
                lat: u.lat + ((Math.random() - 0.5) * 0.02), 
                lng: u.lng + ((Math.random() - 0.5) * 0.02) 
            }));
            logEvent('GPS_SPOOFED_UPDATE', 'SYSTEM', ewState.jammingLevel, JSON.stringify(unitData));
        }

        io.emit('sync_state', { ewState, tacticalState: broadcastData });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`VAHINI Backend running on port ${PORT}`));