from flask import Flask, render_template

app = Flask(__name__)

@app.route('/') 
def index():
    return render_template('index.html')  # Jinja2 génère le HTML


@app.route('/habits')
def task():
    return render_template('habits.html')

def add_task():
    pass
def edit_task():
    pass
def delete_task():
    pass



@app.route('/notes')
def notes():
    return render_template('notes.html')

def add_note():
    pass

def edit_note():
    pass
def delete_note():
    pass
@app.route('/add_habit', methods=['POST'])
def add_habit():
    return render_template('add_habit.html')


@app.route('/rdvr')
def tracker():
    return render_template('tracker.html')

@app.route('/appointments')
def appointments():
    return render_template('appointments.html')