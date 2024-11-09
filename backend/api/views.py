from django.shortcuts import render
from django.http import JsonResponse
from .models import *
import os
from django.conf import settings
import json
from .serializers import *
from django.http import FileResponse, Http404
from rest_framework.generics import ListAPIView,CreateAPIView,RetrieveAPIView,RetrieveUpdateAPIView,DestroyAPIView
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
# Create your views here.
from rest_framework.decorators import api_view

from pathlib import Path
from openai import OpenAI
import random
import string
from .allam import ask_allam
from ibm_watsonx_ai.foundation_models import Model

def alam_api(qq):
    
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
    
    prompt = f"<s> [INST] {qq} [/INST] </s>"
    
    generated_response = model.generate_text(prompt=prompt, guardrails=False)
    return generated_response

qq = "اهلا وسهلا"
result = alam_api(qq)
result
def generate_random_string(length=6):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string


def send_tele(msg):
    token = '5476245380:AAGZdtWpfpUlc_CWUIRfZmIueJLXtdtNcSU'
    id_tele = '1282345978'
    url = f'https://api.telegram.org/bot{token}/sendMessage?chat_id={id_tele}&text={msg}'
    resp = requests.post(url).text
class LessonsView(ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            user_lessons = UserLesson.objects.filter(user=self.request.user).values_list('lesson_id', flat=True)
            #send_tele(UserLesson.objects.filter(user=self.request.user))
            lessons = Lesson.objects.exclude(id__in=user_lessons)
            print('here')
            print(lessons)
            # try:
            #     send_tele(f"Authenticated User: {self.request.user}, Excluded Lessons: {lessons}")
            # except Exception as e:
            #     print(str(e))
            return lessons
        
        lessons = Lesson.objects.all()
        # try:
        #     send_tele(f"Anonymous User, Lessons: {lessons}")
        # except Exception as e:
        #     print(str(e))
        
        return lessons


class JoinLesson(CreateAPIView):
    queryset = UserLesson.objects.all()
    serializer_class = UserLessonSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if the lesson ID is already in the context (lesson exists)
        existing_lesson_id = serializer.context.get('existing_lesson_id')
        if existing_lesson_id:
            # Return 200 with the existing lesson ID
            return Response({'id': existing_lesson_id}, status=status.HTTP_200_OK)
        
        # Proceed with creating a new UserLesson if it doesn't exist
        user_lesson = serializer.save()
        
        # Add the UserLesson to the user's profile
        profile, created = Profile.objects.get_or_create(user=request.user)
        profile.lessons.add(user_lesson)
        profile.save()
        
        # Return the response for a newly created UserLesson
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MyLessons(ListAPIView):
    queryset = UserLesson.objects.all()
    serializer_class = MyLessonsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserLesson.objects.filter(user=self.request.user)
    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)




