const html = require("../xlsx/xlsx.js")
const express = require('express')
const app = express()
const cors = require('cors')
const trataErros = require('../middleware/trataErros.js')
const security = require('./login.js')
const autenticado = require('../middleware/autenticado.js')

// const allowCors = (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Origin', 'https://piloto-client.vercel.app');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//     res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
//     if (req.method === 'OPTIONS') {
//       return res.status(200).end();
//     }
  
//     next();
//   };
// // https://piloto-client.vercel.app

// app.use(allowCors)
app.use(cors({origin: "https://piloto-client.vercel.app",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
    }))
app.use(express.json());

app.get('/', (req, res)=> {
    res.status(200).send({message: "muito bom"})
})

app.post('/security', async (req, res, next) => {
    const {senha} = req.body
    const securityResponse = await security(senha)
    if(securityResponse.message == 'Usuario ou senha invalido'){
        return next(security)
    }
    res.status(201).json(securityResponse)
})

app.get('/tabelancm',autenticado, (req,res,next) => {
    if(html) {
        res.status(200).json(html)
    }
    else {
        const error = new Error('Erro no Excel')
        error.status = 500
        next(error)
    }
})
    
app.get('/tabelancm/:codigo',autenticado, (req, res,next) => {
    const codigo = req.params['codigo']
    const element = html.filter((element) => element.Codigo.startsWith(codigo));
    const regex = /[a-zA-Z]/;
    if(element != '') {
        res.status(200).json(element)
    }
    else if(regex.test(codigo)) {
        const error = new Error('Caractere Inválido')
        error.status = 401
        next(error)
    }
    else if(element == ''){
        const error = new Error('Elemento Não Existe')
        error.status = 404
        next(error)
    }
})


app.use(trataErros)
            
app.listen(3000, ()=> {
    console.log('faz o L')
})

module.exports = app

            