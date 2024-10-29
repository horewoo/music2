const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Muestra información detallada de un usuario.',
  usage: '@usuario',
  run: async (client, message, args) => {
    const targetUserId = message.mentions.users.first()?.id || args[0] || message.author.id;

    try {
      const user = await client.users.fetch(targetUserId);
      const member = message.guild.members.cache.get(targetUserId);
      const embed = new EmbedBuilder()
        .setColor('#f5c591')
        .setTitle(`> Información de ${user.tag}<:fr_bun_sip:1182414043932274688>`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '<:fr_separador1:1182802278030266380> Nombre de usuario', value: user.username, inline: true },
          { name: '<:fr_separador2:1182802280769138718> ID de usuario', value: user.id, inline: true },
          { name: '<:fr_separador5:1182802286179799050> Cuenta creada el', value: user.createdAt.toUTCString(), inline: true },
        );
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('<a:fr_error:1182414048793481236> | No se pudo obtener información del usuario.');
    }
  }
};
