import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/ke.png',
  heroTitleKey: 'ke_hero_title',
  heroSubKey: 'ke_hero_sub',
  statPills: [
    { key: 'ke_stat_phase',  icon: '🔬' },
    { key: 'ke_stat_target', icon: '⚡' },
    { key: 'ke_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'ke_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'ke_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'ke_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'ke_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'ke_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'ke_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'ke_val_netzero'     },
  ],
  challenges: ['ke_ch1', 'ke_ch2', 'ke_ch3', 'ke_ch4', 'ke_ch5', 'ke_ch6'],
  plants: [
    {
      name: 'Kenya NPP (Siaya Region)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'ke_npg1_owner',
      techKey:      'ke_npg1_tech',
      capacityKey:  'ke_npg1_capacity',
      targetKey:    'ke_npg1_target',
      phaseKey:     'ke_npg1_cur_phase',
      milestoneKey: 'ke_npg1_milestone',
      progress: 12,
      partnerFlagUrl: 'https://flagcdn.com/w20/kr.png',
      partnerKey: 'ke_npg1_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'ke_kr_name',
      roleKey: 'ke_kr_role',
      orgsKey: 'ke_kr_orgs',
      agreementKey: 'ke_kr_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'ke_us_name',
      roleKey: 'ke_us_role',
      orgsKey: 'ke_us_orgs',
      agreementKey: 'ke_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'ke_cn_name',
      roleKey: 'ke_cn_role',
      orgsKey: 'ke_cn_orgs',
      agreementKey: 'ke_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'ke_wf_card_title',
  workforceBadge: 'NuPEA / KAERI',
  workforceStats: [
    { labelKey: 'ke_wf_lbl1', valueKey: 'ke_wf_val1' },
    { labelKey: 'ke_wf_lbl2', valueKey: 'ke_wf_val2' },
    { labelKey: 'ke_wf_lbl3', valueKey: 'ke_wf_val3' },
    { labelKey: 'ke_wf_lbl4', valueKey: 'ke_wf_val4' },
  ],
  workforceNotes: ['ke_wf_stat1', 'ke_wf_stat2', 'ke_wf_stat3'],
  developments: [
    { dateKey: 'ke_dev1_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ke_dev1_title', bodyKey: 'ke_dev1_body' },
    { dateKey: 'ke_dev2_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'ke_dev2_title', bodyKey: 'ke_dev2_body' },
    { dateKey: 'ke_dev3_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'ke_dev3_title', bodyKey: 'ke_dev3_body' },
    { dateKey: 'ke_dev4_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ke_dev4_title', bodyKey: 'ke_dev4_body' },
    { dateKey: 'ke_dev5_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'ke_dev5_title', bodyKey: 'ke_dev5_body' },
  ],
  ctaTitleKey: 'ke_cta_title',
  ctaBodyKey:  'ke_cta_body',
}

export default function KenyaContent() {
  return <CountryProfileLayout config={config} />
}
