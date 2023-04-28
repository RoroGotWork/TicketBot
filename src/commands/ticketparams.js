const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Ticket = require("../models/Ticket");

module.exports = {
    infos: 
        new SlashCommandBuilder()
            .setName('ticketparams')
            .setDescription("Parameters for the ticket")
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
            .addUserOption(option => 
                option.setName('member_to_add')
                    .setDescription('Choose a member to add in the ticket')
                    .setRequired(false)
            )
            .addUserOption(option => 
                option.setName('member_to_remove')
                    .setDescription('Choose a member to remove in the ticket')
                    .setRequired(false)),

    run: async (client, interaction) => {
        const options = interaction.options

        const memberToAdd = options.getUser('member_to_add')
        const memberToRemove = options.getUser('member_to_remove')

        const channelId = interaction.channelId
        const channel = await client.channels.fetch(channelId)

        const ticket = await Ticket.findOne({textChannel: channelId })

        if(ticket == null){
            await interaction.reply({content : 'You are not in a ticket', ephemeral: true})
            return
        }

        if(memberToAdd == null && memberToRemove == null){
            await interaction.reply({content: 'No paramater entered', ephemeral: true})
            return
        }

        if(memberToAdd != null){

            if(!ticket.members.includes(memberToAdd.id)){
                ticket.members.push(memberToAdd.id)
                await channel.permissionOverwrites.set([
                    {
                        id: memberToAdd.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ])

                await interaction.reply({content: 'Member added', ephemeral: true})
            } else {
                await interaction.reply({content: 'Member already added', ephemeral: true})
            }
        }


        if(memberToRemove != null){
            if(ticket.members.includes(memberToRemove.id)){
                let index = ticket.members.indexOf(memberToRemove.id)
                ticket.members.slice(index, 1)

                await channel.permissionOverwrites.set([
                    {
                        id: memberToRemove.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ])

                await interaction.reply({content: 'Member removed', ephemeral: true})
            } else {
                await interaction.reply({content: 'The member is not in the ticket', ephemeral: true})
            }
        }

        await ticket.save()
                
    }
}