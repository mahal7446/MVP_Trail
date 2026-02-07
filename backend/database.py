"""
SQLite database module for AgriDetect AI
Handles user authentication and scan history persistence
"""
import sqlite3
import bcrypt
from datetime import datetime
from contextlib import contextmanager

DATABASE_NAME = 'agridetect.db'

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def init_db():
    """Initialize database and create tables if they don't exist"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                profile_picture_url TEXT,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Migrate existing table if needed (add new columns)
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN profile_picture_url TEXT")
            print("Added profile_picture_url column")
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN address TEXT")
            print("Added address column")
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        # Create scan_history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scan_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT NOT NULL,
                disease_name TEXT NOT NULL,
                confidence REAL NOT NULL,
                crop_name TEXT,
                severity TEXT,
                scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users(email)
            )
        ''')
        
        # Create community alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_name TEXT NOT NULL,
                location TEXT NOT NULL,
                disease_reported TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                user_email TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users(email)
            )
        ''')
        
        print("Database initialized successfully")

def hash_password(password):
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(stored_hash, provided_password):
    """Verify a password against its hash"""
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_hash.encode('utf-8'))

def create_user(email, full_name, phone, password):
    """
    Create a new user with hashed password
    Returns: (success, message_or_user_data)
    """
    try:
        password_hash = hash_password(password)
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (email, full_name, phone, password_hash)
                VALUES (?, ?, ?, ?)
            ''', (email, full_name, phone, password_hash))
            
        return True, {
            'email': email,
            'fullName': full_name,
            'phone': phone
        }
    except sqlite3.IntegrityError:
        return False, "Email already registered"
    except Exception as e:
        return False, f"Error creating user: {str(e)}"

def get_user(email):
    """
    Get user by email
    Returns: user dict or None
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, email, full_name, phone, password_hash, profile_picture_url, address, created_at
                FROM users WHERE email = ?
            ''', (email,))
            
            row = cursor.fetchone()
            if row:
                return {
                    'id': row['id'],
                    'email': row['email'],
                    'fullName': row['full_name'],
                    'phone': row['phone'],
                    'password_hash': row['password_hash'],
                    'profilePictureUrl': row['profile_picture_url'],
                    'address': row['address'],
                    'created_at': row['created_at']
                }
        return None
    except Exception as e:
        print(f"Error fetching user: {str(e)}")
        return None

def save_scan(user_email, disease_name, confidence, crop_name=None, severity=None):
    """
    Save a disease detection scan to history
    Returns: (success, message)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO scan_history (user_email, disease_name, confidence, crop_name, severity)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_email, disease_name, confidence, crop_name, severity))
            
        return True, "Scan saved successfully"
    except Exception as e:
        return False, f"Error saving scan: {str(e)}"

def get_user_scans(user_email, limit=10):
    """
    Get user's scan history
    Returns: list of scans
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, disease_name, confidence, crop_name, severity, scan_date
                FROM scan_history
                WHERE user_email = ?
                ORDER BY scan_date DESC
                LIMIT ?
            ''', (user_email, limit))
            
            rows = cursor.fetchall()
            return [{
                'id': row['id'],
                'diseaseName': row['disease_name'],
                'confidence': row['confidence'],
                'cropName': row['crop_name'],
                'severity': row['severity'],
                'scanDate': row['scan_date']
            } for row in rows]
    except Exception as e:
        print(f"Error fetching scans: {str(e)}")
        return []

def update_user_profile(email, full_name=None, phone=None, address=None):
    """
    Update user profile information
    Returns: (success, message)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Build dynamic update query based on provided fields
            updates = []
            params = []
            
            if full_name is not None:
                updates.append("full_name = ?")
                params.append(full_name)
            if phone is not None:
                updates.append("phone = ?")
                params.append(phone)
            if address is not None:
                updates.append("address = ?")
                params.append(address)
            
            if not updates:
                return False, "No fields to update"
            
            params.append(email)
            query = f"UPDATE users SET {', '.join(updates)} WHERE email = ?"
            
            cursor.execute(query, params)
            
            if cursor.rowcount == 0:
                return False, "User not found"
            
        return True, "Profile updated successfully"
    except Exception as e:
        return False, f"Error updating profile: {str(e)}"

def update_profile_picture(email, profile_picture_url):
    """
    Update user profile picture URL
    Returns: (success, message)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE users SET profile_picture_url = ?
                WHERE email = ?
            ''', (profile_picture_url, email))
            
            if cursor.rowcount == 0:
                return False, "User not found"
            
        return True, "Profile picture updated successfully"
    except Exception as e:
        return False, f"Error updating profile picture: {str(e)}"

def create_alert(farmer_name, location, disease_reported, description=None, image_url=None, user_email=None):
    """
    Create a new community alert
    Returns: (success, message_or_alert_data)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO alerts (farmer_name, location, disease_reported, description, image_url, user_email)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (farmer_name, location, disease_reported, description, image_url, user_email))
            
            alert_id = cursor.lastrowid
            
        return True, {
            'id': alert_id,
            'farmerName': farmer_name,
            'location': location,
            'diseaseReported': disease_reported,
            'description': description,
            'imageUrl': image_url
        }
    except Exception as e:
        return False, f"Error creating alert: {str(e)}"

def get_recent_alerts(limit=10):
    """
    Get recent community alerts
    Returns: list of alerts
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, farmer_name, location, disease_reported, description, image_url, created_at
                FROM alerts
                ORDER BY created_at DESC
                LIMIT ?
            ''', (limit,))
            
            rows = cursor.fetchall()
            return [{
                'id': row['id'],
                'farmerName': row['farmer_name'],
                'location': row['location'],
                'diseaseReported': row['disease_reported'],
                'description': row['description'],
                'imageUrl': row['image_url'],
                'createdAt': row['created_at']
            } for row in rows]
    except Exception as e:
        print(f"Error fetching alerts: {str(e)}")
        return []
