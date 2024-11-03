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

    def perform_create(self, serializer):
        #serializer.save(user=self.request.user)
        user_lesson = serializer.save(user=self.request.user)
        # Add the UserLesson to the user's profile
        profile = Profile.objects.get(user=self.request.user)
        profile.lessons.add(user_lesson)
        profile.save()

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


def lesson_view(request):
    response = {
  "summary": "أسلوب الشرط هو أسلوب نحوي يتكون من شرط ونتيجة، حيث يشترط حدوث شيء ما لكي يحدث شيء آخر. أركان أسلوب الشرط هي أداة الشرط، فعل الشرط، وجواب الشرط.  أداة الشرط تشير إلى الشرط نفسه، مثل \"إن\" أو \"لو\".  فعل الشرط هو الفعل الذي يشترط حدوثه، وجواب الشرط هو النتيجة التي ستحدث إذا تحقق الشرط.  هناك العديد من أدوات الشرط، مثل \"إن\"، \"من\"، \"ما\"، \"مهما\"، \"أين\"، \"متى\"، \"إذا\"، و\"لو\".  \"لو\" هي حرف امتناع لامتناع، أي أن الشرط مستحيل الحدوث، وبالتالي جواب الشرط يكون مستحيل الحدوث أيضًا.",
  "questions": [
    {
      "question": "ما هي أركان أسلوب الشرط؟",
      "answers": [
        "أداة الشرط، فعل الشرط",
        "أداة الشرط، فعل الشرط، جواب الشرط",
        "فعل الشرط، جواب الشرط",
        "أداة الشرط، جواب الشرط"
      ],
      "correct_answer": "أداة الشرط، فعل الشرط، جواب الشرط"
    },
    {
      "question": "ما هو الفرق بين أدوات الشرط \"إن\" و \"لو\"؟",
      "answers": [
        "لا يوجد فرق بينهما",
        "\"إن\" تدل على الشرط المؤكد، و\"لو\" تدل على الشرط غير المؤكد",
        "\"إن\" تدل على الشرط المستحيل، و\"لو\" تدل على الشرط الممكن",
        "\"إن\" تدل على الشرط الماضي، و\"لو\" تدل على الشرط المستقبلي"
      ],
      "correct_answer": "\"إن\" تدل على الشرط المؤكد، و\"لو\" تدل على الشرط غير المؤكد"
    },
    {
      "question": "ما هو معنى \"امتناع لامتناع\" في أسلوب الشرط؟",
      "answers": [
        "أن الشرط ممكن الحدوث",
        "أن الشرط مستحيل الحدوث",
        "أن جواب الشرط ممكن الحدوث",
        "أن جواب الشرط مستحيل الحدوث"
      ],
      "correct_answer": "أن الشرط مستحيل الحدوث"
    },
    {
      "question": "ما هي أداة الشرط في الجملة \"إذا ذهبت إلى محمد، فأخبره\"؟",
      "answers": [
        "ذهب",
        "أخبره",
        "إذا",
        "محمد"
      ],
      "correct_answer": "إذا"
    }
  ],
  "sentence_for_parsing": "لو كنت معك بالأمس، لأكرمتك"
}
    return JsonResponse(response)

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

def full_blank_view(request):
    
    response = [
    {
        "question": "الكتاب الذي على الطاولة ........؟",
        "answers": ['له', 'لها', 'لهم', 'لهن'],
        "correct": 'له'
    },
    {
        "question": "السيارة التي في المرآب ........؟",
        "answers": ['لهم', 'لها', 'له', 'لهن'],
        "correct": 'لها'
    },
    {
        "question": "البيت الذي على الجبل ........؟",
        "answers": ['له', 'لها', 'لهم', 'لكم'],
        "correct": 'له'
    },
    {
        "question": "الحديقة التي خلف البيت ........؟",
        "answers": ['لها', 'له', 'لهم', 'لنا'],
        "correct": 'لها'
    }
]
    return JsonResponse(response,safe=False)

def full_blank_view_new(request):
    qq = 'اريد منك توليد ٤ اسئلة مختصه في الاعراب والنحو في اللغه العربيه في داتا json واريدها ان تحتوي على question(ستكون قريبه لهذا السوال : "الكتاب الذي على الطاولة ........؟) answers(ستكون اربعه اجابات وتاكد ان لا يوجد اجابتين صحيحه فقط واحده صحيحه array وستكون قريبه للاجوبه التي مثل : لها - لهم - له زي كذا) correct(الاجابه الصحيحه)'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)

