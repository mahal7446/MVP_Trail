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
        
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN notifications_enabled INTEGER DEFAULT 1")
            print("Added notifications_enabled column")
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
                image_url TEXT,
                scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users(email)
            )
        ''')
        
        # Migrate existing table if needed (add image_url column)
        try:
            cursor.execute("ALTER TABLE scan_history ADD COLUMN image_url TEXT")
            print("Added image_url column to scan_history")
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        # Create community alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_name TEXT NOT NULL,
                location TEXT NOT NULL,
                disease_reported TEXT NOT NULL,
                description TEXT,
                prevention_methods TEXT,
                image_url TEXT,
                user_email TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users(email)
            )
        ''')
        
        # Migrate existing alerts table if needed
        try:
            cursor.execute("ALTER TABLE alerts ADD COLUMN prevention_methods TEXT")
            print("Added prevention_methods column to alerts")
        except sqlite3.OperationalError:
            pass  # Column already exists
        
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

def save_scan(user_email, disease_name, confidence, crop_name=None, severity=None, image_url=None):
    """
    Save a disease detection scan to history
    Returns: (success, scan_id_or_message)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO scan_history (user_email, disease_name, confidence, crop_name, severity, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user_email, disease_name, confidence, crop_name, severity, image_url))
            scan_id = cursor.lastrowid
            
        return True, scan_id
    except Exception as e:
        return False, f"Error saving scan: {str(e)}"

def get_user_scans(user_email, limit=50):
    """
    Get user's scan history
    Returns: list of scans
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, disease_name, confidence, crop_name, severity, image_url, scan_date
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
                'imageUrl': row['image_url'],
                'scanDate': row['scan_date']
            } for row in rows]
    except Exception as e:
        print(f"Error fetching scans: {str(e)}")
        return []

def get_scan_by_id(scan_id, user_email):
    """
    Get a specific scan by ID (verifying ownership)
    Returns: scan dict or None
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, disease_name, confidence, crop_name, severity, image_url, scan_date
                FROM scan_history
                WHERE id = ? AND user_email = ?
            ''', (scan_id, user_email))
            
            row = cursor.fetchone()
            if row:
                return {
                    'id': row['id'],
                    'diseaseName': row['disease_name'],
                    'confidence': row['confidence'],
                    'cropName': row['crop_name'],
                    'severity': row['severity'],
                    'imageUrl': row['image_url'],
                    'scanDate': row['scan_date']
                }
        return None
    except Exception as e:
        print(f"Error fetching scan: {str(e)}")
        return None

def delete_scan(scan_id, user_email):
    """
    Delete a scan from history (only if owned by user)
    Returns: (success, message_or_image_url)
    """
    try:
        # First get the scan to retrieve image URL for cleanup
        scan = get_scan_by_id(scan_id, user_email)
        if not scan:
            return False, "Scan not found or not authorized"
        
        image_url = scan.get('imageUrl')
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                DELETE FROM scan_history
                WHERE id = ? AND user_email = ?
            ''', (scan_id, user_email))
            
            if cursor.rowcount == 0:
                return False, "Scan not found"
            
        return True, image_url  # Return image URL for file cleanup
    except Exception as e:
        return False, f"Error deleting scan: {str(e)}"

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

def create_alert(farmer_name, location, disease_reported, description=None, prevention_methods=None, image_url=None, user_email=None):
    """
    Create a new community alert
    Returns: (success, message_or_alert_data)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO alerts (farmer_name, location, disease_reported, description, prevention_methods, image_url, user_email)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (farmer_name, location, disease_reported, description, prevention_methods, image_url, user_email))
            
            alert_id = cursor.lastrowid
            
        return True, {
            'id': alert_id,
            'farmerName': farmer_name,
            'location': location,
            'diseaseReported': disease_reported,
            'description': description,
            'preventionMethods': prevention_methods,
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
                SELECT id, farmer_name, location, disease_reported, description, prevention_methods, image_url, user_email, created_at
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
                'preventionMethods': row['prevention_methods'],
                'imageUrl': row['image_url'],
                'userEmail': row['user_email'],
                'createdAt': row['created_at']
            } for row in rows]
    except Exception as e:
        print(f"Error fetching alerts: {str(e)}")
        return []