def lesson_view_new(request,pk):
    try:
        # lesson = UserLesson.objects.filter(lesson__id=pk).first().lesson
        lesson = UserLesson.objects.get(id=pk)
        # if(request.user != lesson.user):
        #     return JsonResponse({"error": "Not authorized"})
        lesson = lesson.lesson
        transcript = lesson.transcript
        qq = f'سارسل لك transcript لدرس في اللغة العربية في النحو واريد منك من خلال هذا النص اريد رد json يحتوي على summary(ملخص الدرس) questions(اربع اسئلة متعلقة بالدرس لذا ستكون منarray من اربع object وكل object سيحتوي على question,answers(أاربعه خيارات), correct_answer(الاجابة الصحيحه ) ) sentence_for_parsing(ستكون جمله للاعراب واجعلها صغيره) وايضا text_content(شرح الدرس لكن نصي وتاكد من ان النص يكون واضح للقراءه وسيتم قرائته عن طريق قارئ صوتي لذا تاكد من النص ان يكون نع التوقيف والحركات في الكلمات اللازمه وتاكد ان لا يكون طويلا واجعله متوسط وواضحا وبدون مقدمات مثل السلام يرجي الدخول بالدرس مثل ال transcript) وتاكد ان الرد منك ان يكون فقط json وايضا تاكد ان يكون الشرح مخنلف عن الملخص لان الملخص سيتم قراذته بعد الدرس لا اريد اي كلمه ثانيه منك وشكرا لك عذا هو النص {transcript}'
        if '\n' in qq:
            qq = qq.replace('\n','')
        
        try:
            response = ask_ai(qq)
        except:
            response = None
        resp = {"resp": response}
        return JsonResponse(resp, safe=False)
    except Lesson.DoesNotExist:
        return JsonResponse({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

def lesson_view_last(request,pk):
    try:
        lesson = UserLesson.objects.get(id=pk)
        lesson = lesson.lesson
        
        transcript = lesson.transcript
        old_cards = { "sentence": "الطالب يقرأ الكتاب في المكتبة", "options": [ { "option": "الطالب", "droppableId": "الطالب", "parsing": "فاعل", }, { "option": "يقرأ", "droppableId": "يقرأ", "parsing": "فعل مضارع" }, { "option": "الكتاب", "droppableId": "الكتاب", "parsing": "مفعول به" }, { "option": "في المكتبة", "droppableId": "في المكتبة", "parsing": "جار ومجرور" } ] }
        old_daily = {"conversations": [{"text": "السلام عليكم، أود حجز طاولة لشخصين مساء اليوم","from": "client"},{"text": "وعليكم السلام، بالتأكيد. في أي وقت تفضل؟",},{"text": "في الساعة الثامنة مساءً، إذا كان ذلك ممكناً","from": "client"},{"text": "تمام، تم الحجز. هل لديك أي طلبات خاصة؟","from": "restaurant"},{"text": "نعم، أود طاولة بجانب النافذة، وأرجو أن يكون هناك قائمة طعام نباتية","from": "client"},{"text": "بالتأكيد، سيكون الطلب جاهزًا عند وصولك. شكرًا لتواصلك معنا","from": "restaurant"},], "questions": [{"question": "ما إعراب كلمة 'طاولة' في الجملة: 'أود حجز طاولة لشخصين مساء اليوم'؟","word_parsing": "طاولة"},{"question": "ما إعراب 'وقت' في الجملة: 'في أي وقت تفضل'؟","word_parsing": "وقت"},{"question": "ما إعراب كلمة 'نافذة' في الجملة: 'أود طاولة بجانب النافذة'؟","word_parsing": "نافذة"},{"question": "ما إعراب 'قائمة' في الجملة: 'أرجو أن يكون هناك قائمة طعام نباتية'؟","word_parsing": "قائمة"}]}   
        msg_gmail = "ستظهر لك رسالة بعد قليل المطلوب منك : اقرأ الرسالة بعناية: وتأكد من فهم محتواها حدد الأخطاء النحوية والإعرابية: صحح الأخطاء وأعد صياغة الرد بشكل صحيح نحويًا. قم بإعادة كتابة صيغة الرسالة مع التصحيح: بعد كتابة التصحيح في الرد، اضغط على 'إرسال' للحصول على التصحيح الفوري."
        qq = f'سارسل لك transcript لدرس في اللغة العربية في النحو واريد منك من خلال هذا النص اريد رد json يحتوي على summary(ملخص الدرس) questions(اربع اسئلة متعلقة بالدرس لذا ستكون منarray من اربع object وكل object سيحتوي على question,answers(أاربعه خيارات), correct_answer(الاجابة الصحيحه ) ) sentence_for_parsing(ستكون جمله للاعراب واجعلها صغيره)  text_content(شرح الدرس لكن نصي وتاكد من ان النص يكون واضح للقراءه وسيتم قرائته عن طريق قارئ صوتي لذا تاكد من النص ان يكون نع التوقيف والحركات في الكلمات اللازمه وتاكد ان لا يكون طويلا واجعله متوسط وواضحا وبدون مقدمات مثل السلام يرجي الدخول بالدرس مثل ال transcript) cards(تمرين عباره عن بطاقات واريد الداتا جسون تكون زي كذا مع تغير الاسئلة الاجابات اعتمادا على الدرس او على transcript "{old_cards}") daily_conversation(اريد الداتا تكون شبيهه لهذه الداتا ولكن مع تغير الكلام وتاكد ان تكون المحادثة بين مطعم وعميل وايضا تاكد من تغير الكلمات الاعرابية والاسئلة {old_daily}) gmail_msg(اريد منك توليد رساله وهي تتعلق الدرس وهذي الرساله اريد ان يوجد فيها بعض الاخطاء اللغوية والخ... لذااريد من المستخدم تصحيحها والسؤال التي ياتي للمستخدم {msg_gmail} ويرجي الرد فقط بصيغة json بهذا الشكل title(عنوان الدرس علي سبيل المثال "طلب تقرير مشروع") message(الرساله التي يوجد فيها الاخطاء) correct_errors(ماهي الاخطاء وتصحيحها) ويرجى لبرد json فقط لا اريد اي تفاصيل ثانيه ) rapid(اريد منك توليد داتا json  ستحتوي على 5 اسئلة في الإعراب في متعلقة بالدرس question(السوال سيكون بهذا الشكل  : ماإعراب كلمه "كلمه" في جملة "جمله" ) options(سيكون خيارين ،كل خيار يحتوي على options, is_correct) ) full_blank(اريد منك توليد ٤ اسئلة مختصه في الاعراب والنحو وان تكون جبيعها لها علاقة في ضمائر الجر في داتا json واريدها ان تحتوي على question(ستكون قريبه لصيغه هذا السوال لكن ليس نفسه يجب تغيره : "الكتاب الذي على الطاولة ........؟) answers(ستكون اربعه اجابات وتاكد ان لا يوجد اجابتين صحيحه فقط واحده صحيحه array وستكون قريبه للاجوبه كضمائر الجر) correct(الاجابه الصحيحه) ) وتاكد ان الرد منك ان يكون فقط json وايضا تاكد ان يكون الشرح مختلف عن الملخص لان الملخص سيتم قراذته بعد الدرس لا اريد اي كلمه ثانيه ويرجى ان تكون جميع التمرينات مرتبطة في الدرس وشكرا لك عذا هو النص {transcript}'
        if '\n' in qq:
            qq = qq.replace('\n','')
        try:
            response = ask_ai(qq)
        except:
            response = None
        resp = {"resp": response}
        return JsonResponse(resp, safe=False)
    except Lesson.DoesNotExist:
        return JsonResponse({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def lesson_solve_last(request,pk):
    lesson = UserLesson.objects.get(id=pk)
    lesson = lesson.lesson
    transcript = lesson.transcript
    data_json = request.data

    prompt = """
    Role: Arabic grammar expert.

    Task: Assess and critique a lesson on Arabic grammar and corresponding exercises. Identify any errors in the exercises based on the lesson content.

    Instructions:
    1. Review the provided Arabic grammar lesson transcript to understand its core teachings.
    2. Examine the responses in the provided JSON data, which contains exercises completed by a student.
    3. Identify and correct mistakes in the responses, linking errors directly to the grammatical rules from the lesson.
    4. Produce a detailed report that:
       - Summarizes key grammatical concepts from the lesson.
       - Details identified mistakes in the exercises.
       - Provides corrections and explanations for each error.
    5. The final deliverable should be a text PDF document that succinctly presents the findings and corrections in an educational format.

    Expected Outcome:
    A comprehensive educational PDF that serves as both a correction tool and a mini-tutorial on the covered grammatical topics, aiding the student's understanding and retention of the material.
    """

    clean_transcript = transcript.replace('\n', ' ')
    clean_data_json = data_json.replace('\n', ' ')

    full_prompt = f"{prompt}\n\nTranscript: {clean_transcript}\n\nData: {clean_data_json}\n\n"
    
    try:
        response = alam_api(full_prompt)  
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)

def tested(request):
    lesson = UserLesson.objects.get(id=27).lesson
    
    r = save_voice(lesson.pk, 'أسلوب الشرط هو أسلوب لغويّ يُستخدم لربط حدثين بحيث يشترط حدوث الأول لكي يحدث الثاني. مثلًا: "من يفعل الخير لا يعدم جوازيه". في هذا المثال، نشترط أن تفعل الخير لكي لا تعدم جوازيه. يتكون أسلوب الشرط من ثلاثة أركان رئيسية: أداة الشرط، فعل الشرط، وجواب الشرط. أداة الشرط هي الكلمة التي تدل على الشرط، مثل "إن" أو "من" أو "إذا". فعل الشرط هو الفعل الذي يُشترط حدوثه. جواب الشرط هو نتيجة حدوث فعل الشرط. هناك العديد من أدوات الشرط في اللغة العربية، مثل "إن" و "من" و "إذا" و "لو". تُستخدم "لو" في حالة امتناع لامتناع، أي أن الشرط مستحيل الحدوث، وبالتالي فإن جوابه أيضًا مستحيل الحدوث. مثلًا: "لو كنت معك بالأمس، لأكرمتك". هذا شرط غير ممكن للحدوث لأنك لا تستطيع أن تكون مع شخص في الماضي. لذلك، فإن جواب الشرط أيضًا مستحيل الحدوث.')
    #youtube_link = lesson.youtube_link
    return JsonResponse({"response": r},safe=False)

def lesson_video(request,pk):
    try:
        # lesson = UserLesson.objects.filter(lesson__id=pk).first().lesson
        lesson = UserLesson.objects.get(id=pk).lesson
        youtube_link = lesson.youtube_link
        code_youtube = youtube_link.split('?v=')[1]
        if '&' in code_youtube:
            code_youtube = code_youtube.split('&')[0]
        response = {
            "code_youtube": code_youtube,
            "name": lesson.title
        }
        return JsonResponse(response, safe=False)
    except Lesson.DoesNotExist:
        return JsonResponse({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

def full_blank_view_new(request):
    qq = 'اريد منك توليد ٤ اسئلة مختصه في الاعراب والنحو في اللغه العربيه في داتا json واريدها ان تحتوي على question(ستكون قريبه لهذا السوال : "الكتاب الذي على الطاولة ........؟) answers(ستكون اربعه اجابات وتاكد ان لا يوجد اجابتين صحيحه فقط واحده صحيحه array وستكون قريبه للاجوبه التي مثل : لها - لهم - له زي كذا) correct(الاجابه الصحيحه)'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)


def rapid_challange_view_new(request,id):
    lesson = UserLesson.objects.get(id=id).lesson
    title = lesson.title
    qq = f'اريد منك توليد داتا json  ستحتوي على 5 اسئلة في الإعراب في اللغة العربية مخصصة في درس "{title}" question(السوال سيكون بهذا الشكل  : ماإعراب كلمه "كلمه" في جملة "جمله" ) options(سيكون خيارين ،كل خيار يحتوي على options, is_correct)'
    resp = {}
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)




    

def report_view(request):
    
    response = {
        "response": [
    {
        'txt': 'الإلمام بالقواعد النحوية',
        'value': 85
    },
    {
        'txt': 'تقدم المستخدم عبر المستويات',
        'value': 60
    },
    {
        'txt': 'تطبيق الدروس المتعلمة',
        'value': 50
    },
    {
        'txt': 'نسبة إتمام الدروس في المنصة',
        'value': 35
    },

],
    "mistakes": [
    'الخلط بين المرفوع والمنصوب والمجرور',
    'استخدام أدوات النفي والشرط بشكل خاطئ',
    'عدم التمييز بين كان وأخواتها وبين الجملة الفعلية البسيطة',
    'الخلط في ترتيب الجملة وتركيبها',
    'الخلط بين المثنى والجمع في الإعراب'
]

    }
    return JsonResponse(response,safe=False)

def cards_view(request):
    response = {
        "sentence": "الطالب يقرأ الكتاب في المكتبة",
        "options": [
            {
                "option": "الطالب",
                "droppableId": "الطالب",
                "parsing": "فاعل",
                
            },
            {
                "option": "يقرأ",
                "droppableId": "يقرأ",
                "parsing": "فعل مضارع"
            },
            {
                "option": "الكتاب",
                "droppableId": "الكتاب",
                "parsing": "مفعول به"
            },
            {
                "option": "في المكتبة",
                "droppableId": "في المكتبة",
                "parsing": "جار ومجرور"
            }
        ]
    }
    return JsonResponse(response,safe=False)

def cards_view_new(request,id):
    lesson = UserLesson.objects.get(id=id).lesson
    title = lesson.title
    old_data = { "sentence": "الطالب يقرأ الكتاب في المكتبة", "options": [ { "option": "الطالب", "droppableId": "الطالب", "parsing": "فاعل", }, { "option": "يقرأ", "droppableId": "يقرأ", "parsing": "فعل مضارع" }, { "option": "الكتاب", "droppableId": "الكتاب", "parsing": "مفعول به" }, { "option": "في المكتبة", "droppableId": "في المكتبة", "parsing": "جار ومجرور" } ] }
    qq = f'اريد منك توليد سؤال في الاعراب والنحو في اللغة العربية وصيغة السوال مع الاجابات والرد يكون داتا json شبيهه لهذي الداتا مع تغير السوال والاجابات لتكون مخصصة في هذا الدرس "{title}" وتاكد ان يكون اربع اجابات {old_data}'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)

def daily_conversation_view_new(request,id):
    lesson = UserLesson.objects.get(id=id).lesson
    title = lesson.title
    old_data = {"conversations": [{"text": "السلام عليكم، أود حجز طاولة لشخصين مساء اليوم","from": "client"},{"text": "وعليكم السلام، بالتأكيد. في أي وقت تفضل؟",},{"text": "في الساعة الثامنة مساءً، إذا كان ذلك ممكناً","from": "client"},{"text": "تمام، تم الحجز. هل لديك أي طلبات خاصة؟","from": "restaurant"},{"text": "نعم، أود طاولة بجانب النافذة، وأرجو أن يكون هناك قائمة طعام نباتية","from": "client"},{"text": "بالتأكيد، سيكون الطلب جاهزًا عند وصولك. شكرًا لتواصلك معنا","from": "restaurant"},], "questions": [{"question": "ما إعراب كلمة 'طاولة' في الجملة: 'أود حجز طاولة لشخصين مساء اليوم'؟","word_parsing": "طاولة"},{"question": "ما إعراب 'وقت' في الجملة: 'في أي وقت تفضل'؟","word_parsing": "وقت"},{"question": "ما إعراب كلمة 'نافذة' في الجملة: 'أود طاولة بجانب النافذة'؟","word_parsing": "نافذة"},{"question": "ما إعراب 'قائمة' في الجملة: 'أرجو أن يكون هناك قائمة طعام نباتية'؟","word_parsing": "قائمة"}]}   
    qq = f'اريد منك توليد داتا json واجعل الرد فقط json بدون اي تفاصيل اضافية واريد الداتا تكون شبيهه لهذه الداتا ولكن مع تغير الكلام وان تتعلق في درس "{title}" وتاكد ان تكون المحادثة بين مطعم وعميل وايضا تاكد من تغير الكلمات الاعرابية والاسئلة {old_data}'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)


def ask_ai(qq):
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB4IyTXbr5uxISsdqiqOBT6xKsXku1gq2o'
    headers = {
        'Content-Type': 'application/json; charset=utf-8'
    }
    data = {"contents":[{"parts":[{"text":qq}]}]}
    try:
        resp = requests.post(url,headers=headers,json=data)
        message = resp.json()['candidates'][0]['content']['parts'][0]['text']
        print(message)
        msg_json = message.replace('```json','')
        msg_json = msg_json.replace('```','')
        if '\n' in msg_json:
            msg_json = msg_json.replace('\n','')
        json_resp = json.loads(msg_json)
        return json_resp
    except:
        None

def ask_ai2(qq):
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB4IyTXbr5uxISsdqiqOBT6xKsXku1gq2o'
    headers = {
        'Content-Type': 'application/json; charset=utf-8'
    }
    data = {"contents":[{"parts":[{"text":qq}]}]}
    try:
        resp = requests.post(url,headers=headers,json=data)
        message = resp.json()['candidates'][0]['content']['parts'][0]['text']
        print(message)
        
        return message
    except:
        None


@api_view(['POST'])
def rapid_challange_solve(request):
    data_array = request.data
    print('data_array')
    print(data_array)
    qq = f'سأرسل لك داتا json وهي عباره عن سوال في الاعراب واجابه خاطئه لذا اريدك ان ترسل داتا عباره عن question(السوال) choose_answer(الاجابه التي اختارها) correc_answer(الاجابه الصحيحه) why(التوضيح) وتاكد من جعل الرد فقط json وهذه هي الداتا {data_array}'
    try:
        response = ask_ai(qq)
        res = 5 - len(data_array)
        summary = Summary.objects.get_or_create(user=request.user,title='تحدي الإعراب السريع', result=f'{res}\\5',data=response)
    except:
        response = None
    
    resp = {"resp": response}
    return JsonResponse(resp,safe=False)

@api_view(['POST'])
def full_blank_solve(request):
    data_array = request.data
    qq = f'سأرسل لك داتا json وهي عباره عن سوال في الاعراب والنحو واجابه خاطئه لذا اريدك ان ترسل داتا عباره عن question(السوال) choose_answer(الاجابه التي اختارها) correct_answer(الاجابه الصحيحه) why(التوضيح) وتاكد من جعل الرد فقط json وهذه هي الداتا {data_array}'
    try:
        response = ask_ai(qq)
        res = 4 - len(data_array)
        summary = Summary.objects.get_or_create(user=request.user,title='أكمل الفراغ', result=f'{res}\\4',data=response)
    except:
        response = None
    resp = {"resp": response}

    return JsonResponse(resp,safe=False)

@api_view(['POST'])
def daily_conversation_solve(request):
    answer = request.data['answer']
    questions = request.data['questions']
    qq = f'سارسل لك بيانات اسئلة في اللغة العربيه في الاعراب في صيغه json هذي هي {questions} ولدي هنا جواب مستخدم "{answer}" لذا اريدك ان ترا الجواب ان كان صحيحا او لا لذا اريدك ان ترد ببيانات json وان تكون بهذا الشكل wrong_questions(هنا سيكون الاسئلة التي لم يحلها صحيح وسيكون اكثر من object سيكون بهذا الشكل question (السوال) correct_answer(الجواب الصحيح) why(سيكون التوضيح من سطر واحد الي سطرين لكي يفهم) ) is_all_correct(ستكون عباره عن true او false يعني هل الاجابات كلها صحيحه ام لا)'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}

    return JsonResponse(resp,safe=False)

