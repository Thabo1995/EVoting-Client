from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import PROTECT

# Create your models here.


class Voter(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    voting_token = models.CharField(PROTECT,editable=True,max_length=256)


    def __str__(self) -> str:
        return self.user.username


