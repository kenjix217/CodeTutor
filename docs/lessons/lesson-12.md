# Working with APIs

## Goal

By the end of this lesson, you will understand what APIs are, how to make HTTP requests to fetch data from web services, and how to build programs that interact with the internet.

---

## Explanation

You have learned to work with data you create in your programs. But what if you want data from the internet? Weather information, currency rates, news articles, or social media posts?

This is where **APIs** come in.

An **API** (Application Programming Interface) is a way for programs to talk to each other over the internet. When you use a weather app, it gets data from a weather API. When you check stock prices, that data comes from a financial API.

Think of an API like a waiter in a restaurant:
- **You** (your program) ask the waiter for something
- **The waiter** (the API) takes your request to the kitchen
- **The kitchen** (the server) prepares what you asked for
- **The waiter** brings it back to you
- **You** use what you received

**REST APIs:**

The most common type of API is called REST (Representational State Transfer). REST APIs use HTTP requests - the same technology that powers websites.

**HTTP Methods:**

```python
GET    # Get data (like viewing a webpage)
POST   # Send data (like submitting a form)
PUT    # Update data
DELETE # Remove data
```

For this lesson, we focus on GET (fetching data).

---

**Making API requests with Python:**

**In real Python** (not browser - network limitations in Pyodide):

```python
import requests

response = requests.get('https://api.example.com/data')
data = response.json()
print(data)
```

**What this does:**

The `requests.get()` function sends an HTTP GET request to the URL. The server responds with data. We convert it from JSON to a Python dictionary with `.json()`.

**Note:** In our browser environment, network requests are limited by CORS. The concepts you learn here work in real Python installations.

---

**Understanding the response:**

```python
import requests

response = requests.get('https://api.github.com')

print(f"Status code: {response.status_code}")
print(f"Headers: {response.headers}")
print(f"Content: {response.text}")
```

**What this shows:**

- **Status code:** 200 = success, 404 = not found, 500 = server error
- **Headers:** Metadata about the response
- **Content:** The actual data returned

**Working with JSON responses:**

Most APIs return data in JSON format:

```python
import requests

# Free API - no key required
response = requests.get('https://api.coindesk.com/v1/bpi/currentprice.json')

if response.status_code == 200:
    data = response.json()
    bitcoin_price = data['bpi']['USD']['rate']
    print(f"Bitcoin price: ${bitcoin_price}")
else:
    print(f"Error: {response.status_code}")
```

**What this does:**

We fetch current Bitcoin price from a free API. If successful (status 200), we extract the price from the JSON data.

---

**API keys and authentication:**

Some APIs require an API key for access:

```python
import requests

# Example with API key
api_key = "your-api-key-here"
headers = {"Authorization": f"Bearer {api_key}"}

response = requests.get(
    'https://api.example.com/data',
    headers=headers
)

data = response.json()
```

**What this does:**

The API key proves you have permission to access the API. It's sent in the request headers.

**Important:** Never share your API keys! Keep them private.

---

## Example

Here is a program that gets weather data (conceptual - using free API):

```python
import requests
import json

# Free weather API example (OpenMeteo - no key required)
latitude = 40.7128  # New York City
longitude = -74.0060

url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"

try:
    response = requests.get(url, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        weather = data['current_weather']
        
        print("Current Weather in NYC:")
        print(f"Temperature: {weather['temperature']}°C")
        print(f"Wind Speed: {weather['windspeed']} km/h")
        print(f"Weather Code: {weather['weathercode']}")
    else:
        print(f"API Error: {response.status_code}")
        
except requests.exceptions.Timeout:
    print("Request timed out. Try again.")
except requests.exceptions.ConnectionError:
    print("Cannot connect. Check your internet.")
except Exception as e:
    print(f"Error: {e}")
```

**What happens here?**

We build a URL with coordinates, make a GET request to the weather API, check if successful, parse the JSON response, and display the weather data. We also handle potential errors (timeout, connection issues).

**Processing API data:**

```python
import requests

# Get list of public APIs (free directory)
response = requests.get('https://api.publicapis.org/entries')

if response.status_code == 200:
    data = response.json()
    apis = data['entries'][:5]  # First 5 APIs
    
    print("Free Public APIs:")
    for i, api in enumerate(apis, 1):
        print(f"{i}. {api['API']}")
        print(f"   Category: {api['Category']}")
        print(f"   Description: {api['Description']}")
        print()
```

