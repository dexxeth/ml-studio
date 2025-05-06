from models.linear_regression import train_linear_regression
from models.random_forest import train_random_forest
from models.svm import train_svm
from models.k_means import train_kmeans
from preprocessing.preprocessor import detect_target_column
from database.mongo import db
import pandas as pd

def select_best_model(collection_name: str, test_size: float = 0.2, cross_validation: bool = False):
    # Load data once
    df = pd.DataFrame(list(db[collection_name].find({}, {"_id": 0})))
    target_column = detect_target_column(df)

    X = df.drop(columns=[target_column])
    y = df[target_column]

    results = {
        "Linear Regression": train_linear_regression(X, y, test_size, cross_validation)[1],
        "Random Forest": train_random_forest(X, y, test_size, cross_validation)[1],
        "SVM": train_svm(X, y, test_size, cross_validation)[1],
    }

    # KMeans is only relevant if target has many classes (like clustering)
    if y.nunique() > 10:
        model, metrics = train_kmeans(X)
        results["KMeans"] = metrics

    # Use accuracy if present; fallback to negative RMSE for regression
    def get_metric(metrics_dict):
        return metrics_dict.get("accuracy", 0) or -metrics_dict.get("rmse", float("inf"))

    best_model_name, best_metrics = max(results.items(), key=lambda x: get_metric(x[1]))

    return {
        "best_model": best_model_name,
        "file_id": best_metrics["file_id"],
        "filename": best_metrics["filename"],
        "metrics": best_metrics
    }
