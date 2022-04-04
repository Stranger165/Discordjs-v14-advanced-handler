const client = require("../index");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const mongoose = require("mongoose");
const chalk = require("chalk");

/**
 * @param {client} client 
 * @returns 
 */
module.exports = async (client) => {
	const commandFiles = await globPromise(`${__dirname}/../commands/**/*.js`);
	console.log(
		chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
			chalk.blue.bold("Commands") +
			chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	);
	commandFiles.map((value) => {
		const file = require(value);
		const splitted = value.split("/");
		const directory = splitted[splitted.length - 2];

		if (file.name) {
			const properties = { directory, ...file };
			client.commands.set(file.name, properties);
			console.log(
				chalk.cyan("[ INFORMATION ]") +
					chalk.white.bold(" | ") +
					chalk.blue(`${new Date().toLocaleDateString()}`) +
					chalk.white.bold(" | ") +
					chalk.cyan("Command Load Status") +
					chalk.white.bold(" | ") +
					chalk.blue(file.name) +
					chalk.white(": ") +
					chalk.greenBright(`Success`)
			);
		} else {
			console.log(
				chalk.cyan("[ INFORMATION ]") +
					chalk.white.bold(" | ") +
					chalk.blue(`${new Date().toLocaleDateString()}`) +
					chalk.white.bold(" | ") +
					chalk.cyan("Command Load Status") +
					chalk.white.bold(" | ") +
					chalk.blue(file.name || "MISSING") +
					chalk.white(": ") +
					chalk.redBright(`Failed`)
			);
		}
		if (file.aliases && Array.isArray(file.aliases))
			file.aliases.forEach((alias) => client.aliases.set(alias, file.name));
	});

	console.log(
		chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
			chalk.blue.bold("Slash Commands") +
			chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	);

	// Events
	const eventFiles = await globPromise(`${__dirname}/../events/*.js`);
	eventFiles.map((value) => require(value));

	const slashCommands = await globPromise(
		`${__dirname}/../slashCommands/**/*.js`
	);

	const arrayOfSlashCommands = [];
	slashCommands.map((value) => {
		const file = require(value);
		if (file.name) {
			console.log(
				chalk.cyan("[ INFORMATION ]") +
					chalk.white.bold(" | ") +
					chalk.blue(`${new Date().toLocaleDateString()}`) +
					chalk.white.bold(" | ") +
					chalk.cyan("Slash Command Load Status") +
					chalk.white.bold(" | ") +
					chalk.blue(file.name) +
					chalk.white(": ") +
					chalk.greenBright(`Success`)
			);
		} else if (!file?.name) {
			console.log(
				chalk.cyan("[ INFORMATION ]") +
					chalk.white.bold(" | ") +
					chalk.blue(`${new Date().toLocaleDateString()}`) +
					chalk.white.bold(" | ") +
					chalk.cyan("Slash Command Load Status") +
					chalk.white.bold(" | ") +
					chalk.blue(file.name || "MISSING") +
					chalk.white(": ") +
					chalk.redBright(`Failed`)
			);
		}
		client.slashCommands.set(file.name, file);

		if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
		arrayOfSlashCommands.push(file);
	});

	client.on("ready", async () => {
		// await client.guilds.cache
		// .get("Replace This With Your Server ID")
		// .commands.set(arrayOfSlashCommands).then(() => {
		//   console.log(
		//     chalk.cyan("[ INFORMATION ]") +
		//     chalk.white(" | ") +
		//     chalk.blue(`${new Date().toLocaleDateString()}`) +
		//     chalk.white(" | ") +
		//     chalk.cyan("Slash Commands") +
		//     chalk.white(": ") +
		//     chalk.white(`Loaded to`) +
		//     chalk.white(": ") +
		//     chalk.greenBright(`${client.guilds.cache.get("Replace This With Your Server ID").name}`)
		//   )
		// });

		await client.application.commands.set(arrayOfSlashCommands).then(() => {
			console.log(
				chalk.cyan("[ INFORMATION ]") +
					chalk.white.bold(" | ") +
					chalk.blue(`${new Date().toLocaleDateString()}`) +
					chalk.white.bold(" | ") +
					chalk.cyan("Slash Commands") +
					chalk.white(": ") +
					chalk.greenBright(`Loaded as Multi Guild`)
			);
		});
	});
	console.log(
		chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
			chalk.blue.bold("Client Status") +
			chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	);

	if (!client.config.mongooseConnectionString) return;

	mongoose.connect(client.config.mongooseConnectionString);
	mongoose.connection.on("connected", () =>
		console.log(
			chalk.cyan("[ INFORMATION ]") +
				chalk.white.bold(" | ") +
				chalk.blue(`${new Date().toLocaleDateString()}`) +
				chalk.white.bold(" | ") +
				chalk.cyan("Mongo DB Connection") +
				chalk.white(": ") +
				chalk.greenBright(`Connected`)
		)
	);
	mongoose.connection.on("disconnected", () =>
		console.log(
			chalk.cyan("[ INFORMATION ]") +
				chalk.white.bold(" | ") +
				chalk.blue(`${new Date().toLocaleDateString()}`) +
				chalk.white.bold(" | ") +
				chalk.cyan("Mongo DB Connection") +
				chalk.white(": ") +
				chalk.greenBright(`Disconnected`)
		)
	);
	mongoose.connection.on("error", (error) =>
		console.log(
			chalk.cyan("[ INFORMATION ]") +
				chalk.white.bold(" | ") +
				chalk.blue(`${new Date().toLocaleDateString()}`) +
				chalk.white.bold(" | ") +
				chalk.cyan("Mongo DB Connection") +
				chalk.white(": ") +
				chalk.redBright(`Error`) +
				"\n" +
				chalk.white(`${error}`)
		)
	);
};
