const keepAlive = require("./server");
const Monitor = require("ping-monitor");
const chalk = require("chalk");
const path = require("path");
const { ActivityType } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { admin, db } = require(
  path.join(__dirname, "./", "firebase", "firebaseConfig.js"),
);

keepAlive();

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
require("dotenv/config");
//configenv();
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

const fs = require("fs");
const config = require("./config.json");

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.prefix = config.prefix;

module.exports = client;

fs.readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

function getCurrentTimeInMexicoCity() {
  const options = {
    timeZone: "America/Mexico_City", // Zona horaria de Ciudad de México
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Cambia a true si quieres formato de 12 horas
  };

  const date = new Date();
  return new Intl.DateTimeFormat("es-MX", options).format(date);
}

// Ejemplo de uso
console.log(`Hora en Ciudad de México: ${getCurrentTimeInMexicoCity()}`);

const audioFolder = path.join(__dirname, 'musica'); // Carpeta donde están los archivos MP3
const authorizedUserId = '530934976074743809'; // ID del usuario autorizado para saltar canciones

client.once('ready', () => {
    console.log(`${client.user.tag}`);

    const voiceChannelId = '1300842956537856000';
    const guild = client.guilds.cache.get('1284557762553974814'); 

    const voiceChannel = guild.channels.cache.get(voiceChannelId);

    if (voiceChannel) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        const audioFiles = fs.readdirSync(audioFolder).filter(file => file.endsWith('.mp3'));
        const initialFile = 'DreamKiller - Lipsing.mp3';

        const playInitial = () => {
            const resource = createAudioResource(path.join(audioFolder, initialFile));
            player.play(resource);

            client.user.setPresence({
                activities: [{ name: `- ${path.basename(initialFile, '.mp3')}`, type: ActivityType.Listening }],
                status: 'dnd',
            });
        };

        const playNext = () => {
            const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
            const resource = createAudioResource(path.join(audioFolder, randomFile));
            player.play(resource);

            const trackName = path.basename(randomFile, '.mp3');

            setTimeout(() => {
                client.user.setPresence({
                    activities: [{ name: `♡ ${trackName}`, type: ActivityType.Listening }],
                    status: 'dnd',
                });
            }, 1000);
        };

        playInitial();

        player.on(AudioPlayerStatus.Idle, playNext);
        player.on('error', error => {
            console.error('Error al reproducir:', error.message);
        });

        client.on('messageCreate', (message) => {
            if (message.content === `<@${client.user.id}> skip`) {
                if (message.author.id === authorizedUserId) {
                    playNext();
                    message.channel.send('⏭️ Canción saltada a la siguiente aleatoria.');
                } else {
                    message.channel.send('🚫 No tienes permiso para saltar canciones.');
                }
            }
        });
    } else {
        console.log('No se encontró el canal de voz con el ID proporcionado.');
    }
});

client.login(process.env.TOKEN);
