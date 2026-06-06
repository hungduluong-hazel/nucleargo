import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/kz.png',
  heroTitleKey: 'kz_hero_title',
  heroSubKey: 'kz_hero_sub',
  statPills: [
    { key: 'kz_stat_phase',  icon: '🔬' },
    { key: 'kz_stat_target', icon: '⚡' },
    { key: 'kz_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'kz_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'kz_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'kz_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'kz_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'kz_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'kz_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'kz_val_netzero'     },
  ],
  challenges: ['kz_ch1', 'kz_ch2', 'kz_ch3', 'kz_ch4', 'kz_ch5'],
  plants: [
    {
      name: 'Ulken NPP (Lake Balkhash)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'kz_ulken_owner',
      techKey:      'kz_ulken_tech',
      capacityKey:  'kz_ulken_capacity',
      targetKey:    'kz_ulken_target',
      phaseKey:     'kz_ulken_cur_phase',
      milestoneKey: 'kz_ulken_milestone',
      progress: 14,
      partnerFlagUrl: 'https://flagcdn.com/w20/ru.png',
      partnerKey: 'kz_ulken_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/ru.png',
      nameKey: 'kz_ru_name',
      roleKey: 'kz_ru_role',
      orgsKey: 'kz_ru_orgs',
      agreementKey: 'kz_ru_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'kz_cn_name',
      roleKey: 'kz_cn_role',
      orgsKey: 'kz_cn_orgs',
      agreementKey: 'kz_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'kz_kr_name',
      roleKey: 'kz_kr_role',
      orgsKey: 'kz_kr_orgs',
      agreementKey: 'kz_kr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/fr.png',
      nameKey: 'kz_fr_name',
      roleKey: 'kz_fr_role',
      orgsKey: 'kz_fr_orgs',
      agreementKey: 'kz_fr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'kz_wf_card_title',
  workforceBadge: 'KATEP / KAEC / NNC',
  workforceStats: [
    { labelKey: 'kz_wf_lbl1', valueKey: 'kz_wf_val1' },
    { labelKey: 'kz_wf_lbl2', valueKey: 'kz_wf_val2' },
    { labelKey: 'kz_wf_lbl3', valueKey: 'kz_wf_val3' },
    { labelKey: 'kz_wf_lbl4', valueKey: 'kz_wf_val4' },
  ],
  workforceNotes: ['kz_wf_stat1', 'kz_wf_stat2', 'kz_wf_stat3'],
  developments: [
    { dateKey: 'kz_dev1_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'kz_dev1_title', bodyKey: 'kz_dev1_body' },
    { dateKey: 'kz_dev2_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'kz_dev2_title', bodyKey: 'kz_dev2_body' },
    { dateKey: 'kz_dev3_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'kz_dev3_title', bodyKey: 'kz_dev3_body' },
    { dateKey: 'kz_dev4_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'kz_dev4_title', bodyKey: 'kz_dev4_body' },
    { dateKey: 'kz_dev5_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'kz_dev5_title', bodyKey: 'kz_dev5_body' },
  ],
  ctaTitleKey: 'kz_cta_title',
  ctaBodyKey:  'kz_cta_body',
}

export default function KazakhstanContent() {
  return <CountryProfileLayout config={config} />
}
