const express = require('express')
const server = express();
const chalk = require('chalk');

server.all('/', (req, res) => {
    res.send('El bot sigue encendido.');
});

module.exports = () => {
    server.listen(3000, () => {
        console.log(chalk.blue(chalk.bold(`Monitor`)), (chalk.white(`>>`)),chalk.red('Servidor Listo.\n'));
    });
    return true;
}