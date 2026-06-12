import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/ar.png',
  heroTitleKey: 'ar_hero_title',
  heroSubKey: 'ar_hero_sub',
  statPills: [
    { key: 'ar_stat_phase',  icon: '🏗️' },
    { key: 'ar_stat_target', icon: '⚡' },
    { key: 'ar_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'ar_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'ar_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'ar_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'ar_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'ar_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'ar_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'ar_val_netzero'     },
  ],
  challenges: ['ar_ch1', 'ar_ch2', 'ar_ch3', 'ar_ch4', 'ar_ch5'],
  plants: [
    {
      name: 'CAREM-25 SMR (Atucha Complex)',
      statusKey: 'country_badge_planned',
      statusVariant: 'planned',
      ownerKey:     'ar_carem_owner',
      techKey:      'ar_carem_tech',
      capacityKey:  'ar_carem_capacity',
      targetKey:    'ar_carem_target',
      phaseKey:     'ar_carem_cur_phase',
      milestoneKey: 'ar_carem_milestone',
      progress: 60,
      partnerFlagUrl: 'https://flagcdn.com/w20/ar.png',
      partnerKey: 'ar_carem_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/ca.png',
      nameKey: 'ar_ca_name',
      roleKey: 'ar_ca_role',
      orgsKey: 'ar_ca_orgs',
      agreementKey: 'ar_ca_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/de.png',
      nameKey: 'ar_de_name',
      roleKey: 'ar_de_role',
      orgsKey: 'ar_de_orgs',
      agreementKey: 'ar_de_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'ar_cn_name',
      roleKey: 'ar_cn_role',
      orgsKey: 'ar_cn_orgs',
      agreementKey: 'ar_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'ar_wf_card_title',
  workforceBadge: 'NA-SA / CNEA / ARN',
  workforceStats: [
    { labelKey: 'ar_wf_lbl1', valueKey: 'ar_wf_val1' },
    { labelKey: 'ar_wf_lbl2', valueKey: 'ar_wf_val2' },
    { labelKey: 'ar_wf_lbl3', valueKey: 'ar_wf_val3' },
    { labelKey: 'ar_wf_lbl4', valueKey: 'ar_wf_val4' },
  ],
  workforceNotes: ['ar_wf_stat1', 'ar_wf_stat2', 'ar_wf_stat3'],
  developments: [
    { dateKey: 'ar_dev1_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'ar_dev1_title', bodyKey: 'ar_dev1_body' },
    { dateKey: 'ar_dev2_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ar_dev2_title', bodyKey: 'ar_dev2_body' },
    { dateKey: 'ar_dev3_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'ar_dev3_title', bodyKey: 'ar_dev3_body' },
    { dateKey: 'ar_dev4_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'ar_dev4_title', bodyKey: 'ar_dev4_body' },
    { dateKey: 'ar_dev5_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'ar_dev5_title', bodyKey: 'ar_dev5_body' },
  ],
  ctaTitleKey: 'ar_cta_title',
  ctaBodyKey:  'ar_cta_body',
}

export default function ArgentinaContent() {
  return <CountryProfileLayout config={config} />
}
