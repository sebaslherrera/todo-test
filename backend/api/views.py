from django.shortcuts import render
from . import models
from django.http import JsonResponse
from . import serializers
from . import models
from rest_framework import viewsets

# Create your views here.
def todo_list(request):
  res = []
  
  for todo in Todo.objects.all():
    res.append({ 'name': Todo.name })

  return JsonResponse(result)


class TodoViewSet(viewsets.ModelViewSet):
  serializer_class = serializers.TodoSerializer
  queryset = models.Todo.objects.all()