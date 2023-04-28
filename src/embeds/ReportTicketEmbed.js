const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class ReportTicketEmbed extends EmbedBuilder {

    constructor(creator, members, messages, createdAt, endedAt){
        super()


        this.setTitle('Ticket Report')
        this.setDescription('New ticket closed')
        this.setColor(Colors.Green)

        this.setThumbnail(creator.user.avatarURL())


        this.addFields(
            {name: 'Ticket creator : ', value:  `${creator.user.username}` },
            {name: 'Ticket members : ', value: members.join(', ')},
            {name: 'Messages sent : ', value: `${messages}`},
            {name:'Ticket created at : ', value: `${createdAt}` },
            {name: 'Ticket closed at', value : `${endedAt}`}) 
    
    }

   
}