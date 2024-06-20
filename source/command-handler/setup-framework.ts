import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommandProps, CommandOptions } from 'commandkit';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('asa-setup-framework')
  .setDescription('Setup process, generates required categories.');

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply({ ephemeral: false });

  const installation: ButtonBuilder = new ButtonBuilder()
    .setCustomId('asa-setup-framework')
    .setLabel('Continue Installation')
    .setStyle(ButtonStyle.Success);

  const donation: ButtonBuilder = new ButtonBuilder()
    .setURL('https://example.com/')
    .setLabel('Donation')
    .setStyle(ButtonStyle.Link)

  const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(installation, donation);

  const embed: EmbedBuilder = new EmbedBuilder()
    .setDescription('**Ark Survival Ascended**\n**Account Setup & Overview**\nThis app was designed to integrate into any external hosting provider remotely, without overcomplexity.\n\n**Additional Information**\nWe balance stability then features, in that order. Donations received will be towards funding ongoing development and staff.')
    .setFooter({ text: 'Note: Contact support if issues persist.', iconURL: 'https://i.imgur.com/6OWyTsr.png' })
    .setImage('https://i.imgur.com/bFyqkUS.png')
    .setColor(0x2ecc71);

  await interaction.followUp({ embeds: [embed], components: [row] });
}

export const options: CommandOptions = {
  userPermissions: ['Administrator'],
};
