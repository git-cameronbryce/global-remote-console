import { ButtonInteraction, SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ChannelType, CategoryChannel } from 'discord.js';
import { SlashCommandProps, CommandOptions, ButtonKit } from 'commandkit';
import { supabase } from '../script'

export const data = new SlashCommandBuilder()
  .setName('asa-setup-framework')
  .setDescription('Setup process, generates required categories.');

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply({ ephemeral: false });

  interface InputProps {
    guild: string;
    user: string;
  };

  const input: InputProps = {
    guild: interaction.guild!.id,
    user: interaction.user!.id
  };

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

      const connection: CategoryChannel = await interaction.guild!.channels.create({
        name: `ARC: Connection Status`,
        type: ChannelType.GuildCategory
      });

      await interaction.guild!.channels.create({
        name: '𝗖onnection-𝗦tatus',
        type: ChannelType.GuildText,
        parent: connection
      });

      const server: CategoryChannel = await interaction.guild!.channels.create({
        name: `ARC: Server Status`,
        type: ChannelType.GuildCategory
      });

      await interaction.guild!.channels.create({
        name: '𝗦erver-𝗦tatus',
        type: ChannelType.GuildText,
        parent: server
      });

      const { error, data } = await supabase
        .from('asa-configuration')
        .insert([{ guild: interaction.guild!.id, connection: { id: connection.id }, server: { id: server.id } }])
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


/*
[:guild] [:username] [:]

*/