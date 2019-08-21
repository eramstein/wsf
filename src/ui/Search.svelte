<script>
    import { State } from '../stores';
    
    let activeText = '';
    let nuggets = [];
    let otpions = [];

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
</style>

<div>
	<input type="search" placeholder="Search" bind:value={activeText} />
</div>