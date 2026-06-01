const header = document.querySelector("header");
window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 80);
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
};

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
