const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const moment = require('moment')

module.exports = class YouTube extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'youtube',
      aliases: ['yt'],
      requirements: { apis: ['youtube'] },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commons:search.noParams'
      }, [
        {
          type: 'booleanFlag',
          name: 'video',
          aliases: [ 'v', 'videos' ]
        }, {
          type: 'booleanFlag',
          name: 'channel',
          aliases: [ 'c', 'channels' ]
        }, {
          type: 'booleanFlag',
          name: 'playlist',
          aliases: [ 'p', 'playlists' ]
        }, {
          type: 'string',
          name: 'order',
          aliases: [ 'o' ],
          whitelist: ['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount']
        }
      ]],
      embedColor: Constants.YOUTUBE_COLOR,
      embedLogoURL: 'https://i.imgur.com/yQy45qO.png'
    })
  }

  async search (context, query) {
    const { flags } = context
    const types = Object.keys(flags).filter(f => ['video', 'channel', 'playlist'].includes(f))
    const res = await this.client.apis.youtube.search(query, types, 'snippet,id', flags.order || 'relevance', 10)
    return res.items
  }

  searchResultFormatter ({ id, snippet }) {
    const { title } = snippet
    const type = this.getType(id)
    return `\`${type === 'video' ? 'V' : type === 'channel' ? 'C' : 'P'}\` ${title}`
  }

  async handleResult (ctx, item) {
    const { t, channel } = ctx
    await channel.startTyping()
    const type = this.getType(item.id)
    const embed = await this[`get${MiscUtils.capitalizeFirstLetter(type)}`](ctx, item)
    embed.setAuthor(t(`commands:youtube.${type}.info`), this.embedLogoURL)
      .setColor(this.embedColor)
    channel.send(embed).then(() => channel.stopTyping())
  }

  async getVideo ({ t, author, language }, { id: videoID }) {
    moment.locale(language)
    const { snippet, statistics, contentDetails } = await this.client.apis.youtube.getVideo(videoID.videoId, 'snippet,statistics,contentDetails')
    const { publishedAt, channelId, title, thumbnails, channelTitle } = snippet
    const embed = new SwitchbladeEmbed(author)
      .setDescription(`[${title}](https://youtu.be/${videoID.videoId}) \`(${MiscUtils.formatDuration(contentDetails.duration)})\``)
      .addField(t('commands:youtube.likes'), MiscUtils.formatNumber(statistics.likeCount, language), true)
      .addField(t('commands:youtube.dislikes'), MiscUtils.formatNumber(statistics.dislikeCount, language), true)
      .addField(t('commands:youtube.comments'), MiscUtils.formatNumber(statistics.commentCount, language), true)
      .addField(t('commands:youtube.channel'), `[${channelTitle}](https://www.youtube.com/channel/${channelId})`, true)
      .addField(t('commands:youtube.publishedAt'), moment(publishedAt).format('LLL'), true)
      .setThumbnail(this.client.apis.youtube.getBestThumbnail(thumbnails).url)
    return embed
  }

  getType ({ kind }) {
    return kind.split('#')[1]
  }
}
