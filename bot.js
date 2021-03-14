const { Client, MessageEmbed } = require("discord.js");
const client = new Client({ignoreDirect: true, ignoreRoles: true, ignoreEveryone: true});
client.setMaxListeners(50);
const request = require("request");
const ayarlar = require("./ayarlar.json")

const prefix = ayarlar.prefix
const güvenlix = ayarlar.güvenli
const sunucu = ayarlar.sunucuID
const logkanal = ayarlar.guardlog
const arr = ayarlar.perm
const botrole = ayarlar.botrole

client.on("ready", async () => {
    console.log(`Bot Başarı İle Aktif Oldu`);
    client.user.setPresence(`Kado 🧡 Lethope`, { type: "WATCHING"});
    client.user.setStatus("dnd");
    });


client.on("ready", async function() {
const voiceChannel = "810617447148290089"
client.channels.cache.get(voiceChannel).join()
.catch(err => {
throw err;
})
})

//////////////// SAĞ TIK BAN KORUMASI ////////////////


client.on("guildBanAdd", async (guild, user) => {
const logs = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" });
const log = logs.entries.first();
if (!log) return;
const target = log.target;
const id = log.executor.id;
if (!güvenlix.includes(id)) {
let users = guild.members.cache.get(id);
let kullanici = guild.members.cache.get(client.user.id);
users.kick()
const embed = new MessageEmbed()
.setDescription(`${users} (\`${users.id}\`) İsimli Yetkili Bir Üyeyi Sağ Tık Kullanarak Sunucudan Banladı Gerekli İşlemler Yapıldı`)
client.channels.cache.get(logkanal).send(embed)
}})

//////////////// SAĞ TIK BAN KORUMASI ////////////////






//////////////// KANAL AÇMA KORUMASI ////////////////

client.on("channelCreate", async (channel) => {
  const guild = channel.guild;
  guild.fetchAuditLogs().then(async (logs) => {
  if(logs.entries.first().action === `CHANNEL_CREATE`) {
  const id = logs.entries.first().executor.id;
  if(!güvenlix.includes(id)) {
  const users = guild.members.cache.get(id);
  const kullanici = guild.members.cache.get(client.user.id);    
    users.kick()
    channel.delete()
    const embed = new MessageEmbed()
    .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Kanal Oluşturuldu Gerekli İşlemler Yapıldı`)
    client.users.cache.get(channel.guild.ownerID).send(embed)
  }}})})

//////////////// KANAL AÇMA KORUMASI ////////////////






//////////////// KANAL SİLME KORUMASI ////////////////

client.on("channelDelete", async (channel) => {
  const guild = channel.guild;
  guild.fetchAuditLogs().then(async (logs) => {
  if (logs.entries.first().action === `CHANNEL_DELETE`) {
  const id = logs.entries.first().executor.id;
  if (!güvenlix.includes(id)) {
  const users = guild.members.cache.get(id);
  const kullanici = guild.members.cache.get(client.user.id);
 
    users.kick()
    await channel.clone().then(async kanal => {
      if (channel.parentID != null) await kanal.setParent(channel.parentID);
      await kanal.setPosition(channel.position);
      if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
    });
    const embed = new MessageEmbed()
    .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Kanal Silindi Gerekli İşlemler Yapıldı`)
    client.channels.cache.get(logkanal).send(embed)
  }}})})

//////////////// KANAL SİLME KORUMASI ////////////////






//////////////// KANAL GÜNCELLEME KORUMASI ////////////////

    client.on("channelUpdate", async (oldChannel, newChannel) => {
      let guild = newChannel.guild;
      guild.fetchAuditLogs().then(async (logs) => {
      if(logs.entries.first().action === `CHANNEL_UPDATE`) {
  let id = logs.entries.first().executor.id;
    if(!güvenlix.includes(id)) {
    let users = guild.members.cache.get(id);
      if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
      if (newChannel.type === "category") {
        newChannel.edit({
          name: oldChannel.name,
        });
      } else if (newChannel.type === "text") {
        newChannel.edit({
          name: oldChannel.name,
          topic: oldChannel.topic,
          nsfw: oldChannel.nsfw,
          rateLimitPerUser: oldChannel.rateLimitPerUser
        });
      } else if (newChannel.type === "voice") {
        newChannel.edit({
          name: oldChannel.name,
          bitrate: oldChannel.bitrate,
          userLimit: oldChannel.userLimit,
        });
      };
      oldChannel.permissionOverwrites.forEach(perm => {
        let thisPermOverwrites = {};
        perm.allow.toArray().forEach(p => {
          thisPermOverwrites[p] = true;
        });
        perm.deny.toArray().forEach(p => {
          thisPermOverwrites[p] = false;
        });
        newChannel.createOverwrite(perm.id, thisPermOverwrites);
      });
      users.kick()
        const embed = new MessageEmbed()
        .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Kanal Güncellendi Gerekli İşlemler Yapıldı`)
        client.channels.cache.get(logkanal).send(embed)
    }}})})

//////////////// KANAL GÜNCELLEME KORUMASI ////////////////






//////////////// ROL SİLME KORUMASI ////////////////

  client.on("roleDelete", async (role) => {
    const guild = role.guild;
    let sil = guild.roles.cache.get(role.id);
    guild.fetchAuditLogs().then(async (logs) => {
    if(logs.entries.first().action === `ROLE_DELETE`) {
    const id = logs.entries.first().executor.id;
    if(!güvenlix.includes(id)) {
    const users = guild.members.cache.get(id);
    const kullanici = guild.members.cache.get(client.user.id);
    let yeniRol = await role.guild.roles.create({
      data: {
        name: role.name,
        color: role.hexColor,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable
      }
    });
users.kick()
      const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Rol Silindi Gerekli İşlemler Yapıldı`)
      client.channels.cache.get(logkanal).send(embed)
    }}})})

