import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/th.png',
  heroTitleKey: 'th_hero_title',
  heroSubKey: 'th_hero_sub',
  statPills: [
    { key: 'th_stat_phase',  icon: '🏗️' },
    { key: 'th_stat_target', icon: '⚡' },
    { key: 'th_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'th_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'th_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'th_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'th_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'th_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'th_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'th_val_netzero'     },
  ],
  challenges: ['th_ch1', 'th_ch2', 'th_ch3', 'th_ch4', 'th_ch5'],
  plants: [
    {
      name: 'SMR Program (Northeast & South Sites)',
      statusKey: 'country_badge_planned',
      statusVariant: 'planned',
      ownerKey:     'th_smr_owner',
      techKey:      'th_smr_tech',
      capacityKey:  'th_smr_capacity',
      targetKey:    'th_smr_target',
      phaseKey:     'th_smr_cur_phase',
      milestoneKey: 'th_smr_milestone',
      progress: 10,
      partnerFlagUrl: 'https://flagcdn.com/w20/th.png',
      partnerKey: 'th_smr_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'th_kr_name',
      roleKey: 'th_kr_role',
      orgsKey: 'th_kr_orgs',
      agreementKey: 'th_kr_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'th_us_name',
      roleKey: 'th_us_role',
      orgsKey: 'th_us_orgs',
      agreementKey: 'th_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'th_cn_name',
      roleKey: 'th_cn_role',
      orgsKey: 'th_cn_orgs',
      agreementKey: 'th_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'th_wf_card_title',
  workforceBadge: 'EGAT / TINT / OAP',
  workforceStats: [
    { labelKey: 'th_wf_lbl1', valueKey: 'th_wf_val1' },
    { labelKey: 'th_wf_lbl2', valueKey: 'th_wf_val2' },
    { labelKey: 'th_wf_lbl3', valueKey: 'th_wf_val3' },
    { labelKey: 'th_wf_lbl4', valueKey: 'th_wf_val4' },
  ],
  workforceNotes: ['th_wf_stat1', 'th_wf_stat2', 'th_wf_stat3'],
  developments: [
    { dateKey: 'th_dev1_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'th_dev1_title', bodyKey: 'th_dev1_body' },
    { dateKey: 'th_dev2_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'th_dev2_title', bodyKey: 'th_dev2_body' },
    { dateKey: 'th_dev3_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'th_dev3_title', bodyKey: 'th_dev3_body' },
    { dateKey: 'th_dev4_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'th_dev4_title', bodyKey: 'th_dev4_body' },
    { dateKey: 'th_dev5_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'th_dev5_title', bodyKey: 'th_dev5_body' },
  ],
  ctaTitleKey: 'th_cta_title',
  ctaBodyKey:  'th_cta_body',
}

export default function ThailandContent() {
  return <CountryProfileLayout config={config} />
}
