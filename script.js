/**
 * DecodeLabs Rule-Based AI Chatbot - Web Engine (JavaScript)
 * Replicates the exact Python O(1) Hash Map & IPO Model architecture
 */

class WebRuleBasedChatbot {
    constructor() {
        this.exactMatchMap = new Map();
        this.keywordMap = new Map();
        this.intentsByTag = new Map();
        this.fallbackResponses = [
            "I'm sorry, I don't understand that request. Try asking about 'capabilities' or type 'help'.",
            "That query is outside my current knowledge base. Try asking about 'who are you', 'DecodeLabs', or 'what is AI'.",
            "No matching rule found in my dictionary. Type 'help' to see what I can answer!"
        ];
        this.exitCommands = new Set(["exit", "quit", "bye", "goodbye", "close", "stop", "end"]);
        this.intentsData = [];
    }

    async init() {
        try {
            const response = await fetch("intents.json");
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const data = await response.json();
            this.intentsData = data.intents || [];
            if (data.fallback_responses && data.fallback_responses.length > 0) {
                this.fallbackResponses = data.fallback_responses;
            }

            this.buildIndex();
            console.log("Rule-Based Chatbot Engine initialized with O(1) Hash Map index.", this.exactMatchMap.size, "exact patterns mapped.");
        } catch (err) {
            console.warn("Failed to fetch intents.json via network, using embedded fallback intents:", err);
            this.useEmbeddedIntents();
        }
    }

    useEmbeddedIntents() {
        this.intentsData = [
            {
                "tag": "greeting",
                "patterns": ["hello", "hi", "hey", "good morning", "good evening", "greetings", "whats up", "howdy"],
                "responses": [
                    "Hello! I am your AI Rule-Based Assistant. How can I assist you today?",
                    "Hi there! Ready to assist you with deterministic precision.",
                    "Hey! Welcome to DecodeLabs AI Assistant. What would you like to know?"
                ]
            },
            {
                "tag": "identity",
                "patterns": ["who are you", "who r u", "what are you", "your name", "who made you", "tell me about yourself", "what is your purpose"],
                "responses": [
                    "I am a Rule-Based AI Chatbot built for Project 1 of the DecodeLabs AI Engineering Track.",
                    "I am a deterministic logic engine operating on the IPO (Input-Process-Output) model with O(1) hash map lookups!",
                    "I am an intelligent control layer designed to provide instant, zero-hallucination responses."
                ]
            },
            {
                "tag": "capabilities",
                "patterns": ["what can you do", "help me", "features", "options", "commands", "menu", "capabilities"],
                "responses": [
                    "Here is what I can do:\n1. Answer FAQs about Artificial Intelligence & Rule-Based Systems.\n2. Demonstrate O(1) hash map intent matching.\n3. Show deterministic guardrail logic.\n4. Provide information on DecodeLabs Project 1.",
                    "I can answer questions regarding logic engines, AI guardrails, system architecture, and project specifications!"
                ]
            },
            {
                "tag": "ai_concepts",
                "patterns": ["what is ai", "rule based vs llm", "what is system 1 system 2", "why rule based", "guardrails"],
                "responses": [
                    "Rule-based systems use deterministic logic (if-else or hash maps) for 100% predictable, safe outcomes. LLMs are probabilistic models that generate natural text but carry hallucination risks. Combining them creates safe AI guardrails!",
                    "System 1 AI (LLMs) is probabilistic like an artist. System 2 AI (Rule Engine) is deterministic like an engineer. Rule engines form the security guardrail around generative AI!"
                ]
            },
            {
                "tag": "decodelabs",
                "patterns": ["decodelabs", "tell me about decodelabs", "project 1", "internship", "industrial training kit", "batch 2026"],
                "responses": [
                    "DecodeLabs Project 1 focuses on building the foundational logic skeleton of AI engineering—mastering control flow, sanitization, hash maps, and deterministic guardrails before moving to probabilistic models.",
                    "This project is Milestone 1 of the DecodeLabs AI Engineer Track. Completing this unlocks advanced projects for next week!"
                ]
            },
            {
                "tag": "thanks",
                "patterns": ["thank you", "thanks", "thank you so much", "appreciated", "great job", "awesome"],
                "responses": [
                    "You're very welcome! Let me know if you have any more questions.",
                    "Glad to help! Programmed for efficiency and accuracy.",
                    "Anytime! Deterministic performance at your service."
                ]
            },
            {
                "tag": "how_are_you",
                "patterns": ["how are you", "how are you doing", "how do you feel", "are you okay"],
                "responses": [
                    "I am running smoothly with optimal O(1) lookup speed! How can I help you?",
                    "All systems operational! Deterministic logic is functioning perfectly."
                ]
            },
            {
                "tag": "exit",
                "patterns": ["exit", "quit", "bye", "goodbye", "close", "stop", "end"],
                "responses": [
                    "Goodbye! It was a pleasure assisting you. System shutting down cleanly.",
                    "Farewell! Keep building great AI guardrails!",
                    "Session terminated. Have a productive day!"
                ]
            }
        ];
        this.buildIndex();
    }

