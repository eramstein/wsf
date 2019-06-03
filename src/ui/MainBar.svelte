<script>
    import { State } from '../stores';
    import { Screen } from '../model';
    import Link from './Link.svelte'
</script>

<style>
    .main-bar{
        height: 100%;
        background-color: rgba(33, 33, 33);
        color: white;
        display: flex;
        align-items: center;
        padding-left: 20px;
    }
    .home{
        font-weight: bold;
        cursor: pointer;
    }
</style>

<div class="main-bar">
    <Link screen={ Screen.Home } params={ null }>
        <div class="home">
            HOME
        </div>
    </Link>
</div>