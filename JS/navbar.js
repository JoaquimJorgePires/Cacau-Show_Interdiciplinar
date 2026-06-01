// MENU MOBILE
const menu = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

if (menu && navbar) {
    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('open');
    };
}

// HEADER STICKY
window.addEventListener('scroll', () => {
    document.querySelector('header')
        ?.classList.toggle('sticky', window.scrollY > 0);
});

// LOGIN / LOGOUT
const loginLink = document.getElementById('login-link');

function atualizarBotao() {

    const logado =
        localStorage.getItem('logado') === 'true';

    if (!loginLink) return;

    if (logado) {

        loginLink.textContent = 'Sair';
        loginLink.href = '#';

    } else {

        loginLink.textContent = 'Entrar';
        loginLink.href = 'login.html';
    }
}

atualizarBotao();

if (loginLink) {

    loginLink.addEventListener('click', (e) => {

        const logado =
            localStorage.getItem('logado') === 'true';

        if (!logado) return;

        e.preventDefault();

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

            window.location.reload();
        };
    });
}