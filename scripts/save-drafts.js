#!/usr/bin/env node
/**
 * save-drafts.js
 *
 * Saves AI-generated content drafts to Supabase as pending review items.
 * Called by the Cowork monthly scheduled task after Claude generates content.
 *
 * Usage:
 *   node scripts/save-drafts.js < drafts.json
 *   echo '{"developments":[...],"briefings":[...]}' | node scripts/save-drafts.js
 *
 * Input JSON schema:
 * {
 *   "developments": [
 *     {
 *       "title_en": "...",
 *       "body_en": "...",
 *       "category": "Policy|Technical|Finance|Partnership|Safety|Workforce",
 *       "date": "YYYY-MM-DD",
 *       "source": "Reuters",
 *       "source_url": "https://..."
 *     }
 *   ],
 *   "briefings": [
 *     {
 *       "title_en": "...",
 *       "summary_en": "...",
 *       "body_en": "...",
 *       "published_date": "YYYY-MM-DD"
 *     }
 *   ]
 * }
 */

const https = require('https')
const fs    = require('fs')
const path  = require('path')

// ─── Load env ────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local not found at', envPath)
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
  return env
}

// ─── Supabase REST helpers ────────────────────────────────────────────────────

function supabaseInsert(url, serviceKey, table, rows) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(rows)
    const urlObj = new URL(`${url}/rest/v1/${table}`)
    const options = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname,
      method:   'POST',
      headers:  {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey':         serviceKey,
        'Authorization':  `Bearer ${serviceKey}`,
        'Prefer':         'return=minimal',
      },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, status: res.statusCode })
        } else {
          reject(new Error(`Supabase insert failed: ${res.statusCode} ${data}`))
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv()

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
  const serviceKey  = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

  if (!supabaseUrl || !serviceKey) {
    console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  // Read JSON from stdin
  let input = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) input += chunk

  let drafts
  try {
    drafts = JSON.parse(input)
  } catch (e) {
    console.error('ERROR: Invalid JSON input:', e.message)
    process.exit(1)
  }

  const today = new Date().toISOString().split('T')[0]
  let devCount = 0
  let briefingCount = 0

  // ── Save developments ──
  if (drafts.developments?.length) {
    const rows = drafts.developments.map(d => ({
      title_en:      d.title_en,
      body_en:       d.body_en       || null,
      category:      d.category      || null,
      date:          d.date          || today,
      source:        d.source        || 'AI Research',
      source_url:    d.source_url    || null,
      is_public:     false,
      ai_generated:  true,
      review_status: 'pending',
    }))
    await supabaseInsert(supabaseUrl, serviceKey, 'developments', rows)
    devCount = rows.length
    console.log(`✓ Saved ${devCount} development draft(s)`)
  }

  // ── Save briefings ──
  if (drafts.briefings?.length) {
    const rows = drafts.briefings.map(b => ({
      title_en:       b.title_en,
      summary_en:     b.summary_en    || null,
      body_en:        b.body_en       || null,
      published_date: b.published_date || today,
      is_published:   false,
      ai_generated:   true,
      review_status:  'pending',
    }))
    await supabaseInsert(supabaseUrl, serviceKey, 'briefings', rows)
    briefingCount = rows.length
    console.log(`✓ Saved ${briefingCount} briefing draft(s)`)
  }

  if (devCount === 0 && briefingCount === 0) {
    console.log('No drafts to save.')
    return
  }

  console.log(`\nDone. ${devCount + briefingCount} draft(s) saved — review at https://nucleargo.com/admin/review`)

  // Output summary for the scheduled task to use in notification
  console.log(JSON.stringify({ devCount, briefingCount, reviewUrl: 'https://nucleargo.com/admin/review' }))
}

main().catch(err => {
  console.error('ERROR:', err.message)
  process.exit(1)
})
