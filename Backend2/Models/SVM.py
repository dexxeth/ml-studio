import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import os
from Pipeline import detect_target_column


def calculate_accuracy(y_true, y_pred, threshold=0.05):
    return np.mean(np.abs(y_true - y_pred) / y_true < threshold) * 100

def train_svm(file_path, target_column, kernel='rbf'):
    # Load dataset
    df = pd.read_csv(file_path)

    # Split features and target
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = SVR(kernel=kernel)
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Compute metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    accuracy = calculate_accuracy(y_test, y_pred)

    # Ensure the directory exists
    model_dir = "D:/ML_Studio/Pickle"
    os.makedirs(model_dir, exist_ok=True)
    model_filename = os.path.join(model_dir, "svm_model.pkl")

    # Save model as pickle file
    with open(model_filename, 'wb') as f:
        pickle.dump(model, f)

    # Return results
    return {
        "rmse": rmse,
        "r2": r2,
        "mae": mae,
        "accuracy": accuracy,
        "model_file": model_filename
    }


# Example usage
if __name__ == "__main__":
    file_path = "D:/ML_Studio/Preprocessed_Files/processed_data_20250301_233055.csv"  # Replace with actual processed file path
    df = pd.read_csv(file_path)
    target_column = detect_target_column(df)  # Detect target column automatically


    results_svm = train_svm(file_path, target_column)
    print("SVM Results:", results_svm)
