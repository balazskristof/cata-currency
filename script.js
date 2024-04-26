// https://getbootstrap.com/docs/5.3/components/tooltips/
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

function convert_pve(badge, heroism, valor, conquest, triumph, frost) {
    return {
        // ToC, ICC emblems convert to Justice until 4000 cap
        justice: Math.min((triumph + frost) * 11.58, 4000),
        // Rest converts to gold per excess point along with TBC, Northrend, Naxxramas, Ulduar emblems convert to gold
        money: Math.max(triumph + frost - 346, 0) * 11.58 * 4700 + badge * 18330 + heroism * 55000 + valor * 55000 + conquest * 55000
    }
}

function convert_pvp(old_honor, bg_mark, wg_mark, stonekeeper_shard, venture_coin, spirit_shard) {
    // Everything converts to honor until 4000 cap, rest converts to gold per excess point
    let new_honor = Math.floor(old_honor * 0.024 + bg_mark * 2.976 + wg_mark * 19.08 + stonekeeper_shard * 1.6 + venture_coin * 3 + spirit_shard * 1);

    return {
        honor: Math.min(new_honor, 4000),
        money: Math.max(new_honor - 4000, 0) * 35
    }
}

function format_money(money) {
    let gold = Math.floor(money / 10000);
    let silver = Math.floor((money % 10000) / 100);
    let copper = money % 100;
    return `${gold}g ${silver}s ${copper}c`;
}

document.querySelector('#calculate').addEventListener('click', () => {
    console.log('Calculating...');

    let badge = parseInt(document.querySelector('#badge').value) || 0;
    let heroism = parseInt(document.querySelector('#heroism').value) || 0;
    let valor = parseInt(document.querySelector('#valor').value) || 0;
    let conquest = parseInt(document.querySelector('#conquest').value) || 0;
    let triumph = parseInt(document.querySelector('#triumph').value) || 0;
    let frost = parseInt(document.querySelector('#frost').value) || 0;
    let pve_converted = convert_pve(badge, heroism, valor, conquest, triumph, frost);
    console.log(pve_converted);

    let old_honor = parseInt(document.querySelector('#old_honor').value) || 0;
    let bg_mark = parseInt(document.querySelector('#bg_mark').value) || 0;
    let wg_mark = parseInt(document.querySelector('#wg_mark').value) || 0;
    let stonekeeper_shard = parseInt(document.querySelector('#stonekeeper_shard').value) || 0;
    let venture_coin = parseInt(document.querySelector('#venture_coin').value) || 0;
    let spirit_shard = parseInt(document.querySelector('#spirit_shard').value) || 0;
    let pvp_converted = convert_pvp(old_honor, bg_mark, wg_mark, stonekeeper_shard, venture_coin, spirit_shard);
    console.log(pvp_converted);

    document.querySelector('#justice').value = pve_converted.justice;
    document.querySelector('#money').value = format_money(pve_converted.money + pvp_converted.money);
    document.querySelector('#honor').value = pvp_converted.honor;
});