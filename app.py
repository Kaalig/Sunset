from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

@app.route('/') 
def index():
    return render_template('index.html')  # Jinja2 génère le HTML


# --------------- HABITUDES ------------------

@app.route('/api/habits', methods=['GET','POST'])
def api_habit():
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM habits')
        habits = [dict(row) for row in cursor.fetchall()]
        for habit in habits:
            cursor.execute('SELECT completed_date FROM habits_logs WHERE habit_id=?', (habit['id'],))
            habit['logs'] = [row['completed_date'] for row in cursor.fetchall()]

        conn.close()
        return habits
    else:
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO habits (name, description, goal_days) VALUES (?, ?, ?)', (data['name'], data.get('description', None), data.get('goal_days', 7)))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien reçu'}), 200

# TODO : CHANGER LE PUT POUR NE PAS QUE SI ON SELECTIONNE QUE LE NAME  LA DESCRIPTION EST ECRASEE ET LE GOAL_DAYS REVIENT A 7
# ? Je ne sais pas comment faire.

@app.route('/api/habits/<id>', methods=['PUT','DELETE'])
def api_habit_id(id):
    if request.method == 'PUT':
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM habits WHERE id=?', (id,))
        habit = cursor.fetchone()
        if not habit:
            conn.close()
            return jsonify({'message': 'Habitude non trouvé'}), 404
        cursor.execute('UPDATE habits SET name=?, description=?, goal_days=? WHERE id=?', (data.get('name', habit['name']), data.get('description', habit['description']), data.get('goal_days', habit['goal_days']), id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien mis à jour'}), 200
    else:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM habits WHERE id=?', (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Habitude bien supprimé'}), 200

@app.route('/api/habits/<id>/check', methods=['POST'])
def api_habit_check(id):
    data = request.get_json()
    done = data['done']
    if done == True:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO habits_logs (habit_id, completed_date) VALUES (?, ?)', (id, data['date']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien reçu'}), 200
    else:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM habits_logs WHERE habit_id=? AND completed_date=?', (id, data['date']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien supprimé'}), 200


@app.route ('/api/habits/stats', methods=['GET'])
def api_habit_stats():
    return jsonify({'message': 'TODO'}), 200


# --------------- NOTES ------------------
@app.route('/api/notes', methods=['GET','POST'])
def api_notes():
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM notes WHERE deleted_at IS NULL ORDER BY edited_at DESC')
        notes = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return notes
    else:
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO notes (title, content) VALUES (?, ?)', (data.get('title', None), data.get('content', None)))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien reçu'}), 200

@app.route('/api/notes/<id>', methods=['GET','PUT','DELETE'])
def api_notes_id(id):
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM notes WHERE id=? AND deleted_at IS NULL', (id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'message': 'Note non trouvé'}), 404
        note = dict(row)
        return note
    elif request.method == 'PUT':
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM notes WHERE id=? AND deleted_at IS NULL', (id,))
        note = cursor.fetchone()
        if not note:
            conn.close()
            return jsonify({'message': 'Note non trouvé'}), 404
        cursor.execute('UPDATE notes SET title=?, content=?, edited_at=CURRENT_TIMESTAMP WHERE id=? AND deleted_at IS NULL', (data.get('title', note['title']), data.get('content', note['content']), id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien mis à jour'}), 200
    else:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE notes SET deleted_at=CURRENT_TIMESTAMP WHERE id=? AND deleted_at IS NULL', (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Bien supprimé'}), 200

@app.route('/api/notes/trash', methods=['GET','DELETE'])
def api_notes_get_trash():
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM notes WHERE deleted_at IS NOT NULL')
        notes = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return notes
    else:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM notes WHERE deleted_at IS NOT NULL')
        conn.commit()
        conn.close()
        return jsonify({'message': 'Corbeile vidée'}), 200


@app.route('/api/notes/<id>/restore', methods=['POST'])
def api_notes_restore(id):
    conn = sqlite3.connect('sunset.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE notes SET deleted_at=NULL WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note bien restaurée'}), 200

# --------------- RENDEZ-VOUS ------------------

@app.route('/api/rdv', methods=['GET','POST'])
def api_rdv():
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM rendez_vous')
        rdvs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rdvs
    else:
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO rendez_vous (title, start_date, end_date, iteration, iteration_frequency, location, description, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', (data['title'], data['start_date'], data['end_date'], data.get('iteration', 0), data.get('iteration_frequency', None), data.get('location', None), data.get('description', None), data.get('color', '#6c5ce7')))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Rendez-vous crée'}), 200

@app.route('/api/rdv/<id>', methods=['GET','PUT','DELETE'])
def api_rdv_id(id):
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM rendez_vous WHERE id=?', (id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'message': 'Rendez-vous non trouvé'}), 404
        rdv = dict(row)
        return rdv
    elif request.method == 'PUT':
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE rendez_vous SET title=?, start_date=?, end_date=?, iteration=?, iteration_frequency=?, location=?, description=?, color=? WHERE id=?', (data['title'], data['start_date'], data['end_date'], data.get('iteration', 0), data.get('iteration_frequency', None), data.get('location', None), data.get('description', None), data.get('color', '#6c5ce7'), id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Rendez-vous mis à jour'}), 200
    else:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM rendez_vous WHERE id=?', (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Rendez-vous supprimé'}), 200
    

# --------------- CITATIONS ------------------
@app.route('/api/quotes', methods=['GET','POST'])
def api_quotes():
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM quotes')
        quote = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return quote
    else:
        data = request.get_json()
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO quotes (quote) VALUES (?)', (data['quote'],))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Citation bien ajoutée'}), 200


@app.route('/api/quotes/<id>', methods=['GET','DELETE'])
def api_quotes_id(id):
    if request.method == 'GET':
        conn = sqlite3.connect('sunset.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM quotes WHERE id=?', (id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'message': 'Citation non trouvée'}), 404
        quote = dict(row)
        return quote
    else:
        conn = sqlite3.connect('sunset.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM quotes WHERE id=?', (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Citation bien supprimée'}), 200



# --------------- BACK UPS ------------------
# TODO : A faire plus tard vers la fin
@app.route('/api/export', methods=['GET'])
def api_export():
    conn = sqlite3.connect('sunset.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('')
    conn.close()
    return jsonify({'message': 'TODO'}), 200
@app.route('/api/import', methods=['POST'])
def api_import():
    data = request.get_json()
    conn = sqlite3.connect('sunset.db')
    cursor = conn.cursor()
    cursor.execute('')
    conn.commit()
    conn.close()
    return jsonify({'message': 'TODO'}), 200

if __name__ == '__main__':
    app.run(debug=True)