<script>
    import { State } from '../stores';
    import { searchIndex, NuggetType, addNugget, navigateFromSearch } from '../logic/search';

    const MAX_OPTIONS_PER_TYPE = 5;
    
    let activeText = '';
    let nuggets = [];
    let foundNuggets = [];
    $: foundByType = {};
    $: options = [];
    $: activeOption = -1;

    function sortOptions(a, b) {
        const aSort = a.type + a.props.instance;
        const bSort = b.type + b.props.instance;
        if ( aSort < bSort ){
            return -1;
        }
        if ( aSort > bSort ){
            return 1;
        }
        return 0;
    }

    function onSearchInputKeyUp(event) {        
        if (event.key === 'ArrowDown') {
            activeOption++;
        }
        if (event.key === 'ArrowUp') {
            activeOption--;
        }
        if (event.key === 'Enter') {
            if (options.length === 0) {
                navigateFromSearch(nuggets);
                
            } else {
                if (activeOption >= 0) {
                    selectOption(options[activeOption]);
                } else {
                    selectOption(options[0]);
                }
            }
        }
        search();
    }

    function search() {
        options = [];
        foundByType = {};    
        if (activeText.length === 0) {
            foundNuggets = [];
            return;
        }
        if (activeText.length >= 3) {
            foundNuggets = searchIndex(activeText, nuggets);
        }     
        // group nuggets by type, keep max MAX_OPTIONS_PER_TYPE of each type            
        foundNuggets
            .sort(sortOptions)
            .forEach(nugget => {
                let type = nugget.type;
                if (nugget.type === NuggetType.Instance) {
                    type += nugget.props.concept;
                }
                if (!foundByType[type]){
                    foundByType[type] = 0;
                }
                foundByType[type]++;
                if (foundByType[type] <= MAX_OPTIONS_PER_TYPE) {
                    options.push(nugget)
                }
                if (foundByType[type] === MAX_OPTIONS_PER_TYPE + 1) {
                    options.push({ type: 'MORE', props: nugget.props })
                }
            });
    }

    function selectOption(option) {
        nuggets = addNugget(option, nuggets);
        options = [];
        activeText = '';
        activeOption = -1;
        document.getElementById('search-input').focus();
    }

</script>

<style>
    input {
        outline: none;
    }
    input[type=search] {
        -webkit-appearance: textfield;
        -webkit-box-sizing: content-box;
        font-family: inherit;
        font-size: 100%;
    }
    input::-webkit-search-decoration,
    input::-webkit-search-cancel-button {
        display: none; 
    }

    input[type=search] {
        background: #ededed url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat 9px center;
        border: solid 1px #ccc;
        padding: 9px 10px 9px 32px;
        width: 55px;
        border-radius: 10em;
        transition: all .3s;
    }
    input[type=search]:focus {
        width: 600px;
        background-color: #fff;
        box-shadow: 0 0 5px rgba(109,207,246,.5);
    }
    input::-webkit-input-placeholder {
        color: #999;
    }

    .search{
        position: relative;
    }

    .options-container{
        background-color: #fff;
        position: absolute;
        width: 100%;
        display: flex;
        z-index: 1;
        flex-direction: column;
    }
    .option img, .nugget img {
        height: 20px;
        width: 15px;
        margin-right: 5px;
    }
    .option-type-name {
        color: #666;
        padding-right: 10px;
    }
    .nuggets-container {        
        background-color: #fff;
        position: absolute;
        width: 100%;
        display: flex;
        z-index: 1;
        flex-direction: row;
    }

    .active {
        background-color: steelblue;
    }
</style>

<div class="search">
	<input type="search"
        id="search-input"
        placeholder="Search"
        style="width:{activeText.length > 0 || nuggets.length > 0 ? '600px' : null}"
        bind:value={activeText} on:keyup={onSearchInputKeyUp} />

    {#if nuggets && nuggets.length > 0 }
    <div class="nuggets-container">
        {#each nuggets as nugget }
            <div class="nugget">
            {#if nugget.type === NuggetType.Instance}                
                <img alt=""
                    src={$State.data.concepts[nugget.props.concept].icon}
                />
                { nugget.props.instance }                
            {/if}
            {#if nugget.type === NuggetType.Attribute}
                <span class="nugget-type-name">{ nugget.props.concept } attribute -</span>{ nugget.props.attribute }
            {/if}
            {#if nugget.type === NuggetType.Widget}
                <span class="nugget-type-name">{ nugget.props.concept } widget -</span>{ nugget.props.widget }
            {/if}
            {#if nugget.type === NuggetType.Set}
                <span class="nugget-type-name">{ nugget.props.concept }</span>
                {#each nugget.props.attributeValues as att }
                    <span>{ att.attribute }: { att.value },</span>
                {/each}
            {/if}
            </div>
        {/each}
    </div>
    {/if}

    {#if options && options.length > 0 }
    <div class="options-container">
        {#each options as option, i }
            <div class="option" class:active="{activeOption === i}"
                on:click={() => selectOption(option)}>
                {#if option.type === NuggetType.Instance}                
                    <img alt=""
                        src={$State.data.concepts[option.props.concept].icon}
                    />
                    { option.props.instance }                
                {/if}
                {#if option.type === 'MORE'}
                    {foundByType[NuggetType.Instance + option.props.concept] - MAX_OPTIONS_PER_TYPE} more { option.props.concept }...
                {/if}
                {#if option.type === NuggetType.Attribute}
                    <span class="option-type-name">{ option.props.concept } attribute -</span>{ option.props.attribute }
                {/if}
                {#if option.type === NuggetType.Widget}
                    <span class="option-type-name">{ option.props.concept } widget -</span>{ option.props.widget }
                {/if}
                {#if option.type === NuggetType.Set}
                    <span class="option-type-name">{ option.props.concept }</span>
                    { option.props.attributeValues[0].attribute }: { option.props.attributeValues[0].value }
                {/if}
            </div>
        {/each}
    </div>
    {/if}
</div>