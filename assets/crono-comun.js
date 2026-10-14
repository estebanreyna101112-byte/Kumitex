// Utilidades compartidas por la pantalla del cronómetro y su control remoto.
// El estado de cada tatami vive en kumitex_torneos.config.cronoN (N = tatami):
//   { modo: 'descanso' | 'combate', dur, estado: 'listo' | 'corriendo' | 'pausa' | 'fin',
//     rest (segundos), fin (ms del reloj del servidor), v (versión) }
(function(){
  const SUPA = 'https://rldtkomtclolhbmrphgh.supabase.co';
  const KEY = 'sb_publishable_-ac_7LjLqEIeVkkcQYQmFw_U9jMD2Mo';
  const cab = { apikey: KEY, 'Content-Type': 'application/json' };

  const C = window.CRONO = {
    offset: 0,            // reloj del servidor web − reloj de este dispositivo (ms)
    sincronizado: false,

    ahora(){ return Date.now() + C.offset; },

    // Mide la diferencia con el reloj del servidor web usando la cabecera Date,
    // detectando el instante exacto en que cambia el segundo (precisión ~100 ms).
    async medirReloj(){
      const m = [];
      for(let i = 0; i < 18; i++){
        const a = Date.now();
        try{
          const r = await fetch(`assets/logo.svg?_=${Math.random().toString(36).slice(2)}`, { method: 'HEAD', cache: 'no-store' });
          const b = Date.now();
          const d = Date.parse(r.headers.get('date') || '');
          if(!isNaN(d)) m.push({ mid: (a + b) / 2, d });
        }catch(e){}
        await new Promise(res => setTimeout(res, 140));
      }
      const offs = [];
      for(let i = 1; i < m.length; i++){
        if(m[i].d > m[i - 1].d) offs.push(m[i].d - (m[i - 1].mid + m[i].mid) / 2);
      }
      let off = null;
      if(offs.length){
        offs.sort((x, y) => x - y);
        off = offs[Math.floor(offs.length / 2)];
      }else if(m.length){
        off = m.reduce((s, x) => s + (x.d + 500 - x.mid), 0) / m.length;
      }
      if(off !== null && Math.abs(off) < 6 * 3600 * 1000) C.offset = off;
      C.sincronizado = true;
      return C.offset;
    },

    async leer(slug, select){
      try{
        const r = await fetch(`${SUPA}/rest/v1/kumitex_torneos?slug=eq.${encodeURIComponent(slug)}&select=${select}`, { headers: { apikey: KEY } });
        if(!r.ok) return { ok: false };
        const j = await r.json();
        return { ok: true, fila: Array.isArray(j) && j.length ? j[0] : null };
      }catch(e){ return { ok: false }; }
    },

    // estado del cronómetro de un tatami: objeto, null (sin estado) o undefined (error de red)
    async estado(slug, tatami){
      const r = await C.leer(slug, `c:config->crono${tatami}`);
      if(!r.ok) return undefined;
      return r.fila ? (r.fila.c || null) : null;
    },

    async rpc(fn, body){
      try{
        const r = await fetch(`${SUPA}/rest/v1/rpc/${fn}`, { method: 'POST', headers: cab, body: JSON.stringify(body) });
        return await r.json();
      }catch(e){ return { ok: false, error: 'sin_conexion' }; }
    },

    restante(e){
      if(!e) return 0;
      if(e.estado === 'corriendo') return Math.max(0, (e.fin - C.ahora()) / 1000);
      return Math.max(0, +e.rest || 0);
    },

    fmt(seg){
      const s = Math.max(0, Math.ceil(seg - 1e-6));
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }
  };
})();
