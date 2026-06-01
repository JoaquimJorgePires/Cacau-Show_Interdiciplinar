document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("cadastroForm");

    const submitBtn =
        document.getElementById("submitBtn");

    const togglePwd =
        document.getElementById("togglePwd");

    const pwd =
        document.getElementById("password");

    const cpfInput =
        document.getElementById("cpf");

    const telInput =
        document.getElementById("telefone");

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

    // MOSTRAR SENHA
    if (togglePwd && pwd) {

        togglePwd.addEventListener("click", () => {

            const isPwd =
                pwd.type === "password";

            pwd.type =
                isPwd ? "text" : "password";

            togglePwd.textContent =
                isPwd ? "🙈" : "👁️";
        });
    }

    // MÁSCARA CPF
    if (cpfInput) {

        cpfInput.addEventListener("input", () => {

            let v =
                cpfInput.value.replace(/\D/g, "");

            v = v.slice(0, 11);

            v = v.replace(/(\d{3})(\d)/, "$1.$2");

            v = v.replace(/(\d{3})(\d)/, "$1.$2");

            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            cpfInput.value = v;
        });
    }

    // MÁSCARA TELEFONE
    if (telInput) {

        telInput.addEventListener("input", () => {

            let v =
                telInput.value.replace(/\D/g, "");

            v = v.slice(0, 11);

            v = v.replace(
                /^(\d{2})(\d)/,
                "($1) $2"
            );

            v = v.replace(
                /(\d{5})(\d{4})$/,
                "$1-$2"
            );

            telInput.value = v;
        });
    }

    // CADASTRO
    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const nome =
            document.getElementById("nome").value;

        const email =
            document.getElementById("email").value;

        const telefone =
            document.getElementById("telefone").value;

        const cpf =
            document.getElementById("cpf").value;

        const senha =
            document.getElementById("password").value;

        const confirmar =
            document.getElementById("confirmPassword").value;

        // VALIDAR SENHAS
        if (senha !== confirmar) {

            mostrarToast(
                "Erro",
                "As senhas não coincidem."
            );

            return;
        }

        submitBtn.classList.add("loading");

        // VERIFICAR EMAIL
        const { data: existente } =
            await supabaseClient
                .from("usuarios")
                .select("*")
                .eq("email", email)
                .maybeSingle();

        if (existente) {

            submitBtn.classList.remove("loading");

            mostrarToast(
                "Conta existente",
                "Esse email já está cadastrado."
            );

            return;
        }

        // CADASTRAR
        const { data, error } =
            await supabaseClient
                .from("usuarios")
                .insert([
                    {
                        nome,
                        email,
                        telefone,
                        cpf,
                        senha
                    }
                ])
                .select()
                .single();

        // ERRO
        if (error) {

            console.log(error);

            submitBtn.classList.remove("loading");

            if (error.code === "23505") {

                mostrarToast(
                    "Cadastro existente",
                    "CPF ou email já cadastrados."
                );

            } else {

                mostrarToast(
                    "Erro",
                    "Não foi possível cadastrar."
                );
            }

            return;
        }

        // LOGIN AUTOMÁTICO
        localStorage.setItem(
            "logado",
            "true"
        );

        localStorage.setItem(
            "tipo",
            "usuario"
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(data)
        );

        mostrarToast(
            "Conta criada!",
            "Bem-vindo(a) 🍫"
        );

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1500);

    });

});