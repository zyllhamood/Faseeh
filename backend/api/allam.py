import os
from ibm_watsonx_ai.foundation_models import Model
import json
from django.http import JsonResponse
import threading
from concurrent.futures import ThreadPoolExecutor
def alam_api(prompt):
    
    credentials = {
        "url": "https://eu-de.ml.cloud.ibm.com",
        "apikey": "1bnfzZ8OhEXApfYsjD5Wi7DnMTjgnQeTYM0Tsvryz5Vv"
    }
    
    model_id = "sdaia/allam-1-13b-instruct"
    
    parameters = {
        "decoding_method": "greedy",
        "max_new_tokens": 900,
        "repetition_penalty": 1
    }
    
    project_id = "0218eda5-ba50-4474-ad42-c49a7a0c582b"
   
    model = Model(
        model_id=model_id,
        params=parameters,
        credentials=credentials,
        project_id=project_id,
    )
    
    prompt = f"<s> [INST] {prompt} [/INST] </s>"
    
    generated_response = model.generate_text(prompt=prompt, guardrails=False)
    return generated_response

def generate_summary(lesson_text):
    prompt = """
    Act like a professional Arabic language teacher. Analyze the provided lesson and summarize its key points.
    The response must be in JSON format and structured as follows:
    Example:
    {
        "summary": "هذا الدرس عن أنواع الكلمة في اللغة العربية، يشرح لنا أنواع الكلمة وهي الاسم والفعل والحرف..."
    }
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', '')
    qq = f"{prompt}:{lesson_text}"
    response = alam_api(qq)
    
    response = response.replace("\n","")
    response = json.loads(response)
    
    return response

def generate_questions(lesson_text):
    prompt = """
    Act like an Arabic grammar expert. Create 4 multiple-choice questions relevant to the lesson. 
    The response must be in JSON format and structured as follows:
    Example:
    {
        "questions": [
            {
                "question": "ما هو نوع الكلمة التي تقبل الألف والتنوين؟",
                "answers": [
                    {"option": "الاسم", "is_correct": true},
                    {"option": "الفاعل", "is_correct": false},
                    {"option": "الجملة", "is_correct": false},
                    {"option": "الفعل", "is_correct": false}
                ],
                "correct_answer": "الاسم"
            }
        ]
    }
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', '')
    qq = f"{prompt}: {lesson_text}"
    response = alam_api(qq)
     
    response = response.replace("\n","")
    response = json.loads(response)
    return response

def generate_parsing_sentence(lesson_text):
    prompt = """
    Act like a linguistics expert. Select a short sentence from the lesson for parsing (إعراب). 
    The response must be in JSON format and structured as follows:
    Example:
    {
        "sentence_for_parsing": "الطفل يلعب بالكرة"
    }
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', '')

    qq = f"{prompt}:\n {lesson_text}"

    # Simulate API response for debugging
    response = alam_api(qq)  # Replace this with actual API call

    # Handle empty or invalid JSON response
    if not response:
        return {"error": "No response from API"}

    response = response.replace("\n", "")  
    return json.loads(response)  

def generate_text_content(lesson_text):
    prompt= """
    Act like an Arabic language instructor. Write a shortest paragraph explanation of the lesson. 
    Ensure the content is easy to read and clear.
    The response must be in JSON format and structured as follows:
    Example:
    {
        "text_content": "الكلمة في اللغة العربية هي مجموعة من الحروف التي تفيد معنى..."
    }
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', '')
    qq = f"{prompt}: {lesson_text}"
    
    response = alam_api(qq)
    
    response = response.replace("\n","")
    response = json.loads(response)
    
    return response

