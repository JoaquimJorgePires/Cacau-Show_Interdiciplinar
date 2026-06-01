/* produtos.js - versão final unificada com formulário pessoal + pagamento */
let estoqueCache = {};

let channelEstoque = null;

function iniciarRealtimeEstoque() {

  // fecha canal anterior (IMPORTANTE)
  if (channelEstoque) {
    supabaseClient.removeChannel(channelEstoque);
    channelEstoque = null;
  }

  channelEstoque = supabaseClient
    .channel('produtos-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'produtos'
      },
      async (payload) => {
        console.log("🔥 Estoque mudou:", payload);

        await carregarEstoque();
        validarCarrinhoComEstoque();
        renderCarrinho();
        aplicarEsgotadosNoDOM();
      }
    )
    .subscribe();
}

function atualizarTudoVisivel() {
  aplicarEsgotadosNoDOM();
  renderCarrinho();
}

async function carregarEstoque() {
  const { data, error } = await supabaseClient
    .from("produtos")
    .select("id, estoque");

  if (error) return;

  estoqueCache = {};

  data.forEach(p => {
    estoqueCache[p.id] = Number(p.estoque ?? 0);
  });

  aplicarEsgotadosNoDOM(); // ✅ AQUI dentro
}

// 👇 aplica visual nos cards já existentes
function aplicarEsgotadosNoDOM() {
  document.querySelectorAll('[data-id]').forEach(el => {

    if (!Object.keys(estoqueCache).length) return;

    const id = Number(el.dataset.id);
    const estoque = estoqueCache[id] ?? 0;

    const card = el.closest('.card, .product-card');
    if (!card) return;

    const btn = card.querySelector('.card-btn, .card__button, .add-cart');

    if (estoque <= 0) {
      card.classList.add('esgotado');
      if (btn) btn.style.display = "none";
    } else {
      card.classList.remove('esgotado');
      if (btn) btn.style.display = "block";
    }
  });
}
/* ------------------ LOGIN ------------------ */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  function atualizarBotao() {
    const logado = localStorage.getItem("logado") === "true";
    loginBtn.textContent = logado ? "Sair" : "Entrar";
  }
  atualizarBotao();

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const logado = localStorage.getItem("logado") === "true";
    if (!logado) {

      sessionStorage.setItem(
        "paginaAnterior",
        window.location.href
      );

      window.location.href = "login.html";

    } else {

      const modalLogout =
        document.getElementById("modalLogout");

      const cancelarLogout =
        document.getElementById("cancelarLogout");

      const confirmarLogout =
        document.getElementById("confirmarLogout");

      modalLogout.classList.add("show");

      cancelarLogout.onclick = () => {

        modalLogout.classList.remove("show");
      };

      confirmarLogout.onclick = () => {

        localStorage.removeItem("logado");

        atualizarBotao();

        window.location.reload();
      };
    }
  });
}

/* ------------------ HEADER STICKY ------------------ */
const header = document.querySelector("header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 80);
  });
}

/* ------------------ MENU MOBILE ------------------ */
const menu = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
if (menu) {
  menu.onclick = () => {
    menu.classList.toggle('bx-x');
    if (navbar) navbar.classList.toggle('open');
  };
}

/* ------------------ SLIDER DE PRODUTOS ------------------ */
const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

productContainers.forEach((item, i) => {
  try {
    let containerWidth = item.getBoundingClientRect().width;
    if (nxtBtn[i]) nxtBtn[i].addEventListener('click', () => item.scrollLeft += containerWidth);
    if (preBtn[i]) preBtn[i].addEventListener('click', () => item.scrollLeft -= containerWidth);
  } catch (e) { }
});

/* ------------------ ANIMAÇÃO HOVER PRODUTOS ------------------ */
const produtos = document.querySelectorAll('.product-card, .card');
produtos.forEach(produto => {
  produto.addEventListener('mouseenter', () => {
    produto.style.transform = 'scale(1.05)';
    produto.style.zIndex = '10';
  });
  produto.addEventListener('mouseleave', () => {
    produto.style.transform = 'scale(1)';
    produto.style.zIndex = '';
  });
});

/* ------------------ CARRINHO ------------------ */
let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");

const abrirCarrinhoBtn = document.getElementById("abrirCarrinho");
const carrinhoModal = document.getElementById("carrinhoModal");
const itensCarrinhoEl = document.getElementById("itensCarrinho");
const totalCarrinhoEl = document.getElementById("totalCarrinho");
const fecharCarrinhoBtn = document.getElementById("fecharCarrinho");
const comprarBtn = document.getElementById("comprarBtn");