//////////////// ROL SİLME KORUMASI ////////////////






//////////////// ROL AÇMA KORUMASI ////////////////

client.on("roleCreate", async (role) => {
  let guild = role.guild;
  guild.fetchAuditLogs().then(async (logs) => {
  if(logs.entries.first().action === `ROLE_CREATE`) {
  let id = logs.entries.first().executor.id;
  if(!güvenlix.includes(id)) {
  let users = guild.members.cache.get(id);
  let kullanici = guild.members.cache.get(client.user.id);
  role.delete();
 users.kick()
    const embed = new MessageEmbed()
    .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Rol Oluşturuldu Gerekli İşlemler Yapıldı`)
    client.channels.cache.get(logkanal).send(embed)
  }}})})

//////////////// ROL AÇMA KORUMASI ////////////////






//////////////// ROL GÜNCELLEME KORUMASI ////////////////

  client.on("roleUpdate", async (oldRole, newRole) => {
    let guild = newRole.guild;
    guild.fetchAuditLogs().then(async (logs) => {
    if(logs.entries.first().action === `ROLE_UPDATE`) {
let id = logs.entries.first().executor.id;
  if(!güvenlix.includes(id)) {
  let users = guild.members.cache.get(id);
    if (arr.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
      newRole.setPermissions(oldRole.permissions);
      newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
    };
    newRole.edit({
      name: oldRole.name,
      color: oldRole.hexColor,
      hoist: oldRole.hoist,
      permissions: oldRole.permissions,
      mentionable: oldRole.mentionable
    });
      users.kick()
      const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Rol Güncellendi Gerekli İşlemler Yapıldı`)
      client.channels.cache.get(logkanal).send(embed)
    }}})})

//////////////// ROL GÜNCELLEME KORUMASI ////////////////






//////////////// WEBHOK KORUMASI ////////////////

    client.on("webhookUpdate", async (channel) => {
      let guild = channel.guild;
      guild.fetchAuditLogs().then(async (logs) => {
      if (logs.entries.first().action === `WEBHOOK_CREATE`) {
      let yetkili = logs.entries.first().executor;
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
      let users = guild.members.cache.get(id);
      let kullanic = guild.members.cache.get(client.user.id);
      users.kick()
      const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Webhook (Açtı - Düzenledi - Sildi) Gerekli İşlemler Yapıldı`)
      client.channels.cache.get(logkanal).send(embed)
      }}})})

//////////////// WEEBHOK KORUMASI ////////////////






//////////////// BOT KORUMASI ////////////////

      client.on("guildMemberAdd", async (member) => {
        const guild = member.guild;
        guild.fetchAuditLogs().then(async (logs) => {
        if(logs.entries.first().action === `BOT_ADD`) {
        const id = logs.entries.first().executor.id;
        if(!güvenlix.includes(id)) {
        if(member.user.bot){
        const users = guild.members.cache.get(id);
        const kullanici = guild.members.cache.get(client.user.id);
        users.kick()
          const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Sunucuya Bot Ekledi Gerekli İşlemler Yapıldı`)
      member.ban()
      client.channels.cache.get(logkanal).send(embed)
        }}}})})

//////////////// BOT KORUMASI ////////////////






//////////////// SUNUCU KORUMASI ////////////////

        client.on("guildUpdate", async (oldGuild, newGuild) => {
          let guild = newGuild.guild
      let logs = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'})
      let yetkili = logs.entries.first().executor;
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
      let users = guild.members.cache.get(id);
      let kullanic = guild.members.cache.get(client.user.id);
          if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
          if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
         users.kick()
            const embed = new MessageEmbed()
        .setDescription(`${users} (\`${users.id}\`) İsimli Kullanıcı Tarafından Sunucu Güncellendi Gerekli İşlemler Yapıldı`)
        client.channels.cache.get(logkanal).send(embed)
          }})

//////////////// SUNUCU KORUMASI ////////////////

      client.login(process.env.token);