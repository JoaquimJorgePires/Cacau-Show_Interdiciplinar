# loja/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, CarrinhoViewSet, PedidoViewSet

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)
router.register(r'carrinho', CarrinhoViewSet)
router.register(r'pedidos', PedidoViewSet)

 #commit 02/05
from .views import register_view, FeedbackViewSet
router = DefaultRouter()   
router.register(r'feedbacks', FeedbackViewSet)

urlpatterns = [
     path('register/', register_view),
     path('', include(router.urls)),
]




from .views import login_view

urlpatterns += [
    path('login/', login_view),
]
