from flask import Flask, render_template, request, jsonify
import random, string

app = Flask(__name__)

def check_strength(password):
    score = 0
    suggestions = []

    if len(password) >= 8:
        score += 1
    else:
        suggestions.append("Use at least 8 characters")

    if any(c.isupper() for c in password):
        score += 1
    else:
        suggestions.append("Add uppercase letters")

    if any(c.islower() for c in password):
        score += 1
    else:
        suggestions.append("Add lowercase letters")

    if any(c.isdigit() for c in password):
        score += 1
    else:
        suggestions.append("Add numbers")

    if any(c in string.punctuation for c in password):
        score += 1
    else:
        suggestions.append("Add special characters")

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Medium"
    else:
        strength = "Strong"

    return {"score": score, "strength": strength, "suggestions": suggestions}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    length = max(8, min(32, int(data.get("length", 12))))
    pool = string.ascii_lowercase
    if data.get("uppercase"): pool += string.ascii_uppercase
    if data.get("numbers"):   pool += string.digits
    if data.get("symbols"):   pool += string.punctuation

    password = "".join(random.choices(pool, k=length))
    return jsonify({"password": password, **check_strength(password)})

@app.route("/check", methods=["POST"])
def check():
    password = request.json.get("password", "")
    return jsonify(check_strength(password))

if __name__ == "__main__":
    app.run(debug=True)
