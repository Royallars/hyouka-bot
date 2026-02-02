const assignAutoRole = async (member, config) => {
  if (!config.autoRoleId) {
    return;
  }

  const role = await member.guild.roles.fetch(config.autoRoleId);
  if (!role) {
    return;
  }

  try {
    await member.roles.add(role, "Auto role assignment");
  } catch (error) {
    return;
  }
};

module.exports = { assignAutoRole };
