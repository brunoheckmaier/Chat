import  pg  from "pg";

export const connection = new pg.Client({

    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    user: process.env.DB_USER
})

export const connect = async () => {
    await connection.connect().catch((e)=>{
        console.log("Erro ao conectar no banco de dados: ",e)
        throw e
    })
    console.log("Conectado no banco de dados")        
}

export const disconnect = async () => {
    await connection.end()
}