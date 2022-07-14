from django.contrib.auth.models import User
from django.db import models
from voter.models import Voter

# Create your models here.


class Party(models.Model):
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=10)
    logo = models.ImageField(verbose_name='party_logo',default='/image/none.png')
    

    def __str__(self) -> str:
        return self.name

class Candidate(models.Model):
     name = models.CharField(max_length=50)
     party = models.ForeignKey(Party,null=True,on_delete=models.SET_NULL)
     of_type = models.CharField(max_length=20)


     def __str__(self) -> str:
         return self.name + ' - ' + self.party.name


class VotingEvent(models.Model):
    title = models.CharField(max_length=300)
    date_of_event = models.DateField()
    date_of_event_registration = models.DateField()
    closing_date_of_event_registration = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    is_closed = models.BooleanField(default=False)


    def __str__(self) -> str:
        return self.title


class RegisteredVoter(models.Model):
    voting_event = models.ForeignKey(VotingEvent, on_delete=models.CASCADE)
    string = models.CharField(max_length=300)
    user = models.ForeignKey(User,on_delete=models.CASCADE)


class Vote(models.Model):
    voting_event = models.ForeignKey(VotingEvent, on_delete=models.CASCADE)
    voter = models.ForeignKey(RegisteredVoter, unique=True, on_delete=models.CASCADE)
    party = models.ForeignKey(Party, on_delete=models.CASCADE)
    