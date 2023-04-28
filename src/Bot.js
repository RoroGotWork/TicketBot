const { Client, GatewayIntentBits, REST, Routes, Collection } = require("discord.js");
const fs = require('fs')
const mongoose = require('mongoose')
module.exports = class Bot extends Client {

    constructor(token, clientId, guildId){
        super({
            intents: [
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildPresences
            ]
        })

        this.token = token
        this.clientId = clientId
        this.guildId = guildId


        this.slashCommands = []
        this.commands = new Collection()
    }



    registerEvents(){
        fs.readdirSync('./src/events')
            .filter((file) => file.endsWith('.js'))
            .forEach((file) => {
                const event = require(`./events/${file}`)

                if(!event.name || typeof event.name !== 'string'){
                    console.log(`Event from file ${file} couldn't have been loaded`)
                    return
                }

                if(event.once){
                    this.once(event.name, (...args) => event.run(this, ...args))
                } else {
                    this.on(event.name, (...args) => event.run(this, ...args))
                }

                console.log(`Event ${event.name} loaded`)
            })
    }


    async registerCommands(){

        fs.readdirSync('./src/commands')
            .filter((file) => file.endsWith('.js'))
            .forEach((file) => {
                const command = require(`./commands/${file}`)

                if(!command.infos){
                    console.log(`[Error] could not load file ${file}`)
                    return
                }

                console.log(`Command from file ${file} loaded`)

                this.slashCommands.push(command.infos)
                this.commands.set(command.infos.name, command)

            })

        const rest = await new REST().setToken(this.token)

        await rest.put(Routes.applicationCommands(this.clientId, this.guildId),
            {
                body: this.slashCommands
            }).catch((e) => {
                console.log(e)
            })

    }


    async connectDatabase(databaseUrl){
        await mongoose.connect(databaseUrl)

        console.log("Connected to MongoDB")
    }


    connect(){
        this.login(this.token)
    }
}
