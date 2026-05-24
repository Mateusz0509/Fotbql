const matches = [
  {home:'Arsenal', away:'Chelsea', minute:0, formH:0.78, formA:0.62, xgH:1.72, xgA:1.18, shotsH:14, shotsA:10, possH:58, possA:42, venue:1},
  {home:'Liverpool', away:'Spurs', minute:0, formH:0.74, formA:0.60, xgH:1.90, xgA:1.35, shotsH:16, shotsA:11, possH:56, possA:44, venue:1},
  {home:'Man City', away:'Man Utd', minute:0, formH:0.81, formA:0.55, xgH:2.05, xgA:1.02, shotsH:17, shotsA:8, possH:63, possA:37, venue:1},
  {home:'Juventus', away:'Inter', minute:0, formH:0.69, formA:0.66, xgH:1.45, xgA:1.32, shotsH:12, shotsA:11, possH:51, possA:49, venue:1},
  {home:'Real Madrid', away:'Barcelona', minute:0, formH:0.77, formA:0.75, xgH:1.88, xgA:1.79, shotsH:15, shotsA:14, possH:52, possA:48, venue:1},
  {home:'Bayern', away:'Dortmund', minute:0, formH:0.79, formA:0.63, xgH:2.10, xgA:1.21, shotsH:18, shotsA:9, possH:61, possA:39, venue:1}
];

function scoreMatch(m){
  const form = (m.formH - m.formA) * 34;
  const xg = (m.xgH - m.xgA) * 18;
  const shots = (m.shotsH - m.shotsA) * 2.2;
  const poss = (m.possH - m.possA) * 0.55;
  const venue = m.venue * 4;
  const raw = 50 + form + xg + shots + poss + venue;
  const home = Math.max(5, Math.min(90, raw));
  const away = Math.max(5, Math.min(90, 100 - home - 12));
  const draw = Math.max(5, 100 - home - away);
  const total = home + draw + away;
  return {home:home/total*100, draw:draw/total*100, away:away/total*100};
}

function resultText(m, p){
  const winner = p.home > p.away && p.home > p.draw ? '1' : p.away > p.home && p.away > p.draw ? '2' : 'X';
  const conf = Math.max(p.home, p.draw, p.away).toFixed(0);
  const score = winner === '1' ? '2:1' : winner === '2' ? '1:2' : '1:1';
  return {winner, conf, score};
}

function render(){
  const box = document.getElementById('predictions');
  box.innerHTML = matches.map(m => {
    const p = scoreMatch(m);
    const r = resultText(m,p);
    return `<article class="card"><div class="meta"><strong>${m.home} vs ${m.away}</strong><span>${r.conf}%</span></div><h3>Typ: ${r.winner}</h3><p>Szacowany wynik: ${r.score}</p><div class="meta"><span>1: ${p.home.toFixed(0)}%</span><span>X: ${p.draw.toFixed(0)}%</span><span>2: ${p.away.toFixed(0)}%</span></div><div class="prob"><div style="width:${p.home.toFixed(0)}%"></div></div></article>`;
  }).join('');
  const best = scoreMatch(matches[0]);
  document.getElementById('heroConfidence').innerText = `${Math.max(best.home,best.draw,best.away).toFixed(0)}%`;
}

function refreshLive(){
  const homeScore = Number(document.getElementById('homeScore').value || 0);
  const awayScore = Number(document.getElementById('awayScore').value || 0);
  const homeXg = Number(document.getElementById('homeXg').value || 0);
  const awayXg = Number(document.getElementById('awayXg').value || 0);
  const minute = Number(document.getElementById('minute').value || 0);
  const diff = (homeScore - awayScore) * 20 + (homeXg - awayXg) * 22 + minute * 0.15;
  const home = Math.max(5, Math.min(92, 50 + diff));
  const away = Math.max(5, Math.min(92, 50 - diff * 0.85));
  const draw = Math.max(5, 100 - home - away);
  const total = home + away + draw;
  const probs = {home:home/total*100, draw:draw/total*100, away:away/total*100};
  const winner = probs.home > probs.away && probs.home > probs.draw ? 'Typ: 1' : probs.away > probs.home && probs.away > probs.draw ? 'Typ: 2' : 'Typ: X';
  document.getElementById('liveResult').innerHTML = `<strong>${winner}</strong><br>Live confidence: ${Math.max(probs.home, probs.draw, probs.away).toFixed(0)}%<br>1: ${probs.home.toFixed(0)}% | X: ${probs.draw.toFixed(0)}% | 2: ${probs.away.toFixed(0)}%<br>Szacowany wynik: ${homeScore}-${awayScore}`;
}

render();
refreshLive();
setInterval(refreshLive, 5000);
