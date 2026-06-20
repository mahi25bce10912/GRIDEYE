# GRIDEYE
GRIDEYE is an AI-powered traffic intelligence platform that predicts event-driven congestion, estimates traffic impact, and recommends optimal resource deployment, barricading, and diversion strategies using machine learning and geospatial analytics.

# 🚦 Our team (VisionGrid) presenting
### AI-Powered Event Congestion Forecasting & Traffic Response System

![Hackathon](https://img.shields.io/badge/Hackathon-Gridlock%20Hackathon%202.0-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Flask](https://img.shields.io/badge/Flask-Backend-black)
![CatBoost](https://img.shields.io/badge/CatBoost-Machine%20Learning-orange)

---

## 📌 Overview

Grideye is an AI-powered traffic intelligence and decision-support platform designed to tackle event-driven traffic congestion in urban road networks.

The system analyzes traffic incidents using Machine Learning, Geospatial Analytics, and Predictive Intelligence to forecast congestion severity, estimate traffic impact, recommend optimal resource deployment, and support proactive traffic management.

Developed for **Gridlock Hackathon 2.0**, VisionGrid transforms historical incident data into actionable insights for traffic authorities, enabling smarter and faster operational decisions.

---

## 🚨 Problem Statement

### Event-Driven Congestion (Planned & Unplanned)

Urban traffic networks frequently experience disruptions caused by:

- Political rallies
- Festivals
- Sporting events
- Public gatherings
- Vehicle breakdowns
- Road construction activities
- Traffic accidents

These incidents often result in:

- Severe traffic congestion
- Delayed emergency response
- Inefficient manpower allocation
- Poor diversion planning
- Increased commuter delays

Current traffic management approaches are largely reactive and rely heavily on manual monitoring and experience-based decision making.

---

## 💡 Our Solution

VisionGrid introduces an intelligent traffic management framework capable of:

✅ Predicting incident severity

✅ Estimating congestion impact

✅ Forecasting traffic delays

✅ Calculating affected areas

✅ Recommending police deployment

✅ Suggesting barricade allocation

✅ Generating diversion strategies

✅ Visualizing traffic intelligence through an interactive dashboard

---

# 🏗 System Architecture

```text
Traffic Incident Data
         │
         ▼
Feature Engineering
         │
         ▼
 CatBoost ML Model
         │
         ▼
 Priority Prediction
         │
         ▼
 Impact Analysis Engine
         │
 ┌───────┼────────┬─────────┐
 ▼       ▼        ▼         ▼
Risk   Delay   Resources  Diversion
Score Forecast Allocation Planning
         │
         ▼
 Flask Backend API
         │
         ▼
 React Dashboard
         │
         ▼
 Operational Decision Support
```

# 🧠 Machine Learning Pipeline

### Model

- CatBoost Classifier

### Dataset

Astram Event Dataset provided as part of Gridlock Hackathon 2.0.

### Feature Engineering

The model utilizes:

- Event Type
- Event Cause
- Corridor
- Zone
- GPS Coordinates
- Distance Analysis
- Peak Hour Indicators
- Day of Week
- Historical Event Duration
- Geospatial Metrics

### Prediction Output

The model predicts:

- Low Priority Incident
- High Priority Incident

and feeds the output into the operational decision engine.

---

# ⚡ Core Features

## 🚨 Incident Severity Prediction

Predicts traffic incident priority using machine learning.

Outputs:

- Low Priority
- High Priority

---

## 📈 Impact Score Engine

Generates:

- Traffic Impact Score
- Risk Level
- Confidence Score

to quantify congestion severity.

---

## ⏱ Delay Forecasting

Estimates:

- Expected Traffic Delay
- Congestion Duration

allowing proactive traffic planning.

---

## 👮 Resource Allocation Engine

Automatically recommends:

- Police Personnel Required
- Barricades Required

based on predicted traffic impact.

---

## 🛣 Road Closure Intelligence System

Analyzes the impact of road closures on traffic flow and congestion severity.

Provides:

- Road Closure Risk Assessment
- Congestion Impact Estimation
- Alternative Route Recommendations
- Traffic Diversion Planning
- Affected Area Identification

This module helps traffic authorities proactively manage disruptions caused by planned and unplanned road closures, minimizing congestion and improving traffic movement.

---

## 🌍 Geospatial Intelligence

Uses:

- Latitude & Longitude
- Corridor Mapping
- Zone Analytics
- Haversine Distance Calculations

to analyze traffic impact spatially.

---

## 📊 Deployment Intelligence Hub

Provides:

- Live Incident Monitoring
- Event Logs
- Corridor Intelligence
- Resource Deployment Insights
- Traffic Density Analysis

through an integrated command dashboard.

---

# 🖥 Dashboard Modules

## 🚦 Cognitive Traffic Engine

The primary prediction interface enables operators to:

- Select event location
- Choose corridor
- Select traffic zone
- Configure event type
- Analyze congestion risk

### Generated Insights

- Priority Level
- Risk Level
- Impact Score
- Expected Delay
- Affected Radius
- Resource Requirements
- Diversion Recommendations

---

## 📡 Deployment Hub

A centralized monitoring interface providing:

- Live Event Logs
- Incident Density Matrix
- Corridor-wise Monitoring
- Resource Tracking
- Deployment Analytics

for operational traffic management.

---

# 📊 Decision Support Outputs

VisionGrid generates the following actionable metrics:

| Metric | Description |
|----------|-------------|
| Priority | Predicted Incident Severity |
| Risk Level | Low / Medium / High / Critical |
| Confidence Score | Prediction Confidence |
| Impact Score | Traffic Impact Index (0–100) |
| Expected Delay | Estimated Traffic Delay |
| Affected Radius | Congestion Spread Area |
| Police Required | Recommended Personnel |
| Barricades Required | Recommended Barriers |
| Diversion Status | Traffic Routing Recommendation |

---

# 🛠 Technology Stack

## Frontend

- React.js
- JavaScript
- CSS
- Leaflet Maps

## Backend

- Flask
- Python

## Machine Learning

- CatBoost
- Scikit-Learn
- Pandas
- NumPy

## Geospatial Analytics

- Haversine Distance Calculation
- Corridor Intelligence Mapping

---

## Cognitive Traffic Engine

- Interactive Traffic Map
- Corridor Selection
- Event Configuration
- Predictive Analytics Dashboard

## Deployment Hub

- Live Event Monitoring
- Incident Density Matrix
- Resource Deployment Dashboard
- Corridor Analytics

> Add screenshots inside the `/screenshots` folder and update image paths here.

---

# 🎯 Innovation Highlights

### Predictive Traffic Intelligence

Unlike conventional traffic systems that react after congestion occurs, VisionGrid predicts congestion severity before traffic conditions deteriorate.

### Intelligent Resource Planning

Automatically recommends manpower and barricade allocation, reducing response time and improving operational efficiency.

### Geospatial Decision Support

Integrates spatial intelligence with machine learning to identify high-impact incidents and affected regions.

### Operational Readiness

Provides actionable recommendations instead of simply generating predictions.

---

# 🌍 Real-World Applications

VisionGrid can be deployed by:

- Traffic Police Departments
- Smart City Command Centers
- Municipal Authorities
- Event Management Agencies
- Highway Operations Teams
- Emergency Response Units

---

# 📈 Future Scope

- Real-Time Traffic API Integration
- CCTV-Based Event Detection
- Smart City Integration
- Emergency Vehicle Routing
- Dynamic Traffic Signal Optimization
- Multi-City Deployment Framework
- Real-Time Crowd Density Forecasting

---

# 👥 Team

### Team Name
**VisionGrid**

### Hackathon
**Gridlock Hackathon 2.0**

### Team Size
**3 Members**

### Team Leader 
**Mahi Gupta**
### Team member 1
**Ayushi Kushwaha**
### Team Member 2
**Siddharth Singh**

---

# 🏆 Built for Gridlock Hackathon 2.0

### EyeGrid — Turning Traffic Data into Intelligent Decisions.

An AI-powered platform for forecasting congestion, optimizing resource deployment, and enabling proactive traffic management.

