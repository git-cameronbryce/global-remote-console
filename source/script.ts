import { discord } from './other-config/configuration.json'
import { Client, GatewayIntentBits } from 'discord.js';
import { CommandKit } from 'commandkit';

import path from 'path';
const client: Client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'command-handler'),
  // eventsPath: path.join(__dirname, 'event-handler'),
  devGuildIds: ['1253089110026096752'],
  bulkRegister: true
});

client.login(discord.token)
  .then(() => console.log('Client logged in...'))