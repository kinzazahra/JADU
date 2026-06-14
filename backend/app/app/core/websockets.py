from fastapi import WebSocket
from typing import Dict

class ConnectionManager:
    def __init__(self):
        # Maps client_id (Firebase UID) to their active WebSocket connection
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"Client {client_id} connected. Total: {len(self.active_connections)}")

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            print(f"Client {client_id} disconnected.")

    async def send_personal_message(self, message: dict, client_id: str):
        """Send a JSON message to a specific client (e.g., your specific dashboard)"""
        websocket = self.active_connections.get(client_id)
        if websocket:
            await websocket.send_json(message)

    async def broadcast(self, message: dict):
        """Send a JSON message to ALL connected clients"""
        for connection in self.active_connections.values():
            await connection.send_json(message)

# Global instance to be used across the app
manager = ConnectionManager()