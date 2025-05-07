from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from utils.save_model import save_model

def train_kmeans(X, n_clusters=3):
    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    cluster_labels = model.fit_predict(X)

    silhouette_avg = silhouette_score(X, cluster_labels)

    metrics = {
        "silhouette_score": silhouette_avg,
        "accuracy": None,
        "precision": None,
        "recall": None,
        "f1_score": None,
        "confusion_matrix": None,
        "feature_importance": None
    }

    file_id, filename = save_model(model, "k_means", metrics)
    return {**metrics, "file_id": file_id, "filename": filename}