/* ------------------ MODAL FORMULÁRIO PESSOAL ------------------ */
const formularioModal = document.getElementById("formularioCompra");
const fecharFormBtn = document.getElementById("fecharForm");
const compraForm = document.getElementById("compraForm");
const cpfInput = document.getElementById("cpf");
const telInput = document.getElementById("telefone");
const nomeInput = document.getElementById("nomeCliente");
const cepInput = document.getElementById("cep");
const formaPagamento = document.getElementById("formaPagamento");

/* ------------------ SOM E TOAST ------------------ */
const somAddCarrinho = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_3b8b962c64.mp3?filename=pop-94319.mp3");
somAddCarrinho.volume = 0.45;
function tocarSomAdd() { try { somAddCarrinho.currentTime = 0; somAddCarrinho.play().catch(() => { }); } catch (e) { } }
function mostrarMensagem(texto) {
  const existente = document.querySelector('.mensagem-add');
  if (existente) existente.remove();
  const msg = document.createElement('div');
  msg.className = 'mensagem-add'; msg.textContent = texto;
  document.body.appendChild(msg);
  setTimeout(() => msg.classList.add('show'), 50);
  setTimeout(() => { msg.classList.remove('show'); setTimeout(() => msg.remove(), 400); }, 2500);
}

/* ------------------ FUNÇÕES AUX ------------------ */
function parsePreco(texto) {
  if (!texto) return 0;
  let clean = texto.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}
