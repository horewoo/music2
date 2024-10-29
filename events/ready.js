const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');
const prefix = process.env.prefix;

/*client.on("ready", () => {
	const activities = [
		{ name: `¡Tu asistente ricolino favorito!`, type: ActivityType.Listening },
		{ name: `Femboy Hooters | Cuidandolo.`, type: ActivityType.Watching },
		{ name: `Bonjour Services 24/7!`, type: ActivityType.Playing },
		{ name: `📎 # ${client.commands.size} comandos cargados para administradores.`, type: ActivityType.Competing }
	];
	const status = [
		'idle'
	];
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

	let s = 0;
	setInterval(() => {
		if(s >= activities.length) s = 0
		client.user.setStatus(status[s])
		s++;
	}, 30000);
	console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)),chalk.red(`${client.user.tag} c'est en marche.`))
});*/