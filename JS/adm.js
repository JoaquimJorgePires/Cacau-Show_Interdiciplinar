let pedidos = [];
let itensPedido = [];

async function carregarPedidos() {

    // PEDIDOS
    const { data, error } = await supabaseClient
        .from("pedidos")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    pedidos = data || [];

    // ITENS DOS PEDIDOS
    const {
        data: itens,
        error: erroItens
    } = await supabaseClient
        .from("itens_pedido")
        .select(`
    *,
    produtos (
        nome,
        preco,
        categorias (
            nome
        )
    )
`)

    if (erroItens) {
        console.error(erroItens);
        return;
    }

    itensPedido = itens || [];

    console.log(pedidos);
    console.log(itensPedido);

    atualizarReceita();
    atualizarMaisPedidos();
    atualizarTabela();
    atualizarGrafico();
    atualizarTotais();
}

// ELEMENTOS
const receitaTotal =
    document.getElementById("receitaTotal");

const maisPedidos =
    document.getElementById("maisPedidos");

const tabelaRelatorio =
    document.getElementById("tabelaRelatorio");

// RECEITA TOTAL
function atualizarReceita() {

    let total = 0;

    pedidos.forEach(pedido => {
        total += Number(pedido.total);
    });

    receitaTotal.innerText =
        total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

}

// MAIS VENDIDOS
function atualizarMaisPedidos() {

    const ranking = {};

    itensPedido.forEach(item => {

        const nome =
            item.produtos?.nome || "Produto";

        const preco =
            item.preco_unitario || 0;

        const quantidade =
            item.quantidade || 1;

        if (ranking[nome]) {

            ranking[nome].quantidade +=
                quantidade;

        } else {

            ranking[nome] = {

                quantidade,
                preco
            };
        }
    });

    maisPedidos.innerHTML = "";

    Object.entries(ranking)
        .sort((a, b) =>
            b[1].quantidade - a[1].quantidade
        )
        .slice(0, 5)
        .forEach(([nome, dados]) => {

            maisPedidos.innerHTML += `

                <div class="product-item-min">

                    <div class="p-info">

                        <strong>${nome}</strong>

                        <span>
                            ${dados.quantidade} vendas
                        </span>

                    </div>

                    <span class="p-price">

                        ${Number(dados.preco)
                    .toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    )}

                    </span>

                </div>

            `;
        });
}

// RELATÓRIO SEMANAL
function atualizarTabela() {

    tabelaRelatorio.innerHTML = "";

    const diasSemana = [

        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"

    ];

    const resumo = {};

    pedidos.forEach(pedido => {

        const data = pedido.data
            ? new Date(pedido.data)
            : new Date();

        const dia =
            diasSemana[data.getDay()];

        if (!resumo[dia]) {

            resumo[dia] = {

                pedidos: 0,
                total: 0

            };

        }

        resumo[dia].pedidos++;

        resumo[dia].total += Number(pedido.total);

    });

    Object.entries(resumo).forEach(([dia, info]) => {

        tabelaRelatorio.innerHTML += `

            <tr>

                <td>${dia}</td>

                <td>${info.pedidos}</td>

                <td>
                    <span class="status-tag">
                        Concluído
                    </span>
                </td>

                <td>

                    ${info.total.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        )}

                </td>

            </tr>

        `;

    });

}

// GRÁFICO
function atualizarGrafico() {

    const dias = {
        0: "dom",
        1: "seg",
        2: "ter",
        3: "qua",
        4: "qui",
        5: "sex",
        6: "sab"
    };

    const vendas = {
        seg: 0,
        ter: 0,
        qua: 0,
        qui: 0,
        sex: 0,
        sab: 0,
        dom: 0
    };

    pedidos.forEach(pedido => {

        if (!pedido.data) return;

        const data = new Date(pedido.data); // 👈 aqui dentro

        const dia = dias[data.getDay()];

        if (dia) {
            vendas[dia]++;
        }

    });

    const maiorVenda = Math.max(...Object.values(vendas), 1);

    Object.entries(vendas).forEach(([dia, qtd]) => {

        const barra = document.getElementById(dia);

        if (!barra) return;

        const altura = (qtd / maiorVenda) * 100;

        barra.style.height = altura + "%";
    });
}
// INICIAR DASHBOARD
carregarPedidos();

function atualizarTotais() {

    const totalVendas = pedidos.reduce((total, item) => {
        return total + Number(item.total);
    }, 0);

    document.getElementById("totalVendas").innerText =
        totalVendas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    document.getElementById("totalProdutos").innerText =
        pedidos.length;
}

const botaoPdf = document.getElementById("gerarPdf");