function formatBRL(num) { return Number(num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

/* ------------------ RENDER CARRINHO ------------------ */

function mostrarToast(titulo, mensagem, tipo = "sucesso") {

  const toast =
    document.getElementById("toast");

  const toastTitulo =
    document.getElementById("toastTitulo");

  const toastMensagem =
    document.getElementById("toastMensagem");

  toastTitulo.innerText = titulo;

  toastMensagem.innerText = mensagem;

  toast.classList.remove("erro");

  if (tipo === "erro") {
    toast.classList.add("erro");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarEstoque();
  iniciarRealtimeEstoque();
});

function renderCarrinho() {
  if (!itensCarrinhoEl || !totalCarrinhoEl || !comprarBtn) return;
  itensCarrinhoEl.innerHTML = '';
  if (!carrinho.length) { itensCarrinhoEl.innerHTML = '<p>Seu carrinho está vazio.</p>'; totalCarrinhoEl.textContent = 'Total: R$ 0,00'; comprarBtn.style.display = 'none'; return; }

  const ul = document.createElement('ul'); ul.style.listStyle = 'none'; ul.style.padding = '0';
  carrinho.forEach((item, idx) => {
    const li = document.createElement('li'); li.style.display = 'flex'; li.style.justifyContent = 'space-between'; li.style.alignItems = 'center';
    li.style.margin = '8px 0'; li.style.padding = '8px'; li.style.borderRadius = '8px'; li.style.background = 'var(--first-color)'; li.style.color = 'var(--dark-color)';

    const left = document.createElement('div');
    left.innerHTML = `
  <strong style="font-size:15px">
    ${item.nome}
  </strong>

  <div style="
    font-size:13px;
    opacity:0.7;
    margin-top:4px;
  ">
    ${formatBRL(item.preco)} cada
  </div>
`;

    const right = document.createElement('div'); right.style.display = 'flex'; right.style.gap = '8px'; right.style.alignItems = 'center';

    const price = document.createElement('div');

    price.innerHTML = `
  <div style="
    display:flex;
    flex-direction:column;
    align-items:flex-end;
  ">
    <span style="
      font-size:13px;
      opacity:.6;
    ">
      ${formatBRL(item.preco)} cada
    </span>

    <strong style="
      color:#3bb77e;
      font-size:17px;
    ">
      ${formatBRL(item.preco * item.quantidade)}
    </strong>
  </div>
`;

    const controls = document.createElement('div');

    controls.style.display = 'flex';
    controls.style.alignItems = 'center';
    controls.style.gap = '12px';

    controls.style.padding = '7px 14px';

    controls.style.borderRadius = '18px';

    controls.style.background = `
  linear-gradient(
    135deg,
    rgba(255,255,255,.9),
    rgba(245,245,245,.7)
  )
`;

    controls.style.backdropFilter = 'blur(10px)';

    controls.style.border =
      '1px solid rgba(255,255,255,.5)';

    controls.style.boxShadow =
      '0 8px 25px rgba(0,0,0,.08)';

    const menosBtn = document.createElement('button');
    menosBtn.innerHTML = '−';

    const quantidadeSpan = document.createElement('span');

    quantidadeSpan.textContent = item.quantidade;

    quantidadeSpan.style.fontSize = '16px';
    quantidadeSpan.style.fontWeight = '700';

    quantidadeSpan.style.color = '#2D1B14';

    quantidadeSpan.style.minWidth = '18px';

    quantidadeSpan.style.textAlign = 'center';

    const maisBtn = document.createElement('button');
    maisBtn.innerHTML = '+';

    [menosBtn, maisBtn].forEach(btn => {

      btn.style.width = '34px';
      btn.style.height = '34px';

      btn.style.border = 'none';

      btn.style.borderRadius = '12px';

      btn.style.background = `
    linear-gradient(
      135deg,
      #8b5e3c,
     #ff9100
    )
  `;

      btn.style.color = 'white';

      btn.style.fontSize = '22px';

      btn.style.fontWeight = '500';

      btn.style.cursor = 'pointer';

      btn.style.display = 'flex';

      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';

      btn.style.transition = '.22s ease';

      btn.style.boxShadow =
        '0 6px 16px rgba(122, 75, 18, 0.28)';
    });

    menosBtn.onmouseenter =
      maisBtn.onmouseenter = (e) => {

        e.target.style.transform =
          'translateY(-2px) scale(1.05)';

        e.target.style.boxShadow =
          '0 10px 20px  rgba(216, 147, 7, 0.48)';
      };

    menosBtn.onmouseleave =
      maisBtn.onmouseleave = (e) => {

        e.target.style.transform =
          'translateY(0) scale(1)';

        e.target.style.boxShadow =
          '0 6px 16px rgba(173, 128, 4, 0.4)';
      };

    menosBtn.onclick = () => {

      item.quantidade -= 1;

      if (item.quantidade <= 0) {
        carrinho.splice(idx, 1);
      }

      localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
      );

      renderCarrinho();
    };

    maisBtn.onclick = () => {

      const estoqueAtual =
        estoqueCache[item.id] ?? 0;

      if (item.quantidade >= estoqueAtual) {

        mostrarToast(
          "Estoque insuficiente 🍫",
          `Só temos ${estoqueAtual} unidade(s) de ${item.nome} disponíveis no momento.`,
          "erro"
        );

        return;
      }

      item.quantidade += 1;

      localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
      );

      renderCarrinho();
    };

    controls.appendChild(menosBtn);
    controls.appendChild(quantidadeSpan);
    controls.appendChild(maisBtn);

    right.appendChild(price);
    right.appendChild(controls);

    li.appendChild(left);
    li.appendChild(right);

    ul.appendChild(li);
  });

  itensCarrinhoEl.appendChild(ul);

  const total = carrinho.reduce(
    (s, it) =>
      s + (Number(it.preco || 0) * (it.quantidade || 1)),
    0
  );

  totalCarrinhoEl.textContent =
    `Total: ${formatBRL(total)}`;

  comprarBtn.style.display = 'block';
}
/* ------------------ ABRIR/FECHAR MODAIS ------------------ */
function abrirCarrinho() { renderCarrinho(); if (carrinhoModal) { carrinhoModal.style.display = 'flex'; carrinhoModal.setAttribute('aria-hidden', 'false'); } }
function fecharCarrinho() { if (carrinhoModal) { carrinhoModal.style.display = 'none'; carrinhoModal.setAttribute('aria-hidden', 'true'); } }
function abrirFormulario() { fecharCarrinho(); if (formularioModal) { formularioModal.style.display = 'flex'; formularioModal.setAttribute('aria-hidden', 'false'); } }
function fecharFormulario() { if (formularioModal) { formularioModal.style.display = 'none'; formularioModal.setAttribute('aria-hidden', 'true'); } }

if (abrirCarrinhoBtn) abrirCarrinhoBtn.addEventListener('click', abrirCarrinho);
if (fecharCarrinhoBtn) fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);
if (comprarBtn) comprarBtn.addEventListener('click', abrirFormulario);
if (fecharFormBtn) fecharFormBtn.addEventListener('click', fecharFormulario);

window.addEventListener('click', (e) => {
  if (e.target === carrinhoModal) fecharCarrinho();
  if (e.target === formularioModal) fecharFormulario();
});

