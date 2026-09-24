"""
Rule-Based AI Chatbot Core Engine
DecodeLabs Industrial Training Kit - Project 1 (Batch 2026)

Architecture: IPO Model (Input -> Process -> Output)
- Phase 1: Input Sanitization & Normalization
- Phase 2: Intent Matching using O(1) Hash Map / Dictionary Lookup
- Phase 3: Response Generation & Fallback Management
"""

import json
import re
import random
import time
from typing import Dict, Any, Tuple, Optional, List


class RuleBasedChatbot:
    """
    Deterministic Rule-Based AI Chatbot Engine.
    Implements exact pattern lookup in O(1) time complexity via hash maps,
    avoiding the linear O(n) if-elif ladder anti-pattern.
    """

    def __init__(self, intents_filepath: str = "intents.json"):
        self.intents_filepath = intents_filepath
        self.exact_match_map: Dict[str, Dict[str, Any]] = {}
        self.keyword_map: Dict[str, Dict[str, Any]] = {}
        self.intents_by_tag: Dict[str, Dict[str, Any]] = {}
        self.fallback_responses: List[str] = [
            "I'm sorry, I don't understand that request. Type 'help' for available commands."
        ]
        self.exit_commands = {"exit", "quit", "bye", "goodbye", "close", "stop", "end"}
        
        self.load_knowledge_base()

    def load_knowledge_base(self) -> None:
        """Loads and indexes the intent dictionary for fast O(1) lookup."""
        with open(self.intents_filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.fallback_responses = data.get("fallback_responses", self.fallback_responses)
        intents = data.get("intents", [])

        # Reset maps
        self.exact_match_map.clear()
        self.keyword_map.clear()
        self.intents_by_tag.clear()

        for intent in intents:
            tag = intent["tag"]
            patterns = intent["patterns"]
            responses = intent["responses"]
            
            intent_data = {
                "tag": tag,
                "responses": responses,
                "patterns": patterns
            }
            self.intents_by_tag[tag] = intent_data

            # Build Hash Map for Exact Normalized Patterns -> Intent Data O(1)
            for pattern in patterns:
                sanitized_pattern = self.sanitize_input(pattern)
                if sanitized_pattern:
                    self.exact_match_map[sanitized_pattern] = intent_data
                    
                    # Also map individual words to keyword index for flexible fallback
                    words = sanitized_pattern.split()
                    for word in words:
                        if len(word) > 2 and word not in self.exit_commands:
                            if word not in self.keyword_map:
                                self.keyword_map[word] = intent_data

    @staticmethod
    def sanitize_input(raw_input: str) -> str:
        """
        Phase 1: Input Sanitization & Normalization
        - Converts to lowercase
        - Strips leading/trailing whitespace
        - Removes special characters and punctuation
        - Collapses redundant spaces
        """
        if not raw_input:
            return ""
        # Lowercase & strip
        text = raw_input.lower().strip()
        # Remove non-alphanumeric characters except single spaces
        text = re.sub(r"[^\w\s]", "", text)
        # Collapse multiple spaces into single space
        text = re.sub(r"\s+", " ", text)
        return text

    def get_response(self, raw_input: str) -> Dict[str, Any]:
        """
        Phase 2 & 3: Process & Response Generation
        Implements atomic lookup with default fallback.
        Returns detailed output metadata for traceabilty and guardrails.
        """
        start_time = time.perf_counter()
        clean_input = self.sanitize_input(raw_input)

        # Handle empty input
        if not clean_input:
            exec_time = (time.perf_counter() - start_time) * 1000
            return {
                "reply": "Please type something so I can assist you!",
                "intent_tag": "empty_input",
                "matched_by": "validation",
                "execution_time_ms": round(exec_time, 4),
                "sanitized_input": clean_input,
                "is_exit": False
            }

        # Check for Exit Commands
        if clean_input in self.exit_commands or any(clean_input == cmd for cmd in self.exit_commands):
            exec_time = (time.perf_counter() - start_time) * 1000
            exit_intent = self.intents_by_tag.get("exit", {})
            responses = exit_intent.get("responses", ["Goodbye! Have a great day!"])
            return {
                "reply": random.choice(responses),
                "intent_tag": "exit",
                "matched_by": "exit_rule",
                "execution_time_ms": round(exec_time, 4),
                "sanitized_input": clean_input,
                "is_exit": True
            }

        # 1. Direct O(1) Hash Map Exact Match Lookup
        intent_match = self.exact_match_map.get(clean_input)
        match_type = "exact_hash_map"

        # 2. Keyword Fallback Match if exact match fails
        if not intent_match:
            words = clean_input.split()
            for word in words:
                if word in self.keyword_map:
                    intent_match = self.keyword_map[word]
                    match_type = "keyword_index"
                    break

        # 3. Default Fallback if no rules match
        if intent_match:
            reply = random.choice(intent_match["responses"])
            intent_tag = intent_match["tag"]
        else:
            reply = random.choice(self.fallback_responses)
            intent_tag = "fallback"
            match_type = "fallback_handler"

        exec_time = (time.perf_counter() - start_time) * 1000

        return {
            "reply": reply,
            "intent_tag": intent_tag,
            "matched_by": match_type,
            "execution_time_ms": round(exec_time, 4),
            "sanitized_input": clean_input,
            "is_exit": False
        }


if __name__ == "__main__":
    bot = RuleBasedChatbot()
    test_queries = ["Hello!", "WHO ARE YOU??", "What can you do?", "tell me about AI", "xyz123random", "exit"]
    print("--- Rule-Based Chatbot Core Test Run ---")
    for q in test_queries:
        res = bot.get_response(q)
        print(f"User: '{q}' -> Sanitized: '{res['sanitized_input']}' | Intent: '{res['intent_tag']}' ({res['matched_by']}, {res['execution_time_ms']}ms)")
        print(f"Bot:  {res['reply']}\n")
