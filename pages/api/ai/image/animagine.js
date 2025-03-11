const axios = require("axios");

exports.config = {
    name: "animagine",
    author: "Your_Name",
    description: "Génère une image à partir d'un prompt via Animagine XL.",
    method: "get",
    category: "utility",
    link: ["/animagine?prompt=your_prompt"]
};

class Animagine {
    constructor(prompt) {
        if (!prompt) {
            throw new Error("Le paramètre 'prompt' est requis.");
        }

        this.session_hash = Math.random().toString(36).slice(2);
        this.payload = {
            prompt: prompt,
            negativePrompt: "bad quality",
            seed: 807244162,
            width: 512,
            height: 512,
            guidanceScale: 7,
            numInferenceSteps: 28,
            sampler: "Euler a",
            aspectRatio: "896 x 1152",
            stylePreset: "(None)",
            qualityTags: "Standard v3.1",
            useUpscaler: false,
            strength: 0.55,
            upscaleBy: 1.5,
            addQualityTags: true
        };
    }

    generatePayload() {
        return JSON.stringify({
            data: [
                this.payload.prompt,
                this.payload.negativePrompt,
                this.payload.seed,
                this.payload.width,
                this.payload.height,
                this.payload.guidanceScale,
                this.payload.numInferenceSteps,
                this.payload.sampler,
                this.payload.aspectRatio,
                this.payload.stylePreset,
                this.payload.qualityTags,
                this.payload.useUpscaler,
                this.payload.strength,
                this.payload.upscaleBy,
                this.payload.addQualityTags
            ],
            event_data: null,
            fn_index: 5,
            trigger_id: null,
            session_hash: this.session_hash
        });
    }

    async request() {
        const data = this.generatePayload();
        const config = {
            method: "POST",
            url: "https://asahina2k-animagine-xl-3-1.hf.space/queue/join?ref=huntscreens.com",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Content-Type": "application/json"
            },
            data: data
        };

        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            throw new Error("Erreur de requête: " + error.message);
        }
    }

    async cekStatus() {
        const EventSource = (await import("eventsource")).default;
        return new Promise((resolve, reject) => {
            const eventSource = new EventSource(
                `https://asahina2k-animagine-xl-3-1.hf.space/queue/data?session_hash=${this.session_hash}`
            );

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.msg === "process_completed") {
                        resolve(data);
                        eventSource.close();
                    } else if (data.msg === "error") {
                        reject(new Error(data.msg));
                        eventSource.close();
                    }
                } catch (error) {
                    reject(error);
                    eventSource.close();
                }
            };

            eventSource.onerror = (err) => {
                reject(new Error("Erreur de connexion EventSource"));
                eventSource.close();
            };
        });
    }

    async create() {
        try {
            await this.request();
            return await this.cekStatus();
        } catch (error) {
            throw new Error("Erreur lors de la génération: " + error.message);
        }
    }
}

exports.initialize = async function ({ req, res }) {
    try {
        const { prompt } = req.query;
        if (!prompt) {
            return res.status(400).json({ error: "Le paramètre 'prompt' est requis." });
        }

        const animagine = new Animagine(prompt);
        const response = await animagine.create();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
