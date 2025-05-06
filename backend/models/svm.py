
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from utils.save_model import save_model

def train_svm(X, y, test_size=0.2, cross_validation=False, kernel='rbf'):
    model = SVC(kernel=kernel, probability=True)

    if cross_validation:
        y_pred = cross_val_predict(model, X, y, cv=5)
        model.fit(X, y)
        y_true = y
    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_true = y_test

    metrics = {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred, average='macro', zero_division=0),
        "recall": recall_score(y_true, y_pred, average='macro', zero_division=0),
        "f1_score": f1_score(y_true, y_pred, average='macro', zero_division=0),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "feature_importance": None
    }

    file_id, filename = save_model(model, "svm", metrics)
    return {**metrics, "file_id": file_id, "filename": filename}
