const botaoUpload = document.getElementById("upload-btn");
const inputUpload = document.getElementById("image-upload");
const imagemPrincipal = document.querySelector(".main-imagem");
const nomeDaImagem = document.querySelector(".container-imagem-nome p");
const inputTags = document.getElementById("input-tags");
const listaTags = document.getElementById("lista-tags");
const botaoPublicar = document.querySelector(".botao-publicar");
const botaoDescartar = document.querySelector(".botao-descartar");

const tagsDisponiveis = [
  "Front-end",
  "Programação",
  "Data Science",
  "Full-stack",
  "HTML",
  "CSS",
  "JavaScript",
];

botaoUpload.addEventListener("click", () => {
  inputUpload.click();
});

function lerConteudoDoArquivo(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => {
      resolve({
        url: leitor.result,
        nome: arquivo.name,
      });
    };

    leitor.onerror = () => {
      reject(`Erro na leitura do arquivo ${arquivo.name}`);
    };

    leitor.readAsDataURL(arquivo);
  });
}

inputUpload.addEventListener("change", async (evento) => {
  const arquivo = evento.target.files[0];

  if (!arquivo) {
    return;
  }

  try {
    const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);
    imagemPrincipal.src = conteudoDoArquivo.url;
    nomeDaImagem.textContent = conteudoDoArquivo.nome;
  } catch (erro) {
    console.error("Erro na leitura do arquivo:", erro);
  }
});

listaTags.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("remove-tag")) {
    evento.target.closest("li").remove();
  }
});

function verificarTagDisponivel(tagTexto) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tagsDisponiveis.includes(tagTexto));
    }, 1000);
  });
}

inputTags.addEventListener("keydown", async (evento) => {
  if (evento.key !== "Enter") {
    return;
  }

  evento.preventDefault();
  const tagTexto = inputTags.value.trim();

  if (tagTexto === "") {
    return;
  }

  try {
    const tagExiste = await verificarTagDisponivel(tagTexto);

    if (!tagExiste) {
      alert("Tag não encontrada.");
      return;
    }

    const tagNova = document.createElement("li");
    tagNova.innerHTML = `
      <p>${tagTexto}</p>
      <img src="./img/close-black.svg" class="remove-tag" alt="Remover tag">
    `;

    listaTags.appendChild(tagNova);
    inputTags.value = "";
  } catch (erro) {
    console.error("Erro ao verificar a tag:", erro);
    alert("Não foi possível verificar a tag.");
  }
});

function publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsDoProjeto) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const publicacaoConcluida = Math.random() > 0.5;

      if (publicacaoConcluida) {
        resolve({ nomeDoProjeto, descricaoDoProjeto, tagsDoProjeto });
      } else {
        reject("Erro ao publicar o projeto.");
      }
    }, 2000);
  });
}

botaoPublicar.addEventListener("click", async () => {
  const nomeDoProjeto = document.getElementById("nome").value;
  const descricaoDoProjeto = document.getElementById("descricao").value;
  const tagsDoProjeto = Array.from(listaTags.querySelectorAll("p")).map(
    (tag) => tag.textContent,
  );

  try {
    await publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsDoProjeto);
    alert("Projeto publicado com sucesso.");
  } catch (erro) {
    console.error("Erro ao publicar:", erro);
    alert("Não foi possível publicar o projeto.");
  }
});

botaoDescartar.addEventListener("click", () => {
  const formulario = document.querySelector("form");

  formulario.reset();
  imagemPrincipal.src = "./img/imagem1.png";
  nomeDaImagem.textContent = "image_projeto.png";
  listaTags.innerHTML = "";
});
