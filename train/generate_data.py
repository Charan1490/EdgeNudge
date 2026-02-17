"""
EdgeNudge - Synthetic Occupancy Data Generator
Generates realistic room occupancy patterns for campus spaces (dorms, study rooms, labs)

Features generated:
- hour: 0-23 (time of day)
- day_of_week: 0-6 (Monday=0, Sunday=6)
- ambient_light: 0-1000 lux
- pir_motion: 0/1 (PIR sensor detected motion)
- phone_presence: 0/1 (Bluetooth/WiFi beacon detected)
- temperature: 18-30°C

Target:
- occupied: 0/1 (room is occupied)

Patterns modeled:
- Morning surge (8-10 AM): High occupancy on weekdays
- Afternoon classes (2-4 PM): Moderate occupancy
- Evening study (7-11 PM): High occupancy
- Night (12-6 AM): Very low occupancy
- Weekends: Different patterns (late wake, less structured)
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Seed for reproducibility
np.random.seed(42)

def generate_occupancy_data(num_days=30, samples_per_hour=4):
    """
    Generate synthetic occupancy data for a campus room
    
    Args:
        num_days: Number of days to simulate (default 30 for 1 month)
        samples_per_hour: Sensor readings per hour (default 4 = every 15 min)
    
    Returns:
        pandas.DataFrame with features and occupancy label
    """
    
    total_samples = num_days * 24 * samples_per_hour
    data = []
    
    # Start date
    start_date = datetime(2024, 1, 1, 0, 0)
    
    for i in range(total_samples):
        # Calculate current timestamp
        current_time = start_date + timedelta(minutes=i * (60 // samples_per_hour))
        hour = current_time.hour
        day_of_week = current_time.weekday()  # 0=Monday, 6=Sunday
        minute = current_time.minute
        
        # Base occupancy probability based on time patterns
        occupancy_prob = get_occupancy_probability(hour, day_of_week)
        
        # Determine if room is occupied (binary)
        occupied = 1 if np.random.random() < occupancy_prob else 0
        
        # Generate sensor readings based on occupancy
        ambient_light = generate_light_level(hour, occupied)
        pir_motion = generate_pir(occupied)
        phone_presence = generate_phone_presence(occupied)
        temperature = generate_temperature(hour, occupied)
        
        # Add some sensor noise/errors (realistic imperfection)
        if np.random.random() < 0.05:  # 5% sensor error rate
            pir_motion = 1 - pir_motion  # False positive/negative
        
        data.append({
            'timestamp': current_time.strftime('%Y-%m-%d %H:%M:%S'),
            'hour': hour,
            'day_of_week': day_of_week,
            'ambient_light': ambient_light,
            'pir_motion': pir_motion,
            'phone_presence': phone_presence,
            'temperature': temperature,
            'occupied': occupied
        })
    
    df = pd.DataFrame(data)
    
    # Print summary statistics
    print("=" * 60)
    print("EdgeNudge - Synthetic Data Generation Complete")
    print("=" * 60)
    print(f"Total samples generated: {len(df)}")
    print(f"Date range: {df['timestamp'].iloc[0]} to {df['timestamp'].iloc[-1]}")
    print(f"Occupancy rate: {df['occupied'].mean():.2%}")
    print(f"\nOccupancy by day of week:")
    print(df.groupby('day_of_week')['occupied'].mean().round(3))
    print(f"\nSample data (first 5 rows):")
    print(df.head())
    print("=" * 60)
    
    return df


def get_occupancy_probability(hour, day_of_week):
    """
    Return probability of room being occupied based on hour and day
    Models typical campus room usage patterns
    """
    is_weekend = (day_of_week >= 5)  # Saturday=5, Sunday=6
    
    # Weekday pattern (classes + study)
    if not is_weekend:
        if 0 <= hour < 6:
            return 0.05  # Late night, very few people
        elif 6 <= hour < 8:
            return 0.15  # Early morning, some early risers
        elif 8 <= hour < 10:
            return 0.75  # Morning classes, high occupancy
        elif 10 <= hour < 12:
            return 0.60  # Late morning
        elif 12 <= hour < 14:
            return 0.50  # Lunch time, moderate
        elif 14 <= hour < 16:
            return 0.70  # Afternoon classes
        elif 16 <= hour < 18:
            return 0.40  # Late afternoon, lower
        elif 18 <= hour < 23:
            return 0.80  # Evening study sessions, high
        else:
            return 0.30  # Late evening, winding down
    
    # Weekend pattern (more relaxed, less structured)
    else:
        if 0 <= hour < 8:
            return 0.02  # Late night/early morning, very empty
        elif 8 <= hour < 11:
            return 0.20  # Late wake-up
        elif 11 <= hour < 14:
            return 0.40  # Brunch/midday
        elif 14 <= hour < 18:
            return 0.50  # Afternoon hangout
        elif 18 <= hour < 24:
            return 0.65  # Evening social/study
        else:
            return 0.10


def generate_light_level(hour, occupied):
    """
    Generate ambient light sensor reading (0-1000 lux)
    Higher when lights are on (occupied) or daytime
    """
    # Natural light during day (even if unoccupied)
    if 6 <= hour < 18:
        natural_light = 200 + np.random.randint(-50, 150)
    else:
        natural_light = 10 + np.random.randint(-5, 20)
    
    # Artificial light when occupied
    if occupied:
        artificial_light = 400 + np.random.randint(-100, 200)
    else:
        artificial_light = 0
    
    total_light = natural_light + artificial_light
    return max(0, min(1000, total_light))  # Clamp to sensor range


def generate_pir(occupied):
    """
    Generate PIR motion sensor reading (0/1)
    1 = motion detected, 0 = no motion
    Higher probability when occupied
    """
    if occupied:
        # 90% chance of detecting motion when occupied
        return 1 if np.random.random() < 0.90 else 0
    else:
        # 5% false positive when empty (sensor noise, curtains moving, etc.)
        return 1 if np.random.random() < 0.05 else 0


def generate_phone_presence(occupied):
    """
    Generate phone presence signal (0/1)
    Simulates Bluetooth/WiFi beacon detection
    """
    if occupied:
        # 85% of occupants have detectable phones
        return 1 if np.random.random() < 0.85 else 0
    else:
        # 2% false positive (phone left behind, nearby signal bleed)
        return 1 if np.random.random() < 0.02 else 0


def generate_temperature(hour, occupied):
    """
    Generate temperature reading (18-30°C)
    Slightly higher when occupied (body heat)
    """
    # Base temperature varies by time of day
    if 6 <= hour < 12:
        base_temp = 21.0
    elif 12 <= hour < 18:
        base_temp = 23.0
    elif 18 <= hour < 24:
        base_temp = 22.0
    else:
        base_temp = 20.0
    
    # Occupancy adds 1-2°C
    if occupied:
        base_temp += np.random.uniform(1.0, 2.5)
    
    # Add random noise
    temp = base_temp + np.random.uniform(-0.5, 0.5)
    return round(temp, 1)


if __name__ == "__main__":
    # Generate 30 days of data with 4 samples per hour (every 15 minutes)
    df = generate_occupancy_data(num_days=30, samples_per_hour=4)
    
    # Save to CSV
    output_file = "occupancy_data.csv"
    df.to_csv(output_file, index=False)
    print(f"\n✅ Data saved to: {output_file}")
    print(f"📊 File size: {len(df)} rows × {len(df.columns)} columns")
