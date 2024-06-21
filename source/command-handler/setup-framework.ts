import { ButtonInteraction, SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ChannelType, CategoryChannel, TextChannel } from 'discord.js';
import { SlashCommandProps, CommandOptions, ButtonKit } from 'commandkit';
import { supabase } from '../script'

export const data = new SlashCommandBuilder()
  .setName('asa-setup-framework')
  .setDescription('Setup process, generates required categories.');

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply({ ephemeral: false });

  const installation = new ButtonKit()
    .setCustomId('asa-setup-framework')
    .setLabel('Continue Installation')
    .setStyle(ButtonStyle.Success);

  const donation = new ButtonKit()
    .setURL('https://example.com/')
    .setLabel('Donation')
    .setStyle(ButtonStyle.Link)

  const row = new ActionRowBuilder<ButtonKit>()
    .addComponents(installation, donation);

  const embed: EmbedBuilder = new EmbedBuilder()
    .setDescription('**Ark Survival Ascended**\n**Account Setup & Overview**\nThis app was designed to integrate into any external hosting provider remotely, without overcomplexity.\n\n**Additional Information**\nWe balance stability then features, in that order. Donations received will be towards funding ongoing development and staff.')
    .setFooter({ text: 'Note: Contact support if issues persist.' })
    .setImage('https://i.imgur.com/bFyqkUS.png')
    .setColor(0x2ecc71);

  const message = await interaction.followUp({ embeds: [embed], components: [row] });

  installation.onClick(
    async (interaction: ButtonInteraction) => {
      interaction.reply('Button clicked!');

      const server: CategoryChannel = await interaction.guild!.channels.create({
        name: `ARC: Server Status`,
        type: ChannelType.GuildCategory
      });

      const serverGuildText: TextChannel = await interaction.guild!.channels.create({
        name: '𝗦erver-𝗦tatus',
        type: ChannelType.GuildText,
        parent: server
      });

      const connection = new ButtonKit()
        .setCustomId('asa-connect-gameserver')
        .setLabel('Connect Gameserver')
        .setStyle(ButtonStyle.Success);

      const donation = new ButtonKit()
        .setURL('https://example.com/')
        .setLabel('Support')
        .setStyle(ButtonStyle.Link)

      const row = new ActionRowBuilder<ButtonKit>()
        .addComponents(connection, donation);

      const embed = new EmbedBuilder()
        .setDescription('`🟠` `Service Restarting`\n[US] Example Gameserver ... ...\nPlayer Count: `(0/32)`\nID: ||123456||\n\n`🟢` `Service Online`\n[US] Example Gameserver ... ...\nPlayer Count: `(0/32)`\nID: ||123456||\n\n**Connected Gameservers**\n... ... ... ... ... ... ... ... ... ... ... ...\n... ... ... ... ... ... ... ... ... ... ... ...\n... ... ... ... ... ... ... ... ... ... ... ...')
        .setFooter({ text: 'Note: Contact support if issues persist.' })
        .setImage('https://i.imgur.com/bFyqkUS.png')
        .setColor(0x2ecc71);

      const serverGuildMessage = await serverGuildText.send({ embeds: [embed], components: [row] });

      const { error, data } = await supabase
        .from('asa-configuration')
        .upsert([
          {
            guild: interaction.guild!.id,
            server: { channel: server.id, message: serverGuildMessage.id }
          }])
        .select();

      if (error) console.log(error)
      console.log(data)
    }, { message }
  )
    .onEnd(() => {
      console.log('Button collector ended.')
      installation.setDisabled(true);
      message.edit({ components: [row] })
    })
}

export const options: CommandOptions = {
  userPermissions: ['Administrator'],
};