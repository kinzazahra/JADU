from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.websockets import manager
from core.audio_engine import transcribe_audio
from core.ai_engine import process_intent
from core.gesture_engine import gesture_engine
from core.browser_agent import browser_agent
from core.desktop_agent import desktop_agent
import asyncio
import psutil
import base64
import json

router = APIRouter()

@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    
    async def send_system_stats():
        while True:
            try:
                cpu_percent = psutil.cpu_percent(interval=None)
                memory = psutil.virtual_memory()
                await manager.send_personal_message({
                    "type": "system_status",
                    "data": {"cpu": f"{cpu_percent}%", "memory": f"{memory.used / (1024**3):.1f} GB"}
                }, client_id)
                await asyncio.sleep(2)
            except Exception:
                break

    stats_task = asyncio.create_task(send_system_stats())

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")
            
            if action == "voice_command":
                audio_b64 = data.get("audio_data")
                if audio_b64:
                    audio_bytes = base64.b64decode(audio_b64)
                    
                    # RUNNING IN BACKGROUND SO SERVER DOESN'T FREEZE
                    transcript = await asyncio.to_thread(transcribe_audio, audio_bytes)
                    print(f"Transcribed: {transcript}")
                    
                    if transcript:
                        # RUNNING IN BACKGROUND SO SERVER DOESN'T FREEZE
                        intent_json_str = await asyncio.to_thread(process_intent, transcript)
                        try:
                            intent_data = json.loads(intent_json_str)
                        except:
                            intent_data = {"error": "Invalid JSON from AI"}
                        
                        await manager.send_personal_message({
                            "type": "voice_response",
                            "data": {
                                "transcript": transcript,
                                "intent": intent_data
                            }
                        }, client_id)

                        if intent_data.get("action") == "browser":
                            browser_res = await browser_agent.execute_action(intent_data)
                            await manager.send_personal_message({
                                "type": "browser_response",
                                "data": browser_res
                            }, client_id)
                        
                        elif intent_data.get("action") == "desktop":
                            desktop_res = await desktop_agent.execute_action(intent_data)
                            await manager.send_personal_message({
                                "type": "desktop_response",
                                "data": desktop_res
                            }, client_id)

            elif action == "video_frame":
                frame_data = data.get("frame")
                if frame_data:
                    analysis = gesture_engine.process_base64_frame(frame_data)
                    await manager.send_personal_message({
                        "type": "gesture_response",
                        "data": analysis
                    }, client_id)

            elif action == "browser_action":
                intent_data = data.get("intent", {})
                browser_res = await browser_agent.execute_action(intent_data)
                await manager.send_personal_message({
                    "type": "browser_response",
                    "data": browser_res
                }, client_id)
            
            elif action == "desktop_action":
                intent_data = data.get("intent", {})
                desktop_res = await desktop_agent.execute_action(intent_data)
                await manager.send_personal_message({
                    "type": "desktop_response",
                    "data": desktop_res
                }, client_id)

            else:
                await manager.send_personal_message({
                    "type": "acknowledgment",
                    "message": f"Server received action: {action}"
                }, client_id)

    except WebSocketDisconnect:
        manager.disconnect(client_id)
        stats_task.cancel()