    buildIndex() {
        this.exactMatchMap.clear();
        this.keywordMap.clear();
        this.intentsByTag.clear();

        for (const intent of this.intentsData) {
            const tag = intent.tag;
            const patterns = intent.patterns;
            const responses = intent.responses;

            const intentData = { tag, patterns, responses };
            this.intentsByTag.set(tag, intentData);

            for (const pattern of patterns) {
                const cleanPattern = this.sanitizeInput(pattern);
                if (cleanPattern) {
                    this.exactMatchMap.set(cleanPattern, intentData);

                    // Map individual keywords
                    const words = cleanPattern.split(" ");
                    for (const word of words) {
                        if (word.length > 2 && !this.exitCommands.has(word)) {
                            if (!this.keywordMap.has(word)) {
                                this.keywordMap.set(word, intentData);
                            }
                        }
                    }
                }
            }
        }
    }

    sanitizeInput(rawInput) {
        if (!rawInput) return "";
        let text = rawInput.toLowerCase().trim();
        // Remove punctuation except spaces
        text = text.replace(/[^\w\s]/gi, "");
        // Collapse whitespace
        text = text.replace(/\s+/g, " ");
        return text;
    }

    getResponse(rawInput) {
        const startTime = performance.now();
        const cleanInput = this.sanitizeInput(rawInput);

        if (!cleanInput) {
            const execTime = performance.now() - startTime;
            return {
                reply: "Please type a message so I can assist you!",
                intentTag: "empty_input",
                matchedBy: "validation",
                executionTimeMs: execTime.toFixed(4),
                sanitizedInput: cleanInput,
                isExit: false
            };
        }

        // Exit command check
        if (this.exitCommands.has(cleanInput)) {
            const execTime = performance.now() - startTime;
            const exitIntent = this.intentsByTag.get("exit");
            const responses = exitIntent ? exitIntent.responses : ["Goodbye! Session terminated."];
            const reply = responses[Math.floor(Math.random() * responses.length)];
            return {
                reply,
                intentTag: "exit",
                matchedBy: "exit_rule",
                executionTimeMs: execTime.toFixed(4),
                sanitizedInput: cleanInput,
                isExit: true
            };
        }

        // 1. Direct O(1) Exact Hash Map Lookup
        let match = this.exactMatchMap.get(cleanInput);
        let matchType = "exact_hash_map";

        // 2. Keyword Index Fallback
        if (!match) {
            const words = cleanInput.split(" ");
            for (const word of words) {
                if (this.keywordMap.has(word)) {
                    match = this.keywordMap.get(word);
                    matchType = "keyword_index";
                    break;
                }
            }
        }

        let reply = "";
        let intentTag = "";

        // 3. Output generation or Default Fallback
        if (match) {
            reply = match.responses[Math.floor(Math.random() * match.responses.length)];
            intentTag = match.tag;
        } else {
            reply = this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
            intentTag = "fallback";
            matchType = "fallback_handler";
        }

        const execTime = performance.now() - startTime;

        return {
            reply,
            intentTag,
            matchedBy: matchType,
            executionTimeMs: execTime.toFixed(4),
            sanitizedInput: cleanInput,
            isExit: false
        };
    }
}