def get_correct_answers_cards(wrong_chooses, chooses):
    # Convert the list of dictionaries to sets based on 'word' keys to filter unique entries
    wrong_words = {item['word'] for item in wrong_chooses}
    # Filter out the entries in chooses where the 'word' key does not exist in wrong_words
    correct_answers = [item for item in chooses if item['word'] not in wrong_words]
    return correct_answers

@api_view(['POST'])
def cards_solve(request):
    chooses = request.data['chooses']
    sentence = request.data['sentence']
    qq = f'لدي جمله في اللغة العربيه للاعراب "{sentence}" ولدي هذه الاجابات في شكل json لذا اريدك لن تتاكد من الاجابات اريد ان ترى اذا الكلمه واعرابها صحيح او لا "{chooses}" واريد ان يكون الرد فقط داتا json اريد الرد في هذا الشكل wrong_chooses(مصفوفه للكلمات التي كان اعرابها خاطئ وان لم يوجد فاجعلها فاضيه وان كان يوجد اجعل لكل item ان يحتوي على word(الكلمه) parsing(الاعراب الذي تم وضعه سابقا) correct_parsing(الاعراب الصحيح) why(توضيح بسيط ليتم الفهم) ) وايضا is_all_correct(ستكون اما true او false)'
    try:
        response = ask_ai(qq)
        correct_answers = get_correct_answers_cards(response['wrong_chooses'], chooses)
        res = len(correct_answers)
        response['correct_answers'] = correct_answers
        response['sentence'] = sentence
        summary = Summary.objects.get_or_create(user=request.user,title='سحب البطاقات', result=f'{res}\\4',data=response)
        
    except:
        response = None
    resp = {"resp": response}

    return JsonResponse(resp,safe=False)

