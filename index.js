const urlUsuarios = "https://mock-api.driven.com.br/api/v6/uol/participants";
const urlStatus = "https://mock-api.driven.com.br/api/v6/uol/status";
const urlMensagens = "https://mock-api.driven.com.br/api/v6/uol/messages";

let usuario;

setInterval(buscarMensagens, 3000);
setInterval(buscarParticipantes, 10000);
setInterval(conferirStatus, 5000);

function abrirMenuLateral() {
    const overlay = document.querySelector(`.menuLateralFundos`).parentNode;
    overlay.classList.toggle(`escondido`);
}

function mandarUsuario() {
    usuario = document.querySelector(`.envioUsuario`).value;
    const envioLogin = {
        name: `${usuario}`
    }
    const promise = axios.post(urlUsuarios, envioLogin);

    promise.catch(repetirLogin);
    promise.then(confirmarEntrada);
}

function confirmarEntrada() {
    const overlay = document.querySelector(`.telaInicial`);
    overlay.classList.toggle(`escondido`);
}

function repetirLogin(error) {
    if (error.response.status === 400) {
        alert(`Usuário ja está em uso, favor definir outro nome`);
        login();
    }
}

function conferirStatus() {
    const envioStatus = {
        name: `${usuario}`
    }
    const promise = axios.post(urlStatus, envioStatus);
    console.log(envioStatus);
}

function buscarMensagens() {
    const promessa = axios.get(urlMensagens);
    // console.log(promessa);
    promessa.then(renderizarMensagens);
}

function renderizarMensagens(dados) {
    // console.log(dados);
    let corpoDeMensagens = document.querySelector(".corpoDeMensagens");
    corpoDeMensagens.innerHTML = "";

    for (let i = 0; i < dados.data.length; i++) {

        const hora = dados.data[i].time;
        const usuario = dados.data[i].from;
        const destinatario = dados.data[i].to;
        const mensagem = dados.data[i].text;
        const type = dados.data[i].type;

        const entradaESaida = `<li class="contatoEntradaESaida"><p>${hora} <em>${usuario}</em> ${mensagem}</p></li>`;
        const mensagemPublica = `<li class="mensagemPublica"><p>${hora} <em>${usuario}</em> para <em>${destinatario}:</em> ${mensagem}</p></li>`;
        const mensagemReservada = `<li class="mensagemReservada"><p>${hora} <em>${usuario}</em> reservadamente para <em>${destinatario}:</em> ${mensagem}</p></li>`;

        if (type === `status`) {
            corpoDeMensagens.innerHTML += entradaESaida;
        }
        if (type === `message`) {
            corpoDeMensagens.innerHTML += mensagemPublica;
        }
        if (type === `private_message`) {
            corpoDeMensagens.innerHTML += mensagemReservada;
        }
    }
    corpoDeMensagens.scrollIntoView({ block: "end", behavior: "smooth" });
}

function enviarMensagem() {
    const mensagem = document.querySelector(`.envioMensagens`).value;

    const envioMensagem = {
        from: usuario,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    const promise = axios.post(urlMensagens, envioMensagem);

    document.querySelector(".base>input").value = "";

    promise.then(buscarMensagens);
    promise.catch(reload);
}

document.querySelector(`.envioMensagens`).addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById(".base>ion-icon").click();
        document.querySelector(".base>input").value = "";
    }
})

function reload() {
    window.location.reload();
}

function buscarParticipantes() {
    const promessa = axios.get(urlUsuarios);

    promessa.then(participantesAtivos);
}

function participantesAtivos(dados) {
    let menuLateral = document.querySelector(".menuParticipantes");
    menuLateral.innerHTML = `<li><ion-icon name="people"></ion-icon><h1>Todos</h1><ion-icon name="checkmark-outline" class="offline"></ion-icon></li>`;

    for (let i = 0; i < dados.data.length; i++) {

        const nomes = dados.data[i].name;

        menuLateral.innerHTML += `<li><ion-icon name="person-circle"></ion-icon><h1>${nomes}</h1><ion-icon name="checkmark-outline" class="offline"></ion-icon></li>`;
    }
}