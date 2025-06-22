"""
Script to test the FastAPI application.

This script imports the main FastAPI app and checks for any import errors.
It's useful for debugging application startup issues.
"""

import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from main import app
    print("✅ FastAPI app imported successfully. No import errors detected.")
    
    # Print router information
    for route in app.routes:
        print(f"Route: {route.path}, Methods: {route.methods}")
    
    print(f"\nTotal routes: {len(app.routes)}")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"❌ Other error: {e}")
    import traceback
    traceback.print_exc()
