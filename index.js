const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;
let server;

client.on("ready", ready => {
    server = client.guilds.cache.get(config.bot_server);
    console.log(`Bot ${client.user.tag} encendido`)
})

client.on('message', message => {

    const args = message.content.slice(prefix.length).split(/ +/);

    let embed_to_member = new Discord.MessageEmbed()
    .setDescription("Gracias por abrir un ticket de soporte en el servidor " + server.name + ", el Staff se pondrá en contacto contigo mediante el bot lo más rápido posible.")
    .setColor("#FF0080")
    .setFooter(server.name + " | " + server.id, server.iconURL({dynamic: true}))
    .setTimestamp()

    let new_ticket_embed = new Discord.MessageEmbed()
    .setTitle("Nuevo ticket")
    .setDescription(message.content)
    .setAuthor(message.author.tag + " | " + message.author.id, message.author.avatarURL({dynamic: true}))
    .setColor("RANDOM")
    .setFooter(server.name + " | " + server.id, server.iconURL({dynamic: true}))
    .setTimestamp()

    let embed_to_emulado = new Discord.MessageEmbed()
    .setTitle("Staff:")
    .setAuthor(message.author.tag + " | " + message.author.id, message.author.avatarURL({dynamic: true}))
    .setDescription(message.content)
    .setColor("RANDOM")
    .setFooter(server.name + " | " + server.id, server.iconURL({dynamic: true}))
    .setTimestamp()
    
    let embed_to_not_emulado = new Discord.MessageEmbed()
    .setTitle("Staff:")
    .setAuthor(message.author.tag + " | " + message.author.id, message.author.avatarURL({dynamic: true}))
    .setDescription(args.slice(1).join(" "))
    .setColor("RANDOM")
    .setFooter(server.name + " | " + server.id, server.iconURL({dynamic: true}))
    .setTimestamp()

    let old_ticket_embed = new Discord.MessageEmbed()
    .setDescription(message.content)
    .setAuthor(message.author.tag + " | " + message.author.id, message.author.avatarURL({dynamic: true}))
    .setColor("RANDOM")
    .setFooter(server.name + " | " + server.id, server.iconURL({dynamic: true}))
    .setTimestamp()

    let closeEmbed = new Discord.MessageEmbed()
    .setTitle("Ticket cerrado")
    .setDescription(`Ticket cerrado por ${message.author.tag}, vuelve a enviarme un mensaje solo en caso de querer abrir un nuevo ticket`)

    if (message.author.bot) return;

    if (message.attachments.size > 0) {
        var Attachment = (message.attachments).array();
        Attachment.forEach(function(attachment) {
            old_ticket_embed.setImage(attachment.proxyURL)
            new_ticket_embed.setImage(attachment.proxyURL)
            embed_to_emulado.setImage(attachment.proxyURL)
            embed_to_not_emulado.setImage(attachment.proxyURL)
    }
)
}

        if (message.channel.type === "dm") {
                    
          
            const contact_channel = server.channels.cache.find(channel => channel.topic === message.author.id);

            if (!contact_channel) {

                message.channel.send(embed_to_member) 
                message.react("✅")
                server.channels.create(message.author.tag, {
                    type: 'text',
                    parent: config.categoria,
                    topic: message.author.id
                }).then((channel) => {
                    channel.send(new_ticket_embed)
                })
            } else {

                message.react("✅")
                contact_channel.send(old_ticket_embed)

            }

        }

    if (message.channel.type === "text") {
  
        if (message.channel.parentID === config.categoria) {

          let user = server.members.cache.get(message.channel.topic);
          if(!user)
            user = server.members.fetch(message.channel.topic);
                      
            
            if (config.MD_emulado) {

              user.send(embed_to_emulado)
            
            } else {
          	if (message.content.startsWith(`${prefix}reply`)) {
                message.react("✅")
                user.send(embed_to_not_emulado)
              } else if(message.content === `${prefix}close`) {


                   message.channel.delete()
                  .then(() => user.send(closeEmbed))
                  .catch((error) => message.channel.send("ERROR: " + error))
            }
          }
         }
        }
      }
    )

client.login(config.token)
