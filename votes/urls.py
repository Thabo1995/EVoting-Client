from django.conf.urls import include
from votes.models import RegisteredVoter
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import (
    PartyViewSet,
    CandidateViewSet,
    ResultsViewSet,
    UserViewSet,
    VoteViewSet,
    VotingEventViewSet,
    RegisteredVoterViewSet,
    check_registration_status,
    validate_username,
    check_registration_status
    )


api_router = DefaultRouter()

api_router.register('parties',PartyViewSet)
api_router.register('candidates',CandidateViewSet)
api_router.register('voting/event',VotingEventViewSet)
api_router.register('voting/register',RegisteredVoterViewSet)
api_router.register('voting/vote',VoteViewSet)

urlpatterns = [
    path('',include(api_router.urls)),
    path('validate-username/<slug:username>/', validate_username,name='validate_username'),
    path('check-status/<slug:username>/', check_registration_status,name='validate_username'),
    path('user-details/', UserViewSet.as_view()),
    path('voting-results/', ResultsViewSet.as_view(),name="get_voting_results"),
]
