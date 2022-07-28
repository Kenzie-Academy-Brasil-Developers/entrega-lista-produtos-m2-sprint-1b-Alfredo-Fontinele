const lista_produtos = document.getElementById("listaProdutos")
const searchInput = document.getElementById("searchInput")
const pesquisar = document.getElementById("pesquisar")
const totalPreco = document.getElementById("totalPreco")
const todos = document.getElementById("todos")
const hortifruti = document.getElementById("hortifruti")
const panificadora = document.getElementById("panificadora")
const laticinio = document.getElementById("laticinio")

const listarProdutos = (listaProdutos, secao) => {
    listaProdutos.forEach((produto) => {
        const templateProduto = criarCardProduto(produto)
        secao.append(templateProduto)
    })
}

const criarCardProduto = (produto) => {
    const li = document.createElement("li")
    li.innerHTML = `
        <img src="${produto.img}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <span>${produto.secao}</span>
        <p>R$ ${(produto.preco).toFixed(2)}</p>
    `
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
        renderizarProdutos(PRODUTOS, lista_produtos)
    } else {
        PRODUTOS.forEach((produto) => {
            const secao = produto.secao.toLowerCase()
            if (secao == localId) {
                arrayProdutos.push(produto)
            }
        })
        renderizarProdutos(arrayProdutos, lista_produtos)
    }
    totalPagarPorSecao(PRODUTOS, secao_atual)
}

const renderizarProdutos = (array, secao) => {
    array.forEach((produto) => {
        const produtoTemplate = criarCardProduto(produto)
        secao.append(produtoTemplate)
    })
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
        listaProdutos.filter((produto) => {
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

const pesquisaPorProduto = () => {
    percorrerLista(PRODUTOS, secao_atual)
}

const totalPagarPorSecao = (PRODUTOS, secaoAtual) => {
    if (secaoAtual == "todos") {
        const total = PRODUTOS.map((produto) => produto.preco).reduce((acc, cur) => acc + cur)
        totalPreco.innerText = `R$ ${total.toFixed(2)}`
    } else {
        let result = 0
        const total = PRODUTOS.forEach((produto) => {
            const preco = produto.preco
            const secao = produto.secao.toLowerCase()
            if (secao == secaoAtual) {
                result += preco
            }
        })
        totalPreco.innerText = `R$ ${result.toFixed(2)}`
    }
}

pesquisar.addEventListener("click", pesquisaPorProduto)
todos.addEventListener("click", filtrarCategoria)
hortifruti.addEventListener("click", filtrarCategoria)
panificadora.addEventListener("click", filtrarCategoria)
laticinio.addEventListener("click", filtrarCategoria)

totalPagarPorSecao(PRODUTOS, secao_atual)
listarProdutos(PRODUTOS, lista_produtos)