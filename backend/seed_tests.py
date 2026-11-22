from dotenv import load_dotenv

# 1. Load .env BEFORE importing database modules
load_dotenv()

from db.session import Sessionlocal
from db.models.user import User  # noqa: F401 - register SQLAlchemy relationship mappers
from db.models.submission import Submission  # noqa: F401
from db.models.test import Test, SkillType
from schemas.test_schemas import TestCreate
from services.test_service import TestService


MOCK_TESTS = [
    {
        "title": "[Simulation Q4] Bees on guard",
        "skill_type": SkillType.READING,
        "category": "Passage 1",
        "content": {
            "meta": {
                "attempts_count": 2572,
                "duration_minutes": 20,
                "cover_gradient": "from-amber-600 to-orange-700",
                "question_types": [
                    "True - False - Not Given",
                    "Gap Filling",
                ],
            },
            "passage": {
                "title": "Bees on guard",
                "paragraphs": [
                    (
                        "No region of Kenya records more confrontations between people and "
                        "elephants than the Tsavo area, and it is on farms near Tsavo East National "
                        "Park that subsistence farmers have found an unlikely ally in the honeybee. "
                        "In the first two decades of this century, Kenya's human population increased by "
                        "more than half. This expansion has pushed farms and villages into land that "
                        "elephants once used freely. The difficulty is that elephants continue to leave "
                        "the park in search of food, water and mates, and the maize, beans, "
                        "watermelons and pumpkins now growing on farms in their path are very "
                        "attractive to them, so farmers can lose a considerable share of the harvest. "
                        "Fully grown elephants have few natural predators, but there is one creature "
                        "they will go out of their way to avoid. In fact, the largest animal on land is "
                        "afraid of a small insect and its painful sting."
                    ),
                    (
                        "This is where zoologist Lucy King comes in. She works for the conservation "
                        "charity Save the Elephants and for the University of Oxford. In particular, "
                        "she has spent years studying the relationship between elephants and African "
                        "honeybees. During field experiments, she noticed that when recordings of angry "
                        "bees were played near resting elephant herds, the animals almost immediately "
                        "stopped feeding, shook their heads, and hurried away from the sound source."
                    ),
                    (
                        "Building on this discovery, King designed a simple beehive fence. Wooden "
                        "hives are suspended every ten metres along a wire surrounding a farmer's "
                        "crops. When an elephant tries to cross the boundary and brushes against the "
                        "wire, the hives swing and disturb the bees inside, releasing a defensive "
                        "swarm. Not only do the fences deter more than eighty percent of elephant "
                        "raids, they also provide farmers with extra income from selling honey."
                    ),
                ],
            },
            "question_groups": [
                {
                    "id": "g1",
                    "title": "Questions 1 - 4",
                    "type": "true_false_not_given",
                    "instructions": (
                        "Do the following statements agree with the information given in Reading Passage 1?\n"
                        "Choose TRUE if the statement agrees with the information.\n"
                        "Choose FALSE if the statement contradicts the information.\n"
                        "Choose NOT GIVEN if there is no information on this."
                    ),
                    "question_ids": ["1", "2", "3", "4"],
                },
                {
                    "id": "g2",
                    "title": "Questions 5 - 7",
                    "type": "gap_filling",
                    "instructions": (
                        "Complete the notes below.\n"
                        "Choose ONE WORD ONLY from the passage for each answer."
                    ),
                    "question_ids": ["5", "6", "7"],
                },
            ],
            "questions": [
                {
                    "id": "1",
                    "number": 1,
                    "type": "true_false_not_given",
                    "prompt": "Elephants have pushed farmers off much of their land.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "correct_answer": "FALSE",
                },
                {
                    "id": "2",
                    "number": 2,
                    "type": "true_false_not_given",
                    "prompt": "Elephants that are full grown are frightened of some insects.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "correct_answer": "TRUE",
                },
                {
                    "id": "3",
                    "number": 3,
                    "type": "true_false_not_given",
                    "prompt": "Lucy King worked for Oxford University before joining Save the Elephants.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "correct_answer": "NOT GIVEN",
                },
                {
                    "id": "4",
                    "number": 4,
                    "type": "true_false_not_given",
                    "prompt": "Elephants ignored recordings of angry honeybees during experiments.",
                    "options": ["TRUE", "FALSE", "NOT GIVEN"],
                    "correct_answer": "FALSE",
                },
                {
                    "id": "5",
                    "number": 5,
                    "type": "gap_filling",
                    "prompt": "Crops such as beans, pumpkins, watermelons, and _____ attract elephants to farms.",
                    "correct_answer": "maize",
                },
                {
                    "id": "6",
                    "number": 6,
                    "type": "gap_filling",
                    "prompt": "Beehives are hung along a _____ spaced ten metres apart around the farm.",
                    "correct_answer": "wire",
                },
                {
                    "id": "7",
                    "number": 7,
                    "type": "gap_filling",
                    "prompt": "Farmers can earn additional money by selling _____ from the hives.",
                    "correct_answer": "honey",
                },
            ],
        },
    },
    {
        "title": "[Simulation Q4] In Search of the Visual Learner",
        "skill_type": SkillType.READING,
        "category": "Passage 3",
        "content": {
            "meta": {
                "attempts_count": 658,
                "duration_minutes": 20,
                "cover_gradient": "from-purple-600 to-pink-700",
                "question_types": [
                    "Multiple Choice (One Answer)",
                    "Yes - No - Not Given",
                ],
            },
            "passage": {
                "title": "In Search of the Visual Learner",
                "paragraphs": [
                    (
                        "For decades, classrooms around the world have embraced the idea that every "
                        "student possesses a primary 'learning style'—most famously categorized as "
                        "visual, auditory, or kinesthetic. Teachers are frequently advised to diagnose "
                        "these preferences and tailor lessons accordingly."
                    ),
                    (
                        "However, controlled psychological studies consistently fail to confirm that "
                        "matching instruction to a student's preferred style improves exam results. "
                        "Instead, the effectiveness of a teaching method depends far more on the "
                        "subject matter itself: geography naturally benefits from maps, while "
                        "pronunciation requires listening."
                    ),
                ],
            },
            "question_groups": [
                {
                    "id": "g1",
                    "title": "Questions 1 - 2",
                    "type": "multiple_choice",
                    "instructions": "Choose the correct letter, A, B, or C.",
                    "question_ids": ["1", "2"],
                }
            ],
            "questions": [
                {
                    "id": "1",
                    "number": 1,
                    "type": "multiple_choice",
                    "prompt": "What do controlled psychological studies suggest about learning styles?",
                    "options": [
                        "A. Visual learners outperform auditory learners in most subjects.",
                        "B. Tailoring lessons to preferred styles does not measurably raise scores.",
                        "C. Teachers rarely attempt to diagnose student preferences.",
                    ],
                    "correct_answer": "B",
                },
                {
                    "id": "2",
                    "number": 2,
                    "type": "multiple_choice",
                    "prompt": "According to the author, how should teaching methods be chosen?",
                    "options": [
                        "A. Based on the demands of the subject being taught.",
                        "B. Based on each individual student's survey results.",
                        "C. By avoiding maps and visual aids in classrooms.",
                    ],
                    "correct_answer": "A",
                },
            ],
        },
    },
    {
        "title": "Booking a Hotel Room & Facilities",
        "skill_type": SkillType.LISTENING,
        "category": "Section 1",
        "content": {
            "meta": {
                "attempts_count": 5120,
                "duration_minutes": 10,
                "cover_gradient": "from-amber-500 to-orange-600",
                "question_types": ["Form Completion", "Note Completion"],
            },
            "audio_url": "",
            "transcript": [
                "Receptionist: Good morning, Harbour View Hotel, how can I help you?",
                "Caller: Hi, I'd like to book a double room for three nights starting Friday the 14th.",
            ],
            "question_groups": [
                {
                    "id": "g1",
                    "title": "Questions 1 - 2",
                    "type": "gap_filling",
                    "instructions": "Complete the booking notes below. Write ONE WORD AND/OR A NUMBER.",
                    "question_ids": ["1", "2"],
                }
            ],
            "questions": [
                {
                    "id": "1",
                    "number": 1,
                    "type": "gap_filling",
                    "prompt": "Room type requested: _____ room",
                    "correct_answer": "double",
                },
                {
                    "id": "2",
                    "number": 2,
                    "type": "gap_filling",
                    "prompt": "Length of stay: _____ nights",
                    "correct_answer": "3",
                },
            ],
        },
    },
]


def seed_mock_tests() -> None:
    db = Sessionlocal()
    service = TestService(db)
    created_count = 0

    try:
        for item in MOCK_TESTS:
            existing = db.query(Test).filter(Test.title == item["title"]).first()
            if existing:
                print(f"Skipping existing test: {item['title']} (id={existing.id})")
                continue

            test_payload = TestCreate(
                title=item["title"],
                skill_type=item["skill_type"],
                category=item["category"],
                content=item["content"],
            )
            created = service.create_test(test_payload)
            created_count += 1
            print(f"Created test: {created.title} (id={created.id})")

        print(f"Done! Inserted {created_count} new mock test(s).")
    except Exception as exc:
        db.rollback()
        print(f"Error seeding tests: {exc}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_mock_tests()