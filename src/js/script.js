const lista_produtos = document.getElementById("listaProdutos")
lista_produtos.classList.add("listaProdutos")

const searchInput = document.getElementById("searchInput")
const pesquisar = document.getElementById("pesquisar")
const totalPreco = document.getElementById("totalPreco")
const todos = document.getElementById("todos")
const hortifruti = document.getElementById("hortifruti")
const panificadora = document.getElementById("panificadora")
const laticinio = document.getElementById("laticinio")

const listaProdutos = document.querySelector(".listaProdutos")
const listaCompras = document.querySelector(".carrinhoCompras")
const carrinho_vazio = document.getElementById("carrinho-vazio")
const total_compra = document.getElementById("total-compra")
const preco_total = document.getElementById("preco-total")
const quantidade_total = document.getElementById("quantidade-total")

let produtosCarrinho = []

const listarProdutos = (listaProdutos, secao) => {
    listaProdutos.forEach((produto) => {
        const templateProduto = criarCardProduto(produto)
        secao.append(templateProduto)
    })
}

const criarCardProduto = (produto) => {
    const li = document.createElement("li")
    li.classList.add("card")
    const imagem = document.createElement("img")
    const h3 = document.createElement("h3")
    const span = document.createElement("span")
    const ol = document.createElement("ol")
    const p = document.createElement("p")
    const button = document.createElement("button")

    const { id, img, nome, secao, componentes, preco } = produto

    imagem.src = img
    h3.innerText = nome
    span.innerText = secao

    componentes.forEach((nutriente) => {
        const li = document.createElement("li")
        li.classList.add("nutriente")
        li.innerText = nutriente
        ol.append(li)
    })

    const div = document.createElement("div")
    p.innerText = `R$ ${preco.toFixed(2)}`
    button.id = id
    button.innerText = "Comprar"

    div.append(p, button)
    li.append(imagem, h3, span, ol, div)

    return li
}

let secao_atual = "todos"

const filtrarCategoria = (event) => {
    const localEvento = event.target
    const localId = localEvento.id

    secao_atual = localId

    let arrayProdutos = []
    lista_produtos.innerHTML = ""

    if (localId == "todos") {
        listarProdutos(PRODUTOS, lista_produtos)
        totalPagarPorSecao(PRODUTOS, secao_atual)
    } else {
        PRODUTOS.forEach((produto) => {
            const secao = produto.secao.toLowerCase()
            if (secao == localId) {
                arrayProdutos.push(produto)
            }
        })
        listarProdutos(arrayProdutos, lista_produtos)
        totalPagarPorSecao(arrayProdutos, secao_atual)
    }
}

const percorrerLista = (listaProdutos, secao_atual) => {
    lista_produtos.innerHTML = ""
    const texto = searchInput.value.trim().toLowerCase()
    let qtdProdutosEncontrados = 0

    let arrAtual = []

    if (secao_atual == "todos") {
        listaProdutos.forEach((produto) => {
            const nome = produto.nome.toLowerCase()
            if (nome.includes(texto)) {
                arrAtual.push(produto)
                totalPagarPorSecao(arrAtual, secao_atual)
                lista_produtos.append(criarCardProduto(produto))
                qtdProdutosEncontrados++
            }
        })
    } else {
        listaProdutos.forEach((produto) => {
            const secao = produto.secao.toLowerCase()
            if (secao == secao_atual) {
                const nome = produto.nome.toLowerCase()
                if (nome.includes(texto)) {
                    arrAtual.push(produto)
                    totalPagarPorSecao(arrAtual, secao_atual)
                    lista_produtos.append(criarCardProduto(produto))
                    qtdProdutosEncontrados++
                }
            }
        })
    }
    if (qtdProdutosEncontrados === 0) {
        lista_produtos.innerHTML = `
            <div id='resultadoPesquisa'>
                <h1>Nenhum Produto Encontrado</h1>
                <img src="https://sambatech.com/wp-content/uploads/2019/07/animac%CC%A7a%CC%83o-erro404_3-1.gif" alt="Gif">
            </div>
        `
        totalPreco.innerText = `Nenhum produto`
    }
}

const totalPagarPorSecao = (PRODUTOS, secaoAtual) => {
    if (secaoAtual == "todos") {
        const total = PRODUTOS.reduce((acc, {preco}) => acc + preco, 0)
        totalPreco.innerText = `R$ ${total.toFixed(2)}`
    } else {
        const secao = PRODUTOS
            .filter(({secao}) => secao.toLowerCase() == secaoAtual)
            .reduce((acc, {preco}) => acc + preco, 0)
        totalPreco.innerText = `R$ ${secao.toFixed(2)}`
    }
}

const quantidadeProdutos = array => quantidade_total.innerHTML = array.length

const adicionarProduto = event => {
    const localEvento = event.target
    const idLocalEvento = localEvento.id
    if (localEvento.tagName == "BUTTON") {
        PRODUTOS.find(({id, secao, nome, img, preco}) => {
            if (id == idLocalEvento) {
                const obj = {
                    id: id,
                    secao: secao,
                    nome: nome,
                    img: img,
                    preco: preco
                }
                produtosCarrinho.push(obj)
                criarCardsCarrinho(produtosCarrinho)
                quantidadeProdutos(produtosCarrinho)
                somarProdutos(produtosCarrinho)
                if (produtosCarrinho.length >= 1) {
                    total_compra.style.display = "flex"
                    carrinho_vazio.style.display = "none"
                }
            }
        })
    }
}

const criarCardsCarrinho = (array) => {
    listaCompras.innerHTML = ""
    array.forEach(({img, nome, secao, preco}, index) => {
        const li = document.createElement("li")
        li.id = index
        li.classList.add("cardCarrinho")
        li.innerHTML = `
            <div class="cardCarrinho-left">
                <img src="${img}" alt="${nome}">
                <div class="cardCarrinhoInfo">
                    <h3>${nome}</h3>
                    <span>${secao}</span>
                    <p>R$ ${preco.toFixed(2)}</p>
                </div>
            </div>
            <div class="cardCarrinho-right">
                <img class="remover" src="https://img.icons8.com/ios-glyphs/344/trash--v1.png" alt="Logo | lixeira">
            </div>
        `
        listaCompras.append(li)
    })
}

const removerProduto = (event) => {
    const localEvento = event.target
    const id = event.target.closest("li").id
    if (localEvento.classList.contains("remover")) {
        if (produtosCarrinho.length <= 1) {
            total_compra.style.display = "none"
            carrinho_vazio.style.display = "flex"
        }
        produtosCarrinho.splice(id, 1)
        criarCardsCarrinho(produtosCarrinho)
        quantidadeProdutos(produtosCarrinho)
        somarProdutos(produtosCarrinho)
    }
}

const somarProdutos = array => {
    const total = array.reduce((acc, {preco}) => acc + preco, 0)
    preco_total.innerHTML = `R$ ${total.toFixed(2)}`.replace(",", ".")
}

const pesquisaPorProduto = () => {
    percorrerLista(PRODUTOS, secao_atual)
}

pesquisar.addEventListener("click", pesquisaPorProduto)
todos.addEventListener("click", filtrarCategoria)
hortifruti.addEventListener("click", filtrarCategoria)
panificadora.addEventListener("click", filtrarCategoria)
laticinio.addEventListener("click", filtrarCategoria)

listaProdutos.addEventListener("click", adicionarProduto)
listaCompras.addEventListener("click", removerProduto)

totalPagarPorSecao(PRODUTOS, secao_atual)
listarProdutos(PRODUTOS, lista_produtos)