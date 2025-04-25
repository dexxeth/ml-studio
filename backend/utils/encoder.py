import pandas as pd

def encode_categorical(df: pd.DataFrame):
    cat_cols = df.select_dtypes(include=['object']).columns
    df_encoded = pd.get_dummies(df, columns=cat_cols)
    return df_encoded