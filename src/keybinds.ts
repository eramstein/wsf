import { get } from "svelte/store";
import { State, printState, saveState } from "./stores";
import { Cardinality } from "./model";
import { goBack } from "./logic/navigation";

export function handleKeyPress(event) {
    // l -> log state
    if (event.charCode === 108) {
        printState();
    }

    // // s -> save
    // if (event.charCode === 115) {
    //     saveState();
    // }

    //t -> temp function
    if (event.charCode === 116) {

        // State.setData('movies', 'Titanic', 'Etienne Review', `Like a great iron Sphinx on the ocean floor, the Titanic faces still toward the West, interrupted forever on its only voyage. We see it in the opening shots of Titanic,” encrusted with the silt of 85 years; a remote-controlled TV camera snakes its way inside, down corridors and through doorways, showing us staterooms built for millionaires and inherited by crustaceans.

        // These shots strike precisely the right note; the ship calls from its grave for its story to be told, and if the story is made of showbiz and hype, smoke and mirrors--well, so was the Titanic. She was the largest moving work of man in all history,” a character boasts, neatly dismissing the Pyramids and the Great Wall. There is a shot of her, early in the film, sweeping majestically beneath the camera from bow to stern, nearly 900 feet long and unsinkable,” it was claimed, until an iceberg made an irrefutable reply.
                
        // James Cameron's 194-minute, $200 million film of the tragic voyage is in the tradition of the great Hollywood epics. It is flawlessly crafted, intelligently constructed, strongly acted and spellbinding. If its story stays well within the traditional formulas for such pictures, well, you don't choose the most expensive film ever made as your opportunity to reinvent the wheel.
                
        // We know before the movie begins that certain things must happen. We must see the Titanic sail and sink, and be convinced we are looking at a real ship. There must be a human story--probably a romance--involving a few of the passengers. There must be vignettes involving some of the rest and a subplot involving the arrogance and pride of the ship's builders--and perhaps also their courage and dignity. And there must be a reenactment of the ship's terrible death throes; it took two and a half hours to sink, so that everyone aboard had time to know what was happening, and to consider their actions.`);

        // State.setWidgets('movies', moviesWidgets);
        // State.setWidgets('directors', directorsWidgets);

        // State.updateConceptImages('movies', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/de/Cin%C3%A9matographe_Lumi%C3%A8re.jpg/800px-Cin%C3%A9matographe_Lumi%C3%A8re.jpg', 'https://icon-library.net/images/movies-icon/movies-icon-6.jpg');
        // State.updateConceptImages('directors', 'https://www.bfi.org.uk/sites/bfi.org.uk/files/page/simon-cooper-directors-podium_1000x750.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-_ANz3l6a0cfqHzqjRkQVkMMt2A5O9RH5D_HMdJP9hexPeh27cw');
        // State.updateConceptImages('actors', 'https://pbs.twimg.com/media/DpYHrpWWkAA9-gD.jpg', 'http://www.iconarchive.com/download/i47166/icons-land/vista-people/Occupations-Actor-Male-Light.ico');
        
        // State.updateUserPreferences(prefs);
        // State.updateConceptRelations('movies', relations);
        // State.buildSearchIndex();
    }    
}

const relations = [
    {
        name: 'Director',
        concept: 'directors',
        cardinality: 'one',
        qualifiers: [],
    },
    {
        name: 'Actors',
        concept: 'actors',
        cardinality: 'many',
        qualifiers: [],
    }
]

