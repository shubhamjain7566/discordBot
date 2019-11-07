
/**
 * 
 * CREATED BY SHUBHAM JAIN ON 28 OCT 19
 * 
 **/

const Discord    = require('discord.js');
const googleIt   = require('google-it')
const constants  = require('../properties/constants');
const mysql      = require('../startUpService/index')


const client = new Discord.Client();
const token = constants.discordToken;

client.on('ready', () => {
    console.log(`Bot is online !!!!!`);
});


client.on('message', msg => {
    // case 1 say hey replay hi
    if (msg.content === 'hey') {
        msg.reply('hi');
    } else if (/!google/.test(msg.content)) {  // case 2  
        // !google nodejs, reply with top 5 links that you would get when you search nodejs on google.com
        // google it npm is used to search on google
        const search = msg.content.replace('!google', '');
        let messageSend = 0;
        googleIt({ 'query': search }).then(results => {
            // access to results object here
            for (let count = 0; count < results.length; count++) {
                if (results[count] && results[count].link) {
                    if (messageSend == 5) {
                        break;
                    }
                    let link = results[count].link;
                    try {
                        link = decodeURI(link);
                    } catch(e) { // catches a malformed URI
                        console.error(e);
                        continue;
                    }    
                    messageSend++;
                    msg.reply(link);
                }
            }
            if(messageSend && msg["author"].id) {
                mysql.runQuery("INSERT INTO tb_discord_search_history SET ? ", { // case 4 adding hostory to DB
                    user_id      : msg["author"].id,
                    search_value : search
                });
            }
        }).catch(e => {
            console.error("error in googlIt", e)
            msg.reply('There some error please  try after some time');
        })
    }  else if (/!recent/.test(msg.content)) { // case 3 Implement functionality to search through your search history.
        let search = msg.content.replace('!recent', '');
        search = search.replace("'", '"');
        if(!search || !msg["author"].id){
            return;
        }
        let sqlQuery = ` SELECT search_value FROM tb_discord_search_history WHERE 
         user_id = ${msg["author"].id} AND search_value like  '%${search}%' `;
        mysql.runQuery(sqlQuery, "").then(results => {
            if(!results.length){
                msg.reply('No Result Found');
                return;
            }
            for (let count = 0; count < results.length; count++) {
                msg.reply(count+1 + " : " + results[count].search_value);
            }
        }).catch(e => {
            console.error("error in select query", e);
            msg.reply('There some error please  try after some time');
        })
    }
    return;
});

client.login(token);