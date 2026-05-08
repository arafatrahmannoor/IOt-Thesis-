"""
Test script for Health Prediction API
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_api_root():
    """Test the API root endpoint"""
    print("Testing API Root (GET /)...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}\n")
        return False

def test_profile_get():
    """Test the profile GET endpoint"""
    print("Testing Profile Status (GET /profile/)...")
    try:
        response = requests.get(f"{BASE_URL}/profile/")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}\n")
        return False

def test_prediction_normal():
    """Test prediction with normal values"""
    print("Testing Prediction - Normal Values (POST /profile/)...")
    data = {
        "Temp_C": 37.0,
        "SpO2": 99,
        "BPM": 70
    }
    try:
        response = requests.post(
            f"{BASE_URL}/profile/",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Request Data: {json.dumps(data, indent=2)}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}\n")
        return False

def test_prediction_abnormal():
    """Test prediction with potentially abnormal values"""
    print("Testing Prediction - Potentially Abnormal Values (POST /profile/)...")
    data = {
        "Temp_C": 39.5,
        "SpO2": 88,
        "BPM": 120
    }
    try:
        response = requests.post(
            f"{BASE_URL}/profile/",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Request Data: {json.dumps(data, indent=2)}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}\n")
        return False

def test_missing_fields():
    """Test prediction with missing fields"""
    print("Testing Prediction - Missing Fields (POST /profile/)...")
    data = {
        "Temp_C": 37.0,
        "SpO2": 99
        # BPM is missing
    }
    try:
        response = requests.post(
            f"{BASE_URL}/profile/",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Request Data: {json.dumps(data, indent=2)}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 400
    except Exception as e:
        print(f"Error: {e}\n")
        return False

def test_invalid_data():
    """Test prediction with invalid data types"""
    print("Testing Prediction - Invalid Data Types (POST /profile/)...")
    data = {
        "Temp_C": "invalid",
        "SpO2": 99,
        "BPM": 70
    }
    try:
        response = requests.post(
            f"{BASE_URL}/profile/",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Request Data: {json.dumps(data, indent=2)}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 400
    except Exception as e:
        print(f"Error: {e}\n")
        return False

if __name__ == "__main__":
    print("="*60)
    print("Health Prediction API - Test Suite")
    print("="*60 + "\n")
    
    tests = [
        ("API Root", test_api_root),
        ("Profile Status", test_profile_get),
        ("Normal Prediction", test_prediction_normal),
        ("Abnormal Prediction", test_prediction_abnormal),
        ("Missing Fields", test_missing_fields),
        ("Invalid Data", test_invalid_data),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"Test '{test_name}' failed with exception: {e}\n")
            results.append((test_name, False))
    
    print("="*60)
    print("Test Results Summary")
    print("="*60)
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
    print("="*60)
