(() => (data, State, get) => {

const node = document.createElement('div');

const relations = data.__relations__ || {};
const cast = relations.Cast || [];
const director = relations.Director && relations.Director[0] || {};
const allData = get(State);
const directorData= director.item && allData.data.concepts.directors.items[director.item];
const picture = directorData && Object.values(directorData)[Object.values(directorData).length - 1];

let castList = '';

cast.forEach(c => {
castList  += '<li style="margin: 5px;">' + c.item + ' <span style="color:#999;"> as ' + c.qualifiers.character + '</span></li>';
});

node.innerHTML=
`
<div style="display: flex">
    <div>
        <div>
        Directed by
        </div>
        <div>
         <b>`+ director.item + `</b>
        </div>
        <div>
            <img src="http://image.tmdb.org/t/p/w185/`+ picture + `" style="width: 150px;margin: 20px;" />
        </div>

    </div>
    <div>
        <ul>
        `+ castList + `
        </ul>
    </div>
</div>
`
;

return node;

})()


6cols * 330