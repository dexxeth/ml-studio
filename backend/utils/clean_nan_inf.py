import math


def clean_nan_inf(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: clean_nan_inf(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan_inf(v) for v in obj]
    return obj
