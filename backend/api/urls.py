from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('register/',RegisterView.as_view()),

    path('lessons/',LessonsView.as_view()),

    path('join-lesson/',JoinLesson.as_view()),
    path('my-lessons/',MyLessons.as_view()),

    path('profile/',ProfileView.as_view()),

    path('lesson/',lesson_view),
    path('full-blank/',full_blank_view_new),
    path('rapid-challange/',rapid_challange_view_new),
    path('report/',report_view),
    path('cards/',cards_view_new),
    path('daily-conversation/',daily_conversation_view_new),

    path('lesson/<int:pk>/',lesson_view_new),
    path('lesson-old/',lesson_view),


    path('rapid-challenge-solve/',rapid_challange_solve),
    path('full-blank-solve/',full_blank_solve),
    path('daily-conversation-solve/',daily_conversation_solve),
    path('cards-solve/',cards_solve),
    path('lesson-solve/',lesson_solve),
    path('gmail-solve/',gmail_solve),
    path('chooses-solve/',chooses_solve),

    #path('voice/<int:pk>/',voice_view),
    path('voice/<int:pk>/',voice_view_new),

    path('video/<int:pk>/',lesson_video),

    path('gmail/',gmail_view),

    path('tested/',tested),

    path('summary/',UserSummaryView.as_view()),
    path('summary/<int:id>/',summary_view),
    
]