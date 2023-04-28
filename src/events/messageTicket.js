const { Events } = require("discord.js");
const Ticket = require("../models/Ticket");

module.exports = {
    name: Events.MessageCreate,
    run: async (client, message) => {
        const channelId = message.channel.id 

        const ticket = await Ticket.findOne({textChannel: channelId})

        if(ticket == null) return 
        
        let messages = ticket.messages + 1

        ticket.messages = messages

        ticket.save()

    }
}