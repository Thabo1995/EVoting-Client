import json
from typing import Match
from django.db.models.aggregates import Count, Max
from django.db.models.query_utils import Q
from django.shortcuts import render, get_object_or_404
from .models import (
   Vote,
   Voter,
   Party,
   Candidate,
   VotingEvent,
   RegisteredVoter,
)

from rest_framework import viewsets , serializers
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.generic import View
from .serializers import PartySerializer, RegisteredSerializer, UserSerializers,VoteSerializer,CandidateSerializer, VotingEventSerializer
from django.http.response import JsonResponse
from datetime import datetime
from rest_framework import status


class PartyViewSet(viewsets.ModelViewSet):
    """
    A view that returns the political parties in JSON.
    """
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    filter_backends = (DjangoFilterBackend,)
    http_method_names = ['get']


class CandidateViewSet(viewsets.ModelViewSet):
    """
    A view that returns the candidates in JSON.
    """
    
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    filter_backends = (DjangoFilterBackend,)
    http_method_names = ['get']



class VoteViewSet(viewsets.ModelViewSet):
    """
    A view for voting
    """
    authentication_classes = (SessionAuthentication, BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    filter_backends = (DjangoFilterBackend,)
    http_method_names = ['post']


class RegisteredVoterViewSet(viewsets.ModelViewSet):
    """
    A view for voting
    """
    authentication_classes = (SessionAuthentication, BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    queryset = RegisteredVoter.objects.all()
    serializer_class = RegisteredSerializer
    filter_backends = (DjangoFilterBackend,)


    def get_queryset(self):
        user = self.request.user
        return RegisteredVoter.objects.filter(user=user)



class VotingEventViewSet(viewsets.ModelViewSet):
    """
    A view for latest voting event.
    """
    queryset = VotingEvent.objects.exclude(date_of_event__lt=datetime.now())[:1]
    serializer_class = VotingEventSerializer
    filter_backends = (DjangoFilterBackend,)
    http_method_names = ['get']


def validate_username(request,username):
    """Check username availability"""
    response = {
        'username_is_taken': User.objects.filter(username__iexact=username).exists(),
        # 'email_is_taken': User.objects.filter(email__iexact=email).exists()
    }

    print(response)
    return JsonResponse(data=response)
    

def check_registration_status(request,username):
    """Check username availability"""
    
    latest_voting_event = VotingEvent.objects.exclude(
        date_of_event__lt=datetime.now())[:1]
    response = {
        'username_exist': User.objects.filter(username__iexact=username).exists(),
        'registered_to_vote': RegisteredVoter.objects.filter(user__username__iexact=username,voting_event=latest_voting_event[0].pk).exists(),

    }

    print(response)
    return JsonResponse(data=response)


class UserViewSet(APIView):
    serializer_class = UserSerializers
    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
        SessionAuthentication,
    ]
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']

    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        user = request.user.username
        user_details = get_object_or_404(User,username=user)
        
        data = {
            'pk': user_details.pk,
            'username': user_details.username,
            'email': user_details.email,
            'first_name': user_details.first_name,
            'last_name': user_details.last_name,
            'last_login': user_details.last_login,
        }
        return Response(data,status=status.HTTP_200_OK)


class ResultsViewSet(APIView):
    
    def get(self, request, format=None):
        """
        Returns the results of different voting events.
        Query excludes dates greater than now and if its not closed.
        """
        parties = Party.objects.filter(
        ).prefetch_related()
        
        voting_event = parties.values('vote__voting_event').last()
        votes = parties.exclude(
            vote__voting_event__date_of_event__gt=datetime.now(),
            vote__voting_event__is_closed = False
        ).annotate(number_of_votes=Count('vote')).values(
            'name',
            'short_name',
            'logo',
            'number_of_votes',
            'vote__voting_event',
        ).order_by('-number_of_votes')
        


        data = list(votes)
        print(data)
        new_data = []
        sum = 0
        for d in data:
            sum = sum + d['number_of_votes']
            
        for d in data:
            d['vote_percentage'] = d['number_of_votes'] / sum * 100
            new_data.append(d)
        
        new_data = sorted(new_data, key=lambda d: d['number_of_votes']) 

        return Response(new_data,status=status.HTTP_200_OK)

