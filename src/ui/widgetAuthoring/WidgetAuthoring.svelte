<script>
    import { State } from '../../stores';

    $: widgetAuthoring = $State.ui.widgetAuthoring || {
        widget: {
            name: '',
            width: '4cols',
            height: 300,
            inMashups: true,
            inLists: false,
            nestable: false,
            props: '',            
        },        
    };

    let fullAuthoring = false;
    let includeScripts = true;

    let initialName;

    $: {
        if (!initialName) {            
            initialName = widgetAuthoring.widget.name;
        }
         
    }

    function save() {
        if (widgetAuthoring.computedNode && widgetAuthoring.computedNode.length > 0) {
            widgetAuthoring.template = null;
            widgetAuthoring.script = null;
        } else {
            widgetAuthoring.computedNode = null;
        }
        if (widgetAuthoring.widget.props.length > 0) {
            widgetAuthoring.widget.props = widgetAuthoring.widget.props.replace(/ /g,'_').split(',');
        }
        State.deleteWidget(initialName);
        State.saveWidget();
        State.closeWidgetAuthoring();
    }

    function deleteWidget() {
        const r = confirm("Delete widget?");
        if (r === true) {
            State.deleteWidget(initialName);
            State.closeWidgetAuthoring();
        }        
    }

</script>

<style>
    .authoring{
        padding: 10px 20px;
        height: 100%;
        width: 100%;
    }
    .content {
        display: flex;
        height: 100%;
    }
    .top-bar {
        display: flex;
        justify-content: space-between;
    }
    .buttons {
        display: flex;
        align-items: center;
    }
    .buttons div {
        margin-right: 10px;
    }
    .buttons div button {
        width: 80px;
    }
    .options {
        display: flex;
        align-items: center;
    }    
    .options div {
        padding-right: 20px;
    }

    .title {
        font-weight: bold;
        margin: 10px 0px;
    }

    textarea {
        width: 100%;
        height: 100%;
    }

</style>

<div class="authoring">
    <div class="top-bar">
        <div class="options">
            <div class="name">
                <span>            
                    Name
                </span>
                <input bind:value={widgetAuthoring.widget.name}>
            </div>
            <div>
                <span>            
                    W
                </span>
                <input bind:value={widgetAuthoring.widget.width} style="width:80px" placeholder="Width (px or cols)">
            </div>
            <div>
                <span>            
                    H
                </span>
                <input bind:value={widgetAuthoring.widget.height} style="width:80px" placeholder="Height (px)">
            </div>
            <div>
                <span>            
                    Props
                </span>
                <input bind:value={widgetAuthoring.widget.props} style="width:280px">
            </div>
            <div>
                <label>
                    <input type=radio bind:group={fullAuthoring} value={false}>
                    Template
                </label>
                <label>
                    <input type=radio bind:group={fullAuthoring} value={true}>
                    Full Component
                </label>
            </div>
            <div>
                {#if !fullAuthoring}
                <div>
                    <label>
                        <input type=checkbox bind:checked={includeScripts}>
                        Include Scripts
                    </label>
                </div>
                {/if}
                <div>
                    <label>
                        <input type=checkbox bind:checked={widgetAuthoring.widget.nestable}>
                        Nestable
                    </label>
                </div>
            </div>
            <div>
                <div>
                    <label>
                        <input type=checkbox bind:checked={widgetAuthoring.widget.inMashups}>
                        In Mashups
                    </label>
                </div>
                <div>
                    <label>
                        <input type=checkbox bind:checked={widgetAuthoring.widget.inLists}>
                        In Lists
                    </label>
                </div>
            </div>            
        </div>
        <div class="buttons">
            <div>
                <button on:click={ () => State.closeWidgetAuthoring() }>Cancel</button>
            </div>
            <div>
                <button on:click={ () => save() }>Save</button>
            </div>            
            <div>
                <button on:click={ () => deleteWidget() }>Delete</button>
            </div>
        </div>
    </div>
    <div class="content">
        {#if !fullAuthoring}
            <div style="width: { includeScripts ? '50' : '100' }%">
                <div class="title">Template</div>
                <textarea bind:value={widgetAuthoring.widget.template}></textarea>
            </div>
            {#if includeScripts}
            <div style="width:50%">
                <div class="title">Script</div>
                <textarea bind:value={widgetAuthoring.widget.script}></textarea>
            </div>
            {/if}
        {/if}
        {#if fullAuthoring}
        <div style="width:100%">
            <textarea bind:value={widgetAuthoring.widget.computedNode}></textarea>
        </div>
        {/if}
    </div>
</div>

