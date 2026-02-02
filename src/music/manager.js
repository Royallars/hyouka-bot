const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const guildQueues = new Map();

const createQueue = (guildId) => {
  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
  });

  const queue = {
    guildId,
    connection: null,
    player,
    tracks: [],
    playing: false,
    currentTrack: null,
  };

  player.on(AudioPlayerStatus.Idle, () => {
    queue.playing = false;
    playNext(queue);
  });

  player.on("error", () => {
    queue.playing = false;
    playNext(queue);
  });

  guildQueues.set(guildId, queue);
  return queue;
};

const getQueue = (guildId) => guildQueues.get(guildId) || createQueue(guildId);

const connectToChannel = (queue, channel) => {
  if (queue.connection) {
    return queue.connection;
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true,
  });

  connection.subscribe(queue.player);
  queue.connection = connection;
  return connection;
};

const playNext = (queue) => {
  if (queue.playing) {
    return;
  }

  const nextTrack = queue.tracks.shift();
  if (!nextTrack) {
    queue.currentTrack = null;
    return;
  }

  const stream = ytdl(nextTrack.url, {
    filter: "audioonly",
    highWaterMark: 1 << 25,
  });
  const resource = createAudioResource(stream, {
    inlineVolume: true,
  });

  queue.playing = true;
  queue.currentTrack = nextTrack;
  queue.player.play(resource);
};

const enqueueTrack = (queue, track) => {
  queue.tracks.push(track);
  playNext(queue);
};

const stopQueue = (queue) => {
  queue.tracks = [];
  queue.currentTrack = null;
  queue.player.stop(true);
  if (queue.connection) {
    queue.connection.destroy();
    queue.connection = null;
  }
};

module.exports = {
  connectToChannel,
  enqueueTrack,
  getQueue,
  stopQueue,
  playNext,
};
