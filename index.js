const fs = require('fs');
const delay = require('delay');
const fetch = require('node-fetch');
const chalk = require('chalk');
const moment = require('moment');

const ioxys = (round, auth) => new Promise((resolve, reject) => {

    fetch(`http://kitkabackend.eastus.cloudapp.azure.com:5010/round/finishv2/${round}`, {
        method: 'GET',
        headers: {
            'authorization': auth
        }
    })
        .then(res => res.text())
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err);
        });

});

async function execute() {
    while (true) {
        var round = fs.readFileSync('round.txt');
        var auth = fs.readFileSync('auth.txt');

        const result = await ioxys(round, auth);

        if (!result) {
            console.clear();
            console.log(`${chalk.red(`> Can't get any data from server, expired data ...`)}`);
            setTimeout(() => {
                process.exit();
            }, 5000)
        }
        else if (result.includes('User')) {
            const data = JSON.parse(result);
            const username = data.User.Username;
            const country = data.User.Country;
            const exp = data.User.Experience;
            const tokenPass = data.User.BattlePass.PassTokens;
            const trophy = data.User.SkillRating;
            const crown = data.User.Crowns;

            console.log(`${chalk.magenta(`[${moment().format('HH:mm:ss')}]`)} ${chalk.green(`[FOUND]`)} ${chalk.blue(`Username (${username}) | Country (${country}) | Trophy (${trophy}) | Exp (${exp}) | Tp (${tokenPass})`)} | Crown (${crown})`)

            var time_cd = "7000";
            await delay(time_cd)
        }
        else if (result == "BANNED") {
            console.clear();
            console.log(`${chalk.red(`> User get banned, with uknown reason, bye!`)}`);
            setTimeout(() => {
                process.exit();
            }, 5000)
        }
        else if (result == 'SERVER_ERROR' || result.includes('User path limit exceeded')) {
            execute();
        }
    }


}
execute();