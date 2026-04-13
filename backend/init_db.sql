import sqlite3

conn = sqlite3.connect('sunset.db') -- conn = connection
cursor = conn.cursor()

-- Creating all the main tables
cursor.execute('''
    CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        objectif INTEGER NOT NULL,
        frequency INTEGER NOT NULL DEFAULT'daily', 
        target_days INTEGER NOT NULL DEFAULT 7,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS rendez_vous (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
''')

conn.commit()
conn.close()
print("Base de donnée normalement crée j'espère zebi")