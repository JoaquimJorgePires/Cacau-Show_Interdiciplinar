// === SLIDER / CARROSSEL (caso não exista, não dá erro) ===
let list = document.querySelectorAll('.item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');

if (list.length > 0) {
  let count = list.length;
  let active = 0;

  next && (next.onclick = () => {
    let activeOld = document.querySelector('.item.active');
    if (activeOld) activeOld.classList.remove('active');
    active = (active + 1) % count;
    list[active].classList.add('active');
  });

  prev && (prev.onclick = () => {
    let activeOld = document.querySelector('.item.active');
    if (activeOld) activeOld.classList.remove('active');
    active = (active - 1 + count) % count;
    list[active].classList.add('active');
  });
}

// === MENU FIXO AO ROLAR ===
const header = document.querySelector("header");
window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 80);
});

// === MENU RESPONSIVO ===
let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navbar.classList.toggle('open');
};

// === BOTÃO DE LOGIN / SAIR ===
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  function atualizarBotao() {
    const logado = localStorage.getItem("logado") === "true";
    loginBtn.textContent = logado ? "Sair" : "Entrar";
  }

  atualizarBotao();

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const logado = localStorage.getItem("logado") === "true";

    if (!logado) {
      sessionStorage.setItem("paginaAnterior", window.location.href);
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
});
