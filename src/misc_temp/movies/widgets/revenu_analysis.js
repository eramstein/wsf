(() => (data, State, get) => {

    const node = document.createElement('div');
    node.style.cssText = "padding: 20px";
 
    const colors = {
        'Action': 'rgba(3, 102, 214, 0.5)',
        'Comedy': 'rgba(255, 127, 0, 0.5)',
        'Drama': 'rgba(37, 162, 33, 0.5)',
        'Family': 'rgba(216, 40, 31, 0.5)',
        'Horror': 'rgba(149, 99, 191, 0.5)',
        'Romance': 'rgba(141, 85, 73, 0.5)',
        'SF & Fantasy': 'rgba(229, 116, 196, 0.5)',
        'Thriller': 'rgba(102, 166, 30, 0.5)',
    };
    
    const years = Object.values(get(State).data.concepts.movies.items).reduce((agg, curr) => {
        if (!agg[curr['Release Date']]) {
            agg[curr['Release Date']] = {};
        }
        if (!agg[curr['Release Date']][curr.Genre]) {
            agg[curr['Release Date']][curr.Genre] = 0;
        }
        agg[curr['Release Date']][curr.Genre] += curr.Revenue;
        return agg;
    }, {});
    
    setTimeout(() => {   
        
        const fullWidth = 800;
        const max = 30000;
        const rows = Object.entries(years).map(c => { return { year: c[0], genres: c[1] } });
    
        node.innerHTML += "<h1>Movie Revenue by Year and Genre</h1>";

        let legend = '';

        Object.entries(colors).forEach(c => {            
            legend += `
            <div>
            ` + c[0] + `
            </div>
            <div style="width:18px;height:18px;margin-left:5px;margin-right:15px;background-color:` + c[1] + `">
            </div>
            `;
        });

        node.innerHTML += '<div style="height:30px;display:flex;margin-bottom:5px;">' + legend + '</div>';
        
        rows.forEach(r => {
            let currPos = 0;
            let chart = '';
    
            Object.entries(r.genres).forEach(g => {
                const width = g[1] / max * fullWidth;
                
                chart += `
                <div style="position:absolute;left:` + currPos + `px;height:25px;width:` + width + `px;background-color:` + colors[g[0]] + `">
                </div>
                `;

                currPos += width;
            });
    
            node.innerHTML +=
            `
            <div style="height:30px;display:flex;margin-bottom:5px;">
                <div style="width: 48px;padding-top: 3px;">` + r.year + `</div>
                <div style="position:relative;">
                ` + chart + `
                </div>
            </div>
            `
            ;    
        });   
        
    }, 10)
    
    return node;
    
    
    })()