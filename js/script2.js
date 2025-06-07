const nomeInput = document.getElementById("nomePaciente");
const imagemInput = document.getElementById("imagemPaciente");
const btnAdicionar = document.getElementById("botaoAdicionar");
const btnUrgencia = document.getElementById("botaoUrgencia");
const btnAtender = document.getElementById("botaoAtender");
const listaEspera = document.getElementById("listaEspera");
const pacienteEmAtendimento = document.getElementById("pacienteEmAtendimento");

let fila = [];

// Recupera fila salva ao carregar
window.onload = () => {
  const filaSalva = localStorage.getItem("filaPacientes");
  if (filaSalva) {
    fila = JSON.parse(filaSalva);
    atualizarLista();
  }
};

// Salva fila no localStorage
function salvarFila() {
  localStorage.setItem("filaPacientes", JSON.stringify(fila));
}

// Salva imagem no localStorage usando nome como chave
function salvarImagem(nome, imagemBase64) {
  localStorage.setItem(nome, imagemBase64);
}

// Converte imagem em Base64
function lerImagem(callback) {
  const arquivo = imagemInput.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = () => callback(leitor.result);
  leitor.readAsDataURL(arquivo);
}

// Atualiza lista na tela
function atualizarLista() {
  listaEspera.innerHTML = "";
  fila.forEach((paciente, index) => {
    const div = document.createElement("div");
    div.className = paciente.urgente ? "urgente" : "item-lista";
    div.innerHTML = `${paciente.nome} (${paciente.hora})`;
    listaEspera.appendChild(div);
  });
}

// Adiciona paciente comum
btnAdicionar.onclick = () => {
  if (!nomeInput.value || !imagemInput.files[0]) return alert("Preencha o nome e selecione uma imagem.");
  const nome = nomeInput.value.trim();
  const hora = new Date().toLocaleTimeString();

  lerImagem((imgBase64) => {
    fila.push({ nome, hora, urgente: false });
    salvarImagem(nome, imgBase64);
    salvarFila();
    atualizarLista();
    limparFormulario();
  });
};

// Adiciona paciente com urgência
btnUrgencia.onclick = () => {
  if (!nomeInput.value || !imagemInput.files[0]) return alert("Preencha o nome e selecione uma imagem.");
  const nome = nomeInput.value.trim();
  const hora = new Date().toLocaleTimeString();

  lerImagem((imgBase64) => {
    fila.unshift({ nome, hora, urgente: true });
    salvarImagem(nome, imgBase64);
    salvarFila();
    atualizarLista();
    limparFormulario();
  });
};

// Atende paciente (remove da fila)
btnAtender.onclick = () => {
  if (fila.length === 0) {
    pacienteEmAtendimento.innerHTML = "<p>Nenhum paciente aguardando.</p>";
    return;
  }

  const paciente = fila.shift();
  const imagemBase64 = localStorage.getItem(paciente.nome);

  pacienteEmAtendimento.innerHTML = `
    <p style="font-size: 18px;">Paciente em Atendimento: <strong>${paciente.nome}</strong></p>
    <img src="${imagemBase64}" alt="Imagem do Paciente" style="width: 150px; margin-top: 10px;" />
  `;

  salvarFila();
  atualizarLista();
};

// Limpa campos
function limparFormulario() {
  nomeInput.value = "";
  imagemInput.value = "";
}