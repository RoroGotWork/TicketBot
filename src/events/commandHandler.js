const { Events } = require("discord.js");


module.exports = {
    name: Events.InteractionCreate,
    run: async(client, interaction) => {
        if(!interaction.isChatInputCommand()) return

        const commandName = interaction.commandName

        const command = client.commands.get(commandName)

        if(command){
            command.run(client, interaction)
        }
    }
}