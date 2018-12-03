const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures

const emoji = '\uD83D\uDC4F'
const CLAPIFY_LIMIT = 128

module.exports = class Clapify extends Command {
  constructor (client) {
    super(client)
    this.name = 'clapify'
    this.category = 'memes'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:clapify.missingSentence' })
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    if (text.length >= CLAPIFY_LIMIT) {
      embed
        .setTitle(t('commands:clapify.tooLongText', { limit: CLAPIFY_LIMIT }))
        .setColor(Constants.ERROR_COLOR)
    } else {
      embed.setTitle(`${emoji} ${text.toUpperCase().split(' ').join(` ${emoji} `)} ${emoji}`)
    }
    channel.send(embed)
  }
}
