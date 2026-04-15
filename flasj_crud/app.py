from flask import Flask, request, jsonify, render_template
from prisma import Prisma
from prisma.errors import UniqueViolationError
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
db = Prisma()
db.connect()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/users", methods=["GET"])
def get_users():
    users = db.user.find_many()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users])


@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    try:
        user = db.user.create(data={"name": data["name"], "email": data["email"]})
        return jsonify({"id": user.id, "name": user.name, "email": user.email}), 201
    except UniqueViolationError:
        return jsonify({"error": "Email already exists"}), 409


@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = db.user.find_unique(where={"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.id, "name": user.name, "email": user.email})


@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    try:
        user = db.user.update(where={"id": user_id}, data={"name": data["name"], "email": data["email"]})
        return jsonify({"id": user.id, "name": user.name, "email": user.email})
    except UniqueViolationError:
        return jsonify({"error": "Email already exists"}), 409


@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    db.user.delete(where={"id": user_id})
    return jsonify({"message": "User deleted"})


if __name__ == "__main__":
    app.run(debug=True)
