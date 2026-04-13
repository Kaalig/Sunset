import sqlite3

conn = sqlite3.connect('sunset.db') -- conn = connection
cursor = conn.cursor()

-- Creating all the main tables
cursor.execute('''
    CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        goal_days INTEGER NOT NULL DEFAULT 7,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS habits_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        completed_date TEXT NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
        )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL
        )
''')

-- Plus tard : Changer le end_date en supprimant le 'NOT NULL' et rajouter un truc sympa pour pas niquer le calendrier si c'est un truc à faire sans horaire de fin
cursor.execute('''
    CREATE TABLE IF NOT EXISTS rendez_vous (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        location TEXT,
        description TEXT,
        color TEXT DEFAULT '#6c5ce7',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
''')

conn.commit()
conn.close()
print("Base de donnée normalement crée j'espère zebi")