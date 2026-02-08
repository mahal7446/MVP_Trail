import sqlite3
import os

def delete_alerts():
    db_path = 'agridetect.db'
    base_dir = os.path.join('backend', 'uploads', 'alert_images')
    
    # Alert IDs and images from research
    # ID 1: /uploads/alert_images/1770382296_A.jpeg
    # ID 2: /uploads/alert_images/1770492744_5y.jpg
    
    images_to_delete = [
        '1770382296_A.jpeg',
        '1770492744_5y.jpg'
    ]
    
    # 1. Delete image files
    for img in images_to_delete:
        img_path = os.path.join(base_dir, img)
        if os.path.exists(img_path):
            print(f"Deleting image: {img_path}")
            os.remove(img_path)
        else:
            print(f"Image not found: {img_path}")
            
    # 2. Delete database records
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM alerts WHERE id IN (1, 2)")
        rows_affected = cursor.rowcount
        conn.commit()
        print(f"Deleted {rows_affected} records from database.")
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    delete_alerts()
