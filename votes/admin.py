from django.contrib import admin
from .models import (
   Vote,
   Voter,
   Party,
   Candidate,
   VotingEvent,
   RegisteredVoter,
)

# Register your models here.

admin.site.register(Vote)
admin.site.register(Candidate)
admin.site.register(Party)
admin.site.register(VotingEvent)
admin.site.register(RegisteredVoter)