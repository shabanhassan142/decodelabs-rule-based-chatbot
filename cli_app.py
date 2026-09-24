"""
Rule-Based AI Chatbot - Interactive Terminal Application
DecodeLabs Industrial Training Kit - Project 1 (Batch 2026)

Features:
- Continuous input loop ('while' cycle - PDF Page 11)
- Input Sanitization & Normalization display
- Deterministic O(1) Hash Map response lookup
- Performance & Intent Metadata Inspector
- Clean Exit Handling
"""

import sys
import time
from chatbot_core import RuleBasedChatbot

# Optional rich formatting support for visual excellence
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.prompt import Prompt
    from rich.table import Table
    from rich import print as rprint
    HAS_RICH = True
    console = Console()
except ImportError:
    HAS_RICH = False


def print_banner():
    if HAS_RICH:
        banner = """
[bold cyan]===============================================================
🤖  DECODELABS AI ENGINEER TRACK - PROJECT 1: RULE-BASED BOT  🤖
===============================================================
[dim]Deterministic Guardrail Engine | O(1) Hash Map Lookups | IPO Model[/dim]
        """
        console.print(banner)
        console.print("[yellow]Type 'help' to see sample queries, or 'exit' / 'quit' / 'bye' to exit.[/yellow]\n")
    else:
        print("===============================================================")
        print("🤖  DECODELABS AI ENGINEER TRACK - PROJECT 1: RULE-BASED BOT  🤖")
        print("===============================================================")
        print("Deterministic Guardrail Engine | O(1) Hash Map Lookups | IPO Model")
        print("Type 'help' to see sample queries, or 'exit' / 'quit' / 'bye' to exit.\n")


def display_response(raw_user_input: str, res: dict):
    reply = res["reply"]
    intent = res["intent_tag"]
    match_type = res["matched_by"]
    exec_time = res["execution_time_ms"]
    clean_input = res["sanitized_input"]

    if HAS_RICH:
        meta_info = f"[dim]Sanitized: '{clean_input}' | Intent: '{intent}' | Match: {match_type} | Time: {exec_time:.4f}ms[/dim]"
        panel = Panel(
            f"[bold green]Bot:[/bold green] {reply}\n\n{meta_info}",
            title="[bold blue]Rule Engine Response[/bold blue]",
            border_style="cyan"
        )
        console.print(panel)
        console.print()
    else:
        print(f"\n[Bot]: {reply}")
        print(f"[Meta]: Sanitized: '{clean_input}' | Intent: '{intent}' | Match: {match_type} | Time: {exec_time:.4f}ms\n")


def main():
    bot = RuleBasedChatbot("intents.json")
    print_banner()

    # The Heartbeat Loop (Continuous input cycle as required on PDF Page 11)
    while True:
        try:
            if HAS_RICH:
                user_input = Prompt.ask("[bold magenta]You[/bold magenta]")
            else:
                user_input = input("You: ")

            res = bot.get_response(user_input)
            display_response(user_input, res)

            # Clean exit condition check
            if res["is_exit"]:
                break

        except (KeyboardInterrupt, EOFError):
            print("\n\nSession terminated by user. Goodbye!")
            break


if __name__ == "__main__":
    main()
