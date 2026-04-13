from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/') 
def index():
    return render_template('index.html')  # Jinja2 génère le HTML


@app.route('/api/habits', methods=['GET','POST'])
def api_habit():
    pass
    return jsonify({'message': 'TODO'}), 200


@app.route('/api/notes', methods=['GET','POST'])
def api_notes():
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/rdv', methods=['GET','POST'])
def api_rdv():
    pass
    return jsonify({'message': 'TODO'}), 200