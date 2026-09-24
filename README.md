# DecodeLabs AI Engineering Track - Project 1: Rule-Based AI Chatbot

[![Batch: 2026](https://img.shields.io/badge/Batch-2026-blue.svg)](https://decodelabs.tech)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-green.svg)](https://python.org)
[![Logic Engine](https://img.shields.io/badge/Logic-Deterministic_O(1)-purple.svg)](#architecture--the-ipo-model)

Welcome to **Project 1: Rule-Based AI Chatbot** for the DecodeLabs Industrial Training Track. This project establishes the fundamental **System 2 Deterministic Control Layer (Logic Engine)** required before integrating probabilistic Large Language Models (LLMs).

---

## 📐 Architecture & The IPO Model

As specified in the DecodeLabs Industrial Training Kit, this chatbot adheres to the **Input-Process-Output (IPO) Architecture**:

```
[ RAW INPUT ]  ──►  Phase 1: Sanitization & Normalization
                               │
                               ▼
[ HASH MAP ]   ──►  Phase 2: Intent Matching & Logic Skeleton (O(1))
                               │
                               ▼
[ FEEDBACK ]   ──►  Phase 3: Response Generation & Fallback Loop
```

### 1. Phase 1: Input & Sanitization
* Converts all input text to lowercase.
* Strips leading/trailing whitespace.
* Removes non-alphanumeric punctuation and special characters using regular expressions.
* Normalizes multi-space gaps into single spaces.

### 2. Phase 2: Hash Map vs. `If-Elif` Ladder ($O(1)$ vs $O(n)$)
Instead of an unstable $O(n)$ `if-elif` ladder anti-pattern (which grows linearly in complexity), this engine indexes intent patterns into a **Python Hash Map / Dictionary**. 
* **Lookup Time Complexity**: $O(1)$ constant time atomic lookups using `.get(clean_input, fallback)`.
* **Keyword Fallback Index**: If exact normalized match fails, single key terms are checked against a pre-indexed keyword map before escalating to the fallback handler.

### 3. Phase 3: Response Generation & Fallback Guardrails
* **Deterministic Guardrails**: 100% predictable outcomes with **zero hallucination risk**.
* **Fallback Strategy**: Graceful default responses when user queries do not match known rules.
* **Clean Exit Commands**: Recognized termination keywords (`exit`, `quit`, `bye`) break the continuous execution loop gracefully.

---

## 📁 Project Structure

```
Task1/
├── Artificial intelligence P1.pdf  # Project Specification PDF from DecodeLabs
├── intents.json                    # Knowledge base containing 8+ intent categories & fallbacks
├── chatbot_core.py                 # Core Python RuleBasedChatbot class implementing IPO logic
├── cli_app.py                      # Interactive terminal application with telemetry display
├── test_chatbot.py                 # Automated unit test suite verifying O(1) speed & logic
├── index.html                      # Modern glassmorphism Web UI Dashboard
├── styles.css                      # Custom dark theme CSS design system with IPO visualizer
├── script.js                       # Frontend JavaScript engine mirroring Python core logic
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 How to Run

### 1. Running the Command Line Interface (CLI)
Run the continuous terminal loop (`while` cycle) with real-time execution telemetry:
```bash
python cli_app.py
```

### 2. Running Automated Unit Tests
Verify sanitization, $O(1)$ dictionary lookups, fallback behavior, and exit commands:
```bash
python test_chatbot.py
```

### 3. Running the Web UI Dashboard
Launch a local server (e.g., on port 6500):
```bash
python -m http.server 6500
```
Then open `http://localhost:6500` in your web browser.

> [!TIP]
> **Browser Troubleshooting**: If you previously had the page open, perform a hard refresh (`Ctrl + F5` or `Shift + Refresh`) in your browser to clear cached JavaScript assets and load the updated `script.js` engine.

---

## 🎯 Verification Results

| Requirement | Specification | Result |
| :--- | :--- | :--- |
| **Input Loop** | Continuous `while` cycle | ✅ Implemented in CLI (`cli_app.py`) & Web UI (`script.js`) |
| **Sanitization** | Lowercase, strip, punctuation removal | ✅ Verified by `test_sanitization` |
| **Knowledge Base** | Dictionary with 5+ intents | ✅ 8 intents configured in `intents.json` |
| **O(1) Efficiency** | Hash map lookup vs $O(n)$ ladder | ✅ Avg execution time `< 0.01ms` |
| **Fallback Handler** | Default response for unknown inputs | ✅ Verified by `test_fallback_mechanism` |
| **Exit Strategy** | Clean break on exit commands | ✅ Verified by `test_exit_strategy` |

---
*Powered by DecodeLabs Industrial Training Track | AI Engineering 2026*
