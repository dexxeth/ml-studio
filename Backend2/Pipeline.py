import pandas as pd
import numpy as np
import os
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures, RobustScaler
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectKBest, mutual_info_classif, mutual_info_regression
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer


# Load dataset
def load_data(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == '.csv':
        df = pd.read_csv(file_path)
    elif ext in ['.xls', '.xlsx']:
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload a CSV or XLSX fileh.")
    return df


# Detect Target Column
def detect_target_column(df):
    numeric_cols = df.select_dtypes(include=['number']).columns
    numeric_cols = [col for col in numeric_cols if 'id' not in col.lower()]

    for col in numeric_cols:
        if df[col].nunique() == 2:
            return col  # Binary classification

    return df[numeric_cols].var().idxmax()  # Column with highest variance


# Preprocessing Pipeline
def build_preprocessing_pipeline(df, target_column, top_n_categories=5, k=10, use_pca=True, pca_components=5):
    # Identify column types
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

    if target_column in numeric_cols:
        numeric_cols.remove(target_column)

    # Pipelines for transformation
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="mean")),
        ("scaler", RobustScaler()),  # Handles outliers better than StandardScaler
    ])

    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    # Column Transformer
    preprocessor = ColumnTransformer([
        ("num", num_pipeline, numeric_cols),
        ("cat", cat_pipeline, categorical_cols),
    ], remainder="drop")

    return preprocessor, numeric_cols, categorical_cols


# Feature Selection
def select_features(X, y, k=10, use_pca=True, pca_components=5):
    """Selects top K features and applies PCA if enabled."""
    if y.nunique() > 10:  # Regression task
        selector = SelectKBest(score_func=mutual_info_regression, k=min(k, X.shape[1]))
    else:  # Classification task
        selector = SelectKBest(score_func=mutual_info_classif, k=min(k, X.shape[1]))

    X_selected = selector.fit_transform(X, y)
    selected_features = X.columns[selector.get_support()]

    print(f"Selected Features: {list(selected_features)}")

    X = pd.DataFrame(X_selected, columns=selected_features)

    if use_pca:
        pca = PCA(n_components=min(pca_components, X.shape[1]))
        X = pd.DataFrame(pca.fit_transform(X))

    return X


# Preprocess Data
def preprocess_data(df, target_column, top_n_categories=5, k=10, use_pca=True, pca_components=5):
    preprocessor, numeric_cols, categorical_cols = build_preprocessing_pipeline(df, target_column, top_n_categories, k,
                                                                                use_pca, pca_components)

    X = df.drop(columns=[target_column])
    y = df[target_column]

    X_transformed = preprocessor.fit_transform(X)

    # Convert back to DataFrame
    X_transformed = pd.DataFrame(X_transformed)

    # Apply Feature Selection
    X_transformed = select_features(X_transformed, y, k=k, use_pca=use_pca, pca_components=pca_components)

    return X_transformed, y


# Split Data
def split_data(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test


# Save Processed Data
def save_processed_data(X, y):
    df = pd.concat([X, y.reset_index(drop=True)], axis=1)
    directory = "D:/ML_Studio/Preprocessed_Files"
    os.makedirs(directory, exist_ok=True)
    filename = os.path.join(directory, f"processed_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
    df.to_csv(filename, index=False)
    print(f"Processed data saved as {filename}")


# Main Execution
if __name__ == "__main__":
    file_path = "D:/Data Science IIT BHU/loan_data.csv"
    df = load_data(file_path)

    print("How do you want to select the target column? \n1. Automatically \n2. Manually")
    inp = int(input("Press 1 or 2: "))

    target_col = detect_target_column(df)
    print(f"AI suggests using '{target_col}' as the target column.")

    if inp == 2:
        target_col = input("Enter Target Column: ")

    x, y = preprocess_data(df, target_col, top_n_categories=5, k=10, use_pca=True, pca_components=5)
    X_train, X_test, y_train, y_test = split_data(x, y)

    save_processed_data(x, y)

    print("✅ Data preprocessing completed successfully.")
