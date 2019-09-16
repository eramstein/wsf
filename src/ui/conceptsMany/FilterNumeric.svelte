'<script>
    import { State } from '../../stores';
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH, setNumericRange } from './filters';

    export let filters;
    export let attribute;
    export let spread;

    const width = FILTER_LABEL_WIDTH + FILTER_VALUE_WIDTH;

    const range = { min: Infinity , max: -Infinity };

    $: {
        range.min = Math.min(range.min, spread.min);
        range.max = Math.max(range.max, spread.max);
    }

    function scale(value) {        
        const pixels = (value - range.min) / (range.max - range.min) * width;
        return pixels;
    }

    function scaleInv(pixels) {        
        const value = range.min + pixels / width * (range.max - range.min);
        return value;
    }

    let dragStartPos = null;
    let dragEndPos = null;

    function startDrag(pos) {
        dragStartPos = pos;
        dragEndPos = null;
    }

    function endDrag(pos) {
        dragEndPos = pos;        
        const minPos = Math.max(0, Math.min(dragStartPos, dragEndPos));
        const maxPos = Math.min(width, Math.max(dragStartPos, dragEndPos));        
        setNumericRange(attribute, scaleInv(minPos), scaleInv(maxPos));
    }

    function cancelSelection() {
        setNumericRange(attribute, null, null);
    }

</script>

<style>
    .boxplot {
        position: relative;
        height: 41px;
        user-select: none;
        cursor: col-resize;
    }
    .boxplot div{
        position: absolute;
    }
    .boxplot div:not(.selection){
        transition: all 0.5s;
    }
    .label{
        font-size: 80%;
    }
    .label-top{
        top: 2px;
    }
    .label-bottom{
        top: 25px;
    }
    .label-max{
        transform: translateX(-100%);
    }
    .label-med{
        transform: translateX(-50%) translateX(3px);
    }
    .label-q1, .label-q3{
        transform: translateX(-50%);
    }
    .minmax{        
        top: 21px;
        height: 1px;
        background-color: black;
    }
    .quartiles{
        top: 20px;
        height: 3px;
        background-color: black;
    }
    .median{
        top: 20px;
        height: 3px;
        width: 3px;
        background-color: white;
    }
    .selection{
        top: 0px;
        height: 100%;
        background-color: rgb(248, 216, 164);
    }
    .selection-cancel{
        top: -30px;
        right: 30px;
        cursor: pointer;
    }
    .selection-overlay{
        z-index: 1000;
        width: 100%;
        height: 100%;
    }
</style>

{#if filters && spread.min !== spread.max }
    <div class="boxplot"
        on:mousedown={ e => { if (e.which === 1) { startDrag(e.offsetX); } }}
        on:mouseup={ e => { if (e.which === 1) { endDrag(e.offsetX); } }}
    >   
        <div class="selection-overlay"></div>
        {#if filters.from || filters.to }
        <div class="selection-cancel" on:click={ () => cancelSelection() }>x</div>
        {/if}
        <div class="selection" style="left: { scale(filters.from) }px; width: { scale(filters.to) - scale(filters.from) }px"></div>
        <div class="minmax" style="left: { scale(spread.min) }px; width: { scale(spread.max) - scale(spread.min) }px"></div>
        <div class="quartiles" style="left: { scale(spread.q1) }px; width: { scale(spread.q3) - scale(spread.q1) }px"></div>
        <div class="median" style="left: { scale(spread.med) }px"></div>
        {#if spread.min !== spread.q1 && spread.min !== spread.q3 }
        <div class="label label-bottom" style="left: { scale(spread.min) }px">{ spread.min }</div>
        {/if}
        {#if spread.max !== spread.q1 && spread.max !== spread.q3 }
        <div class="label label-bottom label-max" style="left: { scale(spread.max) }px">{ spread.max }</div>
        {/if}
        {#if spread.med !== spread.min && spread.med !== spread.max && scale(spread.med) - scale(spread.q1) > 10 }
        <div class="label label-bottom label-med" style="left: { scale(spread.med) }px">{ spread.med }</div>
        {/if}
        {#if scale(spread.q3) - scale(spread.med) > 10 }
        <div class="label label-top label-q1" style="left: { scale(spread.q1) }px">{ spread.q1 }</div>        
        <div class="label label-top label-q3" style="left: { scale(spread.q3) }px">{ spread.q3 }</div>
        {/if}
    </div>
{:else}
    <div class="boxplot">
        { spread.min }
    </div>
{/if}
