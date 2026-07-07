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

  if (req.method === 'GET') {
    return res.status(200).json(siteConfig);
  }

  const { jsonrpc, method, params, id } = req.body || {};

  if (jsonrpc !== '2.0') {
    return res.status(200).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id: id || null });
  }

  switch (method) {
    case 'agent/info':
    case 'agent.describe':
      return res.status(200).json({
        jsonrpc: '2.0',
        result: {
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          capabilities: siteConfig.capabilities || [],
          version: siteConfig.version || '1.0.0',
          authentication: siteConfig.authentication || { type: 'none' }
        },
        id
      });

    case 'agent/capabilities':
      return res.status(200).json({
        jsonrpc: '2.0',
        result: { capabilities: siteConfig.capabilities || [], content: siteConfig.content || [] },
        id
      });

    case 'agent/query':
    case 'agent/search':
      const query = (params && (params.query || params.q)) || '';
      const content = (siteConfig.content || []).filter(item => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (item.title || '').toLowerCase().includes(q) ||
               (item.description || '').toLowerCase().includes(q);
      });
      return res.status(200).json({
        jsonrpc: '2.0',
        result: { query, results: content, total: content.length },
        id
      });

    default:
      return res.status(200).json({
        jsonrpc: '2.0',
        error: { code: -32601, message: 'Method not found: ' + method },
        id
      });
  }
};