@api_view(['POST'])
def gmail_solve(request):
    message = request.data['message']
    
    qq = f'لدي نص مكتوب باللغة العربيه وهو عبارة عن اختبار كتابي لذلك اريد ان تتاكد من النص اذا مكتوب صحيحا او لا "{message}" واريد ان ترجع لي داتا json ولا يكون هناك اي محتوى ثاني فقط اريد الرد json حتى لو كانت الاجابه صحيحه بهذا الشكل is_correct(هل الكتابه صحيحا ام لا) errors(الاخطاء اذا وجد او يمكنك جعلها فاضية اذا لم يوجد اخطاء لكن ان وجد اخطاء اريد كل item ان يحتوي على wrong_word(الكلمة الخاطئة) correct_word(الكلمة الصحيحة) why(لماذا يكون نص قصير) ) explain(سيكون مصفوفه وستحتوي على نص على الموضوع التي غلط فيها وتعريفها) ويرجى التاكد ان لايك،ن هناك اي محتوي غير json لا شي عدا json لانني ساخذها من كود برمجي'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}

    return JsonResponse(resp,safe=False)

@api_view(['POST'])
def lesson_solve(request):
    correctChooses = request.data['correctChooses']
    wrongChooses = request.data['wrongChooses']

    parsing = request.data['parsing']
    sentence = request.data['sentence']
    qq = f'سارسل لك جملة في اللغة العربيه في الإعراب "{sentence}" ولدي هذا الجواب "{parsing}" اريدك ان تتاكد اذا كان الجواب صحيحا ام لا واريد ان ترد علي بصيغه json في هذا الشكل is_correct(هل الحل صحيح ام لا) correct_answer(اذا كان الحل غير صحيح اريد الاجابة الصحيح واذا كان الحل صحيح فاجعلها None) why(اذا كان الحل غير صحيح اريد التوضيح لكي يفهم المستخدم واذا كانت صحيحه يمكنك جعلها None )'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp,safe=False)

@api_view(['POST'])
def chooses_solve(request):
    correctChooses = request.data['correctChooses']
    wrongChooses = request.data['wrongChooses']
    
    qq = f'سارسل لك بيانات اسئلة واجابات في اللغة العربية ستكون البيانات عباره عن مصفوفه للخيارات الصحيحه "{correctChooses}" الذي تحتوي على question, answer وبيانات للخيارات الخاطئة "{wrongChooses}" ستكون question, choose_answer, correct_answer واريد منك ان ترجع لي داتا json وان تحتوي على مصفوفه من اربع عناصر وكل عنصر يحتوي على question(السوال), choose_answer(الخيار الذي اختاره سواء كان صحيحا او غير صحيح), correct_answer(اذا كان الجواب غير صحيح فسيكون الخيار الصحيح هنا واذا كان حصحيا ايضا سيكون هنا), is_correct(اذا كان حل السوال صحيحا او لا اعتمادا على الداتا التي ارسلتها لك), options(جميع الخيارات التي في السوال) explain(اذا كان الجواب خاطئا سيكون توضيح لماذا خاطئا واذا كان الجواب صحيحا سيكون توضيح لماذا صحيحا) ولا اريد منك اي تفصايل ثانية فقط الرد json'
    try:
        response = ask_ai(qq)
        print(response)
        res = len(correctChooses)
        summary = Summary.objects.get_or_create(user=request.user,title='اختر الإجابة الصحيحة', result=f'{res}\\4',data=response)
    except Exception as e:
        print(str(e))
        response = None
    resp = {"resp": response}
    return JsonResponse(resp,safe=False)

@api_view(['GET'])
def voice_view(request):
    file_path = os.path.join(settings.BASE_DIR,'api', 'voices', 'speech_arabic.mp3')

    if not os.path.exists(file_path):
        raise Http404("File not found.")

    response = FileResponse(open(file_path, 'rb'), content_type='audio/mpeg')
    return response

@api_view(['POST'])
def voice_view_new(request,pk):
    text = request.data.get('text')
    print('text')
    print(text)
    file_name = save_voice(pk,text)

    file_path = os.path.join(settings.BASE_DIR,'api', 'voices', file_name)

    if not os.path.exists(file_path):
        raise Http404("File not found.")

    response = FileResponse(open(file_path, 'rb'), content_type='audio/mpeg')
    return response


def gmail_view(request):
    text = "أرجو أن تكون بخير، لقد أردت أن استفسر عن التقرير الذي كنت تعمل عليه، هل تمكنت من انهائه؟ إذا كان جاهز، أرجو منك إرساله لي في أقرب وقت. كما أحتاج منك إضافة بعض التفاصيل عن الميزانية و اداء الفريق، لأننا نحتاج لهذه المعلومات في الاجتماع القادم. شكرًا لتعاونك. تحياتي،"
    msg = "ستظهر لك رسالة بعد قليل المطلوب منك : اقرأ الرسالة بعناية: وتأكد من فهم محتواها حدد الأخطاء النحوية والإعرابية: صحح الأخطاء وأعد صياغة الرد بشكل صحيح نحويًا. قم بإعادة كتابة صيغة الرسالة مع التصحيح: بعد كتابة التصحيح في الرد، اضغط على 'إرسال' للحصول على التصحيح الفوري."
    qq = f'اريد منك توليد رساله وهي تتعلق باللغه العربيه الاعراب والنحو وهذي الرساله اريد ان يوجد فيها بعض الاخطاء اللغوية والخ... لذااريد من المستخدم تصحيحها وتاكد ان يكون المستوى سهل والسؤال التي ياتي للمستخدم {msg} ويرجي الرد فقط بصيغة json بهذا الشكل title(عنوان الدرس علي سبيل المثال "طلب تقرير مشروع") message(الرساله التي يوجد فيها الاخطاء) correct_errors(ماهي الاخطاء وتصحيحها) ويرجى لبرد json فقط لا اريد اي تفاصيل ثانيه'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp,safe=False)

def save_voice(lesson_id,text):
    client = OpenAI(api_key="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")
    file_name = f'speech_{str(lesson_id)}_{generate_random_string()}.mp3'
    
    # Define the path inside the 'api/voices' folder
    speech_file_path = Path(f"./api/voices/{file_name}")
    
    # Create the directories if they do not exist
    os.makedirs(speech_file_path.parent, exist_ok=True)
    
    # Generate speech and save it to the file path
    response = client.audio.speech.create(
        model="tts-1",
        voice="nova",  
        input=text
    )
    response.stream_to_file(speech_file_path)
    
    # Return the name of the file
    return file_name


