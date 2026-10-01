# Documentação do JavaScript

Esta documentação explica o funcionamento do JavaScript do **CodeConnect**, mantendo o arquivo principal limpo e deixando as explicações em um local próprio para estudo.

## Fluxo da aplicação

1. O usuário seleciona uma imagem do computador.
2. O `FileReader` transforma a imagem em uma URL para a pré-visualização.
3. O usuário adiciona tags reconhecidas pela aplicação.
4. As tags podem ser removidas individualmente.
5. O botão **Publicar** coleta os dados e simula uma requisição assíncrona.
6. O botão **Descartar** limpa o formulário, a imagem e as tags.

## Funções

### `lerConteudoDoArquivo(arquivo)`

Lê a imagem selecionada pelo usuário utilizando a API `FileReader`.

- **Parâmetro:** `arquivo` — objeto `File` recebido pelo campo de upload.
- **Retorno:** uma `Promise` que resolve um objeto com a URL e o nome do arquivo.
- **Pode rejeitar:** quando ocorre um erro durante a leitura.

### `verificarTagDisponivel(tagTexto)`

Simula uma verificação assíncrona e informa se a tag digitada pertence à lista de tags disponíveis.

- **Parâmetro:** `tagTexto` — texto digitado no campo de tags.
- **Retorno:** uma `Promise` contendo `true` ou `false`.
- **Recursos:** `setTimeout()` e `includes()`.

### `publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsDoProjeto)`

Simula o envio do projeto durante dois segundos. O resultado é definido aleatoriamente para praticar resolução e rejeição de promises.

- **Parâmetros:** nome, descrição e array de tags.
- **Retorno:** uma `Promise`.
- **Resolve:** com os dados do projeto.
- **Rejeita:** com uma mensagem de erro.

## Eventos

| Elemento | Evento | Comportamento |
|---|---|---|
| Botão de upload | `click` | Abre o seletor de arquivos. |
| Campo de arquivo | `change` | Lê e mostra a imagem selecionada. |
| Lista de tags | `click` | Remove a tag cujo ícone foi clicado. |
| Campo de tags | `keydown` | Adiciona a tag quando a tecla Enter é pressionada. |
| Botão Publicar | `click` | Coleta os dados e inicia a simulação. |
| Botão Descartar | `click` | Restaura o estado inicial da interface. |

## Nomenclaturas e recursos

| Recurso | Como funciona |
|---|---|
| `document.getElementById()` | Procura um elemento pelo atributo `id`. |
| `document.querySelector()` | Retorna o primeiro elemento correspondente ao seletor CSS. |
| `addEventListener()` | Executa uma função quando determinado evento acontece. |
| `new Promise()` | Representa uma operação que será concluída ou rejeitada futuramente. |
| `resolve()` | Finaliza uma promise com sucesso. |
| `reject()` | Finaliza uma promise com erro. |
| `FileReader` | Permite que o navegador leia arquivos escolhidos pelo usuário. |
| `readAsDataURL()` | Converte o arquivo para uma URL utilizável na propriedade `src`. |
| `async` | Indica que uma função trabalha com operações assíncronas. |
| `await` | Aguarda a conclusão de uma promise. |
| `try...catch` | Trata erros que podem acontecer durante uma operação. |
| `classList.contains()` | Verifica se um elemento possui determinada classe CSS. |
| `closest()` | Encontra o ancestral mais próximo correspondente ao seletor. |
| `includes()` | Verifica se um array contém um valor. |
| `Array.from()` | Converte uma coleção em um array. |
| `map()` | Cria um novo array transformando cada elemento. |
| `setTimeout()` | Executa uma ação após um intervalo de tempo. |
| `Math.random()` | Gera um número aleatório entre zero e um. |
| `form.reset()` | Restaura os campos de um formulário. |
| `innerHTML` | Lê ou substitui o conteúdo HTML de um elemento. |
| `textContent` | Lê ou substitui somente o conteúdo textual. |

## Código comentado para estudo

### Upload e leitura da imagem

```javascript
botaoUpload.addEventListener("click", () => {
  // Abre o seletor de arquivos escondido no HTML.
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
```

### Adição e remoção de tags

```javascript
listaTags.addEventListener("click", (evento) => {
  // A lista identifica qual ícone de remoção recebeu o clique.
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
});
```

### Publicação simulada

```javascript
function publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsDoProjeto) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // A condição aleatória representa uma resposta de servidor.
      const publicacaoConcluida = Math.random() > 0.5;

      if (publicacaoConcluida) {
        resolve({ nomeDoProjeto, descricaoDoProjeto, tagsDoProjeto });
      } else {
        reject("Erro ao publicar o projeto.");
      }
    }, 2000);
  });
}
```

### Descarte do formulário

```javascript
botaoDescartar.addEventListener("click", () => {
  const formulario = document.querySelector("form");

  formulario.reset();
  imagemPrincipal.src = "./img/imagem1.png";
  nomeDaImagem.textContent = "image_projeto.png";
  listaTags.innerHTML = "";
});
```

---

[← Voltar ao README principal](../README.md)
