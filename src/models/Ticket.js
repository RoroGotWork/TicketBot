const {Schema, model} = require('mongoose')

const TicketSchema = new Schema({
    textChannel: {type: String, required: true},

    creator: {type: String, required: true},

    members: {type: [String], required: true},

    createdAt: {type: Date, required: true, default: Date.now},

    endedAt: {type: Date, required: false},

    messages: {type: Number, required: true, default: 0},

    closed: {type: Boolean, required: true, default: false },




})

const Ticket = model('Ticket', TicketSchema)

module.exports = Ticket
