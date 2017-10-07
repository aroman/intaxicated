import os
from flask import Flask, send_from_directory
CLIENT_PATH = '../client/build'
app = Flask(__name__, static_folder=CLIENT_PATH)

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

if __name__ == '__main__':
    app.run(debug=True)
