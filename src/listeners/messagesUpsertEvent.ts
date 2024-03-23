import { PREFIX } from "#bajigur/config.js";
import ApplyMetadata from "#bajigur/decorators/ApplyMetadata.js";
import Listener from "#bajigur/structures/Listener.js";
import { IListener } from "#bajigur/types/index.js";
import { BaileysEventMap } from "@whiskeysockets/baileys";

@ApplyMetadata<IListener>({
    name: "messages.upsert"
})
export default class messagesUpsertEvent extends Listener {
    public override run({ messages }: BaileysEventMap["messages.upsert"]): void {
        const messageData = messages[0];
        const findMessage = messageData.message?.conversation?.length
            ? messageData.message.conversation
            : messageData.message?.extendedTextMessage?.text ??
              messageData.message?.imageMessage?.caption ??
              messageData.message?.videoMessage?.caption ??
              messageData.message?.documentWithCaptionMessage?.message?.documentMessage?.caption ??
              messageData.message?.groupInviteMessage?.caption ??
              messageData.message?.liveLocationMessage?.caption;

        if (
            !findMessage?.startsWith(PREFIX) ||
            Boolean(messageData.key.fromMe) ||
            !this.client.commands.isReady
        )
            return;

        this.client.commands.handle(findMessage, messageData);
    }
}