def generate_flashcards(lesson_text):
    prompt = """
            # Role: Arabic grammar expert

# Task: Analyze the provided lesson text and generate a single flashcard-based exercise in JSON format.

# Output Requirements:
1. Include a meaningful sentence from the lesson that demonstrates a key grammar concept.
2. Provide parsing options for specific words or phrases in the sentence. Each option must include:
   - **"option"**: The word or phrase to parse.
   - **"droppableId"**: A unique identifier matching the option text.
   - **"parsing"**: The grammatical role (e.g., فاعل, مفعول به, فعل ماضٍ).
3. Return only a valid JSON response. No additional text or explanation is allowed.

# Example JSON Output:
{
    "cards": {
        "sentence": "أهدى المعلم الطالبة هدية جميلة",
        "options": [
            {
                "option": "أهدى",
                "droppableId": "أهدى",
                "parsing": "فعل ماضٍ"
            },
            {
                "option": "المعلم",
                "droppableId": "المعلم",
                "parsing": "فاعل"
            },
            {
                "option": "الطالبة",
                "droppableId": "الطالبة",
                "parsing": "مفعول به أول"
            },
            {
                "option": "هدية جميلة",
                "droppableId": "هدية جميلة",
                "parsing": "مفعول به ثانٍ"
            }
        ]
    }
}

Analyze the lesson content and generate the JSON flashcard accordingly.
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', ' ')
    
    qq = f"{prompt}\n\nLesson Content: {lesson_text}"
    
    response = alam_api(qq)
    
    return response

def generate_daily_conversation(lesson_text):
    prompt = """
    Role: Act like a scriptwriter specializing in creating realistic and contextually relevant Arabic conversations. 
    Your task is to write a short daily conversation in Arabic between a client and a restaurant server.

    Instructions:
    1. The conversation must use vocabulary and grammar concepts from the provided lesson content.
    2. Include at least 4-6 conversational exchanges between the client and the server.
    3. The response must be strictly in JSON format and structured as follows:
    
    Example JSON format:
    {
        "daily_conversation": {
            "conversations": [
                {"text": "السلام عليكم، أود حجز طاولة لشخص واحد الليلة", "from": "client"},
                {"text": "مرحباً، بالتأكيد. في أي وقت تفضل؟", "from": "restaurant"},
                {"text": "في الساعة الثامنة مساءً، إذا كان ذلك ممكناً", "from": "client"},
                {"text": "بالتأكيد، تم الحجز. هل لديك أي طلبات خاصة؟", "from": "restaurant"},
                {"text": "نعم، أود طاولة قريبة من النافذة", "from": "client"},
                {"text": "سنجهز الطاولة لك. شكراً لتواصلك معنا", "from": "restaurant"}
            ],
            "questions": [
                {"question": "ما إعراب كلمة 'طاولة' في الجملة: 'أود حجز طاولة لشخص واحد الليلة'؟", "word_parsing": "طاولة"},
                {"question": "ما إعراب 'النافذة' في الجملة: 'أود طاولة قريبة من النافذة'؟", "word_parsing": "النافذة"}
            ]
        }
    }
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', ' ')
    
    qq = f"{prompt}\n\nLesson Content: {lesson_text}"
    
    # Simulate API response for debugging
    response = alam_api(qq)
    
    try:
        # Attempt to parse the response directly
        return json.loads(response)
    except json.JSONDecodeError:
        # If it fails, extract JSON part using regex
        import re
        match = re.search(r'\{.*\}', response, re.DOTALL)  # Match JSON object
        if match:
            json_text = match.group(0)
            return json.loads(json_text)  # Parse extracted JSON
        else:
            # Return an error message if JSON cannot be found
            return {"error": "No valid JSON found in the response"}

def generate_email_message():
    prompt = """
    Role: Act as an Arabic language expert creating educational content.

    Task: You must Generate from your mind correct a email-style message with intentional grammatical errors to help learners identify and correct them.

    Output Requirements:
    - The response must include:
      - `title`: The subject of the email message.
      - `message`: The body of the email message containing intentional grammatical errors.
      - `correct_errors`: A dictionary where keys are incorrect phrases from the message and values are their corrections.

    - Return only the JSON output. Do not include explanations, notes, or commentary outside the JSON structure.

    # Example JSON Output:  
    # 
    #   gmail_msg": {  
        "title": "طلب معلومات إضافية",
        "message": "أرجو منكم ان ترسلو لي التفاصيل الكامله عن الدورة التدريبية.",
        "correct_errors": {
            "ارجو": "أرجو",
            "ان": "أن",
            "ترسلو": "ترسلوا",
            "الكامله": "الكاملة"
        }
    }
    """
    
    response = alam_api(prompt)
    
    response = response.replace("\n","")
    response = json.loads(response)
    
    return response

