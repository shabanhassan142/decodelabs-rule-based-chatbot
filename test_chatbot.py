"""
Unit Tests for Rule-Based AI Chatbot
Validates requirements from DecodeLabs Project 1 specification:
1. Input loop & clean exit
2. Input sanitization (lowercase, strip, punctuation removal)
3. O(1) dictionary knowledge base lookup
4. Fallback response for unknown queries
"""

import unittest
from chatbot_core import RuleBasedChatbot


class TestRuleBasedChatbot(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.bot = RuleBasedChatbot("intents.json")

    def test_sanitization(self):
        """Test sanitization phase: lowercase, strip, punctuation removal."""
        raw_inputs = [
            ("  HELLO World!  ", "hello world"),
            ("Who ARE you???", "who are you"),
            ("What can YOU do?!", "what can you do"),
            ("   bye   ", "bye")
        ]
        for raw, expected in raw_inputs:
            sanitized = self.bot.sanitize_input(raw)
            self.assertEqual(sanitized, expected, f"Failed sanitizing '{raw}'")

    def test_exact_hash_map_match(self):
        """Test direct O(1) dictionary lookup for exact intent matches."""
        queries = ["hello", "who are you", "what can you do", "decodelabs", "thank you"]
        for q in queries:
            res = self.bot.get_response(q)
            self.assertNotEqual(res["intent_tag"], "fallback")
            self.assertIn(res["matched_by"], ["exact_hash_map", "exit_rule"])
            self.assertLess(res["execution_time_ms"], 10.0, "O(1) lookup exceeded threshold")

    def test_fallback_mechanism(self):
        """Test default fallback when no rule matches."""
        unknown_queries = ["supercalifragilistic", "1239874560", "random unmapped gibberish query"]
        for q in unknown_queries:
            res = self.bot.get_response(q)
            self.assertEqual(res["intent_tag"], "fallback")
            self.assertEqual(res["matched_by"], "fallback_handler")
            self.assertTrue(len(res["reply"]) > 0)

    def test_exit_strategy(self):
        """Test clean exit strategy on termination commands."""
        exit_commands = ["exit", "quit", "bye", "goodbye"]
        for cmd in exit_commands:
            res = self.bot.get_response(cmd)
            self.assertTrue(res["is_exit"], f"Command '{cmd}' failed to trigger exit flag")
            self.assertIn(res["intent_tag"], ["exit", "greeting"])  # 'bye' can map to exit


if __name__ == "__main__":
    unittest.main()
