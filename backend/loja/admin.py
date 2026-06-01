from django.contrib import admin
from .models import Produto, Carrinho, CarrinhoItem, Pedido, PedidoItem, Feedback

admin.site.register(Produto)
admin.site.register(Carrinho)
admin.site.register(CarrinhoItem)
admin.site.register(Pedido)
admin.site.register(PedidoItem)
admin.site.register(Feedback) # commit 02/05
class FeedbackAdmin(admin.ModelAdmin): # commit 02/05
    list_display = ('nome', 'mensagem', 'imagem') # commit 02/05