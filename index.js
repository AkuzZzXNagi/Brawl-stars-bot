index.js
const { Client, GatewayIntentBits } = require('discord.js');
const Parser = require('rss-parser');
const cron = require('node-cron');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const parser = new Parser();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const RSS_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UCooVYzDxdwTtGYAkcPmOgOw";

let lastVideo = "";

client.once('ready', () => {
  console.log(`Connecté : ${client.user.tag}`);

  cron.schedule('*/10 * * * *', async () => {
    const feed = await parser.parseURL(RSS_URL);
    const latest = feed.items[0];

    if (latest.id !== lastVideo) {
      lastVideo = latest.id;

      const channel = await client.channels.fetch(CHANNEL_ID);
      channel.send(`🚨 Nouvelle vidéo Brawl Stars !\n${latest.title}\n${latest.link}`);
    }
  });
});

client.login(TOKEN);
