import sqlite3
import os

db_path = 'agridetect.db'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

try:
    cursor.execute("SELECT id, user_email, disease_name, confidence, scan_date FROM scan_history")
    rows = cursor.fetchall()
    with open('db_dump.txt', 'w') as f:
        f.write(f"Total rows in scan_history: {len(rows)}\n")
        for row in rows:
            f.write(f"ID: {row['id']} | Email: {row['user_email']} | Disease: {row['disease_name']} | Confidence: {row['confidence']} | Date: {row['scan_date']}\n")
    print(f"Dumped {len(rows)} rows to db_dump.txt")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
