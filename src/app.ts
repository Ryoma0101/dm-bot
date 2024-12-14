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
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Botが準備完了したときに実行
client.once("ready", () => {
  console.log(`Bot is online! Logged in as ${client.user?.tag}`);

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
    channel
      .send({ content: messageContent, components: [row] })
      .catch(console.error);
  } else {
    console.error(
      "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
    );
  }
});

// ボタンのインタラクションをリッスン
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) return; // ボタンインタラクション以外は無視

  if (interaction.customId === "confirm_button") {
    try {
      await interaction.reply({
        content: "ボタンが押されました！",
        ephemeral: true,
      });
      console.log("ボタンがクリックされ、応答しました。");
    } catch (error) {
      console.error("インタラクションの処理中にエラーが発生しました:", error);
    }
  }
});

// Botをログイン
client.login(token).catch(console.error);
