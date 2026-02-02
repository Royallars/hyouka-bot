const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const createBanner = async (member) => {
  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#1e1f22";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#5865f2";
  context.fillRect(0, 0, width, 10);

  context.fillStyle = "#ffffff";
  context.font = "36px sans-serif";
  context.fillText("Welcome", 40, 80);

  context.font = "28px sans-serif";
  context.fillText(member.user.tag, 40, 130);

  const avatar = await loadImage(member.user.displayAvatarURL({ extension: "png", size: 256 }));
  const avatarSize = 160;
  const avatarX = width - avatarSize - 40;
  const avatarY = height / 2 - avatarSize / 2;

  context.save();
  context.beginPath();
  context.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
  );
  context.closePath();
  context.clip();
  context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  context.restore();

  return canvas.toBuffer("image/png");
};

const sendWelcomeBanner = async (member, config) => {
  const channelId = config.welcomeChannelId || member.guild.systemChannelId;
  if (!channelId) {
    return;
  }

  const channel = await member.guild.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) {
    return;
  }

  const banner = await createBanner(member);
  const attachment = new AttachmentBuilder(banner, { name: "welcome.png" });

  await channel.send({
    content: `Welcome to **${member.guild.name}**, ${member}!`,
    files: [attachment],
  });
};

module.exports = { sendWelcomeBanner };
