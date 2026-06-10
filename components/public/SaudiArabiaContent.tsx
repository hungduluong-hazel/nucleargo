import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/sa.png',
  heroTitleKey: 'sa_hero_title',
  heroSubKey: 'sa_hero_sub',
  statPills: [
    { key: 'sa_stat_phase',  icon: '🏗️' },
    { key: 'sa_stat_target', icon: '⚡' },
    { key: 'sa_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'sa_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'sa_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'sa_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'sa_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'sa_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'sa_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'sa_val_netzero'     },
  ],
  challenges: ['sa_ch1', 'sa_ch2', 'sa_ch3', 'sa_ch4', 'sa_ch5'],
  plants: [
    {
      name: 'Duwayhin NPP (Khor Duweihin)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'sa_duwayhin_owner',
      techKey:      'sa_duwayhin_tech',
      capacityKey:  'sa_duwayhin_capacity',
      targetKey:    'sa_duwayhin_target',
      phaseKey:     'sa_duwayhin_cur_phase',
      milestoneKey: 'sa_duwayhin_milestone',
      progress: 8,
      partnerFlagUrl: 'https://flagcdn.com/w20/kr.png',
      partnerKey: 'sa_duwayhin_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'sa_kr_name',
      roleKey: 'sa_kr_role',
      orgsKey: 'sa_kr_orgs',
      agreementKey: 'sa_kr_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'sa_us_name',
      roleKey: 'sa_us_role',
      orgsKey: 'sa_us_orgs',
      agreementKey: 'sa_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'sa_cn_name',
      roleKey: 'sa_cn_role',
      orgsKey: 'sa_cn_orgs',
      agreementKey: 'sa_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/fr.png',
      nameKey: 'sa_fr_name',
      roleKey: 'sa_fr_role',
      orgsKey: 'sa_fr_orgs',
      agreementKey: 'sa_fr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'sa_wf_card_title',
  workforceBadge: 'K.A.CARE / NRRC / KACST',
  workforceStats: [
    { labelKey: 'sa_wf_lbl1', valueKey: 'sa_wf_val1' },
    { labelKey: 'sa_wf_lbl2', valueKey: 'sa_wf_val2' },
    { labelKey: 'sa_wf_lbl3', valueKey: 'sa_wf_val3' },
    { labelKey: 'sa_wf_lbl4', valueKey: 'sa_wf_val4' },
  ],
  workforceNotes: ['sa_wf_stat1', 'sa_wf_stat2', 'sa_wf_stat3'],
  developments: [
    { dateKey: 'sa_dev1_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'sa_dev1_title', bodyKey: 'sa_dev1_body' },
    { dateKey: 'sa_dev2_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'sa_dev2_title', bodyKey: 'sa_dev2_body' },
    { dateKey: 'sa_dev3_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'sa_dev3_title', bodyKey: 'sa_dev3_body' },
    { dateKey: 'sa_dev4_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'sa_dev4_title', bodyKey: 'sa_dev4_body' },
    { dateKey: 'sa_dev5_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'sa_dev5_title', bodyKey: 'sa_dev5_body' },
  ],
  ctaTitleKey: 'sa_cta_title',
  ctaBodyKey:  'sa_cta_body',
}

export default function SaudiArabiaContent() {
  return <CountryProfileLayout config={config} />
}