/* ------------------ MÁSCARAS ------------------ */
function mascaraCPF(v) {
  v = v.replace(/\D/g, "");         // Remove tudo que não é número
  v = v.substring(0, 11);           // Limita a 11 dígitos
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

function mascaraTel(v) {
  v = v.replace(/\D/g, "");         // Remove tudo que não é número
  v = v.substring(0, 11);           // Limita a 11 dígitos (DDD + número)
  if (v.length <= 10) {
    // Telefone fixo
    v = v.replace(/(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{4})(\d{0,4})$/, "$1-$2");
  } else {
    // Celular (com o 9)
    v = v.replace(/(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
  }
  return v;
}

// mantém exatamente igual
if (cpfInput) cpfInput.addEventListener('input', (e) => e.target.value = mascaraCPF(e.target.value));
if (telInput) telInput.addEventListener('input', (e) => e.target.value = mascaraTel(e.target.value));

if (cepInput) {
  cepInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = v.substring(0, 9);
  });
}

/* ------------------ SUBMISSÃO FORMULÁRIO PESSOAL ------------------ */
if (compraForm) compraForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!nomeInput.value.trim() || !cpfInput.value.trim() || !telInput.value.trim() || !cepInput.value.trim() || !formaPagamento.value) {
    alert('Preencha todos os campos corretamente.');
    return;
  }
  // Após dados preenchidos, abre modal de pagamento
  fecharFormulario();
  abrirPagamento();
});

