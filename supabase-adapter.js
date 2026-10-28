/* =====================================================================
   CRM SOAGA — connecteur Supabase
   Hors Artefact Claude (ex. Vercel), ce fichier fournit à l'application la
   même interface que le stockage intégré des Artefacts (window.claude) :
     - use('db')        : collection(...).orderBy().limit().onSnapshot(), add, doc(id).set/update/delete
     - use('user')      : me(), profiles(ids), canEdit()
     - use('downloads') : save({filename, data})
   …mais branchée sur une vraie base Supabase avec de vrais comptes
   e-mail / mot de passe et des mises à jour en temps réel.
   Dans un Artefact Claude (window.claude déjà présent) ou si config.js est
   vide, ce fichier ne fait rien.
   Avec l'attribut data-auth-only (page vitrine), il expose seulement
   window.SOAGA_AUTH pour se connecter, sans toucher à window.claude.
   ===================================================================== */
(function(){
  "use strict";
  var script = document.currentScript;
  var authOnly = !!(script && script.hasAttribute('data-auth-only'));
  var cfg = window.SOAGA_SUPABASE || {};
  var configured = !!(cfg.url && cfg.key);
  if(window.claude && !authOnly) return;            // Artefact Claude : stockage intégré
  if(!configured){
    if(!authOnly && !window.claude) document.addEventListener('DOMContentLoaded', showNotConfigured);
    return;
  }

  var SB_SRC = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  var client = null, session = null, myProfile = null;

  function loadLib(){
    if(window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise(function(resolve, reject){
      var s = document.createElement('script');
      s.src = SB_SRC; s.async = true;
      s.onload = function(){ resolve(); };
      s.onerror = function(){ reject(new Error('Impossible de charger la bibliothèque Supabase.')); };
      document.head.appendChild(s);
    });
  }
  var clientReady = loadLib().then(function(){
    client = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true } });
    return client;
  });

  function frError(err){
    var m = (err && (err.message || err.error_description)) || 'Erreur inconnue';
    if(/Invalid login credentials/i.test(m)) return 'E-mail ou mot de passe incorrect.';
    if(/Email not confirmed/i.test(m)) return 'Adresse e-mail pas encore confirmée : cliquez sur le lien reçu par e-mail.';
    if(/User already registered/i.test(m)) return 'Un compte existe déjà avec cet e-mail : connectez-vous.';
    if(/Password should be at least/i.test(m)) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if(/row-level security|permission denied|violates/i.test(m)) return 'Action non autorisée pour votre rôle.';
    if(/Failed to fetch|NetworkError/i.test(m)) return 'Connexion au serveur impossible. Vérifiez votre réseau.';
    return m;
  }
  function wrapErr(err){ var e = new Error(frError(err)); e.cause = err; return e; }

  /* ---------------- authentification ---------------- */
  var AUTH = {
    configured: true,
    getSession: function(){
      return clientReady.then(function(c){ return c.auth.getSession(); }).then(function(r){ return r.data.session; });
    },
    signIn: function(email, password){
      return clientReady.then(function(c){ return c.auth.signInWithPassword({ email: email, password: password }); })
        .then(function(r){ if(r.error) throw wrapErr(r.error); return r.data.session; });
    },
    signUp: function(name, email, password){
      return clientReady.then(function(c){
        return c.auth.signUp({ email: email, password: password, options: { data: { name: name } } });
      }).then(function(r){ if(r.error) throw wrapErr(r.error); return r.data.session; }); // null = confirmation e-mail requise
    },
    signOut: function(){
      return clientReady.then(function(c){ return c.auth.signOut(); }).then(function(){ location.reload(); });
    }
  };
  window.SOAGA_AUTH = AUTH;
  if(authOnly) return;

  /* ---------------- écran de connexion de l'application ---------------- */
  var LOGO = 'logo-icon.png';
  function el(html){ var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function showLogin(){
    return new Promise(function(resolve){
      var signupMode = /[?&]signup=1/.test(location.search);
      var css = '' +
        '#sb-login{position:fixed;inset:0;z-index:200;background:var(--bg,#FFF8ED);display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto}' +
        '#sb-login .pill{position:absolute;height:64px;border-radius:99px;background:var(--surface-3,#EFE3D2);opacity:.7}' +
        '#sb-login .card{position:relative;width:min(420px,100%);background:var(--surface,#FFFAFA);border:1px solid var(--border,#E6D9C7);border-radius:20px;box-shadow:var(--shadow-lg);padding:32px 30px 26px}' +
        '#sb-login .brand{display:flex;align-items:center;gap:9px;margin-bottom:22px;font:900 16px "Helvetica Neue",Helvetica,Arial,sans-serif;color:var(--text,#111A31)}' +
        '#sb-login h2{margin:0 0 6px;font:900 21px "Helvetica Neue",Helvetica,Arial,sans-serif;color:var(--text,#111A31)}' +
        '#sb-login .sub{margin:0 0 20px;color:var(--text-muted,#4A5366);font-size:14px}' +
        '#sb-login label{display:block;font:700 12px "Helvetica Neue",Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted,#4A5366);margin:0 0 7px}' +
        '#sb-login input{width:100%;box-sizing:border-box;border:1.5px solid var(--border-strong,#D8C7AE);background:var(--surface,#FFFAFA);color:var(--text,#111A31);border-radius:10px;padding:11px 13px;font:400 15px Roboto,system-ui,sans-serif;outline:0;margin-bottom:16px}' +
        '#sb-login input:focus{border-color:var(--accent,#990000);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent,#990000) 16%,transparent)}' +
        '#sb-login .go{width:100%;border:0;border-radius:99px;padding:14px;background:var(--accent,#990000);color:#fff;font:700 15px "Helvetica Neue",Helvetica,Arial,sans-serif;cursor:pointer}' +
        '#sb-login .go:hover{background:var(--accent-ink,#7A0000)}#sb-login .go[disabled]{opacity:.6;cursor:wait}' +
        '#sb-login .msg{border-radius:9px;padding:9px 12px;font-size:13px;margin:0 0 16px}' +
        '#sb-login .msg.err{background:var(--critical-soft,#F5D9D6);color:var(--critical,#7A0000);border:1px solid var(--critical,#7A0000)}' +
        '#sb-login .msg.ok{background:var(--success-soft,#E6F4EA);color:var(--success,#1B7A3D);border:1px solid var(--success,#1B7A3D)}' +
        '#sb-login .switch{margin-top:16px;text-align:center;font-size:13.5px;color:var(--text-muted,#4A5366)}' +
        '#sb-login .switch button{all:unset;cursor:pointer;color:var(--accent,#990000);font-weight:700}' +
        '#sb-login .back{display:block;margin-top:10px;text-align:center;font-size:12.5px;color:var(--text-faint,#7A8296)}';
      var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
      var wrap = el('<div id="sb-login" role="dialog" aria-modal="true" aria-labelledby="sb-title">' +
        '<div class="pill" style="width:420px;top:8%;right:-180px"></div><div class="pill" style="width:300px;top:30%;left:-140px"></div>' +
        '<div class="pill" style="width:520px;bottom:12%;right:-260px"></div><div class="pill" style="width:200px;bottom:4%;left:40px"></div>' +
        '<div class="card"><div class="brand"><img src="' + LOGO + '" width="28" height="28" alt="SOAGA" style="border-radius:7px"> SOAGA CRM</div>' +
        '<h2 id="sb-title"></h2><p class="sub" id="sb-sub"></p>' +
        '<form id="sb-form" novalidate><p class="msg" id="sb-msg" hidden></p>' +
        '<div id="sb-name-row"><label for="sb-name">Nom complet</label><input id="sb-name" autocomplete="name" placeholder="Prénom Nom"></div>' +
        '<label for="sb-email">Adresse e-mail</label><input id="sb-email" type="email" autocomplete="username" placeholder="prenom.nom@soaga.net">' +
        '<label for="sb-pw">Mot de passe</label><input id="sb-pw" type="password" autocomplete="current-password" placeholder="••••••••">' +
        '<button class="go" id="sb-go" type="submit"></button></form>' +
        '<p class="switch"><span id="sb-switch-text"></span> <button type="button" id="sb-switch"></button></p>' +
        '<a class="back" href="landing">← Retour à la page d\'accueil</a></div></div>');
      document.body.appendChild(wrap);
      var $ = function(id){ return document.getElementById(id); };
      function setMode(signup){
        signupMode = signup;
        $('sb-title').textContent = signup ? 'Créer votre compte' : 'Connexion à votre espace';
        $('sb-sub').textContent = signup ? 'Rejoignez l\'espace CRM partagé de l\'équipe SOAGA.' : 'Accédez à vos leads, votre pipeline et vos tickets, partagés avec toute l\'équipe.';
        $('sb-name-row').hidden = !signup;
        $('sb-pw').setAttribute('autocomplete', signup ? 'new-password' : 'current-password');
        $('sb-go').textContent = signup ? 'Créer mon compte →' : 'Se connecter →';
        $('sb-switch-text').textContent = signup ? 'Déjà un compte ?' : 'Pas encore de compte ?';
        $('sb-switch').textContent = signup ? 'Se connecter' : 'Créer un compte';
        $('sb-msg').hidden = true;
      }
      function msg(text, ok){ var m = $('sb-msg'); m.textContent = text; m.className = 'msg ' + (ok ? 'ok' : 'err'); m.hidden = false; }
      setMode(signupMode);
      $('sb-switch').addEventListener('click', function(){ setMode(!signupMode); });
      setTimeout(function(){ (signupMode ? $('sb-name') : $('sb-email')).focus(); }, 30);
      $('sb-form').addEventListener('submit', function(e){
        e.preventDefault();
        var name = $('sb-name').value.trim(), email = $('sb-email').value.trim(), pw = $('sb-pw').value;
        if(!email || !pw || (signupMode && !name)){ msg(signupMode ? 'Merci de renseigner votre nom, votre e-mail et un mot de passe.' : 'Merci de renseigner votre e-mail et votre mot de passe.'); return; }
        var btn = $('sb-go'); btn.disabled = true;
        var p = signupMode ? AUTH.signUp(name, email, pw) : AUTH.signIn(email, pw);
        p.then(function(s){
          btn.disabled = false;
          if(!s){ setMode(false); $('sb-email').value = email; msg('Compte créé. Confirmez votre adresse via le lien reçu par e-mail, puis connectez-vous.', true); return; }
          wrap.remove(); style.remove();
          resolve(s);
        }).catch(function(err){ btn.disabled = false; msg(err.message); });
      });
    });
  }

  function showNotConfigured(){
    var b = document.createElement('div');
    b.setAttribute('role', 'status');
    b.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:150;max-width:calc(100% - 32px);background:var(--warning-soft,#FEEACD);color:var(--text,#111A31);border:1px solid var(--warning,#B2650A);border-radius:12px;padding:10px 14px;font:400 13px/1.45 Roboto,system-ui,sans-serif;box-shadow:var(--shadow-lg)';
    b.textContent = 'Base de données non configurée : renseignez config.js (voir README, section « Mise en ligne avec Supabase »). Les données ne sont pas enregistrées.';
    document.body.appendChild(b);
  }

  /* ---------------- session prête ---------------- */
  var ready = clientReady.then(function(c){ return c.auth.getSession(); }).then(function(r){
    session = r.data.session;
    return session || showLogin();
  }).then(function(s){
    session = s;
    client.auth.onAuthStateChange(function(evt){ if(evt === 'SIGNED_OUT') location.reload(); });
    return client.from('profiles').select('*').eq('id', s.user.id).maybeSingle();
  }).then(function(r){
    var u = session.user;
    myProfile = (r && r.data) || { id: u.id, name: (u.user_metadata && u.user_metadata.name) || (u.email || '').split('@')[0], email: u.email, color: '#990000', is_admin: false };
    startRealtime();
    return true;
  });

  /* ---------------- profils ---------------- */
  function initials(name){
    var parts = String(name || '?').trim().split(/\s+/);
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  function avatar(name, color){
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="' + (color || '#990000') + '"/>' +
      '<text x="32" y="41" font-family="Helvetica,Arial,sans-serif" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">' + initials(name).replace(/[<&>]/g, '') + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function toUser(p){ return { id: p.id, name: p.name || p.email || 'Membre', avatarUrl: avatar(p.name || p.email, p.color), color: p.color }; }
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var userCap = {
    me: function(){ return ready.then(function(){ return toUser(myProfile); }); },
    canEdit: function(){ return ready.then(function(){ return !!myProfile.is_admin; }); },
    profiles: function(ids){
      return ready.then(function(){
        ids = (ids || []).filter(function(id){ return UUID.test(String(id)); });
        if(!ids.length) return {};
        return client.from('profiles').select('id,name,email,color').in('id', ids).then(function(r){
          if(r.error) throw wrapErr(r.error);
          var map = {};
          (r.data || []).forEach(function(p){ map[p.id] = toUser(p); });
          return map;
        });
      });
    }
  };

  /* ---------------- base de données ---------------- */
  var cache = {};       // collection -> { id: data }
  var loading = {};     // collection -> Promise
  var listeners = [];   // { coll, field, dir, max, cb }
  var pending = {};

  function newId(){
    if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
  function fetchAll(coll){
    var PAGE = 1000, rows = [];
    function page(from){
      return client.from('records').select('id,data').eq('collection', coll)
        .order('created_at', { ascending: false }).range(from, from + PAGE - 1)
        .then(function(r){
          if(r.error) throw wrapErr(r.error);
          rows = rows.concat(r.data || []);
          if((r.data || []).length === PAGE && rows.length < 20000) return page(from + PAGE);
          var map = {};
          rows.forEach(function(row){ map[row.id] = row.data || {}; });
          cache[coll] = map;
        });
    }
    return page(0);
  }
  function ensure(coll){
    if(!loading[coll]) loading[coll] = ready.then(function(){ return fetchAll(coll); });
    return loading[coll];
  }
  function cmp(a, b){
    if(a === b) return 0;
    if(a === undefined || a === null || a === '') return 1;
    if(b === undefined || b === null || b === '') return -1;
    return a < b ? -1 : 1;
  }
  function snapshotFor(l){
    var map = cache[l.coll] || {};
    var docs = Object.keys(map).map(function(id){ return { id: id, d: map[id] }; });
    if(l.field){
      docs.sort(function(x, y){
        var c = cmp(x.d[l.field], y.d[l.field]);
        if(c !== 0 && (x.d[l.field] == null || y.d[l.field] == null || x.d[l.field] === '' || y.d[l.field] === '')) return c; // vides toujours en dernier
        return l.dir === 'desc' ? -c : c;
      });
    }
    if(l.max) docs = docs.slice(0, l.max);
    return { docs: docs.map(function(x){ var data = x.d; return { id: x.id, data: function(){ return JSON.parse(JSON.stringify(data)); } }; }) };
  }
  function emit(coll){
    if(pending[coll]) return;
    pending[coll] = true;
    setTimeout(function(){
      pending[coll] = false;
      listeners.forEach(function(l){ if(l.coll === coll && l.active){ try { l.cb(snapshotFor(l)); } catch(e){ console.error(e); } } });
    }, 0);
  }
  function applyLocal(coll, id, data){ if(!cache[coll]) return; cache[coll][id] = data; emit(coll); }
  function mergeLocal(coll, id, patch){ if(!cache[coll] || !cache[coll][id]) return; cache[coll][id] = Object.assign({}, cache[coll][id], patch); emit(coll); }
  function removeLocal(coll, id){ if(!cache[coll]) return; delete cache[coll][id]; emit(coll); }

  function startRealtime(){
    client.channel('soaga-records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'records' }, function(p){
        if(p.eventType === 'DELETE'){ if(p.old && p.old.collection) removeLocal(p.old.collection, p.old.id); }
        else if(p.new && p.new.collection){ applyLocal(p.new.collection, p.new.id, p.new.data || {}); }
      })
      .subscribe();
    // Rattrapage après une mise en veille ou une coupure réseau
    document.addEventListener('visibilitychange', function(){
      if(document.visibilityState !== 'visible') return;
      Object.keys(cache).forEach(function(coll){ fetchAll(coll).then(function(){ emit(coll); }).catch(function(){}); });
    });
  }

  function Query(coll, field, dir, max){ this.coll = coll; this.field = field; this.dir = dir; this.max = max; }
  Query.prototype.orderBy = function(field, dir){ return new Query(this.coll, field, dir || 'asc', this.max); };
  Query.prototype.limit = function(n){ return new Query(this.coll, this.field, this.dir, n); };
  Query.prototype.onSnapshot = function(cb, onErr){
    var l = { coll: this.coll, field: this.field, dir: this.dir, max: this.max, cb: cb, active: true };
    listeners.push(l);
    ensure(this.coll).then(function(){ if(l.active) cb(snapshotFor(l)); })
      .catch(function(err){ if(onErr) onErr(err.message ? err : wrapErr(err)); });
    return function(){ l.active = false; };
  };
  Query.prototype.add = function(data){
    var coll = this.coll, id = newId();
    return ready.then(function(){ return client.from('records').insert({ collection: coll, id: id, data: data }); })
      .then(function(r){ if(r.error) throw wrapErr(r.error); applyLocal(coll, id, data); return { id: id }; });
  };
  Query.prototype.doc = function(id){
    var coll = this.coll;
    return {
      id: id,
      set: function(data){
        return ready.then(function(){ return client.from('records').upsert({ collection: coll, id: id, data: data, updated_at: new Date().toISOString() }); })
          .then(function(r){ if(r.error) throw wrapErr(r.error); applyLocal(coll, id, data); });
      },
      update: function(patch){
        return ready.then(function(){ return client.rpc('merge_record', { p_collection: coll, p_id: id, p_patch: patch }); })
          .then(function(r){ if(r.error) throw wrapErr(r.error); mergeLocal(coll, id, patch); });
      },
      delete: function(){
        return ready.then(function(){ return client.from('records').delete().eq('collection', coll).eq('id', id); })
          .then(function(r){ if(r.error) throw wrapErr(r.error); removeLocal(coll, id); });
      }
    };
  };
  var db = { collection: function(name){ return new Query(name, null, 'asc', null); } };

  /* ---------------- téléchargements ---------------- */
  var downloads = {
    save: function(opts){
      var blob = new Blob([opts.data], { type: /\.csv$/i.test(opts.filename) ? 'text/csv;charset=utf-8' : 'application/octet-stream' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = opts.filename || 'export';
      document.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return Promise.resolve();
    }
  };

  /* ---------------- interface attendue par l'application ---------------- */
  var caps = { db: db, user: userCap, downloads: downloads };
  window.claude = {
    use: function(name){
      return ready.then(function(){ return caps[name] || null; }, function(err){
        console.error('Supabase indisponible', err);
        return null;
      });
    }
  };
})();
