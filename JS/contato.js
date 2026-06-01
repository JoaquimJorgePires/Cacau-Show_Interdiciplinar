let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('sticky', window.scrollY > 0);
});

let loginLink = document.getElementById('login-link');
if (localStorage.getItem('logado') === 'true') {
    loginLink.textContent = 'Sair';
    loginLink.href = '#';
    loginLink.onclick = () => {
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

    loginLink.textContent = 'Entrar';

    window.location.reload();
};
    };
}

const form = document.getElementById('form-contato');
const msg = document.getElementById('msg-ok');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    msg.style.display = 'block';
});

function fecharBanner(id) {
    const banner = document.getElementById(id);
    if (banner) {
        banner.style.opacity = "0";
        banner.style.transform = "scale(.95)";
        setTimeout(() => banner.remove(), 250);
    }
}

// Teste de Banco de Dados
async function enviarMensagem() {
  const nome = document.getElementById("nome").value
  const mensagem = document.getElementById("mensagem").value

  const { error } = await supabaseClient
    .from('contato')
    .insert([{ nome, mensagem }])

  if (error) {
    alert("Erro ao enviar")
    return
  }

  alert("Mensagem enviada!")
}