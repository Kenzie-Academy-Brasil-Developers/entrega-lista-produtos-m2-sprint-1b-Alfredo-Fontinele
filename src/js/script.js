const lista_produtos = document.getElementById("listaProdutos")
const searchInput = document.getElementById("searchInput")
const pesquisar = document.getElementById("pesquisar")
const totalPreco = document.getElementById("totalPreco")
const todos = document.getElementById("todos")
const hortifruti = document.getElementById("hortifruti")
const panificadora = document.getElementById("panificadora")
const laticinios = document.getElementById("laticinios")

let listaHortifruti = []
let listaPanificadora = []
let listaLaticinios = []
let listaTodos = []

const listarProdutos = (listaProdutos, secao) => {
    for (let i in listaProdutos) {
        const produto = listaProdutos[i]
        const templateProduto = criarCardProduto(produto)
        secao.append(templateProduto)
    }
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

const filtrarCategoria = (event) => {
    const localEvento = event.target
    lista_produtos.innerHTML = ""
    lista_produtos.id = ""

    listaHortifruti = []
    listaPanificadora = []
    listaLaticinios = []
    listaTodos = []

    if (localEvento.id == "hortifruti") {
        lista_produtos.id = "hortifruti"
        percorrerListaCategoria(PRODUTOS, listaHortifruti, "Hortifruti")
        renderizarProdutos(listaHortifruti, lista_produtos)
    } else if (localEvento.id == "panificadora") {
        lista_produtos.id = "panificadora"
        percorrerListaCategoria(PRODUTOS, listaPanificadora, "Panificadora")
        renderizarProdutos(listaPanificadora, lista_produtos)
    } else if (localEvento.id == "laticinios") {
        lista_produtos.id = "laticinios"
        percorrerListaCategoria(PRODUTOS, listaLaticinios, "Laticínio")
        renderizarProdutos(listaLaticinios, lista_produtos)
    } else if (localEvento.id == "todos") {
        lista_produtos.id = "todos"
        PRODUTOS.forEach((produto) => listaTodos.push(produto))
        renderizarProdutos(PRODUTOS, lista_produtos)
    }

    totalPagar()
}

const percorrerListaCategoria = (listaSecao, secao, nomeSecao) => {
    listaSecao.filter((produto) => {
        if (produto.secao == nomeSecao) {
            secao.push(produto)
        }
    })
}

const renderizarProdutos = (array, secao) => {
    array.forEach((i) => secao.append(criarCardProduto(i)))
}

const pesquisaPorProduto = () => {
    if (lista_produtos.id == "hortifruti") {
        lista_produtos.id = "hortifruti"
        percorrerLista(listaHortifruti)
    } else if (lista_produtos.id == "panificadora") {
        lista_produtos.id = "panificadora"
        percorrerLista(listaPanificadora)
    } else if (lista_produtos.id == "laticinios") {
        lista_produtos.id = "laticinios"
        percorrerLista(listaLaticinios)
    } else {
        lista_produtos.id = "todos"
        percorrerLista(PRODUTOS)
    }
}

const percorrerLista = (listaProdutos) => {
    lista_produtos.innerHTML = ""
    const texto = searchInput.value.trim().toLowerCase()
    let qtdProdutosEncontrados = 0
    listaProdutos.forEach((i) => {
        if (i.nome.toLowerCase().includes(texto)) {
            lista_produtos.append(criarCardProduto(i))
            qtdProdutosEncontrados++
        }
    })
    if (qtdProdutosEncontrados === 0) {
        lista_produtos.innerHTML = `
            <div id='resultadoPesquisa'>
                <h1>Nenhum Produto Encontrado</h1>
                <img src="https://sambatech.com/wp-content/uploads/2019/07/animac%CC%A7a%CC%83o-erro404_3-1.gif" alt="Gif">
            </div>
        `
    }
}

const totalPagar = () => {
    if (lista_produtos.id == "hortifruti") {
        totalPagarPorSecao(listaHortifruti)
    } else if (lista_produtos.id == "panificadora") {
        totalPagarPorSecao(listaPanificadora)
    } else if (lista_produtos.id == "laticinios") {
        totalPagarPorSecao(listaLaticinios)
    } else if (lista_produtos.id == "todos") {
        totalPagarPorSecao(listaTodos)
    }
}

const totalPagarPorSecao = (listaProdutos) => {
    let total = 0
    listaProdutos.forEach((produto) => {
        const preco = produto.preco
        total += preco
    })
    totalPreco.innerText = `R$ ${total.toFixed(2)}`
}

let listaTOTAL = PRODUTOS.map((produto, indice) => produto.preco).reduce((acc, cur) => acc + cur)
totalPreco.innerText = `R$ ${listaTOTAL.toFixed(2)}`

pesquisar.addEventListener("click", pesquisaPorProduto)
todos.addEventListener("click", filtrarCategoria)
hortifruti.addEventListener("click", filtrarCategoria)
panificadora.addEventListener("click", filtrarCategoria)
laticinios.addEventListener("click", filtrarCategoria)

listarProdutos(PRODUTOS, lista_produtos)