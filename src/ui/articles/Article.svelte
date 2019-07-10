<script>
    import { onMount, afterUpdate } from 'svelte';
    import { State } from '../../stores';

    $: article = $State.data.articles[$State.ui.screenParameters.articleID];
    
    let titleValue;
    let editMode = true;
    let shadowRoot;
    let stylesAdded = false;
    let searchString = null;
    let selectedWidget = null;
    let contentInserted = false;
    let titleInserted = false;

    let widgets = [];
    let widgetsFound = [];

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
        if (!searchString || searchString.length === 0) {
            widgetsFound = [];
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
            titleValue = article.title;
            titleInserted = true;
        }
        if (editMode && !contentInserted) {
            document.getElementById('editor').innerText = article.content;
            contentInserted = true;
        } else {
            let filledTemplate = article.content.replace(/\n/g, '<br />');
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
            content: document.getElementById('editor').innerText,
        });
        editMode = false;
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

</script>

<style>
    .article {
        margin: 10px 20px 0px 20px;
        height: calc(100% - 10px);
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
</style>

<div class="article">

    {#if editMode}
        <div class="top-bar">
            <div class="top-bar-left">
                <div class="title">
                    Title
                    <input bind:value={ titleValue } style="width: 400px">
                </div>
                <div class="widgets">
                    Widgets
                    <input class="widgets-input"
                        bind:value={ searchString }
                        style="width: 400px">
                    {#if widgetsFound.length > 0}
                    <div class="results" style="width: 400px;left: 60px">
                        {#each widgetsFound as widget (widget.name) }
                            <div class="widget-result" on:click={ () => selectWidget(widget) }>
                                { widget.name }
                            </div>        
                        {/each}
                    </div>
                    {/if}
                    {#if selectedWidget && selectedWidget.props && selectedWidget.props.length > 0}
                    <div class="results" style="width: 400px;left: 60px">
                        {#each selectedWidget.props as prop }
                            <div class="prop">
                                { prop } <input bind:value={ propsValues[prop] }>
                            </div>        
                        {/each}
                        <button on:click={ () => { insertWidget() }}>Insert</button>
                    </div>
                    {/if}
                </div>
            </div>
            <div class="save">            
                <button on:click={ save }>Save</button>
            </div>
        </div>

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
    

</div>

