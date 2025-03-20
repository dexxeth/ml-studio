import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import mutual_info_classif, mutual_info_regression, SelectKBest
from sklearn.decomposition import PCA
from datetime import datetime
import numpy as np
import os


def load_data(file_path):
    """Loads CSV or XLSX file into a DataFrame."""
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == '.csv':
        df = pd.read_csv(file_path)
    elif ext in ['.xls', '.xlsx']:
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload a CSV or XLSX file.")
    return df


def handle_missing_values(df):
    """Handles missing values: Most frequent for categorical, mean for numerical."""
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    numeric_cols = df.select_dtypes(include=['number']).columns

    if len(categorical_cols) > 0:
        imputer_cat = SimpleImputer(strategy='most_frequent')
        df[categorical_cols] = imputer_cat.fit_transform(df[categorical_cols])

    imputer_num = SimpleImputer(strategy='mean')
    df[numeric_cols] = imputer_num.fit_transform(df[numeric_cols])

    return df


def remove_outliers(df):
    """Removes outliers using the IQR (Interquartile Range) method."""
    numeric_cols = df.select_dtypes(include=['number']).columns

    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]

    return df


def encode_categorical(df, top_n=5):
    """Applies One-Hot Encoding to categorical variables, keeping only the top N most frequent categories."""
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns

    for col in categorical_cols:
        top_categories = df[col].value_counts().index[:top_n]  # Select top N categories
        df[col] = df[col].apply(
            lambda x: x if x in top_categories else "Other")  # Replace less frequent values with 'Other'

    encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    encoded_data = encoder.fit_transform(df[categorical_cols])
    encoded_df = pd.DataFrame(encoded_data, columns=encoder.get_feature_names_out(categorical_cols))

    df = df.drop(columns=categorical_cols).reset_index(drop=True)
    df = pd.concat([df, encoded_df], axis=1)

    return df


def feature_scaling(df):
    """Scales numerical features using StandardScaler."""
    numeric_cols = df.select_dtypes(include=['number']).columns
    scaler = StandardScaler()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    return df


def drop_text_features(df):
    """Drops unnecessary text-based columns that do not contribute to model performance."""
    text_cols = df.select_dtypes(include=['object']).columns
    df = df.drop(columns=text_cols, errors='ignore')
    return df


def feature_selection(df, y, k=10, use_pca=False, pca_components=5):
    """Selects the top K important features using Mutual Information for classification or regression."""

    if y.nunique() > 10:  # Assuming more than 10 unique values means it's a regression task
        selector = SelectKBest(score_func=mutual_info_regression, k=min(k, df.shape[1]))
    else:
        selector = SelectKBest(score_func=mutual_info_classif, k=min(k, df.shape[1]))

    X_selected = selector.fit_transform(df, y)
    selected_features = df.columns[selector.get_support()]

    df = pd.DataFrame(X_selected, columns=selected_features)

    if use_pca:
        pca = PCA(n_components=min(pca_components, df.shape[1]))
        df = pd.DataFrame(pca.fit_transform(df))

    return df


def preprocess_data(df, target_column, top_n_categories=5, select_features=True, k=10, use_pca=False, pca_components=5):
    """Applies all preprocessing steps: missing values, outliers, encoding, scaling, feature selection."""
    df = handle_missing_values(df)
    df = remove_outliers(df)
    df = encode_categorical(df, top_n=top_n_categories)
    df = drop_text_features(df)
    df = feature_scaling(df)

    if select_features:
        y = df[target_column]
        df = df.drop(columns=[target_column])
        df = feature_selection(df, y, k=k, use_pca=use_pca, pca_components=pca_components)
        df[target_column] = y  # Add target column back after feature selection

    return df


def split_data(df, target_column):
    """Splits dataset into training and testing sets."""
    X = df.drop(columns=[target_column])
    y = df[target_column]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test


def detect_target_column(df):
    """Detects the best target column based on binary classification or highest variance."""
    numeric_cols = df.select_dtypes(include=['number']).columns
    numeric_cols = [col for col in numeric_cols if 'id' not in col.lower()]

    for col in numeric_cols:
        if df[col].nunique() == 2:
            return col  # Binary classification column

    return df[numeric_cols].var().idxmax()  # Column with highest variance


def encode_cyclic_features(df):
    """Encodes cyclic features such as months, days of the week."""
    cyclic_cols = ['month', 'day_of_week']  # Customize based on dataset
    for col in cyclic_cols:
        if col in df.columns:
            df[f'{col}_sin'] = np.sin(2 * np.pi * df[col] / df[col].max())
            df[f'{col}_cos'] = np.cos(2 * np.pi * df[col] / df[col].max())
            df.drop(columns=[col], inplace=True)
    return df


def feature_binning(df, num_bins=5):
    """Bins continuous numerical features into categories."""
    numeric_cols = df.select_dtypes(include=['number']).columns
    for col in numeric_cols:
        df[f'{col}_binned'] = pd.qcut(df[col], num_bins, labels=False, duplicates='drop')
    return df


def add_polynomial_features(df, degree=2):
    """Adds polynomial features for regression tasks."""
    numeric_cols = df.select_dtypes(include=['number']).columns
    poly = PolynomialFeatures(degree=degree, include_bias=False)
    poly_features = poly.fit_transform(df[numeric_cols])
    poly_df = pd.DataFrame(poly_features, columns=poly.get_feature_names_out(numeric_cols))
    df = pd.concat([df, poly_df], axis=1)
    return df

def save_processed_data(df):
    """Saves the processed data as a CSV file with a timestamp."""
    directory = "D:/ML_Studio/Preprocessed_Files"
    os.makedirs(directory, exist_ok=True)
    filename = os.path.join(directory, f"processed_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
    df.to_csv(filename, index=False)
    print(f"Processed data saved as {filename}")


# Example usage
if __name__ == "__main__":
    file_path = "D:/Data Science IIT BHU/creditcard.csv"
    df = pd.read_csv(file_path)

    print("How do you want to select the target column? \n1. Automatically \n2. Manually\n")
    inp = int(input("Press 1 or 2: "))

    target_col = detect_target_column(df)
    print(f"AI suggests using '{target_col}' as the target column.")

    if inp == 1:
        print(f"Using '{target_col}' as the target column.")
    elif inp == 2:
        target_col = input("Enter Target Column: ")

    df = preprocess_data(df, target_col, top_n_categories=5, select_features=True, k=10, use_pca=True, pca_components=5)
    X_train, X_test, y_train, y_test = split_data(df, target_col)

    save_processed_data(df)

    print("Data preprocessing completed.")
