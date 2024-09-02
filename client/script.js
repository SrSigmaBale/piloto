const url = 'https://piloto-server.vercel.app'
let page = 1
let limit = 5000 * page
if(document.querySelector('.carregando')){
    document.querySelector('.carregando').classList.add('carregando--hidden');
    getData(`${url}/tabelancm?limit=${limit}&page=${page}`, 'GET')
        .then((data)=>{
            verificacaoErro(data)
        })
        .catch((error)=>{
            criaErro('Falha no Servidor', 2)
        })
}

async function getData(url, method){
    let accessToken = localStorage.getItem('accessToken')
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }})
    console.log(response.url)
    const data = await response.json()
    return data
}

function loading(show) {
    if (show) {
        document.querySelector('.carregando').classList.remove('carregando--hidden');
    } else {
        document.querySelector('.carregando').classList.add('carregando--hidden');
    }
}
async function conecta(){
    const data = await getData(`${url}/tabelancm?limit=${limit}&page=${page}`, 'GET')
    verificacaoErro(data)
    return data
}
function showElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = 'none';
    }
}

async function showExcel(data) {
    try {
        const div = document.querySelector('.conteiner_table')
        div.innerHTML = ""
        hideElement('img')
        const headerTabela = document.createElement('tr')
        headerTabela.innerHTML = `
        <td>Codigo</td>
        <td>Descricao</td>
        <td>Descricao Concatenada</td>
        <td>Data Inicio</td>
        <td>Data Fim</td>
        <td>Ato Legal Inicio</td>
        <td>Numero</td>
        <td>Ano</td>
        `
        div.append(headerTabela)
        data.forEach((element)=> {
            const elementoTabela = document.createElement('tr')
            elementoTabela.innerHTML = `
            <td data-t="s" data-v="01">${element.Codigo}</td>
            <td data-t="s" data-v="${element.Descricao}" id="sjs-B6">${element.Descricao}</td>
            <td data-t="s" data-v="${element.Descricao_Concatenada}" id="sjs-C6" xml:space="preserve">${element.Descricao_Concatenada}</td>
            <td data-t="s" data-v="${element.Data_inicio}" id="sjs-D6">${element.Data_inicio}</td>
            <td data-t="s" data-v="${element.Data_fim}" id="sjs-E6">${element.Data_fim}</td>
            <td data-t="s" data-v="${element.Ato_legal_inicio}" id="sjs-F6">${element.Ato_legal_inicio}</td>
            <td data-t="s" data-v="${element.Numero}" id="sjs-G6">${element.Numero}</td>
            <td data-t="s" data-v="${element.Ano}" id="sjs-H6">${element.Ano}</td>
            `
            div.appendChild(elementoTabela)
        })
        pagination(div)
    }
    catch(error) {
        criaErro('Falha no Servidor')
        console.log(error)
    }
}

function verificacaoErro(data) {
    if(data.message === 'Erro no Excel' || 
       data.message === 'Caractere Inválido' || 
       data.message === 'Elemento Não Existe') {
        criaErro(data.message);
        return true;
    }
    else if (data.message == 'jwt malformed' ||
        data.message == 'jwt expired' ||
        data.message == 'invalid token' ||
        data.message == 'No token provided' ||
        data.message == 'invalid signature' ||
        data.message == 'jwt signature is required' ||
        data.message == 'Access Token Nao Informado'){
        window.location.href = './password.html';
        return true
    }
    return false;
}

async function getExcel() {
    try {
        const data = await conecta();
        showExcel(data);
    } catch(erro) {
        criaErro('Falha no Servidor');
    }
}
async function getByNameExcel(code) {
    try {
        const data = await getData(`${url}/tabelancm/${code}`, 'GET')
        if(verificacaoErro(data)) {
            return;
        }
        console.log(data)
        showExcel(data)
    }
    catch(erro){
        criaErro('Falha no servidor')
    }
}
async function showByNameExcel(valorPesquisa){
    const tabela = document.querySelector('.conteiner_table')
    while(tabela.firstChild){
        tabela.removeChild(tabela.firstChild)
    }
    await getByNameExcel(valorPesquisa)
}
const barraPesquisa = document.querySelector('#barraPesquisa')
const header = document.querySelector('header')
const form = document.querySelector("form")
if(!document.querySelector('.login')){
    barraPesquisa.addEventListener('keyup', async () => {
        const valorPesquisa = barraPesquisa.value
        if(valorPesquisa == '') {
            const div = document.querySelector('.conteiner_table')
            div.innerHTML = ""
            div.appendChild(form)
            botao.classList.remove('hidden')
            showElement('img')
            barraPesquisa.focus();
            return;
        }

        if (!header.contains(form)) {
            header.appendChild(form);
        }
        botao.classList.add('hidden')
        loading(true)
        try {
            await showByNameExcel(valorPesquisa)
        } 
        catch (erro) {
            criaErro("Falha no Servidor", 2)
        }
        finally {
            loading(false)
            barraPesquisa.focus();
        }

})}

const botao = document.querySelector('#showTableButton')
if(botao){
    botao.addEventListener('click', async (e)=>{
        e.preventDefault()
        try {
            loading(true)
            const data = await conecta()
            if(verificacaoErro(data)){
                return;
            }            
            botao.classList.add('hidden')
            header.appendChild(form)
            await showExcel(data)
        } 
        catch (error) {
            criaErro('Falha no Servidor', 2)
        }
        finally{
            loading(false)
        }
    })
}

function pagination(div){
    const mostrarMenos = document.createElement('button')
    mostrarMenos.id = "mostrarMenos_btn"
    div.append(mostrarMenos)
    const numPages = document.createElement('h2')
    numPages.innerHTML = page
    div.append(numPages)
    const mostrarMais = document.createElement('button')
    mostrarMais.id = "mostrarMais_btn"
    div.append(mostrarMais)

    if(page >= 4){
        mostrarMais.classList.add('hidden')
    }
    else if(page <= 1){
        mostrarMenos.classList.add('hidden')
    }

    mostrarMais.addEventListener('click', async () =>{
        page ++
        try{
            loading(true)
            await getExcel()
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        finally{
            loading(false)
        }
    })
    mostrarMenos.addEventListener('click', async () =>{
        page --
        try{
            loading(true)
            await getExcel()
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        finally{
            loading(false)
        }
    })

}

function criaErro(erro, type) {
    if(type == 2){
        document.querySelector('#formPesquisa').innerHTML = ''
        document.querySelector('.conteiner_table').innerHTML = ''
        hideElement('img')
        const msgErro = document.createElement('h1')
        msgErro.textContent = erro
        const tabela = document.querySelector('.conteiner_table')
        tabela.append(msgErro)
    }
    else{
        const msgErro = document.createElement('h1')
        msgErro.textContent = erro
        const tabela = document.querySelector('.conteiner_table')
        tabela.append(msgErro)
    }
}
async function register(ev) {
    ev.preventDefault()
    const senha = {senha: document.querySelector('#password').value}
    const conexao = await fetch(url+'/security', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(senha)
    })
    const response = await conexao.json()
    if(!response.accessToken){
        const msgErro = document.querySelector('label')
        return msgErro.classList.remove('hidden')
    }
    localStorage.setItem('accessToken', response.accessToken);
    window.location.href = './index.html';
    return response.accessToken
}
const button = document.getElementById("butao")
if(document.querySelector('.login')){
    button.addEventListener("click", async(e) => await register(e))}