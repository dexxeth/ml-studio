import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import (
    mean_squared_error, r2_score, mean_absolute_error,
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)
from utils.save_model import save_model

def train_linear_regression(X, y, cross_validation=False):
    model = LinearRegression()

    if cross_validation:
        y_pred = cross_val_predict(model, X, y, cv=5)
        model.fit(X, y)
        y_true = y
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_true = y_test

    is_binary_classification = np.array_equal(np.unique(y), [0, 1])
    metrics = {
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "r2": float(r2_score(y_true, y_pred)),
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "accuracy": None,
        "precision": None,
        "recall": None,
        "f1_score": None,
        "confusion_matrix": None,
        "feature_importance": None
    }

    if is_binary_classification:
        y_pred_rounded = np.round(y_pred).astype(int)
        y_true_int = y_true.astype(int)

        metrics.update({
            "accuracy": accuracy_score(y_true_int, y_pred_rounded),
            "precision": precision_score(y_true_int, y_pred_rounded, average='macro', zero_division=0),
            "recall": recall_score(y_true_int, y_pred_rounded, average='macro', zero_division=0),
            "f1_score": f1_score(y_true_int, y_pred_rounded, average='macro', zero_division=0),
            "confusion_matrix": confusion_matrix(y_true_int, y_pred_rounded).tolist()
        })

    file_id, filename = save_model(model, "linear_regression", metrics)
    return {**metrics, "file_id": file_id, "filename": filename}
