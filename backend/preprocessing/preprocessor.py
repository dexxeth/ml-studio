import pandas as pd
import os
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, RobustScaler
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectKBest, mutual_info_classif, mutual_info_regression
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from database.mongo import db

# Load dataset
def load_data(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == '.csv':
        df = pd.read_csv(file_path)
    elif ext in ['.xls', '.xlsx']:
        df = pd.read_excel(file_path)
    else:
        raise ValueError(
            "Unsupported file format. Please upload a CSV or XLSX file.")
    return df

# Detect Target Column
def detect_target_column(df):
    numeric_cols = df.select_dtypes(include=['number']).columns
    numeric_cols = [col for col in numeric_cols if 'id' not in col.lower()]

    for col in numeric_cols:
        if df[col].nunique() == 2:
            return col  # Binary classification

    return df[numeric_cols].var().idxmax() if numeric_cols else df.columns[-1]

# Preprocessing Pipeline
def build_preprocessing_pipeline(df, target_column, top_n_categories=5, k=10, use_pca=True, pca_components=5):
    # Identify column types
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(
        include=['object', 'category']).columns.tolist()

    if target_column in numeric_cols:
        numeric_cols.remove(target_column)
    if target_column in categorical_cols:
        categorical_cols.remove(target_column)
        
    # Handle categorical columns with high cardinality
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="mean")),
        ("scaler", RobustScaler()),
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
    if y.nunique() > 10:    # Regression task
        selector = SelectKBest(
            score_func=mutual_info_regression, k=min(k, X.shape[1]))
    else:   # Classification task
        selector = SelectKBest(
            score_func=mutual_info_classif, k=min(k, X.shape[1]))

    X_selected = selector.fit_transform(X, y)
    selected_features = X.columns[selector.get_support()]

    print(f"Selected Features: {list(selected_features)}")
    print(f"Number of Selected Features: {len(selected_features)}")
    print(f"Target: {y.name}")

    X = pd.DataFrame(X_selected, columns=selected_features)


    if use_pca:
        pca = PCA(n_components=min(pca_components, X.shape[1]))
        X = pd.DataFrame(pca.fit_transform(X), columns=[
                         f'pca_{i+1}' for i in range(min(pca_components, X.shape[1]))])

    return X


def preprocess_data(df, target_column, top_n_categories=5, k=10, use_pca=True, pca_components=5):
    preprocessor, numeric_cols, categorical_cols = build_preprocessing_pipeline(
        df, target_column, top_n_categories, k, use_pca, pca_components
    )

    X = df.drop(columns=[target_column])
    y = df[target_column]

    X_transformed = preprocessor.fit_transform(X)
    
    # Convert back to DataFrame
    X_transformed = pd.DataFrame(X_transformed)
    
    # Apply Feature Selection
    X_transformed = select_features(
        X_transformed, y, k=k, use_pca=use_pca, pca_components=pca_components)

    return X_transformed, y

# Split Data
def split_data(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test

# Save Processed Data
def save_processed_data(X, y):
    df = pd.concat([X, y.reset_index(drop=True)], axis=1)
    timestamp = datetime.now().strftime('%d%m%Y_%H%M%S')
    collection_name = f"processed_{timestamp}"
    db[collection_name].insert_many(df.to_dict(orient="records"))
    print(f"Processed data saved in MongoDB collection: '{collection_name}'")
    return collection_name


def preprocess_dataset_from_mongo(df: pd.DataFrame, manual_features: list = None, manual_target_column: str = None):
    # Keep only selected features if in manual mode
    if manual_features:
        df = df[manual_features + [manual_target_column]]

    target_col = manual_target_column or detect_target_column(df)

    X, y = preprocess_data(df, target_col)
    save_name = save_processed_data(X, y)

    return save_name


def preprocess(file_path: str, manual_target_column: str = None):
    df = load_data(file_path)

    target_col = manual_target_column or detect_target_column(df)

    X, y = preprocess_data(df, target_col, top_n_categories=5,
                           k=10, use_pca=True, pca_components=5)
    X_train, X_test, y_train, y_test = split_data(X, y)

    collection_name = save_processed_data(X, y)

    return X_train, X_test, y_train, y_test, target_col, collection_name
