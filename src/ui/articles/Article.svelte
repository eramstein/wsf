<script>
    import { onMount, afterUpdate } from 'svelte';
    import { State } from '../../stores';

    $: article = $State.data.articles[$State.ui.screenParameters.articleID];
    $: title = article.title;

    let editMode = true;
    let shadowRoot;
    
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
            // if (e.keyCode === 13) {
            //     console.log('enter mofo');
            //     document.execCommand('insertHTML', false, '\n\n');
            // }
        }
        shadowRoot = preview.attachShadow({mode: 'open'});
    });

    afterUpdate(() => {
        console.log('AFTER UPDATE', editMode);
        if (editMode) {            
            document.getElementById('editor').innerText = article.content;
        } else {
            console.log(article.content);
            
            shadowRoot.innerHTML = article.content;
        }
    });

    function save() {
        State.updateArticle(article.id, {
            id: article.id,
            aboutItems: article.aboutItems,
            title: title,
            content: document.getElementById('editor').innerText,
        });
        editMode = false;
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
    #editor {
        height: calc(100% - 120px);
        width: calc(100% - 10px);
        border: 1px solid #ccc;
        padding: 10px;
    }
    .preview-options div{
        float: right;
    }
</style>

<div class="article">

    {#if editMode}
        <div class="top-bar" >
            <div class="title" >
                Title
                <input bind:value={ title }>
            </div>
            <div class="save" >            
                <button on:click={ save }>Save</button>
            </div>
        </div>

        <div id="editor" contenteditable>
        </div>
    {/if}

    {#if !editMode}
        <div class="preview-options">
            <div><button on:click={ () => { editMode = true } }>Edit</button></div>
        </div>
    {/if}
    <div id="preview">
    </div>
    

</div>

