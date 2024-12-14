import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
} from "discord.js";

// 環境変数からBotトークンとチャンネルIDを取得
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;

if (!token || !channelId) {
  console.error(
    "環境変数 DISCORD_TOKEN または CHANNEL_ID が設定されていません。"
  );
  process.exit(1);
}

// Discordクライアントを作成
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Botが準備完了したときに実行
client.once("ready", () => {
  console.log(`Bot is online! Logged in as ${client.user?.tag}`);
});

// メッセージをリッスンして、特定のコマンドを処理
client.on("messageCreate", async (message) => {
  // Bot自身のメッセージは無視
  if (message.author.bot) return;

  // "!sendButton" コマンドをチェック
  if (message.content === "!sendButton") {
    console.log(`Received command: ${message.content}`);

    // 任意のサーバーとチャンネルIDを設定してボタン付きメッセージを送信
    const messageContent = "以下のボタンを押してください。";

    const channel = client.channels.cache.get(channelId);
    if (channel instanceof TextChannel) {
      // ボタンを作成
      const button = new ButtonBuilder()
        .setCustomId("confirm_button")
        .setLabel("確認")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      // メッセージとボタンを送信
      await channel
        .send({ content: messageContent, components: [row] })
        .catch(console.error);
    } else {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
    }
  }
});

// ボタンのインタラクションをリッスン
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) return; // ボタンインタラクション以外は無視

  if (interaction.customId === "confirm_button") {
    try {
      // ボタンがクリックされたことを通知
      await interaction.reply({
        content: "ボタンが押されました！",
        ephemeral: true,
      });

      // ユーザーにDMを送信
      const user = interaction.user;
      await user.send(
        "確認ありがとうございます！このメッセージはDMで送信されました。"
      );
      console.log(`DMを送信しました: ${user.tag}`);
    } catch (error) {
      console.error("インタラクションの処理中にエラーが発生しました:", error);

      // エラーが発生した場合、ユーザーにエラーメッセージを通知
      await interaction.reply({
        content: "DMの送信に失敗しました。",
        ephemeral: true,
      });
    }
  }
});

// Botをログイン
client.login(token).catch(console.error);
