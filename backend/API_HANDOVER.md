# API Handover Document

## Overview
This document outlines the current state of the backend APIs and provides specific instructions for the developer responsible for the **Matching Model** and **Personality Test Model**.

## 1. Personality Test APIs (Missing)
Currently, the database models and Pydantic schemas for personality tests exist, but the **API endpoints are not implemented**.

### Existing Resources
- **Schemas**: `backend/app/schemas/personality.py`
    - `PatientPersonalityCreate`, `CaregiverPersonalityCreate`
    - Fields: `empathy_score`, `activity_score`, `patience_score`, `independence_score` (0-100 float)
- **Models**: `backend/app/models/care_details.py`
    - `PatientPersonality` (table: `patient_personality`)
    - `CaregiverPersonality` (table: `caregiver_personality`)

### Required Implementation
You need to implement the following endpoints (suggested location: `backend/app/routes/personality.py` or extend `patients.py`/`caregivers.py`):

#### 1.1 Patient Personality
- **POST** `/api/patients/{patient_id}/personality`
    - **Purpose**: Save analysis results from the Personality Model.
    - **Request Body**: `PatientPersonalityCreate`
    - **Response**: `PatientPersonalityResponse`

#### 1.2 Caregiver Personality
- **POST** `/api/caregivers/{caregiver_id}/personality`
    - **Purpose**: Save analysis results from the Personality Model.
    - **Request Body**: `CaregiverPersonalityCreate`
    - **Response**: `CaregiverPersonalityResponse`

---

## 2. Matching Model Integration (Logic Missing)
The CRUD endpoints for Matching Requests and Results exist, but the **core matching logic is missing**.

### Existing Resources
- **Routes**: `backend/app/routes/matching.py`
- **Schemas**: `backend/app/schemas/matching.py`
- **Models**: `backend/app/models/matching.py`

### Current Flow (Implemented)
1. Frontend creates a request: `POST /api/matching/requests` -> Saves to `matching_requests` table.
2. Frontend polls for results: `GET /api/patients/{patient_id}/matching-results`.

### Required Implementation
You need to implement the **Matching Engine** that bridges the Request and Result.

1. **Trigger**: When a `MatchingRequest` is created (or via a background job).
2. **Logic**:
    - Fetch `PatientPersonality` and `CaregiverPersonality` data.
    - Apply your matching algorithm.
    - Calculate `total_score` and specific scores (e.g., `personality_match_score`).
3. **Output**: Create records in the `matching_results` table using `MatchingResultCreate` schema.

---

## 3. Database Schema Reference
Ensure your models write to these existing tables to maintain compatibility with the rest of the system.

| Domain | Table Name | Model File |
|--------|------------|------------|
| **Patient Personality** | `patient_personality` | `app/models/care_details.py` |
| **Caregiver Personality** | `caregiver_personality` | `app/models/care_details.py` |
| **Matching Request** | `matching_requests` | `app/models/matching.py` |
| **Matching Result** | `matching_results` | `app/models/matching.py` |

## 4. Environment Setup
- The backend uses **FastAPI** and **SQLAlchemy**.
- Database: **PostgreSQL** (Azure).
- Run locally: `uvicorn app.main:app --reload`
