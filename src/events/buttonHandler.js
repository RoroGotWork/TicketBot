const { Events, ChannelType, PermissionFlagsBits } = require("discord.js");
const Ticket = require("../models/Ticket");
const config = require('../../config.json')

module.exports = {
    name: Events.InteractionCreate,
    run: async (client, interaction) => {
        if(!interaction.isButton() ) return
            
        switch( interaction.customId){
            case "openticket":
                const creator = interaction.user.id
                const channelId = interaction.channelId
                const members = [creator]

                // Config parameters
                const maxTickets = config.max_tickets
                const roleList = config.permissions_ticket_allow


                // ticket check
                const tickets = await Ticket.countDocuments({creator: creator, closed: false})

                if(tickets > maxTickets){
                    interaction.reply({content :`You can't create more than ${maxTickets} tickets`, ephemeral: true})
                    return
                }


                // ticket registering in database
                const newTicket = new Ticket({
                    creator: creator,
                    textChannel: "",
                    members: members
                })
                

                //channel creation
                const channel = await client.channels.fetch(channelId)
                const parentId = channel.parentId
                
                const guild = interaction.member.guild

                let permissions = [{
                    id: guild.roles.everyone,
                    deny: PermissionFlagsBits.ViewChannel
                },
                {
                    id: creator,
                    allow: [PermissionFlagsBits.ViewChannel]
                }]

                roleList.forEach(role => {
                    permissions.push({
                        id: role,
                        allow: [PermissionFlagsBits.ViewChannel]
                    })
                })

                const newChannel = await guild.channels.create({
                    name: `ticket-${newTicket.id}`,
                    type: ChannelType.GuildText,
                    parent: parentId,
                    permissionOverwrites: permissions
                })
                
                newTicket.textChannel = newChannel.id

                await newTicket.save()
                
                await interaction.reply({content: "Channel created", ephemeral: true})
                break
        }
    }
}