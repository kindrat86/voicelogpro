/**
 * capture-snippet.mjs — shared email-capture + PostHog markup injected into the
 * static tools wing (lien calculator + per-state lien pages) by the generators.
 *
 * CAPTURE UI ONLY. This never touches the legal dataset (deadlines, disclaimer,
 * statute text) — it is appended around the verbatim legal content, not into it.
 *
 * Posts to the same live email-engine endpoint the homepage form uses, with the
 * same routing field (`product: "voicelogpro"`) so subscribers land in the
 * VoiceLogPro persona sequence. `source`/`state` are attribution passthrough —
 * harmless if the engine ignores them.
 */

// Official PostHog array.js loader (EU cloud). identified_only keeps us from
// minting an anonymous person profile on every pageview.
export const POSTHOG_SNIPPET = `<script>!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX',{api_host:'https://eu.i.posthog.com',person_profiles:'identified_only'})</script>`;

/**
 * @param {string} source  page path, e.g. "/lien-law-deadlines/texas"
 * @param {string} state   hidden state value; "" = read from #st select at submit (calculator)
 * @param {string} label   heading noun, e.g. "Texas's" or "my state's"
 */
export function captureBlock(source, state = "", label = "my state's") {
  const src = String(source);
  const st = String(state);
  return `
<section class="cap" style="margin:1.75rem 0;background:#ecfdf5;border:1px solid #6ee7b7;border-radius:.6rem;padding:1.25rem">
  <p style="font-weight:700;margin:0 0 .35rem;font-size:1.05rem">📬 Email me ${label} deadline dates + the free Defense Kit</p>
  <p style="font-size:.9rem;color:#475569;margin:0 0 .75rem">Your dates and a free daily-report Defense Kit, sent to your inbox. No spam, unsubscribe anytime.</p>
  <form class="cap-form" style="display:flex;flex-wrap:wrap;gap:.5rem">
    <input type="email" name="email" required autocomplete="email" placeholder="you@company.com" style="flex:1 1 220px;padding:.6rem;border:1px solid #cbd5e1;border-radius:.4rem;font-size:1rem">
    <input type="hidden" name="source" value="${src}">
    <input type="hidden" name="state" value="${st}">
    <button type="submit" style="background:#059669;color:#fff;border:0;border-radius:.4rem;padding:.6rem 1.2rem;font-weight:700;font-size:1rem;cursor:pointer">Send my dates →</button>
  </form>
  <p class="cap-msg" role="status" aria-live="polite" style="margin:.6rem 0 0;font-size:.9rem;min-height:1.2em"></p>
</section>
<script>(function(){var s=document.currentScript.previousElementSibling;while(s&&!(s.classList&&s.classList.contains('cap')))s=s.previousElementSibling;if(!s)return;var form=s.querySelector('.cap-form'),msg=s.querySelector('.cap-msg');form.addEventListener('submit',function(e){e.preventDefault();var email=form.email.value.trim();if(!email)return;var st=form.state.value||(document.getElementById('st')&&document.getElementById('st').value)||'';var src=form.source.value;msg.style.color='#475569';msg.textContent='Sending…';fetch('https://email-engine-fawn.vercel.app/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product:'voicelogpro',email:email.toLowerCase(),source:src,state:st,heard_from:src})}).then(function(r){if(!r.ok)throw 0;msg.style.color='#047857';msg.innerHTML="You're in! Check your inbox to confirm. → <a href='/thank-you' style='color:#047857;text-decoration:underline'>Your next step</a>";form.reset();try{if(window.posthog&&posthog.capture)posthog.capture('tools_subscribe_submitted',{source:src,state:st});}catch(_){}}).catch(function(){msg.style.color='#b91c1c';msg.textContent='Something went wrong — please try again.';});});})();</script>`;
}
