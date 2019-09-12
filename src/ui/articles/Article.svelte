<script>
    import { onMount, afterUpdate } from 'svelte';
    import { State } from '../../stores';
    import { findClickedNuggets } from '../../logic/contextSearch.ts';
    import Browser from "../conceptsOne/Browser.svelte";

    $: article = $State.data.articles[$State.ui.screenParameters.articleID];
    
    let titleValue;
    let summaryValue;
    let editMode = true;
    let shadowRoot;
    let stylesAdded = false;
    let searchString = null;
    let selectedWidget = null;
    let contentInserted = false;
    let titleInserted = false;

    let widgets = [];
    let widgetsFound = [];
    $: nuggetsFound = [];
    $: nuggetToBrowse = null;

    $: {
        if (nuggetsFound.length > 0) {            
            nuggetToBrowse = nuggetsFound[0];
        } else {
            nuggetToBrowse = null;
        }
    }


    let propsValues = {};
    
    Object.values($State.data.concepts).forEach(c => {
        Object.values(c.widgets.one).forEach(w => {
            widgets.push(w);
        });
        Object.values(c.widgets.many).forEach(w => {
            widgets.push(w);
        });
    });

    $: {
        if (searchString === null) {
            widgetsFound = [];
        } else if (searchString.length === 0) {
            widgetsFound = widgets;
        } else {
            widgetsFound = widgets.filter(w => w.name.toLowerCase().indexOf(searchString) >= 0);
        }        
    }
    
    onMount(() => {
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');
        editor.onkeydown = e => {
            // tab key
            if (e.keyCode === 9) {                
                e.preventDefault();
                document.execCommand('insertHTML', false, '\u00a0\u00a0\u00a0\u00a0');
            }
            // enter key
            if (e.keyCode === 13) {
                document.execCommand('insertText', false, '\n');
            }
        }
        shadowRoot = preview.attachShadow({mode: 'open'});
    });

    afterUpdate(() => {
        if (!titleInserted) {
            titleValue = article.title || '';
            summaryValue = article.summary || '';
            titleInserted = true;
        }
        if (editMode && !contentInserted) {
            const editor = document.getElementById('editor');
            editor.innerText = article.content;
            editor.oncontextmenu = e => { nuggetsFound = findClickedNuggets(e) };
            contentInserted = true;
        } else {
            let filledTemplate = article.content.replace(/\n/g, '<br />');
            if (article.aboutItems.length === 1) {
                const data = $State.data
                    .concepts[article.aboutItems[0].concept]
                    .items[article.aboutItems[0].item];
                function replacer(match, p1) {
                    return data[p1];                
                }        
                filledTemplate = filledTemplate.replace(/{{(.+?)}}/g, replacer);
            }            
            if (!stylesAdded) {
                filledTemplate += `
                    <style>
                        .inline {
                            display:inline;
                            width:auto;
                        }
                    </style>
                `;
                stylesAdded = true;
            }
            shadowRoot.innerHTML = filledTemplate;
        }
    });

    function save() {
        State.updateArticle(article.id, {
            id: article.id,
            aboutItems: article.aboutItems,
            title: titleValue,
            summary: summaryValue,
            content: document.getElementById('editor').innerText,
        });
        editMode = false;
    }

    function deleteArticle() {        
        const r = confirm("Delete article?");
        if (r === true) {
            State.deleteArticle(article.id);
        }   
    }
    
    function selectWidget(widget) {      
        widgetsFound = [];
        selectedWidget = widget;
        
        if (!widget.props || widget.props.length === 0) {
            insertWidget();
        } else {
            widget.props.forEach(p => {
                propsValues[p] = null;
            });
            setTimeout(() => {                
                document.getElementsByClassName('input-prop')[0].focus();
            }, 10);
        }
    }

    function insertWidget() {
        const widgetTag = 'wsf-' + selectedWidget.name.toLowerCase().replace(/ /g, '-');
        const propsText = Object.entries(propsValues).reduce((agg, curr) => {
            agg += ' data-' + curr[0] + '="' + curr[1] + '"';
            return agg;
        }, '');
        const fullText = '<' + widgetTag + propsText + '></' + widgetTag + '>';
        document.getElementById('editor').innerText += fullText;

        propsValues = {};
        selectedWidget = null;
    }

    function startEditing() {      
        searchString = null;
        contentInserted = false;
        editMode = true;
    }

    function resetSearch() {
        searchString = '';
    }

    function stopSearch(e) {          
        if (e.target.className.indexOf('top-bar') >= 0
           || e.target.className.indexOf('title') >= 0) {
            searchString = null;
            selectedWidget = null;
        }
    }

    function onPropType(e) {
        if (e.key === 'Enter') {
            insertWidget();           
        }
    }

