import pyautogui
import time
import asyncio

class DesktopAgent:
    def __init__(self):
        # Fail-safe: moving the mouse to any of the 4 corners of the screen aborts the script
        pyautogui.FAILSAFE = True
        print("Desktop Agent Initialized.")

    async def execute_action(self, intent_data: dict) -> dict:
        steps = intent_data.get("steps", [])
        target = intent_data.get("target", "")
        results = []

        try:
            for step in steps:
                if "type" in step.lower() or "write" in step.lower():
                    # Type the target text
                    text = target if target else "JADU VayuSync Active"
                    pyautogui.write(text, interval=0.05)
                    results.append(f"Typed: {text}")
                
                elif "press" in step.lower() or "hit" in step.lower():
                    # Press a specific key (e.g., enter, win, tab)
                    key = target if target else "enter"
                    pyautogui.press(key)
                    results.append(f"Pressed: {key}")
                
                elif "click" in step.lower():
                    pyautogui.click()
                    results.append("Performed mouse click")
                
                elif "shortcut" in step.lower():
                    # Handle hotkeys like 'ctrl+c'
                    keys = target.split('+')
                    pyautogui.hotkey(*keys)
                    results.append(f"Executed shortcut: {target}")

                # Humanize the execution speed
                await asyncio.sleep(0.5)

            return {"status": "success", "results": results}
        except pyautogui.FailSafeException:
            return {"status": "error", "message": "Failsafe triggered! User moved mouse to corner."}
        except Exception as e:
            print(f"Desktop Agent Error: {e}")
            return {"status": "error", "message": str(e)}

desktop_agent = DesktopAgent()