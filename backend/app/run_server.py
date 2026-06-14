import sys
import os
import asyncio
import uvicorn

# Add the 'app' directory to sys.path so 'core' and 'routes' are found
sys.path.append(os.path.join(os.getcwd(), "app"))

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    # Point uvicorn to the correct module path
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)