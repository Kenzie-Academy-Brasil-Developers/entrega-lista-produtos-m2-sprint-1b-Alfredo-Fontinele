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
let listaCarrinhoID = []

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
    p.innerText = `R$ ${Number(preco).toFixed(2)}`
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
    listaProdutos.forEach((produto) => {
        const nome = produto.nome.toLowerCase()
        const secao = produto.secao.toLowerCase()
        if (secao_atual == "todos") {
            if (nome.includes(texto)) {
                arrAtual.push(produto)
                lista_produtos.append(criarCardProduto(produto))
                qtdProdutosEncontrados++
            }
        }
        else {
            if (secao == secao_atual) {
                if (nome.includes(texto)) {
                    arrAtual.push(produto)
                    lista_produtos.append(criarCardProduto(produto))
                    qtdProdutosEncontrados++
                }
            }
        }
        if (texto == "todos") {
            arrAtual.push(produto)
            lista_produtos.append(criarCardProduto(produto))
            qtdProdutosEncontrados++
        } else {
            if (texto == secao) {
                arrAtual.push(produto)
                lista_produtos.append(criarCardProduto(produto))
                qtdProdutosEncontrados++
            }
        }
    })
    totalPagarPorSecao(arrAtual, secao_atual)
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
        const total = PRODUTOS.reduce((acc, {preco}) => acc + Number(preco), 0)
        totalPreco.innerText = `R$ ${total.toFixed(2)}`
    } else {
        const secao = PRODUTOS
            .filter(({secao}) => secao.toLowerCase() == secaoAtual)
            .reduce((acc, {preco}) => acc + Number(preco), 0)
        totalPreco.innerText = `R$ ${secao.toFixed(2)}`
    }
}

const adicionarProduto = event => {
    const localEvento = event.target
    const idLocalEvento = localEvento.id
    if (localEvento.tagName == "BUTTON") {
        PRODUTOS.find(({id, secao, nome, img, preco}) => {
            if (id == idLocalEvento) {
                const obj = {
                    qtd: 1,
                    id: id,
                    secao: secao,
                    nome: nome,
                    img: img,
                    preco: Number(preco)
                }
                if (!listaCarrinhoID.includes(id)) {
                    listaCarrinhoID.push(id)
                    produtosCarrinho.push(obj)
                    criarCardsCarrinho(produtosCarrinho)
                    quantidadeProdutos(produtosCarrinho)
                    somarProdutos(produtosCarrinho)
                }
            }
        })
    }
    if (produtosCarrinho.length >= 1) {
        total_compra.style.display = "flex"
        carrinho_vazio.style.display = "none"
    }
}

const criarCardsCarrinho = (array) => {
    listaCompras.innerHTML = ""
    array.forEach(({id, qtd, img, nome, secao, preco}) => {
        const li = document.createElement("li")
        li.id = id
        li.classList.add("cardCarrinho")
        li.innerHTML = `
            <div class="cardCarrinho-left">
                <p class="quantidadeProdutoCarrinho">${qtd}</p>
                <img src="${img}" alt="${nome}">
                <div class="cardCarrinhoInfo">
                    <h3>${nome}</h3>
                    <span>${secao}</span>
                    <p>R$ ${Number(preco).toFixed(2)}</p>
                </div>
            </div>
            <div class="cardCarrinho-right">
                <img class="aumentar" src="https://img.icons8.com/ios-glyphs/344/macos-maximize.png" alt="Logo | lixeira">
                <img class="diminuir" src="https://img.icons8.com/ios-glyphs/344/filled-minus-2-math.png" alt="Logo | lixeira">
            </div>
        `
        listaCompras.append(li)
    })
}

const aumentarQuantidadeProduto = (event) => {
    const localEvento = event.target
    const li = event.target.closest("li")
    const id = event.target.closest("li").id
    if (localEvento.classList.contains("aumentar")) {
        produtosCarrinho.find((produto) => {
            if (produto.id == id) {
                produto.qtd++
                criarCardsCarrinho(produtosCarrinho)
                quantidadeProdutos(produtosCarrinho)
                somarProdutos(produtosCarrinho)
            }
        })
    }
}

const diminuirQuantidadeProduto = (event) => {
    const localEvento = event.target
    const li = localEvento.closest("li")
    const localEventoId = event.target.closest("li").id
    if (localEvento.classList.contains("diminuir")) {
        const indice = produtosCarrinho.findIndex((produto) => produto.id == localEventoId)
        const produto = produtosCarrinho[indice]
        if (produto.qtd == 1 && produtosCarrinho.length == 1) {
            produtosCarrinho = []
            listaCarrinhoID = []
            total_compra.style.display = "none"
            carrinho_vazio.style.display = "flex"
        } else if (produto.qtd == 1) {
            produtosCarrinho.splice(indice, 1)
            listaCarrinhoID.splice(indice, 1)
        } else if (produto.qtd > 1) {
            produto.qtd--
        }
        criarCardsCarrinho(produtosCarrinho)
        quantidadeProdutos(produtosCarrinho)
        somarProdutos(produtosCarrinho)
    }
}

const quantidadeProdutos = array => {
    const quantidadeTotal = array.reduce((acc, {qtd}) => acc + qtd, 0)
    quantidade_total.innerHTML = quantidadeTotal
}

const somarProdutos = array => {
    const total = array.reduce((acc, {preco, qtd}) => acc += Number(preco) * qtd, 0)
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

listaCompras.addEventListener("click", aumentarQuantidadeProduto)
listaCompras.addEventListener("click", diminuirQuantidadeProduto)

totalPagarPorSecao(PRODUTOS, secao_atual)
listarProdutos(PRODUTOS, lista_produtos)