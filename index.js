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

// Actualizar cada vez que quieras
/*setInterval(() => {
  console.log(`Hora actualizada en Ciudad de México: ${getCurrentTimeInMexicoCity()}`);
}, 60000); */
/*
// Función para generar un retraso aleatorio entre 1 y 5 minutos
function getRandomSmallDelay() {
  return Math.floor(Math.random() * (300000 - 60000 + 1)) + 60000; // 60000 ms (1 min) - 300000 ms (5 min)
}

async function sendE621Post() {
  try {
    const serverRef = await db.collection("e621Automation").get();

    serverRef.forEach(async (doc) => {
      const serverID = doc.id;

      // Configurar el listener en la subcolección "automations"
      db.collection("e621Automation")
        .doc(serverID)
        .collection("automations")
        .onSnapshot(async (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added" || change.type === "modified") {
              const autoDoc = change.doc;
              const data = autoDoc.data();
              const search = data.search;
              const channelID = data.idChannel;
              const timing = parseInt(data.timing) * 60000; // Convertir minutos a milisegundos
              const channel = client.channels.cache.get(channelID);

              if (!channel) {
                console.log(`Canal con ID ${channelID} no encontrado. Eliminando el documento...`);
                await db.collection("e621Automation")
                  .doc(serverID)
                  .collection("automations")
                  .doc(autoDoc.id)
                  .delete();
                return;
              }

              const tiemporeal = timing / 1000;
              console.log(`﹒♡ Publicando en ${channelID} cada ${tiemporeal / 60} minutos. ${getCurrentTimeInMexicoCity()}\n`);

              // Ejecutar la función repetida
              const smallDelay = getRandomSmallDelay();
              const totalDelay = timing + smallDelay;
              console.log(`﹒♡ Publicación '${search}' aparecerá en ${totalDelay / 1000} segundos, es decir, ${totalDelay / 60000} minutos.`)

              setInterval(async () => {
                try {
                  const minutosEntero = Math.floor(totalDelay / 60000);
                  await channel.send(`-# Próximo envío programado el ${getCurrentTimeInMexicoCity()} en ${minutosEntero} minuto(s).`);

                  // Añadir un retraso antes de realizar la búsqueda
                  await new Promise(resolve => setTimeout(resolve, smallDelay));

                  const options = {
                    TOKEN: "5gKNWJfn5QmvQWzgqBm9wsQV",
                    agent: "OLIVER TECH, oliverogers.812@gmail.com",
                    axiosOptions: { timeout: 10000 },
                  };
                  const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
                  const { E6 } = require("furry-wrapper");

                  // Realizar la búsqueda en e621 después del pequeño retraso
                  const results = await E6.nsfw(search, options);
                  console.log(`𐙚˙⋆.˚ ᡣ𐭩 Obteniendo '${search}' de e621.net\n${getCurrentTimeInMexicoCity()}\n︶︶⊹︶︶︶︶୨୧︶︶︶︶⊹︶︶\n`);
                  console.log(`${results.id}﹒♡﹒${search} | ¡Enviando!\n${getCurrentTimeInMexicoCity()}\n︶︶⊹︶︶︶︶୨୧︶︶︶︶⊹︶︶\n`);

                  const mensaje = `> <a:fr_ready:1182414061850329098> ⌗ ${results.file.url}\n> <:fr_separador3:1182802282664960090> **Artista(s):** __\`${results.tags.artist}\`__\n> -# Se envió el ${getCurrentTimeInMexicoCity()} (Hora CDMX).`;

                  const dsc = new ButtonBuilder()
                    .setLabel("Ir a la fuente.")
                    .setURL(`https://e621.net/posts/${results.id}`)
                    .setStyle("Link");

                  const row = new ActionRowBuilder().addComponents(dsc);

                  await channel.send({ content: mensaje, components: [row] });
                  console.log(`₊˚ʚ ᗢ₊˚ Envío exitoso: ${channelID} - ${search}\n${getCurrentTimeInMexicoCity()}\n︶︶⊹︶︶︶︶୨୧︶︶︶︶⊹︶︶\n`);

                } catch (err) {
                  console.error("Error obteniendo datos de e621:", err);
                  await channel.send(
                    `Error obteniendo datos de e621 para la búsqueda: ${search}`
                  );
                }
              }, totalDelay); // Aquí se mantiene el timing original
            }
          });
        });
    });
  } catch (err) {
    console.log(err);
  }
}

client.once("ready", async () => {
  console.log(`♡♡ / AUTOMATIZACIONES CON ${client.user.username} \ ♡♡`);
  await sendE621Post(); // Llama a la función para iniciar el envío automático
});
*/

const audioFolder = path.join(__dirname, 'musica'); // Carpeta donde están los archivos MP3

client.once('ready', () => {
    console.log(`Bot está listo como ${client.user.tag}`);

    const voiceChannelId = '1300237382238601266';
    const guild = client.guilds.cache.get('1284557762553974814'); 

    // Encuentra el canal de voz por ID
    const voiceChannel = guild.channels.cache.get(voiceChannelId); 

    if (voiceChannel) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        // Obtiene todos los archivos MP3 de la carpeta
        const audioFiles = fs.readdirSync(audioFolder).filter(file => file.endsWith('.mp3'));

        // Archivo específico que deseas reproducir al inicio
        const initialFile = 'Ayesha Erotica - V4T.mp3';

        // Reproduce el archivo inicial primero
        const playInitial = () => {
            const resource = createAudioResource(path.join(audioFolder, initialFile));
            player.play(resource);

            // Establece la presencia
            client.user.setPresence({
                activities: [{ name: `♡ ˖ ${path.basename(initialFile, '.mp3')}`, type: ActivityType.Listening }],
                status: 'dnd',
            });
        };

        // Función para reproducir otros archivos aleatorios
        const playNext = () => {
            // Elige un archivo aleatorio
            const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
            const resource = createAudioResource(path.join(audioFolder, randomFile));
            player.play(resource);

            // Obtiene solo el nombre del archivo sin la extensión
            const trackName = path.basename(randomFile, '.mp3'); // Elimina la extensión

            // Añade un pequeño retraso antes de actualizar la presencia
            setTimeout(() => {
                client.user.setPresence({
                    activities: [{ name: `♡ ˖ ${trackName}`, type: ActivityType.Listening }],
                    status: 'dnd',
                });
            }, 1000); // 1 segundo de retraso para asegurar que se reproduzca primero
        };

        // Reproduce el archivo inicial
        playInitial();

        // Maneja el evento cuando el reproductor está inactivo (cuando la canción termina)
        player.on(AudioPlayerStatus.Idle, playNext);
        player.on('error', error => {
            console.error('Error al reproducir:', error.message);
        });
    } else {
        console.log('No se encontró el canal de voz con el ID proporcionado.');
    }
});


client.login(process.env.TOKEN);
