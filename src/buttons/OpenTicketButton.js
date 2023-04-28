const { ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = class OpenTicketButton extends ButtonBuilder {
    constructor(title, emoji){
        super()
        this.setCustomId('openticket')

        this.title = title || "Open a Ticket"
        this.setLabel(this.title)

        if(emoji != null){
            this.setEmoji(emoji)
        } 
        
        this.setStyle(ButtonStyle.Success)
    }



}