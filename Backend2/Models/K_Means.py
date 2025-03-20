import pandas as pd
import pickle
import os
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, accuracy_score, recall_score, f1_score
from Pipeline import detect_target_column

def train_kmeans(file_path, n_clusters=3):
    # Load dataset
    df = pd.read_csv(file_path)

    # Use entire dataset for clustering
    X = df.copy()

    # Train K-Means model
    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    cluster_labels = model.fit_predict(X)

    # Ensure the directory exists
    model_dir = "D:/ML_Studio/Pickle"
    os.makedirs(model_dir, exist_ok=True)
    model_filename = os.path.join(model_dir, "kmeans_model.pkl")

    # Compute silhouette score
    silhouette_avg = silhouette_score(X, cluster_labels)

    # Check if ground truth exists (assuming last column has true labels)
    if df.iloc[:, -1].nunique() == n_clusters:
        true_labels = df.iloc[:, -1]
        accuracy = accuracy_score(true_labels, cluster_labels)
        recall = recall_score(true_labels, cluster_labels, average='macro')
        f1 = f1_score(true_labels, cluster_labels, average='macro')
    else:
        accuracy, recall, f1 = None, None, None

    # Save model as pickle file
    with open(model_filename, 'wb') as f:
        pickle.dump(model, f)

    # Return results
    return {
        "silhouette_score": silhouette_avg,
        # "accuracy": accuracy,
        "recall": recall,
        "f1_score": f1,
        # "clusters": cluster_labels.tolist(),
        "model_file": model_filename
    }

if __name__ == "__main__":
    file_path = "D:/ML_Studio/Preprocessed_Files/processed_data_20250301_233618.csv"  # Replace with actual processed file path
    df = pd.read_csv(file_path)

    results_kmeans = train_kmeans(file_path)
    print("K-Means Clustering Results:", results_kmeans)