</script>

<style>
    .article {
        margin: 10px 20px 0px 20px;
        height: calc(100% - 10px);
        position: relative;
    }
    .top-bar {
        padding: 10px 0px;
        display: flex;
        justify-content: space-between;
    }
    .top-bar-left {
        display: flex;
    }
    #editor {
        height: calc(100% - 120px);
        width: calc(100% - 10px);
        border: 1px solid #ccc;
        padding: 10px;
    }
    .preview-options div{
        float: right;
    }
    .title {
        padding-right: 20px;
    }
    .widgets {
        position: relative;
    }
    .widgets-input {
        margin-bottom: 0;
    }
    .results{
        position: absolute;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        padding: 5px 20px;
        left: 2px;
        width: 358px;
        left: 0px;
    }
    .prop {
        padding: 5px 0px;
    }
    .widget-result {
        padding: 5px 5px;
        cursor: pointer;
    }
    .widget-result:hover {
        background-color: #eee;
    }
    .buttons {
        display: flex;
    }
    .buttons div button {
        width: 61px;
        margin-left: 10px;
    }
    .block-title {
        padding-bottom: 3px;
        font-size: 12px;
        color: #999;
    }
    .browser {
        position: absolute;
        top: 20px;
        right: 40px;
        border: 1px solid #ccc;
        background-color: #f3f3f3;
        width: 600px;
        height: 600px;
    }
</style>

<div class="article">

    {#if editMode}
        <div class="top-bar" on:click={ e => stopSearch(e) }>
            <div class="top-bar-left">
                <div class="title">
                    <input bind:value={ titleValue } style="width: 400px" placeholder="Enter title">
                </div>
                <div class="widgets">
                    <input class="widgets-input"
                        id="widget-search"
                        placeholder="Search to insert widgets"
                        bind:value={ searchString }
                        on:click={ resetSearch }
                        style="width: 400px">
                    {#if widgetsFound.length > 0}
                    <div class="results">
                        {#each widgetsFound as widget (widget.name) }
                            <div class="widget-result" on:click={ () => selectWidget(widget) }>
                                { widget.name }
                            </div>        
                        {/each}
                    </div>
                    {/if}
                    {#if selectedWidget && selectedWidget.props && selectedWidget.props.length > 0}
                    <div id="selected-widget" class="results">
                        {#each selectedWidget.props as prop }
                            <div class="prop">
                                { prop } <input class="input-prop" on:keypress={e => onPropType(e)} bind:value={ propsValues[prop] }>
                            </div>        
                        {/each}
                    </div>
                    {/if}
                </div>
            </div>
            <div class="buttons">
                <div class="save">            
                    <button on:click={ save }>Save</button>
                </div>
                <div class="delete">            
                    <button on:click={ deleteArticle }>Delete</button>
                </div>
            </div>            
        </div>

        <div class="summary">
            <div class="block-title">Summary</div>
            <textarea bind:value={ summaryValue }
                style="width: calc(100% + 10px); padding-left:10px;height: 78px;resize: none;"></textarea>
        </div>

        <div class="block-title">Contents</div>
        <div id="editor" contenteditable>
        </div>
    {/if}

    {#if !editMode}
        <div class="preview-options">
            <div><button on:click={ () => startEditing() }>Edit</button></div>
        </div>
    {/if}
    <div id="preview">
    </div>

    {#if nuggetToBrowse }
    <div class="browser">
        <Browser concept={nuggetToBrowse.props.concept} item={nuggetToBrowse.props.instance} />
    </div>
    {/if}
    

</div>

