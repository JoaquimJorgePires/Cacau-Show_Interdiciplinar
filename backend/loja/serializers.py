# loja/serializers.py

from rest_framework import serializers
from .models import Produto, Carrinho, Pedido

#commit 03

from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):  #commit 02
    class Meta:
        model = Feedback
        fields = '__all__'

        

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'


class CarrinhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrinho
        fields = '__all__'


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'