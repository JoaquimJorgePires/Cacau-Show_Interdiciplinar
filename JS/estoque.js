const categoriasCache = {
  1: "Páscoa",
  2: "Trufas",
  3: "Tabletes",
  7: "Espaço Café"
};

document.addEventListener("DOMContentLoaded", () => {
  carregarEstoque();
  carregarPedidos();
});

// ================= ESTOQUE =================

async function carregarEstoque() {
  const { data, error } = await supabaseClient
    .from("produtos")
    .select("*")
    .order("id");

  if (error) return console.error(error);

  renderTabelaEstoque(data);
  atualizarStats(data);
}

function renderTabelaEstoque(produtos) {
  const tbody = document.querySelector(".inventory-table tbody");
  tbody.innerHTML = "";

  produtos.forEach(p => {

    const status =
      p.estoque <= 0 ? "Esgotado"
      : p.estoque < 10 ? "Crítico"
      : "Em dia";

    const statusClass =
      p.estoque <= 0 ? "low"
      : p.estoque < 10 ? "low"
      : "high";

    const categoria = categoriasCache[p.categoria_id] || "-";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${categoria}</td>
      <td>R$ ${Number(p.preco || 0).toFixed(2)}</td>
      <td>${p.estoque}</td>

      <td>
        <span class="stock-tag ${statusClass}">
          ${status}
        </span>
      </td>

      <td>-</td>

      <td>
        <div class="stock-controls">
          <input type="number" min="1" value="1" class="qty">
          <button class="btn-add-stock" data-id="${p.id}">
            Adicionar
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// evento único (ESTOQUE)
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-add-stock");
  if (!btn) return;

  const row = btn.closest("tr");
  const qtd = Number(row.querySelector(".qty").value);
  const id = Number(btn.dataset.id);

  if (qtd <= 0) return;

  const { data } = await supabaseClient
    .from("produtos")
    .select("estoque")
    .eq("id", id)
    .single();

  await supabaseClient
    .from("produtos")
    .update({ estoque: data.estoque + qtd })
    .eq("id", id);

  carregarEstoque();
});

function atualizarStats(produtos) {
  const total = produtos.reduce((a, p) => a + (p.estoque || 0), 0);
  const baixo = produtos.filter(p => p.estoque > 0 && p.estoque < 10).length;
  const esgotado = produtos.filter(p => (p.estoque || 0) <= 0).length;
  const emDia = produtos.filter(p => p.estoque >= 10).length;

  const stats = document.querySelectorAll(".stat-item strong");

  stats[0].textContent = total;
  stats[1].textContent = baixo;
  stats[2].textContent = esgotado;
  stats[3].textContent = emDia;
}

// 🔧 opcional (editar estoque rápido)
async function editarEstoque(id, atual) {
  const novo = prompt("Novo estoque:", atual);

  if (novo === null) return;

  const { error } = await supabaseClient
    .from("produtos")
    .update({ estoque: Number(novo) })
    .eq("id", id);

  if (error) {
    alert("Erro ao atualizar estoque");
    return;
  }

  carregarEstoque();
}

async function adicionarEstoque(produtoId, quantidade = 1) {
  const { error } = await supabaseClient
    .from("produtos")
    .update({
    });

  const { data, error: err } = await supabaseClient
    .from("produtos")
    .select("estoque")
    .eq("id", produtoId)
    .single();

  if (err) {
    console.error(err);
    return;
  }

  const novoEstoque = (data.estoque || 0) + quantidade;

  const { error: updateError } = await supabaseClient
    .from("produtos")
    .update({ estoque: novoEstoque })
    .eq("id", produtoId);

  if (updateError) {
    console.error(updateError);
    return;
  }

  await carregarEstoque();
  aplicarEsgotadosNoDOM();
  renderCarrinho();
}


async function carregarPedidos() {
  const { data, error } = await supabaseClient
  .from("pedidos")
  .select("id, total, status, cliente_id")
  .order("id", { ascending: false });

  if (error) {
    console.error("Erro ao buscar pedidos:", error);
    return;
  }

  renderPedidos(data);

  console.log(data);
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-add-stock");
  if (!btn) return;

  const id = Number(btn.dataset.id);

  const row = btn.closest("tr");
  const input = row.querySelector(".qty-input");

  const qtd = Number(input.value);

  if (!qtd || qtd <= 0) return;

  const { data, error } = await supabaseClient
    .from("produtos")
    .select("estoque")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const novoEstoque = (data.estoque || 0) + qtd;

  const { error: updateError } = await supabaseClient
    .from("produtos")
    .update({ estoque: novoEstoque })
    .eq("id", id);

  if (updateError) {
    console.error(updateError);
    return;
  }

  carregarEstoque(); // atualiza tudo
});

function renderPedidos(pedidos) {
  const tbody = document.querySelector(".orders-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  pedidos.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>#${p.id}</td>
      <td>${p.clientes?.nome ?? "-"}</td>
      <td>---</td>
      <td><span class="badge ${p.status}">${p.status}</span></td>
      <td>R$ ${Number(p.total || 0).toFixed(2)}</td>
      <td>
        <button class="btn-cancel" data-id="${p.id}">
          Cancelar
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

