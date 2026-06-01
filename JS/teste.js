// 1. O PADRÃO COMMAND (Ação vira um Objeto)
class ComandoMudarTexto {
    // O comando nasce sabendo quem é o seu "alvo" (a ViewModel)
    constructor(vm) {
        this.viewModel = vm;
    }

    // A ação do botão vira essa função genérica aqui
    executar() {
        this.viewModel.atualizarMensagem();
    }
}

// 2. A VIEWMODEL (Onde o Observer avisa)
class TextoViewModel {
    constructor() {
        // [OBSERVER] Avisa que a variável vai mudar
        this.mensagem = "Texto Inicial"; 
    }

    atualizarMensagem() {
        this.mensagem = "Texto Alterado com Sucesso!";
    }
}

// 3. A VIEW (A Tela que junta tudo)
class MinhaTela {
    constructor() {
        this.vm = new TextoViewModel();
        // A View cria o objeto de comando e passa a ViewModel para ele
        this.botaoComando = new ComandoMudarTexto(this.vm);
    }

    desenharTela() {
        // [AQUI TEM OBSERVER / DATA BINDING]
        // O texto da tela está espiando a ViewModel. Mudou lá, muda aqui sozinho!
        console.log(this.vm.mensagem);

        // [AQUI TEM COMMAND]
        // O botão não tem lógica nenhuma. Ele só dispara o objeto de comando.
        // Botao( aoClicar: botaoComando.executar() )
        this.botaoComando.executar();
    }
}