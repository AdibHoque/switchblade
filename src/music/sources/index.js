module.exports = {
  Songs: {
    // HTTP
    HTTPSong: require('./http/HTTPSong.js'),

    // SoundCloud
    SoundcloudSong: require('./soundcloud/SoundcloudSong.js'),

    // Twitch
    TwitchSong: require('./twitch/TwitchSong.js'),

    // YouTube
    YoutubePlaylist: require('./youtube/YoutubePlaylist.js'),
    YoutubeSong: require('./youtube/YoutubeSong.js')
  },
  Sources: {
    SpotifySongSource: require('./spotify/SpotifySongSource.js')
  }
}
