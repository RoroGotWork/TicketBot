require('dotenv').config()
const Bot = require('./src/Bot')


const client = new Bot(process.env.TOKEN, process.env.CLIENT_ID, process.env.GUILD_ID)

client.registerCommands()
client.registerEvents()
client.connectDatabase(process.env.DB_URI)
client.login()