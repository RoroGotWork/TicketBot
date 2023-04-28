const { SlashCommandBuilder } = require("discord.js");
const Ticket = require("../models/Ticket");
const config = require('../../config.json');
const ReportTicketEmbed = require("../embeds/ReportTicketEmbed");


module.exports = {
    infos: new SlashCommandBuilder()
        .setName('ticketclose')
        .setDescription('Close the ticket'),

    run: async (client, interaction) => {
        const channelId = interaction.channelId
        const user = interaction.user.id
        const guild = interaction.guild

        const ticket = await Ticket.findOne({textChannel: channelId})

        if(ticket == null){
            interaction.reply({content:`You are not in a ticket`, ephemeral: true })
            return
        }

        if(ticket.members.includes(user) && ticket.creator != user){
            interaction.reply({content:`You don't have the permission to do that`, ephemeral: true })
            return
        }

        ticket.endedAt = new Date()
        ticket.closed = true
        await ticket.save()

        const channel = await client.channels.fetch(channelId)
        await channel.delete()

        const reportChannelId = config.ticket_report_channel
        const reportChannel = await client.channels.fetch(reportChannelId)

        
        const creator = await guild.members.fetch(ticket.creator)
        let members = []
        let messages =  ticket.messages
        let createdAt = ticket.createdAt.toLocaleString()
        let endedAt = ticket.endedAt.toLocaleString()

        await ticket.members.forEach( async (memberId) => {
            const member = await guild.members.fetch(memberId)
            members.push(member)
        })

        const embed = new ReportTicketEmbed(creator, members, messages, createdAt, endedAt)

        await reportChannel.send({embeds: [embed]})


    }
    
}