if (botaoPdf) {

    botaoPdf.addEventListener("click", () => {

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.text("Relatório de Vendas - Cacau Show", 14, 20);

        // Data atual
        const dataAtual = new Date().toLocaleDateString("pt-BR");

        doc.setFontSize(11);
        doc.text(`Gerado em: ${dataAtual}`, 14, 30);

        // Dados
        const linhas = [];

        let total = 0;

        const diasSemana = [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado"
        ];

        pedidos.forEach(item => {

            total += Number(item.total);

            const data = new Date(item.data);

            linhas.push([
                `Pedido #${item.id}`,
                item.status,
                diasSemana[data.getDay()],
                `R$ ${Number(item.total).toFixed(2)}`
            ]);

        });

        // Tabela
        doc.autoTable({
            startY: 40,

            head: [[
                "Produto",
                "Categoria",
                "Dia",
                "Preço"
            ]],

            body: linhas
        });

        // Total
        doc.text(
            `Total vendido: R$ ${total.toFixed(2)}`,
            14,
            doc.lastAutoTable.finalY + 15
        );

        // Baixar PDF
        doc.save("relatorio-cacau-show.pdf");

    });

}
function normalizar(txt) {
    return txt
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");
}



const botaoVerTudo = document.querySelector(".card-weekly-table .btn-outline");
const modal = document.getElementById("modalRelatorio");
const fecharModal = document.getElementById("fecharModal");
const container = document.getElementById("relatorioCompleto");

botaoVerTudo.addEventListener("click", () => {

    container.innerHTML = "";

    pedidos.forEach(p => {

        container.innerHTML += `
    <div style="
        padding: 10px;
        border-bottom: 1px solid #ddd;
    ">
        <strong>Pedido #${p.id}</strong><br>

        <small>Status: ${p.status}</small><br>

        <span>
            R$ ${Number(p.total).toFixed(2)}
        </span><br>

        <small>${new Date(p.data).toLocaleDateString("pt-BR")}</small>
    </div>
`;

    });

    modal.classList.remove("hidden");
});

fecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");

userMenu.addEventListener("click", () => {
    userMenu.classList.toggle("active");
});

logoutBtn.addEventListener("click", () => {
    // limpa login (se você usar localStorage depois)
    localStorage.removeItem("usuario");

    // redireciona (ajusta se quiser)
    window.location.href = "login.html";
});
async function carregarGraficoCategorias() {

    const { data, error } = await supabaseClient
        .from("itens_pedido")
        .select("categoria, quantidade");

    if (error) {
        console.error(error);
        return;
    }

    const categorias = {};

    data.forEach(item => {

        const categoria = item.categoria || "Outros";

        categorias[categoria] =
            (categorias[categoria] || 0)
            + item.quantidade;
    });

    const labels = Object.keys(categorias);

    const valores = Object.values(categorias);

    const ctx =
        document
        .getElementById("graficoCategorias");

    new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: labels,

            datasets: [{

                data: valores,

                backgroundColor: [

                    '#3bb77e',
                    '#6b3f23',
                    '#d4a373',
                    '#FFD166',
                    '#9C6644'

                ],

                borderWidth: 0,

                hoverOffset: 10
            }]
        },

        options: {

            responsive: true,

            cutout: '60%',

            plugins: {

                legend: {

                    position: 'bottom',

                    labels: {

                        color: '#2D1B14',

                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
}
async function carregarGraficoCategorias() {

    const { data, error } = await supabaseClient
        .from("itens_pedido")
        .select(`
            quantidade,
            produtos (
                id,
                categorias (
                    nome
                )
            )
        `);

    if (error) {
        console.error(
            "Erro ao carregar gráfico:",
            error
        );
        return;
    }

    console.log(data);

    const categorias = {};

    data.forEach(item => {

        const categoria =
            item.produtos?.categorias?.nome
            || "Outros";

        const quantidade =
            Number(item.quantidade || 0);

        if (!categorias[categoria]) {
            categorias[categoria] = 0;
        }

        categorias[categoria] += quantidade;
    });

    const labels =
        Object.keys(categorias);

    const valores =
        Object.values(categorias);

    const canvas =
        document.getElementById(
            "graficoCategorias"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    // remove gráfico antigo
    if (window.graficoPizza) {
        window.graficoPizza.destroy();
    }

    window.graficoPizza = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: valores,

                backgroundColor: [

                    "#9d401b",
                    "#d68c5e",
                    "#D4A373",
                    "#FFD166",
                    "#9C6644"

                ],

                borderWidth: 0,

                hoverOffset: 14
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "62%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: "#2D1B14",

                        padding: 18,

                        font: {

                            size: 13,
                            weight: "600"
                        }
                    }
                }
            }
        }
    });
}
carregarGraficoCategorias();

const campoPesquisa = document.getElementById("campoPesquisa");

campoPesquisa.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    const valor = campoPesquisa.value
        .toLowerCase()
        .trim();

    if (!valor) return;

    // ELEMENTOS pesquisáveis
    const elementos = document.querySelectorAll(`
        .product-item-min,
        .card,
        tr
    `);

    // remove destaque antigo
    elementos.forEach(el => {
        el.classList.remove("resultado-pesquisa");
    });

    let encontrou = false;

    elementos.forEach(el => {

        const texto = el.innerText
            .toLowerCase();

        if (!encontrou && texto.includes(valor)) {

            encontrou = true;

            // rolar até o elemento
            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            // destacar
            el.classList.add("resultado-pesquisa");

            // remover depois
            setTimeout(() => {
                el.classList.remove("resultado-pesquisa");
            }, 4000);
        }

    });

    if (!encontrou) {
        alert("Nada encontrado.");
    }

});