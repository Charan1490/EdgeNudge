"""
EdgeNudge - Model Training Script
Trains a lightweight DecisionTreeClassifier for occupancy prediction

Target: >85% accuracy with <50KB model size
Optimized for: On-device inference (ONNX export)
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, 
    precision_score, 
    recall_score, 
    f1_score,
    confusion_matrix,
    classification_report
)
import joblib
import os

# Seed for reproducibility
np.random.seed(42)

def load_data(csv_path='occupancy_data.csv'):
    """Load and prepare training data"""
    print("=" * 70)
    print("EdgeNudge - Model Training Pipeline")
    print("=" * 70)
    print(f"\n📂 Loading data from: {csv_path}")
    
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded {len(df)} samples")
    
    # Select features (exclude timestamp)
    feature_cols = ['hour', 'day_of_week', 'ambient_light', 'pir_motion', 
                    'phone_presence', 'temperature']
    target_col = 'occupied'
    
    X = df[feature_cols].values.astype('float32')
    y = df[target_col].values.astype('int64')
    
    print(f"\n📊 Dataset Info:")
    print(f"   Features: {feature_cols}")
    print(f"   Shape: {X.shape}")
    print(f"   Target distribution: {np.bincount(y)} (0=empty, 1=occupied)")
    print(f"   Occupancy rate: {y.mean():.2%}")
    
    return X, y, feature_cols


def train_model(X_train, y_train, max_depth=8, min_samples_split=10):
    """
    Train DecisionTreeClassifier optimized for:
    - Small model size (<50KB)
    - Fast inference (<50ms)
    - Easy ONNX export
    """
    print(f"\n🤖 Training DecisionTreeClassifier...")
    print(f"   Hyperparameters:")
    print(f"   - max_depth: {max_depth}")
    print(f"   - min_samples_split: {min_samples_split}")
    print(f"   - criterion: gini")
    
    clf = DecisionTreeClassifier(
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        criterion='gini',
        random_state=42
    )
    
    clf.fit(X_train, y_train)
    
    print(f"✅ Training complete!")
    print(f"   Tree depth: {clf.get_depth()}")
    print(f"   Number of leaves: {clf.get_n_leaves()}")
    print(f"   Number of features: {clf.n_features_in_}")
    
    return clf


def evaluate_model(clf, X_train, y_train, X_test, y_test):
    """Comprehensive model evaluation"""
    print(f"\n📈 Model Evaluation")
    print("=" * 70)
    
    # Training set performance
    y_train_pred = clf.predict(X_train)
    train_acc = accuracy_score(y_train, y_train_pred)
    
    # Test set performance
    y_test_pred = clf.predict(X_test)
    test_acc = accuracy_score(y_test, y_test_pred)
    test_precision = precision_score(y_test, y_test_pred)
    test_recall = recall_score(y_test, y_test_pred)
    test_f1 = f1_score(y_test, y_test_pred)
    
    print(f"\n🎯 Accuracy Scores:")
    print(f"   Training accuracy:   {train_acc:.4f} ({train_acc:.2%})")
    print(f"   Testing accuracy:    {test_acc:.4f} ({test_acc:.2%})")
    
    if test_acc >= 0.85:
        print(f"   ✅ TARGET MET: >85% accuracy achieved!")
    else:
        print(f"   ⚠️  Below target (85%), consider tuning hyperparameters")
    
    print(f"\n📊 Detailed Metrics (Test Set):")
    print(f"   Precision: {test_precision:.4f} (of predicted occupied, % correct)")
    print(f"   Recall:    {test_recall:.4f} (of actual occupied, % detected)")
    print(f"   F1-Score:  {test_f1:.4f} (harmonic mean)")
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_test_pred)
    print(f"\n🔢 Confusion Matrix:")
    print(f"                Predicted")
    print(f"                Empty  Occupied")
    print(f"   Actual Empty    {cm[0][0]:4d}    {cm[0][1]:4d}")
    print(f"   Actual Occ.     {cm[1][0]:4d}    {cm[1][1]:4d}")
    
    # Calculate error types
    true_neg, false_pos, false_neg, true_pos = cm.ravel()
    print(f"\n   True Negatives:  {true_neg:4d} (correctly predicted empty)")
    print(f"   False Positives: {false_pos:4d} (predicted occupied, actually empty)")
    print(f"   False Negatives: {false_neg:4d} (predicted empty, actually occupied)")
    print(f"   True Positives:  {true_pos:4d} (correctly predicted occupied)")
    
    # Classification report
    print(f"\n📋 Classification Report:")
    print(classification_report(y_test, y_test_pred, 
                                target_names=['Empty', 'Occupied'],
                                digits=4))
    
    # Feature importance
    print(f"\n🌟 Feature Importance:")
    feature_names = ['hour', 'day_of_week', 'ambient_light', 
                     'pir_motion', 'phone_presence', 'temperature']
    importances = clf.feature_importances_
    for name, importance in sorted(zip(feature_names, importances), 
                                   key=lambda x: x[1], reverse=True):
        bar = '█' * int(importance * 50)
        print(f"   {name:16s} {importance:.4f} {bar}")
    
    return test_acc


def save_model(clf, filename='model.pkl'):
    """Save trained model"""
    print(f"\n💾 Saving model...")
    joblib.dump(clf, filename)
    
    file_size = os.path.getsize(filename)
    print(f"✅ Model saved to: {filename}")
    print(f"   File size: {file_size:,} bytes ({file_size/1024:.2f} KB)")
    
    if file_size < 50 * 1024:
        print(f"   ✅ Under 50KB target - optimized for edge deployment!")
    
    return file_size


def predict_sample(clf, feature_names):
    """Test model with sample predictions"""
    print(f"\n🧪 Sample Predictions (Demo Scenarios)")
    print("=" * 70)
    
    scenarios = [
        {
            'name': 'Late Night (Empty)',
            'features': [2, 1, 15, 0, 0, 20.0],  # 2 AM, Tuesday, low light, no motion
            'expected': 0
        },
        {
            'name': 'Morning Class (Occupied)',
            'features': [9, 2, 550, 1, 1, 23.0],  # 9 AM, Wednesday, bright, motion
            'expected': 1
        },
        {
            'name': 'Evening Study (Occupied)',
            'features': [20, 3, 600, 1, 1, 23.5],  # 8 PM, Thursday, lights on
            'expected': 1
        },
        {
            'name': 'Weekend Morning (Empty)',
            'features': [8, 5, 200, 0, 0, 20.5],  # 8 AM, Saturday, natural light
            'expected': 0
        }
    ]
    
    for scenario in scenarios:
        features = np.array(scenario['features']).reshape(1, -1)
        prediction = clf.predict(features)[0]
        probability = clf.predict_proba(features)[0]
        
        status = "✅" if prediction == scenario['expected'] else "❌"
        pred_label = "Occupied" if prediction == 1 else "Empty"
        
        print(f"\n{status} {scenario['name']}")
        print(f"   Input: {dict(zip(feature_names, scenario['features']))}")
        print(f"   Predicted: {pred_label} (confidence: {probability[prediction]:.2%})")
        print(f"   Probabilities: [Empty: {probability[0]:.2%}, Occupied: {probability[1]:.2%}]")


def main():
    """Main training pipeline"""
    
    # 1. Load data
    X, y, feature_names = load_data('occupancy_data.csv')
    
    # 2. Split train/test (80/20)
    print(f"\n✂️  Splitting data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"   Training samples: {len(X_train)}")
    print(f"   Testing samples:  {len(X_test)}")
    
    # 3. Train model
    clf = train_model(X_train, y_train, max_depth=8, min_samples_split=10)
    
    # 4. Evaluate
    test_accuracy = evaluate_model(clf, X_train, y_train, X_test, y_test)
    
    # 5. Save model
    model_size = save_model(clf, 'model.pkl')
    
    # 6. Test with sample scenarios
    predict_sample(clf, feature_names)
    
    # Final summary
    print("\n" + "=" * 70)
    print("🎉 STEP 2 COMPLETE - Model Training Successful!")
    print("=" * 70)
    print(f"\n✅ Key Metrics:")
    print(f"   Accuracy:    {test_accuracy:.2%}")
    print(f"   Model size:  {model_size/1024:.2f} KB")
    print(f"   Features:    {len(feature_names)}")
    print(f"   Tree depth:  {clf.get_depth()}")
    print(f"\n📁 Output files:")
    print(f"   - model.pkl (ready for ONNX conversion)")
    print(f"\n🎯 Next Step: Run convert_to_onnx.py to export for browser inference")
    print("=" * 70)


if __name__ == "__main__":
    main()