// UI Controller
document.addEventListener("DOMContentLoaded", async () => {
    const bot = new WebRuleBasedChatbot();
    await bot.init();

    const chatFeed = document.getElementById("chatFeed");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const telemetryRaw = document.getElementById("telemetryRaw");
    const telemetryClean = document.getElementById("telemetryClean");
    const telemetryIntent = document.getElementById("telemetryIntent");
    const metricLatency = document.getElementById("metricLatency");
    const metricCount = document.getElementById("metricCount");
    const viewIntentsBtn = document.getElementById("viewIntentsBtn");
    const intentsModal = document.getElementById("intentsModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalIntentsList = document.getElementById("modalIntentsList");

    let messageCounter = 0;

    function appendMessage(sender, text, metaText = "") {
        const row = document.createElement("div");
        row.className = `message-row ${sender}`;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = sender === "user" ? "👤" : "🤖";

        const content = document.createElement("div");
        content.className = "message-content";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.innerHTML = text.replace(/\n/g, "<br>");

        content.appendChild(bubble);

        if (metaText) {
            const meta = document.createElement("div");
            meta.className = "message-meta";
            meta.textContent = metaText;
            content.appendChild(meta);
        }

        row.appendChild(avatar);
        row.appendChild(content);

        chatFeed.appendChild(row);
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }

    function updateTelemetry(raw, res) {
        telemetryRaw.textContent = raw ? `"${raw}"` : "-";
        telemetryClean.textContent = res.sanitizedInput ? `"${res.sanitizedInput}"` : "-";
        telemetryIntent.textContent = `${res.intentTag.toUpperCase()} (${res.matchedBy})`;
        metricLatency.textContent = `${res.executionTimeMs} ms`;

        messageCounter++;
        metricCount.textContent = messageCounter;

        // Highlight step pulse effect
        document.querySelectorAll(".ipo-step").forEach(step => step.classList.add("active"));
        setTimeout(() => {
            document.querySelectorAll(".ipo-step").forEach(step => step.classList.remove("active"));
        }, 500);
    }

    function handleSend(inputQuery) {
        const text = inputQuery || userInput.value;
        if (!text.trim()) return;

        appendMessage("user", text);
        if (!inputQuery) userInput.value = "";

        // Process through Rule Engine
        try {
            const res = bot.getResponse(text);

            // Simulated brief micro-delay for smooth feel
            setTimeout(() => {
                appendMessage("bot", res.reply, `Match: ${res.matchedBy} | Time: ${res.executionTimeMs}ms`);
                updateTelemetry(text, res);
            }, 120);
        } catch (err) {
            console.error("Error processing response:", err);
            appendMessage("bot", "An unexpected error occurred while processing your request.");
        }
    }

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSend();
    });

    // Handle suggestion chips
    document.querySelectorAll(".chip-btn").forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.getAttribute("data-prompt");
            handleSend(promptText);
        });
    });

    // Knowledge Base Modal
    viewIntentsBtn.addEventListener("click", () => {
        modalIntentsList.innerHTML = "";
        if (!bot.intentsData || bot.intentsData.length === 0) {
            modalIntentsList.innerHTML = "<p class='sub-text'>No intents loaded.</p>";
        } else {
            bot.intentsData.forEach(intent => {
                const item = document.createElement("div");
                item.className = "intent-card-item";
                item.innerHTML = `
                    <div class="intent-card-header">
                        <span class="intent-tag-name"># ${intent.tag}</span>
                        <span class="sub-text">${intent.patterns.length} patterns</span>
                    </div>
                    <div class="patterns-list">
                        <strong>Triggers:</strong> ${intent.patterns.join(", ")}
                    </div>
                `;
                modalIntentsList.appendChild(item);
            });
        }
        intentsModal.classList.add("open");
    });

    closeModalBtn.addEventListener("click", () => {
        intentsModal.classList.remove("open");
    });

    intentsModal.addEventListener("click", (e) => {
        if (e.target === intentsModal) intentsModal.classList.remove("open");
    });
});
