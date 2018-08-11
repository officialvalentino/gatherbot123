const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const userlist = 'userlist.json'

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

var prefix = '!';
var vc;

client.on("ready", () => {
  console.log('ready!')
  client.user.setActivity('Proximity Invitational Scrims', { type: 'PLAYING' });
})

client.on('message', message => {
  //console.log(`message content: "${message.content}", message from: ${message.author.username}`)
  if(message.author.bot === true) return;
  if((message.guild.id != '470183289584615424') || (message.channel.type === 'dm')) return;
  if(!(message.content.startsWith(prefix))) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  var everyone = message.guild.roles.find('name', "@" + "everyone");
  if(command === 'help11'){
    message.delete()
    const embed = new Discord.RichEmbed()
    .setTitle("Help for Gather Bot")
   .setColor(0xe172e5)
   .setThumbnail(client.user.avatarURL)
   .addField("User Commands","**!createsquad \'Team name\' @player2 @player3 @player4**: Creates a role and a private voice channel for you and 3 other friends.\n**!createduo \'Team name\' @player2**: Creates a role and a private voice channel for you and 1 other friend.\n**!leave \'Team name\'**: Leaves team and private voice channel. Also removes Captain role.\n"+
   "**!join \'Team name\'**: Joins a squad role if there\'s room left.\n**!report @user <reason>**: Reports the mentioned user.\n**!addrole AU/NZ**: Adds the role you have chosen.\n**!removerole AU/NZ**: Removes the role you have chosen.", true)
  /*
   * commands
   */
   .addBlankField(true)
   .addField("Staff Commands", "**!cleanteams**: Cleans up empty team roles and channels.\n**!kick @player \'Team name\'**: Kicks the mentioned player from a team.\n**!gathercaptains**: Summons all captains to the queue-room voice channel.\n**!kick @user**: Kicks mentioned user from the server.\n**!ban @user**: Bans mentioned user from the server", true);
  message.channel.send({embed});
  /* old help cmd
    message.channel.send('**Help for ValBot**\n\n**User Commands**\n\`!createsquad \'Team name\' @player2 @player3 @player4\`: Creates a role and a private voice channel for you and 3 other friends.\n'+
    '\`!createduo \'Team name\' @player2\`: Creates a role and a private voice channel for you and 1 other friend.\n\`!leave \'Team name\'\`: Leaves team and private voice channel. Also removes Captain role.\n'+
  '\`!join \'Team name\'\`: Joins a squad role if there\'s room left.\n\`!help\`: This message.\n\n**Staff Commands**\n\`!cleanteams\`: Cleans up empty team roles and channels.\n\`!kick @player \'Team name\'\`: Kicks '+
'the mentioned player from a team.\n\`!gathercaptains\`: Summons all captains to the Captains voice channel.')
*/
  }

  if(command === 'clear'){

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have permission!");
    if(!args[0]) return message.channel.send("You do not have permission!");
    message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete(5000));
    });

    return;
  }

  if(command === 'say'){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have permission!");
    let saycommand = args.join(" ");
    message.delete().catch();
    message.channel.send(saycommand);

    return;
  }

  if(command === 'getrole11'){
    if(args.length > 1) return message.channel.send('Wrong arguments! \`!getrole NZ or !getrole AU\`')
    if((args[0].toUpperCase() === "AU") || (args[0].toUpperCase() === "NZ")){
      if(message.member.roles.find('name', args[0])) return message.channel.send('You already have that role! \`!getrole NZ or !getrole AU\`')
      message.member.addRole(message.guild.roles.find('name', args[0].toUpperCase()))
      message.channel.send('Role Added.').then(m => {m.delete(5000);message.delete(5000)}); return;
    } else return message.channel.send('Wrong arguments! \`!getrole NZ or !getrole AU\`')
  }

  if(command === 'removerole11'){
    if(args.length > 1) return message.channel.send('Wrong arguments! \`!removerole NZ or !removerole AU\`')
    if((args[0].toUpperCase() === "AU") || (args[0].toUpperCase() === "NZ")){
      if (!(message.member.roles.find('name', args[0]))) return message.channel.send('You don\'t have that role! \`!removerole NZ or !removerole AU\`')
      message.member.removeRole(message.guild.roles.find('name', args[0].toUpperCase()))
      message.channel.send('Role Removed.').then(m => {m.delete(5000);message.delete(5000)}); return;
    } else return message.channel.send('Wrong arguments! \`!removerole NZ or !removerole AU\`')
  }

  if(command === 'report11'){

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user!");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Report Incident")
    .setColor("#ffb521")
    .addField("Reported User", `${rUser}`)
    .addField("Reported By", `${message.author}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");

    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);
    return;
  }


  if(command === 'ban11'){


    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Couldn't find user!");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission!");
    if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("That person can't be banned!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("Ban Incident")
    .setColor("#ff2222")
    .addField("Banned User", `${bUser}`)
    .addField("Banned By", `${message.author}`)
    .addField("Banned In", message.channel)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);

    return;
  }


  if(command === 'kick11'){


    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Couldn't find user!");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission!");
    if(kUser.hasPermission("ADMINISTRATOR")) return message.channel.send("That person can't be kicked!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("Kick Incident")
    .setColor("#ff5e23")
    .addField("Kicked User", `${kUser}`)
    .addField("Kicked By", `${message.author}`)
    .addField("Kicked In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "incidents");
    if(!kickChannel) return message.channel.send("Can't find incidents channel.");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);



    return;
  }


  if(command === 'createsquad11'){
    if(args.length < 4) {message.channel.send('Not enough arguments! \`!createsquad \'Teamname\' @player2 @player3 @player4\`').then(m => {m.delete(10000);message.delete(10000)}); return;}
    if(!(message.content.includes('\''))) {message.channel.send('There was no quotes around your team name! \`!createsquad \'Teamname\' @player2 @player3 @player4\`').then(m => {m.delete(10000);message.delete(10000)}); return;}

    var teamname = message.content.match(/'((?:\\.|[^'\\])*)'/)[1]
    var captain = message.member;
    var player2 = message.mentions.members.array()[0]
    var player3 = message.mentions.members.array()[1]
    var player4 = message.mentions.members.array()[2]

    fs.readFile(userlist, 'utf8', function readFileCallback(err, d){
      if (err){
        console.log(err);
      } else {
        var data = JSON.parse(d)
        if((data.users[captain.id]) || (data.users[player2.id]) || (data.users[player3.id]) || (data.users[player4.id])){
          console.log(JSON.stringify(data.users))
          if((data.users[captain.id] === true) || (data.users[player2.id] === true) || (data.users[player3.id] === true) || (data.users[player4.id] === true)) {
            message.channel.send('User/s already in a team, leave all teams first then try again.').then(m => {m.delete(10000);message.delete(10000)}); return;
          }
          data.users[captain.id] = true;data.users[player2.id] = true;data.users[player3.id] = true;data.users[player4.id];
          console.log(JSON.stringify(data));
          fs.writeFile(userlist, JSON.stringify(data), function(err) {
              if (err) throw err;
              }
          );
        } else {
          data.users[captain.id] = true;data.users[player2.id] = true;data.users[player3.id] = true;data.users[player4.id];
          console.log(JSON.stringify(data));
          fs.writeFile(userlist, JSON.stringify(data), function(err) {
              if (err) throw err;
              }
          );
        }
        if((message.guild.roles.find('name', teamname)) != null) {message.channel.send('Team name already exists, try another name.').then(m => {m.delete(10000);message.delete(10000)}); return;}
          message.guild.createRole({
            name: teamname,
            permissions: 67472449
          }).then(r => {
            vc = message.guild.createChannel(teamname, 'voice', [{
              id: r.id,
              allow: 36701184
            }])
            vc.then(vc => {
              vc.overwritePermissions(everyone, {"VIEW_CHANNEL": false});
              vc.setParent('465081317621497866'); //set the parent to normal server
            })
            captain.addRoles(['476686532670128128', r.id]); player2.addRole(r.id); //id for server captain role is 465079281102487553
            player2.addRole(r.id); player3.addRole(r.id); player4.addRole(r.id);
        })
      }
    })
  }
  if(command === 'createduo11'){
    if(args.length < 2) {message.channel.send('Not enough arguments! \`!createduo \'Teamname\' @player2 \`').then(m => {m.delete(10000);message.delete(10000)}); return;}
    if(!(message.content.includes('\''))) {message.channel.send('There was no quotes around your team name! \`!createduo \'Teamname\' @player2\`').then(m => {m.delete(10000);message.delete(10000)}); return;}

    var teamname = message.content.match(/'((?:\\.|[^'\\])*)'/)[1]
    var captain = message.member;
    var player2 = message.mentions.members.array()[0]

    fs.readFile(userlist, 'utf8', function readFileCallback(err, d){
      if (err){
        console.log(err);
      } else {
        var data = JSON.parse(d)
        if((data.users[captain.id]) || (data.users[player2.id])){
          console.log(JSON.stringify(data.users))
          if((data.users[captain.id] === true) || (data.users[player2.id] === true)) {message.channel.send('User/s already in a team, leave all teams first then try again.').then(m => {m.delete(10000);message.delete(10000)}); return;}
          data.users[captain.id] = true;data.users[player2.id] = true;
          console.log(JSON.stringify(data));
          fs.writeFile(userlist, JSON.stringify(data), function(err) {
              if (err) throw err;
              }
          );
        } else {
          data.users[captain.id] = true;data.users[player2.id] = true;
          console.log(JSON.stringify(data));
          fs.writeFile(userlist, JSON.stringify(data), function(err) {
              if (err) throw err;
              }
          );
        }
        if((message.guild.roles.find('name', teamname)) != null) {message.channel.send('Team name already exists, try another name.').then(m => {m.delete(10000);message.delete(10000)}); return;}
          message.guild.createRole({
            name: teamname,
            permissions: 67472449
          }).then(r => {
            vc = message.guild.createChannel(teamname, 'voice', [{
              id: r.id,
              allow: 36701184
            }])
            vc.then(vc => {
              vc.overwritePermissions(everyone, {"VIEW_CHANNEL": false});
              //vc.setParent('465081317621497866');
            })
            captain.addRoles(['465079281102487553', r.id]); player2.addRole(r.id); //id for server captain role is 465079281102487553
        })
      }
    })
  }
  if(command === 'leave11'){
    if(!(message.content.includes('\''))) {message.channel.send('There was no quotes around your team name! \`!leave \'Teamname\'`').then(m => {m.delete(10000);message.delete(10000)}); return;}
    if(args.length < 1) {message.channel.send('Not enough arguments! \`!leave \'Team name\`')}
    var teamname = message.content.match(/'((?:\\.|[^'\\])*)'/)[1]

    if(message.member.roles.exists('name', teamname)){
      message.member.removeRole(message.member.roles.find('name', teamname))
      if(message.member.roles.exists('name', 'Captain')) {message.member.removeRole(message.member.roles.find('name', 'Captain'))}
      if(message.guild.roles.find('name', teamname).members.size = 0){
        message.guild.roles.find('name', teamname).delete();
        message.guild.channels.find('name', teamname).delete();
      }
      fs.readFile(userlist, 'utf8', function readFileCallback(err, d){
        if (err){
          console.log(err);
        } else {
          var data = JSON.parse(d)
          if(data.users[message.member.id] === false){message.channel.send('That person isn\'t in a team! \`!leave \'Teamname\'`').then(m => {m.delete(10000);message.delete(10000)}); return;}
          data.users[message.member.id] = false
          fs.writeFile(userlist, JSON.stringify(data), function(err) {
              if (err) throw err;
              }
          );
        }
      })
    } else message.channel.send('Team role not found, are you sure you\'re in that team?')
  }
  if(command === 'join11'){
    var teamname = message.content.match(/'((?:\\.|[^'\\])*)'/)[1]
    if(args.length < 1) {message.channel.send('Not enough arguments! \`!join \'Team name\'\`'); return;}
    if(!(message.guild.roles.exists('name', teamname))){message.channel.send('Team role not found, are you sure that team exists?').then(m => {m.delete(10000);message.delete(10000)}); return;}
    if(message.guild.roles.find('name', teamname).members.size >= 4){message.channel.send('Team is full.').then(m => {m.delete(10000);message.delete(10000)}); return;} else {
      message.member.addRole(message.guild.roles.find('name', teamname))
    }
  }
  //staff commands
  if(command === 'cleanteams11'){
    if(message.member.roles.exists('name', 'Admin')){
      let number = 0
      message.guild.roles.forEach(function(role) {
        console.log(`testing role: ${role.name}, amount of members: ${role.members.size}`)
        if((role.members.size === 0) && !(role.name === 'Captain') && !(role.name === 'Muted') && !(role.name === 'Scrim Host') && !(role.name === 'Frozen') && !(role.id === '457916473864880158') &&
         !(role.id === '457916570891452426') && !(role.name === 'Streaming')){
          role.delete('Team role deleted.')
          number++;
          message.guild.channels.find('name', role.name).delete()
        }
      })
    message.channel.send(`${number} team/s deleted.`).then(m => {m.delete(10000);message.delete(10000)}); return;
    } else {message.channel.send('No permission to use this command.'); return;}
  }
  if(command === 'kick11'){
    if(message.member.roles.exists('name', 'Admin')){
      if(!(message.content.includes('\'')) && !(message.content.includes('@'))) {message.channel.send('Wrong format! \`!kick @player \'Team name\'`').then(m => {m.delete(10000);message.delete(10000)}); return;}
      if(args.length < 2) {message.channel.send('Not enough arguments! \`!kick @player \'Team name\'`').then(m => {m.delete(10000);message.delete(10000)}); return;}
      var teamname = message.content.match(/'((?:\\.|[^'\\])*)'/)[1]
      var mention = message.mentions.members.first()
      fs.readFile(userlist, 'utf8', function readFileCallback(err, d){
        if (err){
          console.log(err);
        } else {
          var data = JSON.parse(d)
          if(data.users[mention.user.id] === false){message.channel.send('That person isn\'t in a team! \`!kick @player \'Team name\'`').then(m => {m.delete(10000);message.delete(10000)}); return;}
          data.users[mention.user.id] = false
          fs.writeFile(userlist, JSON.stringify(data), function(err) {
              if (err) throw err;
              }
          );
        }
      })
      if(!(message.guild.roles.exists('name', teamname))){message.channel.send('Team role not found, are you sure that team exists?').then(m => {m.delete(10000);message.delete(10000)}); return;}


      if(args.length < 1) {message.channel.send('Not enough arguments! \`!kick @player \'Team name\'\`'); return;}
      mention.removeRole(message.guild.roles.find('name', teamname))
      if(mention.roles.exists('name', 'Captain')) mention.removeRole(message.guild.roles.find('name', 'Captain'));
      message.delete(10000)
    } else {message.channel.send('No permission to use this command.'); return;}
  }
  if(command === 'gathercaptains'){
    if(!(message.member.roles.exists('name', 'Admin'))) return;
    if(message.guild.roles.find('name', 'Captain').members.size === 0){message.channel.send('No one has the Captain role.');return;}
    message.guild.roles.find('name', 'Captain').members.forEach(function (user){
      if(user.voiceChannel != undefined){
        user.setVoiceChannel('474953735588544512')
      } else {user.createDM().then(dm => dm.send('Hello! One of the staff have summoned all the captains, please check **Proximity Invitational Scrims** when you can.')).catch(console.error);}
    })
  }
  //super duper special commands
  if(command === 'eval'){
    if(message.author.id !== '231252858333429764') return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
})
    //console.log(roleID); player3.addRole(roleID)
    //captain.addRole(roleID); player2.addRole(roleID); player3.addRole(roleID); player4.addRole(roleID);


client.login('NDc2NzA0NTY0Njk5OTg3OTY4.DlAX5Q.nsR_0lGTBI_rzotmnAcBziDP-_U')
