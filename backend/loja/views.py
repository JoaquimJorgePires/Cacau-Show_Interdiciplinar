from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Produto, Carrinho, Pedido
from .serializers import ProdutoSerializer, CarrinhoSerializer, PedidoSerializer
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


class CarrinhoViewSet(viewsets.ModelViewSet):
    queryset = Carrinho.objects.all()
    serializer_class = CarrinhoSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer


#  commit 02/05 #


@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # validação básica
    if not username or not password:
        return Response({"error": "Preencha todos os campos"}, status=400)

    # verificar se já existe
    if User.objects.filter(username=username).exists():
        return Response({"error": "Usuário já existe"}, status=400)

    # criar usuário
    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({"message": "Usuário criado com sucesso"})

#teste #

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({"message": "Login realizado com sucesso"})
    else:
        return Response({"error": "Usuário ou senha inválidos"}, status=400)
    
    #teste #

from rest_framework import viewsets
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer