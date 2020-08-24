const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;
const server = client.guilds.cache.get(config.bot_server);

client.on("ready", ready => {
    console.log(`Bot ${client.user.tag} encendido`)
})

client.on('message', message => {

    const args = message.content.slice(prefix.length).split(/ +/);

    if (message.author.bot) return;

        if (message.channel.type === "dm") {
          
            const contact_channel = server.channels.cache.find(channel => channel.name === message.author.id);

            if (!contact_channel)

                server.channels.create(message.author.id, {
                    type: 'text',
                    parent: config.categoria,
                    topic: message.author.tag
                }).then((channel) => {

                    channel.send(`${message.author.tag}: \`\`\`${message.content}\`\`\``);

                })

            else

                contact_channel.send(`${message.author.tag}: \`\`\`${message.content}\`\`\``)

        }
    }

    if (message.channel.type === "text") {
        if (message.channel.parentID !== config.categoria) return;
        else {
            var user = server.members.cache.get(message.channel.name)
            if (config.MD_emulado === true) {
                user.send(message.content)
            } else {
                if (message.content.startsWith(`${prefix}reply`)) {
                    user.send(`${message.author.tag}: \`\`\`${args.slice(1).join(" ")}\`\`\``)
                } else return
            }
        }
    
})

client.login(config.token)