def rapid_challange_view(request):
    
    response = [
    {
        "question": "ما إعراب كلمة 'الكتاب' في الجملة التالية: 'قرأتُ الكتابَ'؟",
        "options": [
            {
                "option": "مفعول به منصوب وعلامة نصبه الفتحة الظاهرة",
                "is_correct": True
            },
            {
                "option": "فاعل مرفوع وعلامة رفعه الضمة",
                "is_correct": False
            }
        ]
    },
    {
        "question": "ما إعراب كلمة 'الطالب' في الجملة التالية: 'نجح الطالبُ'؟",
        "options": [
            {
                "option": "فاعل مرفوع وعلامة رفعه الضمة",
                "is_correct": True
            },
            {
                "option": "مفعول به منصوب وعلامة نصبه الفتحة",
                "is_correct": False
            }
        ]
    },
    {
        "question": "ما إعراب كلمة 'المعلم' في الجملة التالية: 'أكرمتُ المعلمَ'؟",
        "options": [
            {
                "option": "مفعول به منصوب وعلامة نصبه الفتحة",
                "is_correct": True
            },
            {
                "option": "مبتدأ مرفوع وعلامة رفعه الضمة",
                "is_correct": False
            }
        ]
    },
    {
        "question": "ما إعراب كلمة 'العلماء' في الجملة التالية: 'احترمتُ العلماءَ'؟",
        "options": [
            {
                "option": "مفعول به منصوب وعلامة نصبه الفتحة",
                "is_correct": True
            },
            {
                "option": "خبر مرفوع وعلامة رفعه الضمة",
                "is_correct": False
            }
        ]
    },
    {
        "question": "ما إعراب كلمة 'الدرس' في الجملة التالية: 'فهمتُ الدرسَ'؟",
        "options": [
            {
                "option": "مفعول به منصوب وعلامة نصبه الفتحة",
                "is_correct": True
            },
            {
                "option": "فاعل مرفوع وعلامة رفعه الضمة",
                "is_correct": False
            }
        ]
    }
]
    return JsonResponse(response,safe=False)

def rapid_challange_view_new(request):
    qq = 'اريد منك توليد داتا json  ستحتوي على 5 اسئلة في الإعراب في اللغة العربية question(السوال سيكون بهذا الشكل  : ماإعراب كلمه "كلمه" في جملة "جمله" ) options(سيكون خيارين ،كل خيار يحتوي على options, is_correct)'
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

def cards_view_new(request):
    old_data = { "sentence": "الطالب يقرأ الكتاب في المكتبة", "options": [ { "option": "الطالب", "droppableId": "الطالب", "parsing": "فاعل", }, { "option": "يقرأ", "droppableId": "يقرأ", "parsing": "فعل مضارع" }, { "option": "الكتاب", "droppableId": "الكتاب", "parsing": "مفعول به" }, { "option": "في المكتبة", "droppableId": "في المكتبة", "parsing": "جار ومجرور" } ] }
    qq = f'اريد منك توليد سؤال في الاعراب والنحو في اللغة العربية وصيغة السوال مع الاجابات والرد يكون داتا json شبيهه لهذي الداتا مع تغير السوال والاجابات وتاكد ان يكون اربع اجابات {old_data}'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)

def daily_conversation_view_new(request):
    old_data = {"conversations": [{"text": "السلام عليكم، أود حجز طاولة لشخصين مساء اليوم","from": "client"},{"text": "وعليكم السلام، بالتأكيد. في أي وقت تفضل؟",},{"text": "في الساعة الثامنة مساءً، إذا كان ذلك ممكناً","from": "client"},{"text": "تمام، تم الحجز. هل لديك أي طلبات خاصة؟","from": "restaurant"},{"text": "نعم، أود طاولة بجانب النافذة، وأرجو أن يكون هناك قائمة طعام نباتية","from": "client"},{"text": "بالتأكيد، سيكون الطلب جاهزًا عند وصولك. شكرًا لتواصلك معنا","from": "restaurant"},], "questions": [{"question": "ما إعراب كلمة 'طاولة' في الجملة: 'أود حجز طاولة لشخصين مساء اليوم'؟","word_parsing": "طاولة"},{"question": "ما إعراب 'وقت' في الجملة: 'في أي وقت تفضل'؟","word_parsing": "وقت"},{"question": "ما إعراب كلمة 'نافذة' في الجملة: 'أود طاولة بجانب النافذة'؟","word_parsing": "نافذة"},{"question": "ما إعراب 'قائمة' في الجملة: 'أرجو أن يكون هناك قائمة طعام نباتية'؟","word_parsing": "قائمة"}]}   
    qq = f'اريد منك توليد داتا json واجعل الرد فقط json بدون اي تفاصيل اضافية واريد الداتا تكون شبيهه لهذه الداتا ولكن مع تغير الكلام وتاكد ان تكون المحادثة بين مطعم وعميل وايضا تاكد من تغير الكلمات الاعرابية والاسئلة {old_data}'
    try:
        response = ask_ai(qq)
    except:
        response = None
    resp = {"resp": response}
    return JsonResponse(resp, safe=False)
