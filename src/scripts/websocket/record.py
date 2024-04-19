# import websocket
# import time
# import threading

# def on_message(ws, message):
#     print("Received: " + message)

# def on_error(ws, error):
#     print("Error: " + str(error))

# def on_close(ws, close_status_code, close_msg):
#     print("### closed ###")

# def on_open(ws):
#     print("WebSocket opened")

# def run_websocket():
#     websocket.enableTrace(True)
#     localMachineIpv4 = "192.168.1.94";
#     port = "9002";
#     websocketUrl = f"ws://{localMachineIpv4}:{port}"
#     print(websocketUrl)
#     ws = websocket.WebSocketApp(websocketUrl,
#                                 on_open=on_open,
#                                 on_message=on_message,
#                                 on_error=on_error,
#                                 on_close=on_close)
#     ws.run_forever()

# if __name__ == "__main__":
#     # Set up the websocket in a thread
#     ws_thread = threading.Thread(target=run_websocket)
#     ws_thread.start()

#     # Let the thread run for 10 seconds
#     time.sleep(10)

#     # Stop the thread after 10 seconds
#     websocket.WebSocketApp.close = True
#     ws_thread.join()


import asyncio
import websockets
import json

import random

# Generate a random integer between 1 and 10
random_number = random.randint(1, 10000000000)

async def record_websocket_data(uri, duration=10):
    async with websockets.connect(uri) as websocket:
        start_time = asyncio.get_event_loop().time()
        data_list = []
        while True:
            data = await websocket.recv()
            data_list.append(data)
            if asyncio.get_event_loop().time() - start_time > duration:
                break
        with open(f'{random_number}_recorded_data.json', 'w') as f:
            json.dump(data_list, f)


localMachineIpv4 = "192.168.1.94";
port = "9002";
websocketUrl = f"ws://{localMachineIpv4}:{port}"
print(websocketUrl)
asyncio.run(record_websocket_data(websocketUrl, 60))
