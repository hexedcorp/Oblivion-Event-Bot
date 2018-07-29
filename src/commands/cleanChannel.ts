import Helpers from "./helpers";
import permCheck from "./permCheck";
import { Message } from "discord.js";

export default async function cleanChannel(message: Message, args: string[]) {
  if (permCheck(message, "staff") === false) {
    const embed = await Helpers.errorEmbed(
      "You do not have the required permission to do this."
    );
    return message.channel.send(embed);
  }
  if (!args) {
    const embed = await Helpers.errorEmbed(
      "Invalid arguments, please check '>help'."
    );
    return message.channel.send(embed);
  }
  let numberOfMessages: string = args[0];
  if (isNaN(parseInt(numberOfMessages)) === true) {
    const embed = await Helpers.errorEmbed(
      "Invalid arguments, please check '>help'."
    );
    return message.channel.send(embed);
  }
  message.delete();
  let messages = await message.channel
    .fetchMessages({ limit: parseInt(numberOfMessages) })
    .catch(async e => {
      console.log(e);
      const embed = await Helpers.successEmbed(
        "Failed to fetch messages to delete."
      );
      return message.channel.send(embed);
    });
  return message.channel
    .bulkDelete(messages)
    .then(async () => {
      const embed = await Helpers.successEmbed(
        `Cleared ${parseInt(numberOfMessages)} messages.`
      );
      return message.channel.send(embed).then(m => m.delete(20000));
    })
    .catch(async (err: object) => {
      const embed = await Helpers.errorEmbed(err.message);
      return message.channel.send(embed);
    });
}