# ============== LOCATION-BASED AND NOTIFICATION FUNCTIONS ==============

from location_helpers import extract_district, normalize_district_name

def get_alerts_by_location(user_email, limit=20):
    """
    Get alerts filtered by user's location (same district or nearby)
    Always includes the user's own alerts.
    Returns: list of alerts
    """
    try:
        # Get user's address
        user = get_user(user_email)
        user_address = user.get('address', '') if user else ''
        user_district = extract_district(user_address)
        normalized_user_district = normalize_district_name(user_district) if user_district else None
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Fetch more than limit to allow for filtering
            cursor.execute('''
                SELECT id, farmer_name, location, disease_reported, description, prevention_methods, image_url, user_email, created_at
                FROM alerts
                ORDER BY created_at DESC
                LIMIT 100
            ''')
            
            rows = cursor.fetchall()
            filtered_alerts = []
            
            for row in rows:
                alert_user_email = row['user_email']
                alert_location = row['location']
                
                # 1. Always include user's own alerts
                if alert_user_email == user_email:
                    filtered_alerts.append({
                        'id': row['id'],
                        'farmerName': row['farmer_name'],
                        'location': row['location'],
                        'diseaseReported': row['disease_reported'],
                        'description': row['description'],
                        'preventionMethods': row['prevention_methods'],
                        'imageUrl': row['image_url'],
                        'userEmail': row['user_email'],
                        'createdAt': row['created_at']
                    })
                    continue

                # 2. Location-based matching
                if normalized_user_district:
                    alert_district = extract_district(alert_location)
                    normalized_alert_district = normalize_district_name(alert_district) if alert_district else None
                    
                    # Match if districts are the same (after normalization)
                    if (normalized_user_district == normalized_alert_district or 
                        (user_district and user_district in alert_location.lower()) or 
                        (alert_district and alert_district in user_address.lower())):
                        
                        filtered_alerts.append({
                            'id': row['id'],
                            'farmerName': row['farmer_name'],
                            'location': row['location'],
                            'diseaseReported': row['disease_reported'],
                            'description': row['description'],
                            'preventionMethods': row['prevention_methods'],
                            'imageUrl': row['image_url'],
                            'userEmail': row['user_email'],
                            'createdAt': row['created_at']
                        })
                
                if len(filtered_alerts) >= limit:
                    break
            
            # 3. Fallback: if still no alerts (or very few), pad with recent ones
            if len(filtered_alerts) < 5:
                already_included = {a['id'] for a in filtered_alerts}
                for row in rows:
                    if row['id'] not in already_included:
                        filtered_alerts.append({
                            'id': row['id'],
                            'farmerName': row['farmer_name'],
                            'location': row['location'],
                            'diseaseReported': row['disease_reported'],
                            'description': row['description'],
                            'preventionMethods': row['prevention_methods'],
                            'imageUrl': row['image_url'],
                            'userEmail': row['user_email'],
                            'createdAt': row['created_at']
                        })
                    if len(filtered_alerts) >= limit:
                        break

            return filtered_alerts
            
    except Exception as e:
        print(f"Error fetching location-based alerts: {str(e)}")
        return get_recent_alerts(limit)

