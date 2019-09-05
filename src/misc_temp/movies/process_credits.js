var fs = require('fs');
var csv = require("csvtojson");

//Use async / await
async function asyncCall() {
    const jsonArray = await csv().fromFile('credits.csv');

    const actors = {};
    const directors = {};

    //jsonArray.length

    function processRow(data) {
        let { id, crew, cast } = data;

        try {
            cast = JSON.parse(cast.replace(/O\'/g, 'O ').replace(/\'/g, '"').replace(/None/g, '""'));
            crew = JSON.parse(crew.replace(/O\'/g, 'O ').replace(/\'/g, '"').replace(/None/g, '""'));
        } catch (error) {
            return;
        }
        
        cast.forEach(actor => {
            if (!actors[actor.name]) {
                actors[actor.name] = { 'movies': 0 };
            }
            actors[actor.name].name = actor.name;
            actors[actor.name].movies++;
            actors[actor.name].gender = actor.gender === 2 ? 'Male' : 'Female';
            actors[actor.name].profile_path = actor.profile_path;
        });
        crew.forEach(director => {
            if (director.job === 'Director') {
                if (!directors[director.name]) {
                    directors[director.name] = { 'movies': 0 };
                }
                directors[director.name].name = director.name;
                directors[director.name].movies++;
                directors[director.name].gender = director.gender === 2 ? 'Male' : 'Female';
                directors[director.name].profile_path = director.profile_path;
            }
        });
    }

    for (let index = 0; index < 10000; index++) {
        processRow(jsonArray[index]);
    }
    
    let blooob = Object.entries(actors).filter(e => e[1].profile_path !== '').map(e => [e[1].name,e[1].gender,e[1].movies,e[1].profile_path]).join('\n')

    fs.writeFile('actors.csv', blooob, 'utf8', function(err) {
        if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
        console.log('It\'s saved!');
        }
    });

    blooob = Object.entries(directors).filter(e => e[1].profile_path !== '').map(e => [e[1].name,e[1].gender,e[1].movies,e[1].profile_path]).join('\n')

    fs.writeFile('directors.csv', blooob, 'utf8', function(err) {
        if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
        console.log('It\'s saved!');
        }
    });
}
  
asyncCall();