def daily_conversation(request):
    response = {
        "conversations": [
            {
                "text": "السلام عليكم، أود حجز طاولة لشخصين مساء اليوم",
                "from": "client"
            },
            {
                "text": "وعليكم السلام، بالتأكيد. في أي وقت تفضل؟",
                "from": "restaurant"
            },
            
            {
                "text": "في الساعة الثامنة مساءً، إذا كان ذلك ممكناً",
                "from": "client"
            },
            {
                "text": "تمام، تم الحجز. هل لديك أي طلبات خاصة؟",
                "from": "restaurant"
            },

            {
                "text": "نعم، أود طاولة بجانب النافذة، وأرجو أن يكون هناك قائمة طعام نباتية",
                "from": "client"
            },
            {
                "text": "بالتأكيد، سيكون الطلب جاهزًا عند وصولك. شكرًا لتواصلك معنا",
                "from": "restaurant"
            },
            
            
        ],
        "questions": [
            {
            "question": "ما إعراب كلمة 'طاولة' في الجملة: 'أود حجز طاولة لشخصين مساء اليوم'؟",
            "word_parsing": "طاولة"
            },
            {
            "question": "ما إعراب 'وقت' في الجملة: 'في أي وقت تفضل'؟",
            "word_parsing": "وقت"
            },
            {
            "question": "ما إعراب كلمة 'نافذة' في الجملة: 'أود طاولة بجانب النافذة'؟",
            "word_parsing": "نافذة"
            },
            {
            "question": "ما إعراب 'قائمة' في الجملة: 'أرجو أن يكون هناك قائمة طعام نباتية'؟",
            "word_parsing": "قائمة"
            }
        ]

    }   
    return JsonResponse(response,safe=False)


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
        json_resp = json.loads(msg_json)
        return json_resp
    except:
        None



@api_view(['POST'])
def rapid_challange_solve(request):
    data_array = request.data
    qq = f'سأرسل لك داتا json وهي عباره عن سوال في الاعراب واجابه خاطئه لذا اريدك ان ترسل داتا عباره عن question(السوال) answer(الاجابه الصحيحه) why(التوضيح) وتاكد من جعل الرد فقط json وهذه هي الداتا {data_array}'
    try:
        response = ask_ai(qq)
    except:
        response = None
    
    resp = {"resp": response}
    return JsonResponse(resp,safe=False)

@api_view(['POST'])
def full_blank_solve(request):
    data_array = request.data
    qq = f'سأرسل لك داتا json وهي عباره عن سوال في الاعراب والنحو واجابه خاطئه لذا اريدك ان ترسل داتا عباره عن question(السوال) answer(الاجابه الصحيحه) why(التوضيح) وتاكد من جعل الرد فقط json وهذه هي الداتا {data_array}'
    try:
        response = ask_ai(qq)
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

@api_view(['POST'])
def cards_solve(request):
    chooses = request.data['chooses']
    sentence = request.data['sentence']
    qq = f'لدي جمله في اللغة العربيه للاعراب "{sentence}" ولدي هذه الاجابات في شكل json لذا اريدك لن تتاكد من الاجابات اريد ان ترى اذا الكلمه واعرابها صحيح او لا "{chooses}" واريد ان يكون الرد فقط داتا json اريد الرد في هذا الشكل wrong_chooses(مصفوفه للكلمات التي كان اعرابها خاطئ وان لم يوجد فاجعلها فاضيه وان كان يوجد اجعل لكل item ان يحتوي على word(الكلمه) correct_parsing(الاعراب الصحيح) why(توضيح بسيط ليتم الفهم) ) وايضا is_all_correct(ستكون اما true او false)'
    try:
        response = ask_ai(qq)
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
    qq = f'اريد منك توليد رساله وهي تتعلق باللغه العربيه الاعراب والنحو وهذي الرساله اريد ان يوجد فيها بعض الاخطاء اللغوية والخ... لذااريد من المستخدم تصحيحها والسؤال التي ياتي للمستخدم {msg} ويرجي الرد فقط بصيغة json بهذا الشكل title(عنوان الدرس علي سبيل المثال "طلب تقرير مشروع") message(الرساله التي يوجد فيها الاخطاء) correct_errors(ماهي الاخطاء وتصحيحها) ويرجى لبرد json فقط لا اريد اي تفاصيل ثانيه'
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