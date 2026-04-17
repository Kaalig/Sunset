from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/') 
def index():
    return render_template('index.html')  # Jinja2 génère le HTML


# --------------- HABITUDES ------------------

@app.route('/api/habits', methods=['GET','POST'])
def api_habit():
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/habits/<id>', methods=['PUT','DELETE'])
def api_habit_id(id):
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/habits/<id>/check', methods=['POST'])
def api_habit_check(id):
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route ('/api/habits/stats', methods=['GET'])
def api_habit_stats():
    pass
    return jsonify({'message': 'TODO'}), 200


# --------------- NOTES ------------------
@app.route('/api/notes', methods=['GET','POST'])
def api_notes():
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/notes/<id>', methods=['GET','PUT','DELETE'])
def api_notes_id(id):
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/notes/trash', methods=['GET','DELETE'])
def api_notes_get_trash():
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/notes/<id>/restore', methods=['POST'])
def api_notes_restore(id):
    pass
    return jsonify({'message': 'TODO'}), 200

# --------------- RENDEZ-VOUS ------------------

@app.route('/api/rdv', methods=['GET','POST'])
def api_rdv():
    pass
    return jsonify({'message': 'TODO'}), 200

@app.route('/api/rdv/<id>', methods=['GET','PUT','DELETE'])
def api_rdv_id(id):
    pass
    return jsonify({'message': 'TODO'}), 200

# --------------- BACK UPS ------------------
@app.route('/api/export', methods=['GET'])
def api_export():
    pass
    return jsonify({'message': 'TODO'}), 200
@app.route('/api/import', methods=['POST'])
def api_import():
    pass
    return jsonify({'message': 'TODO'}), 200