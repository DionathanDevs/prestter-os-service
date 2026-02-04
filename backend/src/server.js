require('dotenv').config()
const osRoutes = require('./routes/osRoutes')
const express = require ('express')
const cors = require ('cors') 

const connectMongo = require('./database/mongo')
const mysqlPool = require('./database/mysql')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/os', osRoutes)

const startServer = async () => {
    try{

        await connectMongo()

        const [rows] = await mysqlPool.query('SELECT 1')
        console.log(`MySQL Conectado com sucesso, pool ativo.`)

        const PORT = process.env.DB_PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`)
            console.log(`Acesse em http://localhost:${PORT}`)
        })

        
    }catch(err){
        console.log(`Erro ao acessar servidor, ${err}`)
        process.exit(1)
    }
}

startServer()