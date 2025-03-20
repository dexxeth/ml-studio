import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error, accuracy_score
import os
from Pipeline import *


def train_linear_regression(file_path, target_column):
    # Load dataset
    df = pd.read_csv(file_path)

    # Split features and target
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Compute metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    # Accuracy calculation (only for classification, workaround for regression)
    y_pred_rounded = np.round(y_pred)
    accuracy = accuracy_score(y_test, y_pred_rounded) if set(y_test.unique()) <= {0, 1} else None

    # Save model as pickle file
    model_filename = f"linear_regression_model.pkl"
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


# Example usage (update with actual file path and target column)
if __name__ == "__main__":
    file_path = "D:/ML_Studio/Preprocessed_Files\processed_data_20250302_025723.csv"  # Replace with actual processed file path
    df = pd.read_csv(file_path)
    target_column = detect_target_column(df)  # Replace with actual target column
    results = train_linear_regression(file_path, target_column)
    print(results)