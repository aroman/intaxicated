import os
from enum import IntEnum
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS, cross_origin

if os.getenv('PORT'):
    CLIENT_PATH = './build'
else:
    CLIENT_PATH = '../client/build'

app = Flask(__name__, static_folder=CLIENT_PATH)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == '':
        return send_from_directory(CLIENT_PATH, 'index.html')
    else:
        if os.path.exists(CLIENT_PATH + '/' + path):
            return send_from_directory(CLIENT_PATH, path)
        else:
            return send_from_directory(CLIENT_PATH, 'index.html')

class Phase(IntEnum):
    WAIT_FOR_SERVER = 0
    WAIT_FOR_PLAYER_1 = 1
    WAIT_FOR_PLAYER_2 = 2
    WAIT_FOR_ROUND_START = 3
    IN_ROUND = 4
    ROUND_ENDED = 5

state = {
    'board': {
        'image': 'foo.jpg',
        'width': 500,
        'height': 400,
        'gridSize': 10,
    },
    'player1': {
        'x': 3,
        'y': 2,
    },
    'player2': {
        'x': 3,
        'y': 0
    },
    'phase': Phase.WAIT_FOR_PLAYER_1,
}

@cross_origin()
@app.route('/state')
def getState():
    return jsonify(state)

if __name__ == '__main__':
    app.run(debug=True)
