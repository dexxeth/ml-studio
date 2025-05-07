import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from preprocessing.preprocessor import detect_target_column
from database.mongo import db
from utils.save_model import save_model


def calculate_accuracy(y_true, y_pred, threshold=0.05):
    return np.mean(np.abs(y_true - y_pred) / y_true < threshold) * 100


def train_random_forest(collection_name: str, target_column: str = None, n_estimators: int = 100):
    # Validate input
    if not isinstance(collection_name, str) or not collection_name.strip():
        raise ValueError("Invalid collection_name. Must be a non-empty string.")

    # Load dataset from MongoDB
    df = pd.DataFrame(list(db[collection_name].find({}, {'_id': 0})))
    if df.empty:
        raise ValueError(f"No data found in collection '{collection_name}'.")

    # Detect target column if not provided
    if target_column is None:
        target_column = detect_target_column(df)
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in collection '{collection_name}'.")

    # Split features and target
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = RandomForestRegressor(n_estimators=n_estimators, random_state=42)
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Compute metrics
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))
    mae = float(mean_absolute_error(y_test, y_pred))
    accuracy = float(calculate_accuracy(y_test, y_pred))
    confusion_matrix = float(np.mean(y_test == y_pred))
    

    # Save model using GridFS
    metrics = {
        "rmse": rmse,
        "r2": r2,
        "mae": mae,
        "accuracy": accuracy,
        "feature_importance": model.feature_importances_.tolist(),
        "confusion_matrix": confusion_matrix.tolist() if hasattr(confusion_matrix, 'tolist') else confusion_matrix
    }

    file_id, filename = save_model(model, "random_forest", metrics)

    # Return results
    return {
        **metrics,
        "file_id": file_id,
        "filename": filename
    }
