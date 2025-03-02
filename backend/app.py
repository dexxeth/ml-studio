from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS for handling cross-origin requests
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate(
    "backend/serviceAccountKey.json")  # Ensure correct path
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)
# ✅ Allow only Next.js frontend to access
CORS(app, origins=["http://localhost:3000"])

# Route to upload dataset to Firestore


@app.route("/uploadDataset", methods=["POST"])
def upload_dataset():
    try:
        data = request.json  # Get JSON data
        print("Received Data:", data)  # Debugging output

        if not data or "dataset" not in data or not isinstance(data["dataset"], list):
            return jsonify({"error": "Invalid dataset format"}), 400

        dataset = data["dataset"]

        batch = db.batch()
        collection_ref = db.collection("datasets")

        for i, record in enumerate(dataset):
            doc_ref = collection_ref.document(f"record_{i}")
            batch.set(doc_ref, record)

        batch.commit()
        return jsonify({"message": "Dataset uploaded successfully"}), 200

    except Exception as e:
        print("Error:", str(e))  # Debugging output
        return jsonify({"error": str(e)}), 500

# Route to fetch dataset from Firestore


@app.route("/getDataset", methods=["GET"])
def get_dataset():
    try:
        dataset_ref = db.collection("datasets")
        docs = dataset_ref.stream()

        dataset = [doc.to_dict() for doc in docs]

        if not dataset:
            return jsonify({"error": "No dataset found"}), 404

        return jsonify({"dataset": dataset}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