const prefs = {"movies":{"lists":[{"id":518674043398,"name":"My Listing","sortBy":null,"sortDirection":null,"columns":{"Title":{"name":"Title","filterValue":"","display":false},"Genre":{"name":"Genre","filterValue":null,"display":false},"Budget":{"name":"Budget","filterValue":null,"display":false},"Homepage":{"name":"Homepage","filterValue":null,"display":false},"Language":{"name":"Language","filterValue":null,"display":false},"Overview":{"name":"Overview","filterValue":null,"display":false},"Poster path":{"name":"Poster path","filterValue":null,"display":false},"Production company":{"name":"Production company","filterValue":null,"display":false},"Release Date":{"name":"Release Date","filterValue":null,"display":false},"Commercial Success":{"name":"Commercial Success","filterValue":null,"display":false},"Revenue":{"name":"Revenue","filterValue":null,"display":false},"Tagline":{"name":"Tagline","filterValue":null,"display":false},"Vote Average":{"name":"Vote Average","filterValue":null,"display":false},"All Genres\r":{"name":"All Genres\r","filterValue":null,"display":false}},"widgets":{"Flag":false,"Stars":false,"Dollars":false,"Revenue":true,"Movie":true,"Language":false,"Release":true,"Origin":true,"Summary":false,"Critics":true,"Movie Summary":true},"pages":1},{"id":708076970586,"name":"New List","sortBy":null,"sortDirection":null,"columns":{"Title":{"name":"Title","filterValue":null,"display":true},"Genre":{"name":"Genre","filterValue":null,"display":false},"Budget":{"name":"Budget","filterValue":null,"display":false},"Homepage":{"name":"Homepage","filterValue":null,"display":false},"Language":{"name":"Language","filterValue":null,"display":false},"Overview":{"name":"Overview","filterValue":null,"display":true},"Poster path":{"name":"Poster path","filterValue":null,"display":false},"Production company":{"name":"Production company","filterValue":null,"display":false},"Release Date":{"name":"Release Date","filterValue":null,"display":false},"Commercial Success":{"name":"Commercial Success","filterValue":null,"display":false},"Revenue":{"name":"Revenue","filterValue":null,"display":false},"Tagline":{"name":"Tagline","filterValue":null,"display":false},"Vote Average":{"name":"Vote Average","filterValue":null,"display":false},"All Genres\r":{"name":"All Genres\r","filterValue":null,"display":false}},"widgets":{},"pages":1}],
"mashups":[{"id":760318135612,"name":"Mashup","widgets":["Overview","Review","Cast","Metrics"]}],"filters":{"Title":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Genre":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Budget":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Homepage":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Language":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Overview":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Poster path":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Production company":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Release Date":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Commercial Success":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Revenue":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Tagline":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Vote Average":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"All Genres\r":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}}}},"actors":{"lists":[],"mashups":[],"filters":{"Name":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Gender":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Movies":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Picture\r":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}}}},"directors":{"lists":[],"mashups":[],"filters":{"Name":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Gender":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Movies":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}},"Picture\r":{"collapsed":false,"limited":false,"from":null,"to":null,"categories":{}}}}};

const moviesWidgets = {
    "one": {
        "Overview": {
            "name": "Overview",
            "height": 300,
            "width": "6cols",
            "template": "<style>\n    .row { display:flex; padding-bottom: 5px; }\n    .title { justify-content: space-between; }\n    .muted { color: #666; padding-top: 10px; }\n</style>\n\n<div style=\"display: flex;\">\n    <div style=\"display: flex;padding-right: 50px;\">\n              <img src=\"http://image.tmdb.org/t/p/w185/{{Poster path}}\" />\n    </div>\n    <div>\n    <div class=\"row title\">\n        <div>\n            <div>\n            <b>{{Title}}</b>\n            </div>\n            <div class=\"row\">\n                 <i>\n                      {{Tagline}}\n                </i>\n         </div>\n        </div>        \n        <div>\n            <wsf-flag data-language={{Language}}></wsf-flag>\n        </div>\n    </div>    \n    <div class=\"row title\">\n        <div>\n             {{Genre}} - {{Release Date}}\n        </div>\n        <div>\n            {{Production company}}\n        </div>\n    </div>    \n    <div class=\"row muted\">\n        <div>\n            {{Overview}}\n        </div>\n    </div>\n    <div class=\"row\">\n        <div>\n              <a href=\"{{Homepage}}\">homepage</a>\n        </div>\n    </div>\n    </div>\n</div>",
            "script": "    ",
            "computedNode": "",
            "props": "",
            "inMashups": true
      },
      "Metrics": {
        "name": "Metrics",
        "height": "100",
        "width": "4cols",
        "template": "<style>\n    .row { display:flex; padding-bottom: 5px; }\n    .title { justify-content: space-between; }\n    .muted { color: #666; padding-top: 10px; }\n</style>\n\n<div>\n    <div class=\"row title\">\n        <div>\n            <div>\n                 <b>{{Title}}</b>\n            </div>\n            <div class=\"row\">\n                 <i>\n                      {{successText}}\n                </i>\n            </div>\n        </div>        \n        <div style=\"white-space:nowrap\">\n            {{dollars}}\n        </div>\n    </div>\n    <div class=\"row\">\n        <div>\n              Budget: ${{Budget}} millions\n        </div>\n    </div>\n    <div class=\"row\">\n        <div>\n              Revenue: ${{Revenue}} millions\n        </div>\n<div><img src='https://www.d3-graph-gallery.com/img/block/block_area.png' /></div>\n    </div>    \n</div>",
        "script": "(() => {\n\nconst dollar = '<img width=\"20px\" alt=\"star-full\" src=\"https://cdn2.iconfinder.com/data/icons/user-interface-icons-bundle-4/32/228-512.png\" style=\"filter: invert(28%) sepia(100%) hue-rotate(420deg) saturate(3);\">';\n\nconst success = data['Commercial Success'];\n\nlet dollars; if (success === 'Blockbuster') {dollars = dollar + dollar + dollar + dollar; } if (success === 'High') {dollars = dollar + dollar + dollar; } if (success === 'Medium') {dollars = dollar + dollar; } if (success === 'Small') {dollars = dollar; } \n\nconst successText = success === 'Blockbuster' ? 'Blockbuster' : success + ' Success';\n\nreturn {\n    dollars,\n    successText,\n};\n\n})()",
        "computedNode": "",
        "props": "",
        "inMashups": true
      },
      "Cast": {
        "name": "Cast",
        "height": "330",
        "width": "6cols",
        "template": "",
        "script": "",
        "computedNode": "(() => (data, State, get) => {\n\nconst node = document.createElement('div');\n\nconst relations = data.__relations__ || {};\nconst cast = relations.Cast || [];\nconst director = relations.Director && relations.Director[0] || {};\nconst allData = get(State);\nconst directorData= director.item && allData.data.concepts.directors.items[director.item];\nconst picture = directorData && Object.values(directorData)[Object.values(directorData).length - 1];\n\nlet castList = '';\n\ncast.forEach(c => {\ncastList  += '<li style=\"margin: 5px;\">' + c.item + ' <span style=\"color:#999;\"> as ' + c.qualifiers.character + '</span></li>';\n});\nconsole.log(castList );\n\nnode.innerHTML=\n`\n<div style=\"display: flex\">\n    <div>\n        <div>\n        Directed by\n        </div>\n        <div>\n         <b>`+ director.item + `</b>\n        </div>\n        <div>\n            <img src=\"http://image.tmdb.org/t/p/w185/`+ picture + `\" style=\"width: 130px;margin: 20px;\" />\n        </div>\n\n    </div>\n    <div>\n        <ul>\n        `+ castList + `\n        </ul>\n    </div>\n</div>\n`\n;\n\nreturn node;\n\n})()",
        "props": "",
        "inMashups": true
      },      
      "Flag": {
        "name": "Flag",
        "height": "20px",
        "width": "30px",
        "template": "<style>\nimg {\n  width: 30px;\n  height: 20px;\n}\n</style>\n{{widget}}",
        "script": "(() => {\n\nconst language = data.Language || data.language;\n\nconst imageSource =\n    language === 'English' ? 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png'\n: language === 'French' ? 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1200px-Flag_of_France.svg.png'\n: language === 'Chinese' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png'\n: 'https://images-na.ssl-images-amazon.com/images/I/31PLu7MsveL.jpg';\n\nlet widget = '<span style=\"width:auto;display:inline\"><div class=\"aligned\"><img width=\"14px\"  src=\"' + imageSource + '\" /></div></span>';\n\nreturn {\n    widget,\n};\n\n})()",
        "computedNode": "",
        "props": "language",
        "inLists": true,
        "nestable": true
      },
      "Poster": {
        "name": "Poster",
        "height": "268px",
        "width": "200px",
        "template": "<img src=\"http://image.tmdb.org/t/p/w185/{{Poster path}}\" />",
        "script": "",
        "computedNode": "",
        "props": "",
        "inMashups": true
      },
      "Review": {
        "name": "Review",
        "height": 300,
        "width": "4cols",
        "template": "<style>\n</style>\n\n<div>\n    <div>\n        <b>{{Title}}</b>\n    </div>\n    <div>\n        <wsf-critics data-vote=\"{{Vote Average}}\"></wsf-critics>\n    </div>\n    <div>\n        <wsf-data\n            data-concept=\"movies\"\n            data-instance=\"{{Title}}\"\n            data-attribute=\"Etienne Review\"\n            data-defval=\"{{defaultValue}}\"\n        ></wsf-data>\n    </div>\n</div>",
        "script": "(() => {\n\nconst defaultValue = data['Etienne Review'] || 'Not reviewed yet';\n\nreturn {\n    defaultValue,\n};\n\n})()",
        "computedNode": "",
        "props": "",
        "inMashups": true
      },
      "Revenue": {
        "name": "Revenue",
        "height": "20",
        "width": "80",
        "template": "<div style=\"white-space:nowrap; display:flex; align-items: center;\">\n      {{dollars}} <div style=\"padding-left: 10px;\">{{successText}}</div>\n</div>",
        "script": "(() => {\n\nconst dollar = '<img width=\"15px\" alt=\"star-full\" src=\"https://cdn2.iconfinder.com/data/icons/user-interface-icons-bundle-4/32/228-512.png\" style=\"filter: invert(28%) sepia(100%) hue-rotate(420deg) saturate(3);margin-right:-4px;margin-top:-1px;\">';\n\nconst success = data['Commercial Success'] || data.success;\n\nconst dollars = success === 'Blockbuster' ? dollar + dollar + dollar + dollar\n: 'High' ? dollar + dollar + dollar\n: 'Medium' ? dollar + dollar\n: dollar;\n\nconst successText = success === 'Blockbuster' ? 'Blockbuster' : success + ' Success';\n\nreturn {\n    dollars,\n    successText,\n};\n\n})()",
        "computedNode": "",
        "props": "",
        "inLists": true
      },
      "Release": {
        "name": "Release",
        "height": "30",
        "width": "100",
        "template": "<div style=\"white-space: nowrap\">{{Production company}}</div>\n<div>{{Release Date}}</div>",
        "script": "",
        "computedNode": "",
        "props": "",
        "inLists": true
      },
      "Origin": {
        "name": "Origin",
        "height": "20",
        "width": "80",
        "template": "<style>\nimg {\n  width: 20px;\n  height: 15px;\n  margin-right: 7px;\n}\ndiv {\n    white-space: nowrap;\n    display: flex;\n}\n</style>\n<div>\n{{widget}} {{Language}}\n</div>",
        "script": "(() => {\n\nconst language = data.Language || data.language;\n\nconst imageSource =\n    language === 'English' ? 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png'\n: language === 'French' ? 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1200px-Flag_of_France.svg.png'\n: language === 'Chinese' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png'\n: 'https://images-na.ssl-images-amazon.com/images/I/31PLu7MsveL.jpg';\n\nlet widget = '<span style=\"width:auto;display:inline\"><div class=\"aligned\"><img width=\"14px\"  src=\"' + imageSource + '\" /></div></span>';\n\nreturn {\n    widget,\n};\n\n})()\n",
        "computedNode": "",
        "props": "",
        "inLists": true
      },
      "Critics": {
        "name": "Critics",
        "height": "20",
        "width": "80",
        "template": "<div style=\"white-space:nowrap\">\n    {{stars}}\n</div>",
        "script": "(() => {\n\nconst starFull = '<img width=\"14px\" alt=\"star-full\" src=\"data:image/png;base64,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\">';\n\nconst starEmpty = '<img width=\"14px\" style=\"filter: invert(80%);\" src=\"https://image.flaticon.com/icons/png/512/130/130188.png\" alt=\"star-empty\">';\n\nconst rating = data['Vote Average'] || data.vote || 5;\nconst starCount = Math.ceil(rating/2);\nconst emptyCount = 5 - starCount;\n\nlet stars = '';\n\nfor (let index = 0; index < starCount; index++) {\n        stars += starFull;\n}\nfor (let index = 0; index < emptyCount ; index++) {\n        stars += starEmpty;\n}\n\nreturn {\n    stars,\n};\n\n})()",
        "computedNode": "",
        "props": "",
        "inLists": true,
        "nestable": true
      },
      "Movie Summary": {
        "name": "Movie Summary",
        "height": "",
        "width": "",
        "template": "<style>\n    .row { display:flex; padding-bottom: 5px; }\n    .title { justify-content: space-between; }\n    .muted { color: #666; padding-top: 5px; overflow: hidden;\n height: 30px;}\n</style>\n\n    <div class=\"row title\">\n        <div>\n            <div>\n            <b>{{Genre}}</b>\n            </div>\n            <div class=\"row muted\">\n                      {{text}}\n         </div>\n        </div> \n    </div>  ",
        "script": "(() => {\n\n\nreturn {\n    text: data['Overview'].substr(0,100) + '...',\n};\n\n})()",
        "computedNode": "",
        "props": "",
        "inLists": true
      },
      "Movie": {
        "name": "Movie",
        "height": "20",
        "width": "100",
        "template": "<style>\n    .row { display:flex; padding-bottom: 5px; }\n    .title { justify-content: space-between; }\n    .tag { padding-top: 5px; }\n</style>\n\n    <div class=\"row title\">\n        <div>\n            <div>\n            <b>{{Title}}</b>\n            </div>\n            <div class=\"row tag\">\n                      {{Tagline}}\n         </div>\n        </div> \n    </div>  ",
        "script": "",
        "computedNode": "",
        "props": "",
        "inLists": true
      }
    },
    "many": {
      "Revenue Analysis": {
        "name": "Revenue Analysis",
        "height": null,
        "width": null,
        "template": "",
        "script": "",
        "computedNode": "(() => (data, State, get) => {\n\n    const node = document.createElement('div');\n    node.style.cssText = \"padding: 20px\";\n \n    const colors = {\n        'Action': 'rgba(3, 102, 214, 0.5)',\n        'Comedy': 'rgba(255, 127, 0, 0.5)',\n        'Drama': 'rgba(37, 162, 33, 0.5)',\n        'Family': 'rgba(216, 40, 31, 0.5)',\n        'Horror': 'rgba(149, 99, 191, 0.5)',\n        'Romance': 'rgba(141, 85, 73, 0.5)',\n        'SF & Fantasy': 'rgba(229, 116, 196, 0.5)',\n        'Thriller': 'rgba(102, 166, 30, 0.5)',\n    };\n    \n    const years = Object.values(get(State).data.concepts.movies.items).reduce((agg, curr) => {\n        if (!agg[curr['Release Date']]) {\n            agg[curr['Release Date']] = {};\n        }\n        if (!agg[curr['Release Date']][curr.Genre]) {\n            agg[curr['Release Date']][curr.Genre] = 0;\n        }\n        agg[curr['Release Date']][curr.Genre] += curr.Revenue;\n        return agg;\n    }, {});\n    \n    setTimeout(() => {   \n        \n        const fullWidth = 800;\n        const max = 30000;\n        const rows = Object.entries(years).map(c => { return { year: c[0], genres: c[1] } });\n    \n        node.innerHTML += \"<h1>Movie Revenue by Year and Genre</h1>\";\n\n        let legend = '';\n\n        Object.entries(colors).forEach(c => {            \n            legend += `\n            <div>\n            ` + c[0] + `\n            </div>\n            <div style=\"width:18px;height:18px;margin-left:5px;margin-right:15px;background-color:` + c[1] + `\">\n            </div>\n            `;\n        });\n\n        node.innerHTML += '<div style=\"height:30px;display:flex;margin-bottom:5px;\">' + legend + '</div>';\n        \n        rows.forEach(r => {\n            let currPos = 0;\n            let chart = '';\n    \n            Object.entries(r.genres).forEach(g => {\n                const width = g[1] / max * fullWidth;\n                \n                chart += `\n                <div style=\"position:absolute;left:` + currPos + `px;height:25px;width:` + width + `px;background-color:` + colors[g[0]] + `\">\n                </div>\n                `;\n\n                currPos += width;\n            });\n    \n            node.innerHTML +=\n            `\n            <div style=\"height:30px;display:flex;margin-bottom:5px;\">\n                <div style=\"width: 48px;padding-top: 3px;\">` + r.year + `</div>\n                <div style=\"position:relative;\">\n                ` + chart + `\n                </div>\n            </div>\n            `\n            ;    \n        });   \n        \n    }, 10)\n    \n    return node;\n    \n    \n    })()",
        "props": ""
      }
    }
  };

const directorsWidgets = {"one":{"Picture":{"name":"Picture","height":300,"width":"3cols","template":"<img src=\"http://image.tmdb.org/t/p/w185/{{image}}\" />","script":"(() => {\n\nreturn {\nimage: Object.values(data)[3],\n}\n\n})()\n","computedNode":"","props":"","inMashups":true}},"many":{}};

/*

DECKS RELATIONS

const relations = [
    {
        name: 'Has Key Card',
        concept: 'cards',
        cardinality: 'one',
        qualifiers: [],
    },
    {
        name: 'Has Author',
        concept: 'players',
        cardinality: 'one',
        qualifiers: [],
    },
    {
        name: 'Includes Card',
        concept: 'cards',
        cardinality: 'many',
        qualifiers: [{ name: 'quantity', type: 'NUMERIC' }],
    }
]

RESET WIDGETS

const widgets = {
    many: {},
    one: {
        'Summary': {
            name: 'Summary',
            width: '4cols',
            height: 250,
            template: `
                <style> .row{ display:flex } .title{ font-weight:bold } </style>
                <div>
                    <div class="row">
                        <div class="title">
                            Name
                        </div>
                        <div>
                            {{Name}}
                        </div>
                    </div>                        
                    <div class="row">
                        <div class="title">
                            Oracle Text
                        </div>
                        <div>
                            {{Oracle Text}}
                        </div>
                    </div>
                </div>
            `,
        },
        'Image': {
            name: 'Image',
            width: '488px',
            height: 680,
            template: `
                <div>
                    <img src="{{Image}}" />
                </div>
            `,
        }
    }
}
State.setWidgets('cards', widgets);

*/