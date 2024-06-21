import type { CommandKit } from 'commandkit';
import { Events, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, Client, Interaction, ModalBuilder } from 'discord.js';
import { RconProps } from '../event-interface/interface'
import { Rcon } from 'rcon-client'
import { supabase } from '../../../script';

export default function (c: Client<true>, client: Client<true>, handler: CommandKit) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'asa-connect-gameserver') {
        const modal = new ModalBuilder()
          .setCustomId('asa-rcon-modal')
          .setTitle('Remote Connection Parameters')

        const inputPassword = new TextInputBuilder()
          .setCustomId('asa-rcon-password').setLabel('Required Rcon Password').setMinLength(0).setMaxLength(75)
          .setPlaceholder('...oAg66TcQYUnYXBQn17A161-N86cN5jWDp7')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)

        const inputHost = new TextInputBuilder()
          .setCustomId('asa-rcon-host').setLabel('Required Rcon Host').setMinLength(0).setMaxLength(15)
          .setPlaceholder('30.214.216.218')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)

        const inputPort = new TextInputBuilder()
          .setCustomId('asa-rcon-port').setLabel('Required Rcon Port').setMinLength(0).setMaxLength(5)
          .setPlaceholder('11290')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)

        const inputPasswordRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
          .addComponents(inputPassword)

        const inputHostRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
          .addComponents(inputHost)

        const inputPortRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
          .addComponents(inputPort)

        modal.addComponents(inputPasswordRow, inputHostRow, inputPortRow)
        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'asa-rcon-modal') {
        const information: RconProps = {
          password: interaction.fields.getTextInputValue('asa-rcon-password'),
          host: interaction.fields.getTextInputValue('asa-rcon-host'),
          port: parseInt(interaction.fields.getTextInputValue('asa-rcon-port'))
        }

        try {
          const rcon: Rcon = await Rcon.connect(information);
          console.log(rcon);

          const { error, data } = await supabase
            .from('asa-configuration')
            .upsert(([{ remote: { password: information.password, host: information.host, port: information.port } }]))
            .select()

          await interaction.reply({ content: `Rcon Authenticated: ${rcon.authenticated}` });
        } catch (error) {
          console.log(error)
        }
      }
    }
  });
};

