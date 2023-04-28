const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class TicketEmbed extends EmbedBuilder {

    constructor(title, description, flagUrl){
        super()
        this.setTitle(title)
        this.setDescription(description)
        
            
        this.setColor(Colors.White)
        
        // Lien de l'image
        if(flagUrl != null){
            this.setThumbnail(flagUrl)
        }
    }
}