const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const TicketEmbed = require("../embeds/TicketEmbed");
const OpenTicketButton = require("../buttons/OpenTicketButton");


module.exports = {
    infos: 
        new SlashCommandBuilder()
            .setName('ticket')
            .setDescription('Generate a ticket embed')
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
            .addStringOption(option => 
                option.setName('title')
                    .setDescription('Choose a title')
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName('description')
                    .setDescription('Choose a description')
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName('channel_id')
                    .setDescription('Enter the channel id')
                    .setRequired(false))
            .addStringOption(option => 
                option.setName('flag_url')
                    .setDescription('Enter an image URL')
                    .setRequired(false))
            .addStringOption(option => 
                option.setName('button_name')
                    .setDescription("Choose button name")
                    .setRequired(false))
            .addStringOption(option => 
                option.setName('button_emoji')
                    .setDescription('Choose a button for the emoji')
                    .setRequired(false)),
            
    run: async (client, interaction) => {
        const options = interaction.options
        const title = options.getString('title')
        const description = options.getString('description')
        const channelId = options.getString('channel_id')        
        const flagUrl = options.getString('flag_url')
        const buttonName = options.getString('button_name')
        const buttonEmoji = options.getString('button_emoji')

        const embed = new TicketEmbed(title, description, flagUrl)

        const buttons =  new ActionRowBuilder().addComponents(new OpenTicketButton(buttonName, buttonEmoji))

        const channels = client.channels

        let channel = null
        

        if(channelId == null){
            channel = await channels.fetch(interaction.channelId) 
        } else {
            channel = await channels.fetch(channelId) || await channels.fetch(interaction.channelId)
        }
    

        await channel.send({embeds : [embed], components: [buttons]})
        await interaction.reply({content : "Embed created", ephemeral: true})
    }
}