def generate_rapid_questions(lesson_text):
    prompt = """
    Role: Act like an Arabic grammar expert. 

    Task: Analyze the provided lesson text and generate 5 parsing questions.

    Output Requirements:
    1. Each question must have:
       - A `question` field that asks about the grammatical role of a specific word or phrase in a sentence.
       - An `options` field containing two answer options. Each option must include:
         - **"option"**: The answer text.
         - **"is_correct"**: A boolean indicating if the option is correct.

    2. Return the response strictly in JSON format. Do not include any explanations or commentary outside the JSON structure.

    Example JSON Output:
    {
        "rapid_questions": [
            {
                "question": "ما إعراب كلمة 'الطفل' في جملة 'رأيتُ الطفل يلعب'؟",
                "options": [
                    {"option": "مفعول به", "is_correct": true},
                    {"option": "فاعل", "is_correct": false}
                ]
            },
            {
                "question": "ما إعراب كلمة 'القلم' في جملة 'أمسكتُ القلم'؟",
                "options": [
                    {"option": "مفعول به", "is_correct": true},
                    {"option": "فاعل", "is_correct": false}
                ]
            }
        ]
    }
    """

    # Remove unnecessary newlines in the lesson text
    lesson_text = lesson_text.replace("\n", " ")
    qq = f"{prompt}\n\nLesson Content: {lesson_text}"

    # Simulate API response for debugging (replace with actual API call)
    try:
        response = alam_api(qq)  # Replace with the actual API call
    except Exception as e:
        return {"error": "API call failed", "details": str(e)}

    # Handle empty or invalid API response
    if not response:
        return {"error": "No response from API"}

    try:
        # Clean up response and parse as JSON
        response = response.replace("\n", "")
        return json.loads(response)
    except json.JSONDecodeError as e:
        # Return error details if JSON parsing fails
        return {"error": "Invalid JSON response", "details": str(e)}

def generate_fill_in_the_blank(lesson_text):
    prompt = """
    Role: Act like a grammar teacher specializing in Arabic grammar exercises.

    Task: Generate one fill-in-the-blank randomly grammar question that tests on Arabic grammar from provided lesson.

    Output Requirements:
    - The response must include:
      - `question`: A sentence with a blank for the user to fill, demonstrating a key grammatical structure.
      - `answers`: A list of four options, each with:
        - `option`: The text of the option.
        - `is_correct`: A boolean indicating if the option is correct.
      - `correct`: The correct answer from the options.
    - Ensure the response is strictly in JSON format without any external commentary.

    Example JSON Output:
    {
        "full_blank": {
            "question": "في الصف الدراسي، المعلم _____ بشرح الدرس.",
            "answers": [
                {"option": "يقوم", "is_correct": true},
                {"option": "قام", "is_correct": false},
                {"option": "قوم", "is_correct": false},
                {"option": "تقوم", "is_correct": false}
            ],
            "correct": "يقوم"
        }
    }
    """
    if '\n' in lesson_text:
        lesson_text = lesson_text.replace('\n', ' ')
    
    qq = f"{prompt}\n\nLesson Content: {lesson_text}"

    # Assuming alam_api sends a request and returns a JSON response
    response = alam_api(qq)  # This should be a JSON object already

    try:
        if isinstance(response, str):
            response = json.loads(response)
        return response  
    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse JSON response: {str(e)}"}


def ask_allam(lesson_text):
    resp = {}

    # Define the functions and their arguments in a list
    tasks = {
        'summary': (generate_summary, [lesson_text]),
        'questions': (generate_questions, [lesson_text]),
        'sentence_for_parsing': (generate_parsing_sentence, [lesson_text]),
        'text_content': (generate_text_content, [lesson_text]),
        'cards': (generate_flashcards, [lesson_text]),
        'daily_conversation': (generate_daily_conversation, [lesson_text]),
        'gmail_msg': (generate_email_message, []),
        'rapid_questions': (generate_rapid_questions, [lesson_text]),
        'full_blank': (generate_fill_in_the_blank, [lesson_text]),
    }

    # ThreadPoolExecutor for threading
    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(func, *args): key for key, (func, args) in tasks.items()}

        for future in futures:
            key = futures[future]
            try:
                resp[key] = future.result()
            except Exception as e:
                resp[key] = f"Error: {e}"

    return resp