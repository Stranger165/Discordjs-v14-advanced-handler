const { Embed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Returns websocket latency",

  run: async (client, message) => {
    const embed = new Embed()
      .setColor("#FF0000")
      .setTitle("🏓 Pong!")
      .setDescription(`Latency : ${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` });
    return message.channel.send({ embeds: [embed] });
  },
};

