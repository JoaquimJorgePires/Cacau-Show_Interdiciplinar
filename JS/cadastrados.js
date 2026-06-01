let clientes =
    JSON.parse(localStorage.getItem("clientes")) || [];

let setores =
    JSON.parse(localStorage.getItem("setores")) || [];

let funcionarios =
    JSON.parse(localStorage.getItem("funcionarios")) || [];

function salvarTudo() {

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    localStorage.setItem(
        "setores",
        JSON.stringify(setores)
    );

    localStorage.setItem(
        "funcionarios",
        JSON.stringify(funcionarios)
    );
}

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

function atualizarCards() {

    document.getElementById("clientes-count")
        .textContent =
            document.querySelectorAll("#clientes-body tr").length;

    document.getElementById("setores-count")
        .textContent =
            document.querySelectorAll("#setores-body tr").length;

    document.getElementById("funcionarios-count")
        .textContent =
            document.querySelectorAll("#funcionarios-body tr").length;
}

function renderClientes() {

    const tbody =
        document.getElementById("clientes-body");

    tbody.innerHTML = "";

    clientes.forEach((cliente, index) => {

        tbody.innerHTML += `
            <tr>
                <td><strong>${cliente.nome}</strong></td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.data}</td>

                <td>
                    <span class="status-badge ativo">
                        Ativo
                    </span>
                </td>

                <td>
                    <button
                        class="btn-action"
                        onclick="editarCliente(${index})"
                    >
                        Editar
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderSetores() {

    const tbody =
        document.getElementById("setores-body");

    tbody.innerHTML = "";

    setores.forEach((setor, index) => {

        tbody.innerHTML += `
            <tr>

                <td>
                    <strong>${setor.nome}</strong>
                </td>

                <td>${setor.responsavel}</td>

                <td>${setor.localizacao}</td>

                <td>${setor.email}</td>

                <td>${setor.data}</td>

                <td>
                    <span class="status-badge ativo">
                        Ativo
                    </span>
                </td>

                <td>
                    <button
                        class="btn-action"
                        onclick="editarSetor(${index})"
                    >
                        Editar
                    </button>
                </td>

            </tr>
        `;
    });
}

function renderFuncionarios() {

    const tbody =
        document.getElementById("funcionarios-body");

    tbody.innerHTML = "";

    funcionarios.forEach((funcionario, index) => {

        tbody.innerHTML += `
            <tr>

                <td>
                    <strong>${funcionario.nome}</strong>
                </td>

                <td>${funcionario.email}</td>

                <td>${funcionario.cargo}</td>

                <td>${funcionario.franquia}</td>

                <td>${funcionario.data}</td>

                <td>
                    <span class="status-badge ativo">
                        Ativo
                    </span>
                </td>

                <td>
                    <button
                        class="btn-action"
                        onclick="editarFuncionario(${index})"
                    >
                        Editar
                    </button>
                </td>

            </tr>
        `;
    });
}

function editarCliente(index) {

    const novoNome =
        prompt(
            "Novo nome:",
            clientes[index].nome
        );

    if (!novoNome) return;

    clientes[index].nome = novoNome;

    salvarTudo();

    renderClientes();
}

function editarSetor(index) {

    const novoNome =
        prompt(
            "Novo setor:",
            setores[index].nome
        );

    if (!novoNome) return;

    setores[index].nome = novoNome;

    salvarTudo();

    renderSetores();
}

function editarFuncionario(index) {

    const novoNome =
        prompt(
            "Novo nome:",
            funcionarios[index].nome
        );

    if (!novoNome) return;

    funcionarios[index].nome = novoNome;

    salvarTudo();

    renderFuncionarios();
}

renderClientes();

renderSetores();

renderFuncionarios();

atualizarCards();


const modalOverlay =
    document.getElementById("modalOverlay");

const modalTitulo =
    document.getElementById("modalTitulo");

const modalCampos =
    document.getElementById("modalCampos");

const modalForm =
    document.getElementById("modalForm");

const fecharModal =
    document.getElementById("fecharModal");

const cancelarModal =
    document.getElementById("cancelarModal");

let tipoCadastro = "";

// ABRIR MODAL CLIENTE
document.getElementById("novoClienteBtn")
.addEventListener("click", () => {

    tipoCadastro = "cliente";

    modalTitulo.innerText =
        "Novo Cliente";

    modalCampos.innerHTML = `
        <input type="text" id="nome" placeholder="Nome">
        <input type="email" id="email" placeholder="Email">
        <input type="text" id="telefone" placeholder="Telefone">
    `;

    modalOverlay.classList.add("active");
});

// ABRIR MODAL SETOR
document.getElementById("novoSetorBtn")
.addEventListener("click", () => {

    tipoCadastro = "setor";

    modalTitulo.innerText =
        "Novo Setor";

    modalCampos.innerHTML = `
        <input type="text" id="nome" placeholder="Nome do setor">
        <input type="text" id="responsavel" placeholder="Responsável">
        <input type="text" id="localizacao" placeholder="Localização">
        <input type="email" id="email" placeholder="Email">
    `;

    modalOverlay.classList.add("active");
});

// ABRIR MODAL FUNCIONÁRIO
document.getElementById("novoFuncionarioBtn")
.addEventListener("click", () => {

    tipoCadastro = "funcionario";

    modalTitulo.innerText =
        "Novo Funcionário";

    modalCampos.innerHTML = `
        <input type="text" id="nome" placeholder="Nome">
        <input type="email" id="email" placeholder="Email">
        <input type="text" id="cargo" placeholder="Cargo">
        <input type="text" id="franquia" placeholder="Franquia">
    `;

    modalOverlay.classList.add("active");
});

// FECHAR MODAL
function fechar() {
    modalOverlay.classList.remove("active");
}

fecharModal.onclick = fechar;
cancelarModal.onclick = fechar;

// SALVAR
modalForm.addEventListener("submit", (e) => {

    e.preventDefault();

    // CLIENTE
    if (tipoCadastro === "cliente") {

        clientes.push({

            nome:
                document.getElementById("nome").value,

            email:
                document.getElementById("email").value,

            telefone:
                document.getElementById("telefone").value,

            data:
                new Date().toLocaleDateString()
        });

        salvarTudo();
        renderClientes();
    }

    // SETOR
    if (tipoCadastro === "setor") {

        setores.push({

            nome:
                document.getElementById("nome").value,

            responsavel:
                document.getElementById("responsavel").value,

            localizacao:
                document.getElementById("localizacao").value,

            email:
                document.getElementById("email").value,

            data:
                new Date().toLocaleDateString()
        });

        salvarTudo();
        renderSetores();
    }

    // FUNCIONÁRIO
    if (tipoCadastro === "funcionario") {

        funcionarios.push({

            nome:
                document.getElementById("nome").value,

            email:
                document.getElementById("email").value,

            cargo:
                document.getElementById("cargo").value,

            franquia:
                document.getElementById("franquia").value,

            data:
                new Date().toLocaleDateString()
        });

        salvarTudo();
        renderFuncionarios();
    }

    atualizarCards();

    fechar();
});