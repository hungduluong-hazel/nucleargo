import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/ua.png',
  heroTitleKey: 'ua_hero_title',
  heroSubKey: 'ua_hero_sub',
  statPills: [
    { key: 'ua_stat_phase',  icon: '🏗️' },
    { key: 'ua_stat_target', icon: '⚡' },
    { key: 'ua_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'ua_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'ua_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'ua_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'ua_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'ua_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'ua_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'ua_val_netzero'     },
  ],
  challenges: ['ua_ch1', 'ua_ch2', 'ua_ch3', 'ua_ch4', 'ua_ch5'],
  plants: [
    {
      name: 'Khmelnytskyi NPP — Units 5 & 6',
      statusKey: 'country_badge_planned',
      statusVariant: 'planned',
      ownerKey:     'ua_kh_owner',
      techKey:      'ua_kh_tech',
      capacityKey:  'ua_kh_capacity',
      targetKey:    'ua_kh_target',
      phaseKey:     'ua_kh_cur_phase',
      milestoneKey: 'ua_kh_milestone',
      progress: 10,
      partnerFlagUrl: 'https://flagcdn.com/w20/us.png',
      partnerKey: 'ua_kh_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'ua_us_name',
      roleKey: 'ua_us_role',
      orgsKey: 'ua_us_orgs',
      agreementKey: 'ua_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/pl.png',
      nameKey: 'ua_pl_name',
      roleKey: 'ua_pl_role',
      orgsKey: 'ua_pl_orgs',
      agreementKey: 'ua_pl_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/ca.png',
      nameKey: 'ua_ca_name',
      roleKey: 'ua_ca_role',
      orgsKey: 'ua_ca_orgs',
      agreementKey: 'ua_ca_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/se.png',
      nameKey: 'ua_se_name',
      roleKey: 'ua_se_role',
      orgsKey: 'ua_se_orgs',
      agreementKey: 'ua_se_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'ua_wf_card_title',
  workforceBadge: 'Energoatom / SNRIU',
  workforceStats: [
    { labelKey: 'ua_wf_lbl1', valueKey: 'ua_wf_val1' },
    { labelKey: 'ua_wf_lbl2', valueKey: 'ua_wf_val2' },
    { labelKey: 'ua_wf_lbl3', valueKey: 'ua_wf_val3' },
    { labelKey: 'ua_wf_lbl4', valueKey: 'ua_wf_val4' },
  ],
  workforceNotes: ['ua_wf_stat1', 'ua_wf_stat2', 'ua_wf_stat3'],
  developments: [
    { dateKey: 'ua_dev1_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'ua_dev1_title', bodyKey: 'ua_dev1_body' },
    { dateKey: 'ua_dev2_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ua_dev2_title', bodyKey: 'ua_dev2_body' },
    { dateKey: 'ua_dev3_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'ua_dev3_title', bodyKey: 'ua_dev3_body' },
    { dateKey: 'ua_dev4_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'ua_dev4_title', bodyKey: 'ua_dev4_body' },
    { dateKey: 'ua_dev5_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'ua_dev5_title', bodyKey: 'ua_dev5_body' },
  ],
  ctaTitleKey: 'ua_cta_title',
  ctaBodyKey:  'ua_cta_body',
}

export default function UkraineContent() {
  return <CountryProfileLayout config={config} />
}