/* ------------------ ADICIONAR AO CARRINHO ------------------ */
function adicionarAoCarrinho(id, nome, preco, info = '') {
  const logado = loginBtn && loginBtn.textContent.trim().toLowerCase() === 'sair';
  if (!logado) {

    mostrarToast(
      "Login Necessário 🔒",
      "Você precisa estar logado para adicionar ao carrinho!",
      "erro"
    );

    setTimeout(() => {
      sessionStorage.setItem(
        "paginaAnterior",
        window.location.href
      );

      window.location.href = "login.html";
    }, 1800);

    return;
  }

  let categoria = "";

  if (nome.includes("Trufa")) categoria = "Trufa";
  else if (nome.includes("Tablete")) categoria = "Tablete";
  else if (
    nome.includes("Café") ||
    nome.includes("Cappuccino") ||
    nome.includes("Milk")
  ) categoria = "Espaço Café";

  const quantidadeNoCarrinho = carrinho
    .filter(p => p.id === id)
    .reduce((total, item) =>
      total + (item.quantidade || 1), 0);

  const estoqueAtual = estoqueCache[id] ?? 0;

  if (quantidadeNoCarrinho >= estoqueAtual) {

    mostrarToast(
      "Limite de estoque 🍫",
      `Você já adicionou todas as ${estoqueAtual} unidade(s) disponíveis de ${nome}.`,
      "erro"
    );

    return;
  }

  const existente = carrinho.find(p => p.id === Number(id));

  if (existente) {

    existente.quantidade += 1;

  } else {

    carrinho.push({
      id: Number(id),
      nome,
      preco,
      quantidade: 1,
      categoria
    });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  tocarSomAdd(); mostrarMensagem('Item adicionado ao carrinho!');
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest(
    '.card-btn,.card__button,a.card__button,[data-add-cart],.add-cart'
  );

  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const card = btn.closest('.card, .product-card');
  if (!card) return;

  const produto_id = Number(
    card.dataset.id ||
    card.querySelector('[data-id]')?.dataset.id
  );

  console.log("CLICK ID:", produto_id);

  if (!produto_id) return;

  const estoque = estoqueCache[produto_id] ?? 0;

  console.log("ESTOQUE:", estoque);

  // 🔴 bloqueio de estoque
  if (estoque <= 0) {
    mostrarToast("Esgotado", "Produto sem estoque", "erro");
    return;
  }

  const nomeEl = card.querySelector('.card__title, h3');

  const precoEl =
    card.querySelector('.price, .preco, .card__price, .card__preci, span');

  const nome =
    nomeEl?.textContent?.trim() || "Produto";

  let preco = 0;

  if (precoEl) {
    const raw = precoEl.textContent.trim();
    preco = parsePreco(raw);
  }

  console.log({ nome, rawPreco: precoEl?.textContent, preco });

  adicionarAoCarrinho(produto_id, nome, preco);
});
/* ------------------ MODAL PAGAMENTO ------------------ */
function abrirPagamento() {

  const pagamentoModal = document.createElement('div');

  pagamentoModal.classList.add('pagamento-modal');

  pagamentoModal.style.cssText = `
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background: rgba(0,0,0,0.6);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:10000;
    `;

  pagamentoModal.innerHTML = `

      <div class="pagamento-content" style="
        background:#fff;
        padding:20px;
        border-radius:10px;
        text-align:center;
        max-width:400px;
        width:80%;
      ">

        <h2>Formas de Pagamento</h2>

        <select id="tipoPagamento" style="margin-top:10px;padding:5px;">

          <option value="">Selecione</option>

          <option value="credito">
            Cartão de Crédito
          </option>

          <option value="debito">
            Cartão de Débito
          </option>

          <option value="pix">
            Pix
          </option>

        </select>

        <div id="detalhesPagamento" style="margin-top:15px;"></div>

        <button id="confirmarPagamento" style="
          margin-top:15px;
          padding:10px 15px;
          background:#3bb77e;
          color:#fff;
          border:none;
          border-radius:8px;
          cursor:pointer;
        ">
          Confirmar Pagamento
        </button>

      </div>
    `;

  document.body.appendChild(pagamentoModal);

  const tipoPagamento =
    pagamentoModal.querySelector('#tipoPagamento');

  const detalhesPagamento =
    pagamentoModal.querySelector('#detalhesPagamento');

  const confirmarPagamento =
    pagamentoModal.querySelector('#confirmarPagamento');

  tipoPagamento.addEventListener('change', () => {

    detalhesPagamento.innerHTML = '';

    if (
      tipoPagamento.value === 'credito' ||
      tipoPagamento.value === 'debito'
    ) {

      detalhesPagamento.innerHTML = `

              <input
                type="text"
                id="numeroCartao"
                placeholder="Número do cartão"
                style="width:90%;padding:8px;margin-bottom:8px;"
              ><br>

              <input
                type="text"
                id="cvv"
                placeholder="CVV"
                style="width:90%;padding:8px;margin-bottom:8px;"
              ><br>

              <input
                type="text"
                id="validade"
                placeholder="Validade (MM/AA)"
                style="width:90%;padding:8px;margin-bottom:8px;"
              ><br>

              <input
                type="text"
                placeholder="Nome do titular"
                style="width:90%;padding:8px;"
              >
            `;

      // INPUTS
      const numeroCartao =
        document.getElementById("numeroCartao");

      const validade =
        document.getElementById("validade");

      const cvv =
        document.getElementById("cvv");

      // MÁSCARA CARTÃO
      numeroCartao.addEventListener("input", (e) => {

        let v = e.target.value.replace(/\D/g, "");

        v = v.substring(0, 16);

        v = v.replace(/(\d{4})(?=\d)/g, "$1 ");

        e.target.value = v.trim();
      });

      // MÁSCARA VALIDADE
      validade.addEventListener("input", (e) => {

        let v = e.target.value.replace(/\D/g, "");

        v = v.substring(0, 4);

        if (v.length >= 3) {

          v = v.replace(
            /(\d{2})(\d{1,2})/,
            "$1/$2"
          );
        }

        e.target.value = v;
      });

      // MÁSCARA CVV
      cvv.addEventListener("input", (e) => {

        let v = e.target.value.replace(/\D/g, "");

        e.target.value = v.substring(0, 4);
      });

    }

    else if (tipoPagamento.value === 'pix') {

      const codigoPix =
        "PIX-" +
        Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();

      detalhesPagamento.innerHTML = `
              <p>Código Pix:</p>
              <strong>${codigoPix}</strong>
            `;
    }

  });

  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "loadingPagamento";
  loadingOverlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

  loadingOverlay.innerHTML = `
  <div style="text-align:center">
    ⏳<br>
    Efetuando pagamento...
  </div>
`;

  document.body.appendChild(loadingOverlay);

  confirmarPagamento.addEventListener('click', async () => {

    // VALIDAR ESTOQUE ANTES DA COMPRA
    for (const item of carrinho) {

      const estoqueAtual =
        estoqueCache[item.id] ?? 0;

      if (item.quantidade > estoqueAtual) {

        mostrarToast(
          "Estoque insuficiente",
          `${item.nome} não possui estoque suficiente.`,
          "erro"
        );

        return;
      }
    }

    loadingOverlay.style.display = "flex";

    console.log("clicou no pagamento");

    loadingOverlay.style.display = "flex";

    console.log("clicou no pagamento");

    // 1. criar pedido
    const total = carrinho.reduce(
      (s, i) =>
        s + (Number(i.preco) * (i.quantidade || 1)),
      0
    );

    const nomeCliente = nomeInput.value.trim();

    const { data: cliente, error: erroCliente } = await supabaseClient
      .from("clientes")
      .insert([{ nome: nomeCliente }])
      .select()
      .single();

    if (erroCliente) {
      console.error("Erro cliente:", erroCliente);
      return;
    }

    const { data: pedido, error: erroPedido } = await supabaseClient
      .from("pedidos")
      .insert([{
        cliente_id: cliente.id,
        data: new Date().toISOString(),
        total,
        status: "pendente"
      }])
      .select("*, clientes(nome)");

    if (erroPedido) {
      console.error("Erro ao criar pedido:", erroPedido);
      loadingOverlay.style.display = "none";
      alert("Erro ao criar pedido");
      return;
    }

    // 2. salvar itens do carrinho
    const pedidoId = pedido[0].id;

    const itens = carrinho.map(item => ({
      pedido_id: pedidoId,
      produto_id: item.id,
      quantidade: item.quantidade || 1,
      preco_unitario: item.preco,
      categoria: item.categoria,
      nome_produto: item.nome
    }));

    const { error: erroItens } = await supabaseClient
      .from("itens_pedido")
      .insert(itens);

    if (erroItens) {
      console.log("Erro ao salvar itens:", erroItens);
      loadingOverlay.style.display = "none";
      return;
    }

    // 3. atualizar estoque (VERSÃO CORRETA)
    for (let item of carrinho) {
      const { error } = await supabaseClient.rpc("decrementar_estoque", {
        produto_id: item.id,
        qtd: item.quantidade
      });

      if (error) {
        console.error("Erro ao atualizar estoque:", error);
      }
    }

    // 4. limpar carrinho
    carrinho = [];
    localStorage.removeItem("carrinho");

    renderCarrinho();

    document.querySelector('.pagamento-modal')?.remove();

    mostrarToast(
      "Pedido confirmado 🍫",
      "Sua compra foi enviada para o sistema!",
      "sucesso"
    );
    loadingOverlay.style.display = "none";
  });

  // CARROSSEL ESPAÇO CAFÉ
  document.addEventListener("DOMContentLoaded", () => {
    const containerCafe = document.querySelector(".espaco-cafe .product-container");
    const btnEsquerda = document.querySelector(".seta-esquerda");
    const btnDireita = document.querySelector(".seta-direita");
    const bolinhas = document.querySelectorAll(".bolinhas span");

    if (!containerCafe || !btnEsquerda || !btnDireita) {
      console.log("Carrossel do Espaço Café não encontrado.");
      return;
    }

    let indiceAtual = 0;

    function larguraCard() {
      const card = containerCafe.querySelector(".product-card");
      return card.offsetWidth + 30;
    }

    function atualizarBolinhas() {
      bolinhas.forEach((bolinha, index) => {
        bolinha.classList.toggle("ativo", index === indiceAtual);
      });
    }

    btnDireita.addEventListener("click", () => {
      const totalCards = containerCafe.querySelectorAll(".product-card").length;

      indiceAtual++;

      if (indiceAtual >= totalCards) {
        indiceAtual = 0;
        containerCafe.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      } else {
        containerCafe.scrollBy({
          left: larguraCard(),
          behavior: "smooth"
        });
      }

      atualizarBolinhas();
    });


    btnEsquerda.addEventListener("click", () => {
      const totalCards = containerCafe.querySelectorAll(".product-card").length;

      indiceAtual--;

      if (indiceAtual < 0) {
        indiceAtual = totalCards - 1;
        containerCafe.scrollTo({
          left: containerCafe.scrollWidth,
          behavior: "smooth"
        });
      } else {
        containerCafe.scrollBy({
          left: -larguraCard(),
          behavior: "smooth"
        });
      }

      atualizarBolinhas();
    });

    bolinhas.forEach((bolinha, index) => {
      bolinha.addEventListener("click", () => {
        indiceAtual = index;

        containerCafe.scrollTo({
          left: larguraCard() * index,
          behavior: "smooth"
        });

        atualizarBolinhas();
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarEstoque();
  iniciarRealtimeEstoque();
});

function validarCarrinhoComEstoque() {
  carrinho = carrinho.filter(item => {
    const estoque = estoqueCache[item.id] ?? 0;
    return item.quantidade <= estoque;
  });

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}