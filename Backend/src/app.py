from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

model = joblib.load('symptom_svm_model.pkl')
df1 = pd.read_csv('Symptom-severity.csv')



@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    symptoms = data.get("symptoms", [])

    # Convert symptom names to severity/weight using your severity mapping
    df1 = pd.read_csv('Symptom-severity.csv')
    a = np.array(df1["Symptom"])
    b = np.array(df1["weight"])
    psymptoms = []
    for s in symptoms:
        weight = 0
        for i in range(len(a)):
            if s == a[i]:
                weight = b[i]
                break
        psymptoms.append(weight)

    # PAD TO LENGTH 17!
    nulls = [0] * (17 - len(psymptoms))  # <--- change 12 to 17 here
    psy = [psymptoms + nulls]

    pred2 = model.predict(psy)            # pred2 is a numpy array
    return jsonify({"predicted_disease": str(pred2)})  # Convert to string

if __name__ == '__main__':
    app.run(port=5000, debug=True)
