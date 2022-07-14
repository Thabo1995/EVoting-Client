from voter.models import Voter
from rest_framework import serializers
from rest_framework.relations import HyperlinkedRelatedField
from .models import (
   RegisteredVoter,
   Vote,
   Voter,
   Party,
   Candidate,
   VotingEvent,
   RegisteredVoter,
)
from django.contrib.auth.models import User
from drf_extra_fields.fields import Base64ImageField


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = (
            'voting_event',
            'voter',
            'party'
            )


class VotingEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = VotingEvent
        fields = (
            'id',
            'title',
            'date_of_event',
            'date_of_event_registration',
            'closing_date_of_event_registration',
            'is_closed',
            )




class PartySerializer(serializers.ModelSerializer):

    class Meta:
        model = Party
        fields = (
            'id',
            'name',
            'short_name',
            'logo',
            )


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = (
            'name',
            'party',
            'of_type',
            )


class RegisteredSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisteredVoter
        fields = (
            'id',
            'voting_event',
            'string',
            'user'
            )



class UserSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'pk',
            'email',
            'username',
            'first_name',
            'last_name',
        ]
