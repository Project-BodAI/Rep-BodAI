import requests


headers = {
  "Content-Type": "application/json"
}

data = {
    "username": "eren",
    "email": "eren@example.com",
    "password": "build"
}

res = requests.post(url, headers=headers, json=data)

print(res.status_code)
print(res.text)

