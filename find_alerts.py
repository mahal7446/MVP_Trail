import sqlite3
import json

def find_alerts():
    conn = sqlite3.connect('backend/agridetect.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM alerts')
    rows = cursor.fetchall()
    alerts = [dict(row) for row in rows]
    print(json.dumps(alerts, indent=2))
    conn.close()

if __name__ == "__main__":
    find_alerts()
