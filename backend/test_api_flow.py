import sys
import os
import asyncio
from unittest.mock import MagicMock, patch
from dotenv import load_dotenv

# Load env vars
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.routes.personality import create_personality_test
from app.routes.matching import create_matching
from app.schemas.personality import PersonalityTestRequest
from app.schemas.matching import MatchingRequestCreate, MatchingRequirements
from app.models.user import User, UserGenderEnum, UserTypeEnum
from app.models.profile import Patient, Guardian, Caregiver
from app.models.care_details import PatientPersonality, CaregiverPersonality

async def test_personality_and_matching():
    print("🧪 Testing Personality and Matching APIs...")
    
    # Mock DB Session
    mock_db = MagicMock()
    
    # Mock User (Guardian)
    mock_user = MagicMock(spec=User)
    mock_user.user_id = 1
    mock_user.user_type = UserTypeEnum.guardian
    
    # Mock Guardian & Patient
    mock_guardian = MagicMock(spec=Guardian)
    mock_guardian.guardian_id = 1
    mock_guardian.user_id = 1
    
    mock_patient = MagicMock(spec=Patient)
    mock_patient.patient_id = 100
    mock_patient.guardian_id = 1
    
    # Mock DB Queries
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        mock_guardian, # For personality test (find guardian)
        mock_patient,  # For personality test (find patient)
        mock_patient,  # For matching (verify access)
        MagicMock(spec=PatientPersonality, empathy_score=80, activity_score=70, patience_score=90, independence_score=60), # For matching (get patient personality)
    ]
    
    # 1. Test Personality API
    print("\n[1] Testing Personality API...")
    
    personality_request = PersonalityTestRequest(
        user_type="guardian",
        answers={"q1": "answer1", "q2": "answer2"}
    )
    
    # Mock OpenAI response
    with patch("app.routes.personality.AzureOpenAI") as MockOpenAI:
        mock_client = MockOpenAI.return_value
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"empathy_score": 80, "activity_score": 70, "patience_score": 90, "independence_score": 60, "analysis": "Test Analysis"}'
        mock_client.chat.completions.create.return_value = mock_response
        
        try:
            result = await create_personality_test(personality_request, mock_user, mock_db)
            print("✅ Personality API Call Successful")
            print(f"   Result: {result}")
        except Exception as e:
            print(f"❌ Personality API Failed: {e}")
            import traceback
            traceback.print_exc()

    # 2. Test Matching API
    print("\n[2] Testing Matching API...")
    
    matching_request = MatchingRequestCreate(
        patient_id=100,
        requirements=MatchingRequirements(
            care_type="time",
            time_slots=["morning"],
            gender=UserGenderEnum.female,
            experience="3-5",
            skills=["suction"]
        )
    )
    
    # Mock Caregivers for matching
    mock_caregiver = MagicMock(spec=Caregiver)
    mock_caregiver.caregiver_id = 200
    mock_caregiver.experience_years = 4
    mock_caregiver.specialties = ["suction"]
    
    mock_caregiver_personality = MagicMock(spec=CaregiverPersonality)
    mock_caregiver_personality.caregiver_id = 200
    mock_caregiver_personality.empathy_score = 85
    mock_caregiver_personality.activity_score = 75
    mock_caregiver_personality.patience_score = 85
    mock_caregiver_personality.independence_score = 65
    
    # Reset side effects for matching query flow
    # 1. verify_patient_access -> patient
    # 2. get patient personality
    # 3. filter caregivers -> list
    # 4. get caregiver personality (loop)
    
    mock_db.query.return_value.join.return_value.filter.return_value.first.return_value = mock_patient # verify access
    
    # Mock query chain for caregivers
    mock_query = MagicMock()
    mock_query.filter.return_value = mock_query
    mock_query.join.return_value = mock_query
    mock_query.all.return_value = [mock_caregiver]
    
    def query_side_effect(model):
        if model == Patient:
            return MagicMock(join=MagicMock(return_value=MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_patient))))))
        if model == PatientPersonality:
            return MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=MagicMock(empathy_score=80, activity_score=70, patience_score=90, independence_score=60)))))
        if model == Caregiver:
            return mock_query
        if model == CaregiverPersonality:
            return MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_caregiver_personality))))
        return MagicMock()

    mock_db.query.side_effect = query_side_effect

    try:
        results = await create_matching(matching_request, mock_user, mock_db)
        print("✅ Matching API Call Successful")
        print(f"   Matches found: {len(results)}")
        if results:
            print(f"   Top Match Score: {results[0].match_score}")
            print(f"   Top Match Grade: {results[0].grade}")
    except Exception as e:
        print(f"❌ Matching API Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_personality_and_matching())
