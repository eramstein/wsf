'<script>
    import { State } from '../../stores';
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH, CATEGORIES_LIMITED_DISPLAYED, toggleCategory } from './filters';

    export let categories;
    export let filters;
    export let attribute;  

    const BAR_HEIGHT = 21;

    // TODO - this is weird :
    // we need to keep all categories, and in the same order, else Svelte doesn't keep object constency
    const allCategories = {};
    $: currentCategories = {};    
    
    $: categories.forEach(c => {
        if (!allCategories[c.label]) {
            allCategories[c.label] = true;
        }
        currentCategories[c.label] = true;
    })

    $: categoriesForChart = categories;
    
    Object.keys(allCategories).forEach(c => {
        if (!currentCategories[c]) {
            categoriesForChart.push({ label: c, value: 0 });
        }
    });    
    
    $: {
        if (filters && filters.limited) {
            categoriesForChart = categoriesForChart.slice(0, CATEGORIES_LIMITED_DISPLAYED);
        }
        categoriesForChart.sort((a, b) => a.label.localeCompare(b.label));
    }

</script>

<style>
    .category {
        display: flex;
        margin-bottom: 1px;
        position: absolute;
        transition: all 0.5s;
        cursor: pointer;
    }
    .category-name-container {
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .category-name {        
        overflow: hidden;
        text-align: right;
        white-space: nowrap;
    }
    .category-value {
        position: relative;
        padding-right: 5px;
        padding-top: 3px;
        padding-bottom: 3px;
        font-size: 80%;
        transition: all 0.5s;
        height: 15px;
    }
    .category-label {
        position: absolute;
    }
</style>

<div style="position:relative;height: {(BAR_HEIGHT+1)*Object.keys(categoriesForChart).length}px;">
    {#each categoriesForChart as category (category.label) }
        <div class="category"
             on:click={ () => toggleCategory(attribute, category.label)}
             style="top: {category.position * (BAR_HEIGHT+1)}px;">
            <div class="category-name-container" style="width: {FILTER_LABEL_WIDTH}px">
                <div class="category-name">{ category.label }</div>
            </div>
            <div style="
                width: {FILTER_VALUE_WIDTH}px;
                height: {BAR_HEIGHT}px;
                ">
                <div class="category-value"
                    style="width: {category.sizePercent}%;
                           background-color: {filters && filters.categories[category.label] ? 'red' : 'steelblue'}">
                    <div class="category-label"
                        style="color: {category.sizePercent > 10 ? 'white' : '#333' };
                               right: {category.sizePercent > 10 ? '5px' : null };
                               left: {category.sizePercent > 10 ? null : '110%' };
                               "
                    >
                        { category.value }
                    </div>
                </div>                
            </div>
        </div>   
    {/each}
</div>
