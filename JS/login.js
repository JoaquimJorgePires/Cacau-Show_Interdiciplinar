document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("loginForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("successMsg");

  const togglePwd = document.getElementById("togglePwd");
  const pwd = document.getElementById("password");

  // MOSTRAR / ESCONDER SENHA
  if (togglePwd && pwd) {

    togglePwd.addEventListener("click", () => {

      const isPwd = pwd.type === "password";

      pwd.type = isPwd ? "text" : "password";

      togglePwd.textContent =
        isPwd ? "🙈" : "👁️";
    });
  }

  // LOGIN
  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email").value;

    const senha =
      document.getElementById("password").value;

    submitBtn.classList.add("loading");

    // ADMIN FIXO
    if (
      email === "adm@gmail.com" &&
      senha === "12345"
    ) {

      localStorage.setItem("logado", "true");
      localStorage.setItem("tipo", "admin");

      successMsg.style.display = "block";

      setTimeout(() => {
        window.location.href = "adm.html";
      }, 1000);

      return;
    }

    // LOGIN SUPABASE
    const { data, error } = await supabaseClient
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .eq("senha", senha)
      .maybeSingle();

    // ERRO LOGIN
    if (error || !data) {

      submitBtn.classList.remove("loading");

      mostrarToast(
        "Erro no login",
        "Email ou senha inválidos."
      );

      return;
    }

    // LOGIN OK
    localStorage.setItem("logado", "true");

    localStorage.setItem("tipo", "usuario");

    localStorage.setItem(
      "usuario",
      JSON.stringify(data)
    );

    successMsg.style.display = "block";

    mostrarToast(
      "Login realizado",
      "Bem-vindo de volta 🍫"
    );

    setTimeout(() => {

      const voltar =
        sessionStorage.getItem("paginaAnterior")
        || "index.html";

      sessionStorage.removeItem(
        "paginaAnterior"
      );

      window.location.href = voltar;

    }, 1200);

  });

});

// TOAST
function mostrarToast(titulo, mensagem) {

  const toast =
    document.getElementById("toast");

  document.getElementById(
    "toastTitle"
  ).innerText = titulo;

  document.getElementById(
    "toastMessage"
  ).innerText = mensagem;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);
}