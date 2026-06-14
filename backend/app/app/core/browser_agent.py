from playwright.async_api import async_playwright, Page, Browser

class BrowserAgent:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None
        self.is_running = False

    async def initialize(self):
        if not self.is_running:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=False)
            self.page = await self.browser.new_page()
            self.is_running = True
            print("Browser Agent Initialized successfully.")

    async def execute_action(self, intent_data: dict) -> dict:

        if not self.is_running:
            await self.initialize()

        steps = intent_data.get("steps", [])
        target = intent_data.get("target", "")
        results = []

        try:
            for step in steps:
                if "open" in step.lower() or "navigate" in step.lower():
                    url = target if target.startswith("http") else f"https://{target}"
                    await self.page.goto(url)
                    results.append(f"Navigated to {url}")

            return {
                "status": "success",
                "results": results
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

browser_agent = BrowserAgent()