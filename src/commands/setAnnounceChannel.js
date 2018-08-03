import Settings from "../models/settingsModel";
import * as Embeds from "../embeds";
import { permCheck } from "../helpers";
import logger from "../logger";

export default async function setAnnounceChannel(message, client, args) {
    if (permCheck(message, "staff") === false) {
        logger.info(`Insufficient permission. User: ${message.author.username}:${message.author.id}.`)
        const embed = Embeds.errorEmbed("Insufficient permission.");
        return message.channel.send(embed);
    }
    const guildsettings = await Settings.find();
    if (args.length === 0) {
        logger.info(`Invalid arguments specified by user ${message.author.username}:${message.author.id}.`)
        const embed = Embeds.errorEmbed(
            "Invalid arguments, please check '>help'."
        );
        return message.channel.send(embed);
    }
    const channel = client.channels.find("name", args[0]);
    if (!channel) {
        logger.error(`Tried to fetch channel that did not exist.`)
        const embed = Embeds.errorEmbed("Channel does not exist.");
        return message.channel.send(embed);
    }
    if (!guildsettings[0]) {
        const eventChannel = new Settings({ announce_channel: channel.id });
        eventChannel.save((err, channel) => {
            if (err) return console.error(err);
            logger.info(`${channel.id} saved to the collection.`)
        });
        const embed1 = Embeds.successEmbed(
            `The bot will now make event announcements in channel "${args[0]}".`
        );
        return message.channel.send(embed1);
    }
    if (guildsettings[0].eventChannel) {
        Settings.updateOne(
            { _id: guildsettings[0]._id },
            { $set: { announce_channel: channel.id } },
            (err, res) => {
                if (!err) {
                    logger.info(`${channel.id} updated to the collection.`)
                    const embed = Embeds.successEmbed(
                        `Announcements will now be made in the channel "${args[0]}".`
                    );
                    return message.channel.send(embed);
                } else if (err) return logger.error(`Error occured updating the announcement channel collection.`);
            }
        );
    }
}