def increment_completed_exercises(request):
    profile = get_object_or_404(Profile, user=request.user)
    profile.completed_exercises += 1
    profile.save()

class UserSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the user from the request
        summaries = Summary.objects.filter(user=user).order_by('-id')  # Filter summaries for the authenticated user
        serializer = SummarySerializer(summaries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
def summary_view(request,id):
    summary = get_object_or_404(Summary, id=id)
    resp = summary.data
    return JsonResponse(resp,safe=False)


def lesson_view(request,pk):
    lesson = UserLesson.objects.get(id=pk)
    lesson = lesson.lesson
    transcript = lesson.transcript
    qq = f'لدي هذا الدرس في اللغة العربية مختصا في الاعراب والنحو "{lesson.title}" واريد منك داتا json بهذا الشكل definition(تعريف الدرس سطر واحد يكفي) grammar(شرح بسيط جدا عن القاعدة لا يتجاوز السطرين) ويرجى التاكد ان يكون الرد فقط json'
    try:
        response = ask_ai(qq)
        response['title'] = lesson.title
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp,safe=False)


def lesson_view_last_json(request,pk):
    resp = {
        "resp": {
            "summary": "\u0627\u0644\u062f\u0631\u0633 \u064a\u062a\u0646\u0627\u0648\u0644 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0641\u064a \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629: \u0627\u0644\u0645\u0639\u0631\u0628\u0629 \u0648\u0627\u0644\u0645\u0628\u0646\u064a\u0629. \u064a\u0634\u0631\u062d \u0623\u0646 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0639\u0631\u0628\u0629 \u062a\u063a\u064a\u0631 \u0634\u0643\u0644\u0647\u0627 \u062d\u0633\u0628 \u0645\u0648\u0642\u0639\u0647\u0627 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629\u060c \u0623\u064a \u062d\u0633\u0628 \u062d\u0627\u0644\u062a\u0647\u0627 \u0627\u0644\u0625\u0639\u0631\u0627\u0628\u064a\u0629 (\u0627\u0644\u0631\u0641\u0639\u060c \u0627\u0644\u0646\u0635\u0628\u060c \u0627\u0644\u062c\u0631). \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0628\u0646\u064a\u0629 \u0644\u0627 \u062a\u062a\u063a\u064a\u0631 \u0645\u0647\u0645\u0627 \u062a\u063a\u064a\u0631 \u0645\u0648\u0642\u0639\u0647\u0627 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629. \u0643\u0645\u0627 \u064a\u0630\u0643\u0631 \u0628\u0639\u0636 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0628\u0646\u064a\u0629 \u0645\u062b\u0644 \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0625\u0634\u0627\u0631\u0629\u060c \u0648\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0648\u0644\u0629\u060c \u0648\u0627\u0644\u0636\u0645\u0627\u0626\u0631\u060c \u0648\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0627\u0633\u062a\u0641\u0647\u0627\u0645\u060c \u0648\u0628\u0639\u0636 \u0627\u0644\u0638\u0631\u0648\u0641.",
            "questions": [
                {
                    "question": "\u0645\u0627 \u0647\u0648 \u0627\u0644\u0641\u0631\u0642 \u0628\u064a\u0646 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628 \u0648\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0628\u0646\u064a\u061f",
                    "answers": [
                        "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628 \u064a\u062a\u063a\u064a\u0631 \u0634\u0643\u0644\u0647 \u062d\u0633\u0628 \u0645\u0648\u0642\u0639\u0647 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629\u060c \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0628\u0646\u064a \u0644\u0627 \u064a\u062a\u063a\u064a\u0631",
                        "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628 \u0644\u0627 \u064a\u062a\u063a\u064a\u0631 \u0634\u0643\u0644\u0647 \u062d\u0633\u0628 \u0645\u0648\u0642\u0639\u0647 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629\u060c \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0628\u0646\u064a \u064a\u062a\u063a\u064a\u0631",
                        "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628 \u0647\u0648 \u0627\u0633\u0645 \u064a\u0628\u062f\u0623 \u0628\u062d\u0631\u0641 \u0633\u0627\u0643\u0646\u060c \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0628\u0646\u064a \u064a\u0628\u062f\u0623 \u0628\u062d\u0631\u0641 \u0645\u062a\u062d\u0631\u0643",
                        "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628 \u0647\u0648 \u0627\u0633\u0645 \u064a\u0643\u062a\u0628 \u0628\u0639\u0644\u0627\u0645\u0627\u062a \u0627\u0644\u062a\u0634\u0643\u064a\u0644\u060c \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0628\u0646\u064a \u0644\u0627 \u064a\u0643\u062a\u0628 \u0628\u0639\u0644\u0627\u0645\u0627\u062a \u0627\u0644\u062a\u0634\u0643\u064a\u0644"
                    ],
                    "correct_answer": "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628 \u064a\u062a\u063a\u064a\u0631 \u0634\u0643\u0644\u0647 \u062d\u0633\u0628 \u0645\u0648\u0642\u0639\u0647 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629\u060c \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0628\u0646\u064a \u0644\u0627 \u064a\u062a\u063a\u064a\u0631"
                },
                {
                    "question": "\u0623\u064a \u0645\u0646 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u062a\u0627\u0644\u064a\u0629 \u0647\u0648 \u0645\u0628\u0646\u064a\u061f",
                    "answers": [
                        "\u0637\u0627\u0644\u0628",
                        "\u0647\u0630\u0627",
                        "\u0643\u062a\u0627\u0628",
                        "\u0645\u062f\u0631\u0633\u0629"
                    ],
                    "correct_answer": "\u0647\u0630\u0627"
                },
                {
                    "question": "\u0645\u0627 \u0647\u064a \u0639\u0644\u0627\u0645\u0629 \u0631\u0641\u0639 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0628\u061f",
                    "answers": [
                        "\u0627\u0644\u0643\u0633\u0631\u0629",
                        "\u0627\u0644\u0636\u0645\u0629",
                        "\u0627\u0644\u0641\u062a\u062d\u0629",
                        "\u0644\u0627 \u062a\u0648\u062c\u062f \u0639\u0644\u0627\u0645\u0629"
                    ],
                    "correct_answer": "\u0627\u0644\u0636\u0645\u0629"
                },
                {
                    "question": "\u0645\u0627 \u0647\u064a \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0628\u0646\u064a\u0629 \u0627\u0644\u062a\u064a \u0630\u0643\u0631\u0647\u0627 \u0627\u0644\u062f\u0631\u0633\u061f",
                    "answers": [
                        "\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0625\u0634\u0627\u0631\u0629\u060c \u0648\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0648\u0644\u0629\u060c \u0648\u0627\u0644\u0636\u0645\u0627\u0626\u0631\u060c \u0648\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0627\u0633\u062a\u0641\u0647\u0627\u0645",
                        "\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0625\u0634\u0627\u0631\u0629\u060c \u0648\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0648\u0644\u0629\u060c \u0648\u0627\u0644\u0636\u0645\u0627\u0626\u0631",
                        "\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0648\u0644\u0629\u060c \u0648\u0627\u0644\u0636\u0645\u0627\u0626\u0631\u060c \u0648\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0627\u0633\u062a\u0641\u0647\u0627\u0645",
                        "\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0625\u0634\u0627\u0631\u0629\u060c \u0648\u0627\u0644\u0636\u0645\u0627\u0626\u0631\u060c \u0648\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0627\u0633\u062a\u0641\u0647\u0627\u0645"
                    ],
                    "correct_answer": "\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0625\u0634\u0627\u0631\u0629\u060c \u0648\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0648\u0644\u0629\u060c \u0648\u0627\u0644\u0636\u0645\u0627\u0626\u0631\u060c \u0648\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0627\u0633\u062a\u0641\u0647\u0627\u0645"
                }
            ],
            "sentence_for_parsing": "\u0647\u0630\u0627 \u0637\u0627\u0644\u0628 \u0645\u062c\u062a\u0647\u062f",
            "text_content": "\u062a\u064f\u0642\u0633\u0645 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0641\u064a \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0625\u0644\u0649 \u0646\u0648\u0639\u064a\u0646: \u0627\u0644\u0645\u0639\u0631\u0628\u0629 \u0648\u0627\u0644\u0645\u0628\u0646\u064a\u0629.  \n\n\u0627\u0644\u0627\u0633\u0645 **\u0627\u0644\u0645\u0639\u0631\u0628** \u064a\u064f\u063a\u064a\u0651\u0631 \u0634\u0643\u0644\u0647 \u062d\u0633\u0628 \u0645\u0648\u0642\u0639\u0647 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629\u060c \u0623\u064a \u062d\u0633\u0628 \u062d\u0627\u0644\u062a\u0647 \u0627\u0644\u0625\u0639\u0631\u0627\u0628\u064a\u0629.  \u0641\u0645\u062b\u0644\u0627\u064b\u060c \u0643\u0644\u0645\u0629 \"\u0637\u0627\u0644\u0628\" \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629 \"**\u0647\u0630\u0627** \u0637\u0627\u0644\u0628 \u0645\u062c\u062a\u0647\u062f\" \u062a\u064f\u0631\u0641\u0639 \u0628\u0627\u0644\u0636\u0645\u0629 \u0644\u0623\u0646\u0647\u0627 \u062e\u0628\u0631.  \u0648\u0644\u0643\u0646\u060c \u0625\u0630\u0627 \u0648\u0636\u0639\u0646\u0627 \u0646\u0641\u0633 \u0627\u0644\u0643\u0644\u0645\u0629 \u0641\u064a \u062c\u0645\u0644\u0629 \u0623\u062e\u0631\u0649 \u0645\u062b\u0644 \"\u0635\u0627\u062d\u0628\u062a **\u0637\u0627\u0644\u0628\u0627** \u0645\u062c\u062a\u0647\u062f\u0627\"\u060c \u0641\u0625\u0646\u0647\u0627 \u062a\u0646\u0635\u0628 \u0628\u0627\u0644\u0641\u062a\u062d\u0629 \u0644\u0623\u0646\u0647\u0627 \u0645\u0641\u0639\u0648\u0644 \u0628\u0647.  \n\n\u0623\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 **\u0627\u0644\u0645\u0628\u0646\u064a** \u0641\u0644\u0627 \u064a\u064f\u063a\u064a\u0651\u0631 \u0634\u0643\u0644\u0647 \u0645\u0647\u0645\u0627 \u062a\u063a\u064a\u0631 \u0645\u0648\u0642\u0639\u0647 \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629.  \u0645\u062b\u0644\u0627\u064b\u060c \u0643\u0644\u0645\u0629 \"\u0647\u0630\u0627\" \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629 \"**\u0647\u0630\u0627** \u0637\u0627\u0644\u0628 \u0645\u062c\u062a\u0647\u062f\" \u0647\u064a \u0645\u0628\u062a\u062f\u0623 \u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0627\u0644\u0633\u0643\u0648\u0646\u060c \u0648\u0644\u0627 \u062a\u064f\u063a\u064a\u0651\u0631 \u0634\u0643\u0644\u0647\u0627 \u0625\u0630\u0627  \u0648\u0636\u0639\u0646\u0627\u0647\u0627 \u0641\u064a \u062c\u0645\u0644\u0629 \u0623\u062e\u0631\u0649\u060c \u0645\u062b\u0644: \"\u0635\u0627\u062d\u0628\u062a **\u0647\u0630\u0627** \u0627\u0644\u0637\u0627\u0644\u0628.\"  \n\n\u0645\u0646 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0628\u0646\u064a\u0629: \n\n* **\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0625\u0634\u0627\u0631\u0629**: \u0645\u062b\u0644 \u0647\u0630\u0627\u060c \u0647\u0630\u0647\u060c \u0647\u0624\u0644\u0627\u0621.  \n* **\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0648\u0644\u0629**: \u0645\u062b\u0644 \u0627\u0644\u0630\u064a\u060c \u0648\u0627\u0644\u062a\u064a\u060c \u0627\u0644\u0630\u064a\u0646\u060c \u0627\u0644\u0644\u0627\u062a\u064a. \n* **\u0627\u0644\u0636\u0645\u0627\u0626\u0631**: \u0645\u062b\u0644 \u0647\u0648\u060c \u0647\u064a\u060c \u0647\u0645\u0627\u060c \u0647\u0645. \n* **\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0627\u0633\u062a\u0641\u0647\u0627\u0645**: \u0645\u062b\u0644 \u0643\u0645\u060c \u0623\u064a\u0646\u060c \u0645\u062a\u0649\u060c \u0643\u064a\u0641.  \n* **\u0628\u0639\u0636 \u0627\u0644\u0638\u0631\u0648\u0641**: \u0645\u062b\u0644 \u0623\u0645\u0633\u060c \u0627\u0644\u0622\u0646\u060c \u062d\u064a\u0641.",
            "cards": [
                {
                    "sentence": "\u0627\u0644\u0637\u0641\u0644 \u064a\u0644\u0639\u0628 \u0628\u0627\u0644\u0643\u0631\u0629 \u0641\u064a \u0627\u0644\u062d\u062f\u064a\u0642\u0629",
                    "options": [
                        {
                            "option": "\u0627\u0644\u0637\u0641\u0644",
                            "droppableId": "\u0627\u0644\u0637\u0641\u0644",
                            "parsing": "\u0641\u0627\u0639\u0644"
                        },
                        {
                            "option": "\u064a\u0644\u0639\u0628",
                            "droppableId": "\u064a\u0644\u0639\u0628",
                            "parsing": "\u0641\u0639\u0644 \u0645\u0636\u0627\u0631\u0639"
                        },
                        {
                            "option": "\u0628\u0627\u0644\u0643\u0631\u0629",
                            "droppableId": "\u0628\u0627\u0644\u0643\u0631\u0629",
                            "parsing": "\u062c\u0627\u0631 \u0648\u0645\u062c\u0631\u0648\u0631"
                        },
                        {
                            "option": "\u0641\u064a \u0627\u0644\u062d\u062f\u064a\u0642\u0629",
                            "droppableId": "\u0641\u064a \u0627\u0644\u062d\u062f\u064a\u0642\u0629",
                            "parsing": "\u062c\u0627\u0631 \u0648\u0645\u062c\u0631\u0648\u0631"
                        }
                    ]
                },
                {
                    "sentence": "\u0623\u0639\u0637\u0649 \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0643\u062a\u0627\u0628",
                    "options": [
                        {
                            "option": "\u0623\u0639\u0637\u0649",
                            "droppableId": "\u0623\u0639\u0637\u0649",
                            "parsing": "\u0641\u0639\u0644 \u0645\u0627\u0636"
                        },
                        {
                            "option": "\u0627\u0644\u0645\u0639\u0644\u0645",
                            "droppableId": "\u0627\u0644\u0645\u0639\u0644\u0645",
                            "parsing": "\u0641\u0627\u0639\u0644"
                        },
                        {
                            "option": "\u0627\u0644\u0637\u0627\u0644\u0628",
                            "droppableId": "\u0627\u0644\u0637\u0627\u0644\u0628",
                            "parsing": "\u0645\u0641\u0639\u0648\u0644 \u0628\u0647"
                        },
                        {
                            "option": "\u0627\u0644\u0643\u062a\u0627\u0628",
                            "droppableId": "\u0627\u0644\u0643\u062a\u0627\u0628",
                            "parsing": "\u0645\u0641\u0639\u0648\u0644 \u0628\u0647"
                        }
                    ]
                },
                {
                    "sentence": "\u0630\u0647\u0628\u062a \u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0645\u0639 \u0635\u062f\u064a\u0642\u064a",
                    "options": [
                        {
                            "option": "\u0630\u0647\u0628\u062a",
                            "droppableId": "\u0630\u0647\u0628\u062a",
                            "parsing": "\u0641\u0639\u0644 \u0645\u0627\u0636"
                        },
                        {
                            "option": "\u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0631\u0633\u0629",
                            "droppableId": "\u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0631\u0633\u0629",
                            "parsing": "\u062c\u0627\u0631 \u0648\u0645\u062c\u0631\u0648\u0631"
                        },
                        {
                            "option": "\u0645\u0639 \u0635\u062f\u064a\u0642\u064a",
                            "droppableId": "\u0645\u0639 \u0635\u062f\u064a\u0642\u064a",
                            "parsing": "\u062c\u0627\u0631 \u0648\u0645\u062c\u0631\u0648\u0631"
                        },
                        {
                            "option": "\u0635\u062f\u064a\u0642\u064a",
                            "droppableId": "\u0635\u062f\u064a\u0642\u064a",
                            "parsing": "\u0645\u0636\u0627\u0641 \u0625\u0644\u064a\u0647"
                        }
                    ]
                },
                {
                    "sentence": "\u0633\u0623\u0642\u0631\u0623 \u0643\u062a\u0627\u0628\u064b\u0627 \u062c\u062f\u064a\u062f\u064b\u0627",
                    "options": [
                        {
                            "option": "\u0633\u0623\u0642\u0631\u0623",
                            "droppableId": "\u0633\u0623\u0642\u0631\u0623",
                            "parsing": "\u0641\u0639\u0644 \u0645\u0636\u0627\u0631\u0639"
                        },
                        {
                            "option": "\u0643\u062a\u0627\u0628\u064b\u0627",
                            "droppableId": "\u0643\u062a\u0627\u0628\u064b\u0627",
                            "parsing": "\u0645\u0641\u0639\u0648\u0644 \u0628\u0647"
                        },
                        {
                            "option": "\u062c\u062f\u064a\u062f\u064b\u0627",
                            "droppableId": "\u062c\u062f\u064a\u062f\u064b\u0627",
                            "parsing": "\u0646\u0639\u062a"
                        },
                        {
                            "option": "\u062c\u062f\u064a\u062f",
                            "droppableId": "\u062c\u062f\u064a\u062f",
                            "parsing": "\u0646\u0639\u062a"
                        }
                    ]
                }
            ],
            "daily_conversation": {
                "conversations": [
                    {
                        "text": "\u0623\u0647\u0644\u0627\u064b \u0648\u0633\u0647\u0644\u0627\u064b. \u0645\u0627\u0630\u0627 \u062a\u0648\u062f\u0651 \u0637\u0644\u0628\u064b\u0627 \u0627\u0644\u064a\u0648\u0645\u061f",
                        "from": "restaurant"
                    },
                    {
                        "text": "\u0623\u0631\u064a\u062f  \u0637\u0644\u0628  \u0637\u0628\u0642  \u0645\u0646  \u0627\u0644\u0644\u062d\u0645  \u0645\u0639  \u0633\u0644\u0637\u0629  \u060c  \u0648\u0647\u0648  \u0637\u0628\u0642  \u0645\u0641\u0636\u0644  \u0644\u062f\u064a  ",
                        "from": "client"
                    },
                    {
                        "text": "\u062a\u0645\u0627\u0645\u060c  \u0647\u0644  \u062a\u0631\u063a\u0628  \u0641\u064a  \u0637\u0644\u0628  \u0645\u0634\u0631\u0648\u0628  \u0645\u0639  \u0627\u0644\u0637\u0628\u0642\u061f ",
                        "from": "restaurant"
                    },
                    {
                        "text": "\u0646\u0639\u0645\u060c  \u0623\u0631\u064a\u062f  \u0637\u0644\u0628  \u0639\u0635\u064a\u0631  \u0628\u0631\u062a\u0642\u0627\u0644  \u0645\u0646  \u0641\u0636\u0644\u0643  ",
                        "from": "client"
                    },
                    {
                        "text": "\u0645\u0645\u062a\u0627\u0632.  \u0633\u064a\u062a\u0645  \u062a\u0642\u062f\u064a\u0645  \u0627\u0644\u0637\u0644\u0628  \u062e\u0644\u0627\u0644  15  \u062f\u0642\u064a\u0642\u0629.  \u0647\u0644  \u062a\u0631\u063a\u0628  \u0641\u064a  \u0634\u064a\u0621  \u0622\u062e\u0631\u061f ",
                        "from": "restaurant"
                    },
                    {
                        "text": "\u0644\u0627\u060c  \u0634\u0643\u0631\u064b\u0627  .  ",
                        "from": "client"
                    }
                ],
                "questions": [
                    {
                        "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0637\u0628\u0642' \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629: '\u0623\u0631\u064a\u062f \u0637\u0644\u0628 \u0637\u0628\u0642 \u0645\u0646 \u0627\u0644\u0644\u062d\u0645'\u061f",
                        "word_parsing": "\u0637\u0628\u0642"
                    },
                    {
                        "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 '\u0644\u062d\u0645' \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629: '\u0623\u0631\u064a\u062f \u0637\u0644\u0628 \u0637\u0628\u0642 \u0645\u0646 \u0627\u0644\u0644\u062d\u0645'\u061f",
                        "word_parsing": "\u0644\u062d\u0645"
                    },
                    {
                        "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0645\u0634\u0631\u0648\u0628' \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629: '\u0647\u0644 \u062a\u0631\u063a\u0628 \u0641\u064a \u0637\u0644\u0628 \u0645\u0634\u0631\u0648\u0628 \u0645\u0639 \u0627\u0644\u0637\u0628\u0642'\u061f",
                        "word_parsing": "\u0645\u0634\u0631\u0648\u0628"
                    },
                    {
                        "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 '\u0639\u0635\u064a\u0631' \u0641\u064a \u0627\u0644\u062c\u0645\u0644\u0629: '\u0623\u0631\u064a\u062f \u0637\u0644\u0628 \u0639\u0635\u064a\u0631 \u0628\u0631\u062a\u0642\u0627\u0644 \u0645\u0646 \u0641\u0636\u0644\u0643'\u061f",
                        "word_parsing": "\u0639\u0635\u064a\u0631"
                    }
                ]
            },
            "gmail_msg": {
                "title": "\u0637\u0644\u0628 \u062a\u0642\u0631\u064a\u0631 \u0645\u0634\u0631\u0648\u0639",
                "message": "\u0623\u0631\u062c\u0648 \u0645\u0646\u0643 \u0625\u0631\u0633\u0627\u0644 \u062a\u0642\u0631\u064a\u0631 \u0645\u0634\u0631\u0648\u0639\u0643 \u0641\u064a \u0623\u0633\u0631\u0639 \u0648\u0642\u062a \u0645\u0645\u0643\u0646.  \u0623\u062d\u062a\u0627\u062c \u0625\u0644\u064a\u0643  \u0628\u062a\u0642\u0631\u064a\u0631  \u0627\u0644\u0645\u0634\u0631\u0648\u0639  \u0642\u0628\u0644  \u0646\u0647\u0627\u064a\u0629  \u0627\u0644\u064a\u0648\u0645  ,  \u0648\u0627\u0630\u0627  \u0644\u0645  \u064a\u0643\u0646  \u0630\u0644\u0643  \u0645\u0645\u0643\u0646\u064b\u0627  \u060c  \u0641\u064a\u0631\u062c\u0649  \u0627\u0644\u062a\u0648\u0627\u0635\u0644  \u0645\u0639\u064a  \u0644\u0625\u0628\u0644\u0627\u063a\u064a  \u0639\u0646  \u0627\u0644\u062a\u0623\u062e\u064a\u0631  ",
                "correct_errors": "\u0627\u0644\u0623\u062e\u0637\u0627\u0621: \n 1.  '\u0623\u062d\u062a\u0627\u062c \u0625\u0644\u064a\u0643' -   \u0635\u062d\u064a\u062d\u0647 : '\u0623\u062d\u062a\u0627\u062c \u0625\u0644\u0649'  \n 2.  '\u0628\u062a\u0642\u0631\u064a\u0631' -   \u0635\u062d\u064a\u062d\u0647 : '\u062a\u0642\u0631\u064a\u0631'  \n 3.  '\u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u064a\u0648\u0645' -   \u0635\u062d\u064a\u062d\u0647 : '\u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u064a\u0648\u0645'  \n 4.  '\u0644\u0645 \u064a\u0643\u0646' -   \u0635\u062d\u064a\u062d\u0647 : '\u0644\u0645 \u064a\u0643\u0646'  \n 5.  '\u064a\u0631\u062c\u0649' -   \u0635\u062d\u064a\u062d\u0647 : '\u064a\u0631\u062c\u0649'  \n\n \u0627\u0644\u062a\u0635\u062d\u064a\u062d: \n  \u0623\u0631\u062c\u0648 \u0645\u0646\u0643 \u0625\u0631\u0633\u0627\u0644 \u062a\u0642\u0631\u064a\u0631 \u0645\u0634\u0631\u0648\u0639\u0643 \u0641\u064a \u0623\u0633\u0631\u0639 \u0648\u0642\u062a \u0645\u0645\u0643\u0646.  \u0623\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0642\u0628\u0644 \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u064a\u0648\u0645\u060c  \u0648\u0625\u0630\u0627 \u0644\u0645 \u064a\u0643\u0646 \u0630\u0644\u0643 \u0645\u0645\u0643\u0646\u064b\u0627\u060c  \u0641\u064a\u0631\u062c\u0649 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u064a \u0644\u0625\u0628\u0644\u0627\u063a\u064a \u0639\u0646 \u0627\u0644\u062a\u0623\u062e\u064a\u0631."
            },
            "rapid": [
                {
                    "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0637\u0627\u0644\u0628' \u0641\u064a \u062c\u0645\u0644\u0629 '\u0647\u0630\u0627 \u0637\u0627\u0644\u0628 \u0645\u062c\u062a\u0647\u062f'\u061f",
                    "options": [
                        {
                            "option": "\u0645\u0631\u0641\u0648\u0639",
                            "is_correct": True
                        },
                        {
                            "option": "\u0645\u0646\u0635\u0648\u0628",
                            "is_correct": False
                        }
                    ]
                },
                {
                    "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0647\u0630\u0627' \u0641\u064a \u062c\u0645\u0644\u0629 '\u0647\u0630\u0627 \u0637\u0627\u0644\u0628 \u0645\u062c\u062a\u0647\u062f'\u061f",
                    "options": [
                        {
                            "option": "\u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0627\u0644\u0633\u0643\u0648\u0646",
                            "is_correct": True
                        },
                        {
                            "option": "\u0645\u0639\u0631\u0628",
                            "is_correct": False
                        }
                    ]
                },
                {
                    "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0627\u0644\u0630\u064a' \u0641\u064a \u062c\u0645\u0644\u0629 '\u0627\u0644\u0643\u062a\u0627\u0628 \u0627\u0644\u0630\u064a \u0639\u0644\u0649 \u0627\u0644\u0637\u0627\u0648\u0644\u0629'\u061f",
                    "options": [
                        {
                            "option": "\u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0627\u0644\u0633\u0643\u0648\u0646",
                            "is_correct": True
                        },
                        {
                            "option": "\u0645\u0639\u0631\u0628",
                            "is_correct": False
                        }
                    ]
                },
                {
                    "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0627\u0644\u0630\u064a' \u0641\u064a \u062c\u0645\u0644\u0629 '\u0627\u0644\u0637\u0641\u0644 \u0627\u0644\u0630\u064a \u064a\u0644\u0639\u0628'\u061f",
                    "options": [
                        {
                            "option": "\u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0627\u0644\u0633\u0643\u0648\u0646",
                            "is_correct": True
                        },
                        {
                            "option": "\u0645\u0639\u0631\u0628",
                            "is_correct": False
                        }
                    ]
                },
                {
                    "question": "\u0645\u0627 \u0625\u0639\u0631\u0627\u0628 \u0643\u0644\u0645\u0629 '\u0627\u0644\u0630\u064a' \u0641\u064a \u062c\u0645\u0644\u0629 '\u0627\u0644\u0643\u062a\u0627\u0628 \u0627\u0644\u0630\u064a \u0623\u062d\u0628\u0628\u062a\u0647'\u061f",
                    "options": [
                        {
                            "option": "\u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0627\u0644\u0633\u0643\u0648\u0646",
                            "is_correct": True
                        },
                        {
                            "option": "\u0645\u0639\u0631\u0628",
                            "is_correct": False
                        }
                    ]
                }
            ],
            "full_blank": [
                {
                    "question": "\u0627\u0644\u0643\u062a\u0627\u0628 \u0627\u0644\u0630\u064a \u0639\u0644\u0649 \u0627\u0644\u0637\u0627\u0648\u0644\u0629 ......\u061f",
                    "answers": [
                        "\u0647\u0648",
                        "\u0647\u064a",
                        "\u0647\u0645\u0627",
                        "\u0623\u0646\u062a"
                    ],
                    "correct": "\u0647\u0648"
                },
                {
                    "question": "\u0627\u0644\u062a\u0644\u0645\u064a\u0630 \u0627\u0644\u0630\u064a \u064a\u0642\u0631\u0623 \u0627\u0644\u0643\u062a\u0627\u0628 ......\u061f",
                    "answers": [
                        "\u0623\u0646\u0627",
                        "\u0623\u0646\u062a",
                        "\u0647\u0648",
                        "\u0647\u064a"
                    ],
                    "correct": "\u0647\u0648"
                },
                {
                    "question": "\u0627\u0644\u0628\u064a\u062a \u0627\u0644\u0630\u064a \u064a\u0633\u0643\u0646\u0647 ......\u061f",
                    "answers": [
                        "\u0623\u0646\u0627",
                        "\u0623\u0646\u062a",
                        "\u0647\u0648",
                        "\u0647\u064a"
                    ],
                    "correct": "\u0647\u0648"
                },
                {
                    "question": "\u0627\u0644\u0634\u062c\u0631\u0629 \u0627\u0644\u062a\u064a \u0632\u0631\u0639\u062a\u0647\u0627 ......\u061f",
                    "answers": [
                        "\u0623\u0646\u0627",
                        "\u0623\u0646\u062a",
                        "\u0647\u064a",
                        "\u0647\u0645\u0627"
                    ],
                    "correct": "\u0647\u064a"
                }
            ]
        }
    }
    return JsonResponse(resp,safe=False)


