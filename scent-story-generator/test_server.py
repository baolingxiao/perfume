from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory('static', 'scent_story_generator.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    print("启动测试服务器在 http://localhost:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)
