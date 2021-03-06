// Discord.js bot
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');

var worldsData = "";

// things to do on startup
// 1. Pull data from league esports API
request('http://api.lolesports.com/api/v1/scheduleItems?leagueId=9', { json:true }, (err, res, body) => {
	if (err) { return console.log(err); }
	worldsData = body;
	});

// when client is ready
client.on('ready', () => {
    client.user.setGame('League of Leggos');
});

// things to do on intervals
// 1. Pull league esports API data every day
setInterval(() => {
    request('http://api.lolesports.com/api/v1/scheduleItems?leagueId=9', { json:true }, (err, res, body) => {
        if (err) { return console.log(err); }
	worldsData = body;
    });
}, 86400000);

// 2. every 30 minutes check if match is upcoming
setInterval(() => {
    var now = Date.now();
    var channel = client.channels.get("278038929720999937");
    for (i = 0; i < worldsData.scheduleItems.length; i++) {
	if (worldsData.scheduleItems[i].scheduledTime.startsWith("2017")) {
	    var time = worldsData.scheduleItems[i].scheduledTime;
	    console.log("Checking time of match");
	    var matchDate = new Date(time);
	    var diff = now - matchDate.getTime();
	    if ((diff <= 3600000) && (diff >= 0)) {
		 // Construct string for match
		 var req = "http://api.lolesports.com/api/v2/highlanderMatchDetails?tournamentId=a246d0f8-2b5c-4431-af4c-b872c8dee023&matchId=" + worldsData.scheduleItems[i].match;
                 var str = "";
		 request(req, { json:true }, (err, res, body) => { 
                           if (err) { return console.log(err); }
                           str = body.teams[0].name + " versus " + body.teams[1].name + " is coming up soon!";
                 });
                 // About an hour until match starts, post a message in general
	         channel.sendMessage(str);
            }
        }
    }
}, 3000000);
//1800000



// FIXME: hardcoded value for start index of scheduleEvent Array
var scheduleStart = 182;

// for every 5 min check if event in 

var quotes = ["\"Can the text-to-speech do this?\" - Machuka",
	      "\"Now we know what you listen to!!!\" - cshang's friends after misposting k-pop",
	      "\"For my stream\" - Machuka",
	      "\"Skins get wins\" - Machuka",
	      "\"If you wanna do it, I'll put you in my YouTube channel\" - Machuka",
	      "\"This is why they call me the baconator\" - Machuka",
	      "\"Just need to find my wallet\" - cshang on impulse buying Star Guardian Ezreal",
	      "\"Intuition is bad\" - cshang",
	      "\"200 to 300 mpg\" - cshang on the mileage his dad's car gets",
	      "\"Sona is so OP\" - Julian",
	      "\"If we win this one, we play URF\" - Julian",
	      "\"If we lose this one, we play URF\" - Julian",
	      "\"That's literally the only reason I took the offer\" - Betsy",
		"\"This is me playing League of Leggins\" - Machuka",
		"\"He might know martial arts\" - Machuka",
		"\"We got ads on Gnar? This ain't no sponsored thing\" - Machuka",
		"\"I can't believe I got a big splat\" - Machuka acout his weird pixel square",
		"\"I hate Vayne with a passion.\" - Machuka",
		"\"I'm gonna give this Veigar the business\" - Machuka",
		"\"Much gate, much wow\" - Machuka",
		"\"Did you see how useless you were our last game?\" - Machuka",
		"\"Ryze is useless\" - Machuka",
		"\"I am perfectly fine with sleeping on the floor\" - cshang",
		"\"We'll just end up smelling like each other, but that's ok\" - Julian",
		"\"Let's go, forget cshang!\" - Julian",
		"\"Win10 bash is trash\" - Julian",
		"\"Yeah, Japan's like the bacon.\" - Julian",
		"\"So you're just making things up.\" - Julian",
		"\"Destructive motherfucker\" - Betsy",
		"\"YOU CAN'T KILL ME\" - Betsy",
		"\"Something something up my butt\" - Betsy",
		"\"I'm shook\" - Heather",
		"\"Ten cuidado\" - Heather",
		]

client.on('message', msg => {
    if (msg.content.startsWith("ping")) {
    	msg.channel.send("pong!");
    }

    if (msg.content.startsWith("foo")) {
        msg.channel.send("bar");
    }

    if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;
    const command = msg.content.split(' ')[0].substr(process.env.PREFIX.length);
    const args = msg.content.split(' ').slice(1).join(' ');
    if (command === 'guide') return msg.channel.send('https://git.io/d.js-heroku');
    else if (command === 'invite') return msg.channel.send(process.env.INVITE);
    else if (command === 'quote') return msg.channel.send(quotes[Math.floor(Math.random()*quotes.length)]);
});

client.login(process.env.BOT_TOKEN);

// This part keeps the bot on 24/7
// Web app (Express + EJS)
const http = require('http');
const express = require('express');
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
 http.get('http://gooblerbot.herokuapp.com');
}, 900000);
