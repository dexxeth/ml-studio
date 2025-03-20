import os
import pickle
import pandas as pd
from LinearRegression import train_linear_regression
from RandomForest import train_random_forest
from SVM import train_svm
from K_Means import train_kmeans
from Pipeline import detect_target_column


def select_best_model(file_path):
    df = pd.read_csv(file_path)
    target_column = detect_target_column(df)

    # Train models
    results = {
        "Linear Regression": train_linear_regression(file_path, target_column),
        "Random Forest": train_random_forest(file_path, target_column),
        "SVM": train_svm(file_path, target_column),
    }

    # Check if dataset is suitable for clustering (K-Means)
    if df[target_column].nunique() > 10:  # Ensuring it's not a classification target
        kmeans_results = train_kmeans(file_path)
        results["K-Means"] = kmeans_results

    # Ensure 'accuracy' key exists; if not, use RMSE as a fallback
    def get_metric(model_result):
        return model_result.get("accuracy", 0) or -model_result.get("rmse", float("inf"))

    best_model = max(results.items(), key=lambda x: get_metric(x[1]))
    best_model_name, best_model_info = best_model

    print(f"Best Model: {best_model_name} with accuracy: {best_model_info.get('accuracy', 'N/A')}")

    # Save the best model in the specified directory
    model_dir = "D:/ML_Studio/Pickle"
    os.makedirs(model_dir, exist_ok=True)
    best_model_path = os.path.join(model_dir, "best_model.pkl")
    os.rename(best_model_info["model_file"], best_model_path)

    return best_model_name, best_model_path


# Example usage
if __name__ == "__main__":
    file_path = "D:/Data Science IIT BHU/creditcard.csv"  # Update with actual file path
    best_model, model_path = select_best_model(file_path)
    print(f"Best model saved at: {model_path}")
