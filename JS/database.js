//DATABASE PARA TESTES DO ADMIN

// PEDIDOS
function pegarPedidos() {

    return JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];

}

function salvarPedidos(lista) {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(lista)
    );

}

function adicionarPedido(produto) {

    const pedidos = pegarPedidos();

    pedidos.push(produto);

    salvarPedidos(pedidos);

}

// CARRINHO
function pegarCarrinho() {

    return JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];

}

function salvarCarrinho(lista) {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(lista)
    );

}

function adicionarCarrinho(produto) {

    const carrinho = pegarCarrinho();

    carrinho.push(produto);

    salvarCarrinho(carrinho);

}