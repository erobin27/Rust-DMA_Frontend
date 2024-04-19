import asyncio
import websockets
import json

async def mock_websocket_server(port, data_file):
    async def handler(websocket, path):
        with open(data_file, 'r') as f:
            data_list = json.load(f)
        # This loop will allow continuous connection attempts to the server
        while True:
            for data in data_list:
                await websocket.send(data)
                await asyncio.sleep(.1)  # Adjust the sleep time to match the original timing

    # Set up the WebSocket server
    start_server = websockets.serve(handler, "localhost", port)

    # The server is started and now needs to be kept running
    server = await start_server
    try:
        await asyncio.Future()  # Block here until Ctrl+C or a server close
    finally:
        server.close()
        await server.wait_closed()

asyncio.run(mock_websocket_server(8765, 'recorded_data.json'))
