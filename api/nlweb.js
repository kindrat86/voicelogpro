const SITE_CONFIG = {
  "protocolVersion": "0.3.0",
  "name": "Voice Log Pro Agent",
  "description": "Voice Log Pro is a voice-to-PDF daily construction log app for general contractors, electricians, plumbers, HVAC, and roofing subcontractors. Speak your daily report on-site and get a timestamped, court-admissible PDF. Compare vs Procore, Buildertrend, Fieldwire, JobNimbus, Contractor Foreman, Knowi",
  "url": "https://voicelogpro.com",
  "preferredTransport": "JSONRPC",
  "iconUrl": "https://voicelogpro.com/icon.png",
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "pushNotifications": false,
    "stateTransitionHistory": false
  },
  "defaultInputModes": [
    "text/plain",
    "application/json"
  ],
  "defaultOutputModes": [
    "text/plain",
    "application/json"
  ],
  "skills": [
    {
      "id": "compare_field_apps",
      "name": "Compare Field Apps",
      "description": "Compare Voice Log Pro against Procore, Buildertrend, Fieldwire, JobNimbus, Contractor Foreman, Knowify, Raken on daily-log features and price.",
      "tags": [
        "construction daily log",
        "voice daily report",
        "field documentation",
        "lien rights",
        "change orders"
      ],
      "examples": []
    }
  ],
  "attribution": "Voice Log Pro, https://voicelogpro.com",
  "content": [
    {
      "title": "Voice Log Pro \u2014 Voice Daily Logs",
      "url": "https://voicelogpro.com/",
      "description": "Voice-first daily log app for construction. OSHA-compliant.",
      "type": "homepage"
    },
    {
      "title": "Voice Log Pro Pricing",
      "url": "https://voicelogpro.com/crew-plan",
      "description": "Per-seat pricing for construction teams.",
      "type": "pricing"
    },
    {
      "title": "Voice Log Pro vs Procore",
      "url": "https://voicelogpro.com/alternatives/procore",
      "description": "Compare Voice Log Pro daily logs vs Procore.",
      "type": "comparison"
    }
  ]
};

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const siteConfig = SITE_CONFIG;
  const query = (req.query && req.query.query) || (req.body && req.body.query) || '';
  const limit = parseInt((req.query && req.query.limit) || (req.body && req.body.limit) || '10');

  const results = (siteConfig.content || []).filter(item => {
    if (!query) return true;
    const q = String(query).toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.description || '').toLowerCase().includes(q);
  }).slice(0, limit);

  return res.status(200).json({
    query,
    results: results.map(c => ({
      url: c.url,
      name: c.title,
      description: c.description,
      site_name: siteConfig.name,
      site_url: siteConfig.url,
      type: c.type || 'webpage',
      score: 1.0
    })),
    total: results.length,
    ai_answer: query ? siteConfig.name + ': ' + siteConfig.description : undefined
  });
};