def delete_alert(alert_id, user_email):
    """
    Delete an alert (only if user owns it)
    Returns: (success, message_or_image_url)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # First check if alert exists and user owns it
            cursor.execute('''
                SELECT image_url FROM alerts
                WHERE id = ? AND user_email = ?
            ''', (alert_id, user_email))
            
            row = cursor.fetchone()
            if not row:
                return False, "Alert not found or not authorized"
            
            image_url = row['image_url'] if row else None
            
            # Delete the alert
            cursor.execute('''
                DELETE FROM alerts
                WHERE id = ? AND user_email = ?
            ''', (alert_id, user_email))
            
            if cursor.rowcount == 0:
                return False, "Alert not found"
            
        return True, image_url  # Return image URL for cleanup
    except Exception as e:
        return False, f"Error deleting alert: {str(e)}"

def get_user_notification_preference(email):
    """
    Get user's notification preference
    Returns: (success, enabled_boolean)
    """
    try:
        user = get_user(email)
        if not user:
            return False, False
        
        # Default to True if column doesn't exist or is None
        enabled = user.get('notifications_enabled', 1)
        return True, bool(enabled)
    except Exception as e:
        print(f"Error getting notification preference: {str(e)}")
        return False, True  # Default to enabled

def update_user_notification_preference(email, enabled):
    """
    Update user's notification preference
    Returns: (success, message)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE users SET notifications_enabled = ?
                WHERE email = ?
            ''', (1 if enabled else 0, email))
            
            if cursor.rowcount == 0:
                return False, "User not found"
            
        return True, "Notification preference updated successfully"
    except Exception as e:
        return False, f"Error updating notification preference: {str(e)}"

def get_new_alerts_count(user_email, last_seen_id=0):
    """
    Get count of new alerts since last_seen_id for user's location
    Returns: count of new alerts
    """
    try:
        alerts = get_alerts_by_location(user_email, limit=50)
        new_count = sum(1 for alert in alerts if alert['id'] > last_seen_id)
        return new_count
    except Exception as e:
        print(f"Error counting new alerts: {str(e)}")
        return 0

def update_alert(alert_id, user_email, farmer_name=None, location=None, disease_reported=None, description=None, prevention_methods=None, image_url=None):
    """
    Update an alert (only if user owns it)
    Returns: (success, message)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Build dynamic update query
            updates = []
            params = []
            
            if farmer_name is not None:
                updates.append("farmer_name = ?")
                params.append(farmer_name)
            if location is not None:
                updates.append("location = ?")
                params.append(location)
            if disease_reported is not None:
                updates.append("disease_reported = ?")
                params.append(disease_reported)
            if description is not None:
                updates.append("description = ?")
                params.append(description)
            if prevention_methods is not None:
                updates.append("prevention_methods = ?")
                params.append(prevention_methods)
            if image_url is not None:
                updates.append("image_url = ?")
                params.append(image_url)
                
            if not updates:
                return False, "No fields to update"
                
            params.append(alert_id)
            params.append(user_email)
            
            query = f"UPDATE alerts SET {', '.join(updates)} WHERE id = ? AND user_email = ?"
            cursor.execute(query, params)
            
            if cursor.rowcount == 0:
                return False, "Alert not found or not authorized"
                
        return True, "Alert updated successfully"
    except Exception as e:
        return False, f"Error updating alert: {str(e)}"

def get_user_stats(user_email):
    """
    Get scan statistics for a user
    Returns: {total, healthy, diseased}
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Get total scans
            cursor.execute('SELECT COUNT(*) FROM scan_history WHERE user_email = ?', (user_email,))
            total_scans = cursor.fetchone()[0]
            
            # Get healthy scans (where disease_name contains 'Healthy')
            cursor.execute('''
                SELECT COUNT(*) FROM scan_history 
                WHERE user_email = ? AND disease_name LIKE '%Healthy%'
            ''', (user_email,))
            healthy_scans = cursor.fetchone()[0]
            
            diseased_scans = total_scans - healthy_scans
            
            return {
                'total': total_scans,
                'healthy': healthy_scans,
                'diseased': diseased_scans
            }
    except Exception as e:
        print(f"Error fetching user stats: {str(e)}")
        return {'total': 0, 'healthy': 0, 'diseased': 0}
