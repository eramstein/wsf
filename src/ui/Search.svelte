<script>
    import { State } from '../stores';
    import { searchIndex, NuggetType } from '../logic/search';

    const MAX_OPTIONS_PER_TYPE = 5;
    
    let activeText = '';
    let nuggets = [];
    let foundNuggets = [];
    $: foundByType = {};
    $: options = [];

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
        console.log(options);
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
    .option img {
        height: 20px;
        width: 15px;
        margin-right: 5px;
    }
    .option-type-name {
        color: #666;
        padding-right: 10px;
    }
</style>

<div class="search">
	<input type="search"
        placeholder="Search"
        style="width:{activeText.length > 0 ? '600px' : null}"
        bind:value={activeText} on:keyup={search} />
    {#if options && options.length > 0 }
    <div class="options-container">
        {#each options as option }
            {#if option.type === NuggetType.Instance}
                <div class="option">
                    <img alt=""
                        src={$State.data.concepts[option.props.concept].icon}
                    />
                    { option.props.instance }
                </div>
            {/if}
            {#if option.type === 'MORE'}
                <div class="option">
                    {foundByType[NuggetType.Instance + option.props.concept] - MAX_OPTIONS_PER_TYPE} more { option.props.concept }...
                </div>
            {/if}
            {#if option.type === NuggetType.Attribute}
                <div class="option">
                    <span class="option-type-name">{ option.props.concept } attribute -</span>{ option.props.attribute }
                </div>
            {/if}
            {#if option.type === NuggetType.Widget}
                <div class="option">
                    <span class="option-type-name">{ option.props.concept } widget -</span>{ option.props.widget }
                </div>
            {/if}
            {#if option.type === NuggetType.Set}
                <div class="option">
                    <span class="option-type-name">{ option.props.concept }</span>
                    { option.props.attributeValues[0].attribute }: { option.props.attributeValues[0].value }
                </div>
            {/if}
        {/each}
    </div>
    {/if}
</div>