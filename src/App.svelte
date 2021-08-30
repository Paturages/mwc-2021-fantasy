<script lang="ts">
  const storagePlayers = localStorage.getItem('players');
  let players = storagePlayers ? JSON.parse(storagePlayers) : [];
  let selected = [];
  const sum = (arr, prop) => arr.reduce((sum, x) => sum + x[prop], 0);
  const ratio = player => player[toOptimize] / player.price;
  let toOptimize = 'total';
  let top = 6;
  let indexOverflow = false;

  const parse = $event => {
    const newPlayers = [];
    $event.target.value.split('\n').forEach(line => {
      const [,, player, sel, country, price, ro32, ro16, qf, sf, f, total] = line.split('\t');
      if (!+price) return;
      newPlayers.push({ player, sel: +sel, country, price: +price, ro32: +ro32, ro16: +ro16, qf: +qf, sf: +sf, f: +f, total: +total });
    });
    players = newPlayers;
    localStorage.setItem('players', JSON.stringify(players));
    compute();
  }

  const compute = () => {
    if (!players.length) return;
    const playersByPrice = players.sort((a, b) => b.price - a.price)
    // 1. Sort all players by points
    players = players.sort((a, b) => b[toOptimize] - a[toOptimize]);

    // 2. Initialize to top 6
    selected = players.slice(0, top);
    let index = top;

    // 3. If there are multiple players from the same country, only keep the best points/price ratio
    // At the same time, only keep the best 14 or 13.5 since we're only allowed one of those per roster
    let hasET = false;
    const countries = selected.reduce((obj, p) => {
      if (!obj[p.country] || ratio(p) > ratio(obj[p.country])) {
        if (!hasET || obj[p.country]?.price >= 13.5 || p.price < 13.5) {
          obj[p.country] = p;
          hasET ||= p.price >= 13.5;
        }
      }
      return obj;
    }, {});
    // Backfill with the next best players until the array reaches 6 members again
    selected = Object.values(countries);
    while (selected.length < top) {
      const p = players[index];
      if ((p.price < 13.5 || !hasET) && !countries[p.country]) {
        hasET ||= p.price >= 13.5;
        countries[p.country] = p;
        selected.push(p);
      }
      ++index;
    }

    // 5. There's not really a great way to optimize subs,
    // so just backfill with the cheapest pawns- I mean players
    // from non included countries

    // However, we do have to check that the sum of prices do not exceed 80,
    // so we store those 2 "fillers" away for now before the next step
    const fillers = [];
    let backIndex = playersByPrice.length - 1;
    while (fillers.length < 8 - top) {
      if (
        !countries[playersByPrice[backIndex].country]
        // HACK: Do not include murorachi (from TW) as a filler because TW does have potential I guess lol
        && playersByPrice[backIndex].country != 'TW'
      ) {
        fillers.push(playersByPrice[backIndex]);
        countries[playersByPrice[backIndex].country] = playersByPrice[backIndex];
      }
      --backIndex;
    }

    // 6. Aggressively repeatedly remove the least viables among the selected 6 (the least points/price ratio)
    // until people can fit again and backfill with other people until the price fits
    while (sum(selected.concat(fillers), 'price') > 80) {
      while (sum(selected.concat(fillers), 'price') + (playersByPrice[playersByPrice.length-1].price * (8 - selected.length - fillers.length)) > 80) {
        let min = Infinity;
        let minIndex = null;
        selected.forEach((p, i) => {
          const value = ratio(p);
          if (value < min) {
            min = value;
            minIndex = i;
          }
        });

        delete countries[selected[minIndex].country];
        const [deleted] = selected.splice(minIndex, 1);
        hasET = hasET && deleted.price < 13.5;
      }

      while (selected.length < top) {
        const p = players[index];
        if (index >= players.length) {
          break;
        } else if ((p.price < 13.5 || !hasET) && !countries[p.country]) {
          hasET ||= p.price >= 13.5;
          countries[p.country] = p;
          selected.push(p);
          ++index;
        } else {
          ++index;
        }
      }

      if (index >= players.length) {
        indexOverflow = true;
        break;
      }
    }

    // 7. Finally, assemble the selected and the fillers together
    selected.push(...fillers);
  }

  compute();
</script>

<main>
  <div class="column">
    <h1>fantasy thing</h1>

    <p>
      6 players + 2 subs<br />
      Max cost: 80<br />
      Only one player per country<br />
      Only one "super player" (14 or 13.5)
    </p>

    <textarea placeholder="Ctrl+A, Ctrl+C from 'MWC players' sheet, Ctrl+V here. Make sure that *everything* is selected on the sheet (all columns, even 'A')" on:input={parse}></textarea>

    <br />
    <select bind:value={toOptimize} on:change={compute}>
      <option value="total">Optimize total points</option>
      <option value="ro32">Optimize RO32 points</option>
      <option value="ro16">Optimize RO16 points</option>
      <option value="qf">Optimize Quarterfinals points</option>
      <option value="sf">Optimize Semifinals points</option>
      <option value="f">Optimize Finals/GF points</option>
    </select>

    <br />
    <select bind:value={top} on:change={compute}>
      <option value={6}>Optimize for top 6 (filler subs)</option>
      <option value={8}>Optimize for all 8</option>
    </select>

    <pre>Players: {JSON.stringify(players, null, 2)}</pre>
  </div>

  <div class="column">
    <pre>
      {selected.map(p => `${p.player.padEnd(15)} (${p.country}, ${p.price.toFixed(1)}): ${p[toOptimize]}`).join('\n')}
    </pre>
    {#if indexOverflow}
      <b>Optimization failed, results are broken :/</b>
    {/if}
    Optimization target: <b>{toOptimize.toUpperCase()}</b><br />
    Cost sum: <b>{sum(selected, 'price')}</b><br />
    Top 6 points (w/o bench): <b>{sum(selected.slice(0, 6), toOptimize)}</b><br />
    Total points: <b>{sum(selected, toOptimize)}</b>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    padding: 1em;
    display: flex;
  }

  .column {
    margin-right: 1em;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  textarea {
    width: 20em;
    height: 10em;
    margin: 1rem auto;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
