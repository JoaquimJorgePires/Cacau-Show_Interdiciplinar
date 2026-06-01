// --- CÓDIGO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ENVIO DE FEEDBACK COM AVATAR ---
    const btnEnviarFeedback = document.getElementById('btn-enviar-feedback');
    const inputNome = document.getElementById('feedback-nome');
    const inputMensagem = document.getElementById('feedback-mensagem');
    const inputAvatar = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarContainer = document.querySelector('.avatar-container');

    if (avatarContainer && inputAvatar && avatarPreview) {
        avatarContainer.addEventListener('click', () => inputAvatar.click());

        inputAvatar.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => avatarPreview.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnEnviarFeedback) {
        btnEnviarFeedback.addEventListener('click', () => {
            const nome = inputNome.value.trim();
            const mensagem = inputMensagem.value.trim();
            const avatarFile = inputAvatar.files[0];

            if (!nome || !mensagem) {
                alert('Por favor, preencha seu nome e a mensagem.');
                return;
            }

            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('mensagem', mensagem);
            if (avatarFile) formData.append('avatar', avatarFile);

      fetch("http://127.0.0.1:8000/api/feedbacks/", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
       mostrarToast(
    "Feedback enviado!",
    "Obrigado por compartilhar sua experiência."
);
        console.log(data);
    })
    .catch(err => {
        console.error(err);
        mostrarToast(
    "Erro ao enviar",
    "Tente novamente em alguns instantes.",
    "erro"
);
    });


        });
    }

    // --- SLIDER MANUAL ---
    let list = document.querySelectorAll('.item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let count = list.length;
    let active = 0;

    if (next && prev) {
        next.onclick = () => {
            document.querySelector('.item.active')?.classList.remove('active');
            active = (active + 1) % count;
            list[active].classList.add('active');
        };

        prev.onclick = () => {
            document.querySelector('.item.active')?.classList.remove('active');
            active = (active - 1 + count) % count;
            list[active].classList.add('active');
        };
    }

    // --- HEADER FIXO AO ROLAR ---
    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("sticky", window.scrollY > 80);
        });
    }

    // --- LOGIN / LOGOUT ---
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
    }

    // --- FEEDBACK SIMPLES (SEM UPLOAD) ---
    const btnEnviarSimples = document.querySelector(".btn-enviar");
    const feedbackMsg = document.getElementById("feedback-msg");
    const nomeInputSimples = document.querySelector(".input-nome");
    const feedbackTextarea = document.querySelector(".textarea-feedback");

    if (btnEnviarSimples && nomeInputSimples && feedbackTextarea) {
        btnEnviarSimples.addEventListener("click", (e) => {
            e.preventDefault();

            if (!nomeInputSimples.value.trim() || !feedbackTextarea.value.trim()) {
                mostrarToast(
    "Campos obrigatórios",
    "Preencha seu nome e mensagem.",
    "erro"
);
                return;
            }

            nomeInputSimples.value = "";
            feedbackTextarea.value = "";

            if (feedbackMsg) {
                feedbackMsg.style.display = "block";
                setTimeout(() => feedbackMsg.style.display = "none", 3000);
            }
        });
    }

    // --- SWIPER SLIDER ---
    if (typeof Swiper !== "undefined") {
        new Swiper('.slider-wrapper', {
            loop: true,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    }
});

// // Teste de Banco de Dados
// async function verificarUsuario() {
//   const { data: { user } } = await supabaseClient.auth.getUser()

//   if (!user) {
//     alert("Você precisa estar logado")
//     window.location.href = "login.html"
//   }
// }

// verificarUsuario()