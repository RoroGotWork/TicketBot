const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    run: async(client)=> {
        console.log(`Bot connected as ${client.user.tag}`)
    }
}