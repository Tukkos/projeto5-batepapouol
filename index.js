const urlUsuarios = "https://mock-api.driven.com.br/api/v6/uol/participants";
const urlStatus = "https://mock-api.driven.com.br/api/v6/uol/status";
const urlMensagens = "https://mock-api.driven.com.br/api/v6/uol/messages";

setInterval(buscarMensagens, 3000);
login();
setInterval(conferirStatus, 5000);

function abrirMenuLateral() {
    const overlay = document.querySelector(`.menuLateralFundos`).parentNode;
    overlay.classList.toggle(`escondido`);
}

function login() {
    usuario = prompt(`Defina um nome de usuário:`);
    mandarUsuario();
}

function mandarUsuario() {
    const envioLogin = {
        name: `${usuario}`
    }
    const promise = axios.post(urlUsuarios, envioLogin);

    promise.catch(repetirLogin);
    promise.then(confirmarEntrada);
}

function confirmarEntrada() {
    alert("Bem vindo ao Bate Papo Uol!")
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
}