**What this does:**

We fetch a list of free public APIs and display information about the first 5. This shows how to work with lists of data from APIs.

---

## Guided Practice

Let's practice working with APIs.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Use the json library (works in browser):

```python
import json

# Simulate API response
api_response = '{"name": "Alice", "score": 95, "passed": true}'

# Parse JSON
data = json.loads(api_response)
print(f"Name: {data['name']}")
print(f"Score: {data['score']}")
print(f"Passed: {data['passed']}")
```

**Step 3:** Create JSON from Python data:

```python
import json

user = {
    "username": "coder123",
    "email": "coder@example.com",
    "projects": ["website", "game", "bot"]
}

# Convert to JSON
json_output = json.dumps(user, indent=2)
print(json_output)
```

**Step 4:** Work with datetime library:

```python
from datetime import datetime, timedelta

# Current time
now = datetime.now()
print(f"Now: {now.strftime('%I:%M %p')}")

# Time zones and formatting
print(f"Date: {now.strftime('%B %d, %Y')}")

# Calculate deadline (30 days from now)
deadline = now + timedelta(days=30)
print(f"Deadline: {deadline.strftime('%B %d, %Y')}")
```

**Step 5:** Simulate working with API data:

```python
import json

# Simulate API response with list of users
api_data = '''
{
    "users": [
        {"name": "Alice", "age": 25, "country": "USA"},
        {"name": "Bob", "age": 30, "country": "Canada"},
        {"name": "Charlie", "age": 22, "country": "UK"}
    ]
}
'''

data = json.loads(api_data)

# Process the data
print("Users over 25:")
for user in data['users']:
    if user['age'] > 25:
        print(f"- {user['name']} ({user['age']}) from {user['country']}")

# Calculate average age
ages = [user['age'] for user in data['users']]
avg_age = sum(ages) / len(ages)
print(f"\nAverage age: {avg_age:.1f}")
```

**What happens:**

We parse JSON data (like you'd get from an API), filter it, and perform calculations. This is exactly how you'd process real API responses.

---

## Homework

Your task is to build a **currency data analyzer** that simulates working with an exchange rate API.

**Requirements:**

- Create a dictionary simulating API response with exchange rates
  - Base currency: USD
  - Include rates for at least 5 currencies (EUR, GBP, JPY, CAD, AUD)
- Convert this dictionary to JSON string (use json.dumps with indent=2)
- Parse it back from JSON (use json.loads)
- Create a function that takes an amount in USD and converts it to another currency
- Convert $100 USD to at least 3 different currencies and print results

**Example output:**

```
Exchange Rates (Base: USD)
{
  "base": "USD",
  "date": "2026-01-13",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.50,
    ...
  }
}

Currency Conversions for $100 USD:
EUR: €92.00
GBP: £79.00
JPY: ¥14,950.00
```

**Hints:**

Create the exchange rate data:

```python
import json
from datetime import datetime

rates_data = {
    "base": "USD",
    "date": datetime.now().strftime("%Y-%m-%d"),
    "rates": {
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 149.50,
        "CAD": 1.35,
        "AUD": 1.52
    }
}
```

Convert to JSON and back:

```python
json_string = json.dumps(rates_data, indent=2)
print(json_string)

data = json.loads(json_string)
```

Create conversion function:

```python
def convert_currency(amount, from_currency, to_currency, rates):
    if from_currency == "USD":
        return amount * rates[to_currency]
    # Add logic for other conversions
```

**Bonus challenge:** Add error handling for invalid currency codes and add a function to find which currency gives you the most value for $100 USD.

This homework prepares you for working with real financial and data APIs.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What is an API?
2. What does the requests library do?
3. What is JSON and why is it commonly used with APIs?
4. What HTTP status code means success?
5. Why might an API require an API key?

If you understand these concepts, you are ready to build programs that interact with web services and external data sources.

---

**Excellent progress!** You now understand how to work with external libraries and APIs, which opens up unlimited possibilities for your programs. You can fetch real-time data, integrate with web services, and build applications that connect to the internet. In the next lesson, you will learn about data processing and analysis, essential skills for working with real-world datasets.




