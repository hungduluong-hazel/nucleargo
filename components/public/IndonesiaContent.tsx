import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/id.png',
  heroTitleKey: 'id_hero_title',
  heroSubKey: 'id_hero_sub',
  statPills: [
    { key: 'id_stat_phase',  icon: '🔬' },
    { key: 'id_stat_target', icon: '⚡' },
    { key: 'id_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'id_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'id_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'id_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'id_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'id_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'id_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'id_val_netzero'     },
  ],
  challenges: ['id_ch1', 'id_ch2', 'id_ch3', 'id_ch4', 'id_ch5'],
  plants: [
    {
      name: 'Indonesia NPP (TBD Site)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'id_npg1_owner',
      techKey:      'id_npg1_tech',
      capacityKey:  'id_npg1_capacity',
      targetKey:    'id_npg1_target',
      phaseKey:     'id_npg1_cur_phase',
      milestoneKey: 'id_npg1_milestone',
      progress: 7,
      partnerFlagUrl: 'https://flagcdn.com/w20/us.png',
      partnerKey: 'id_npg1_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'id_us_name',
      roleKey: 'id_us_role',
      orgsKey: 'id_us_orgs',
      agreementKey: 'id_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'id_kr_name',
      roleKey: 'id_kr_role',
      orgsKey: 'id_kr_orgs',
      agreementKey: 'id_kr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/fr.png',
      nameKey: 'id_fr_name',
      roleKey: 'id_fr_role',
      orgsKey: 'id_fr_orgs',
      agreementKey: 'id_fr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/ru.png',
      nameKey: 'id_ru_name',
      roleKey: 'id_ru_role',
      orgsKey: 'id_ru_orgs',
      agreementKey: 'id_ru_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'id_wf_card_title',
  workforceBadge: 'PLN / BRIN / BAPETEN',
  workforceStats: [
    { labelKey: 'id_wf_lbl1', valueKey: 'id_wf_val1' },
    { labelKey: 'id_wf_lbl2', valueKey: 'id_wf_val2' },
    { labelKey: 'id_wf_lbl3', valueKey: 'id_wf_val3' },
    { labelKey: 'id_wf_lbl4', valueKey: 'id_wf_val4' },
  ],
  workforceNotes: ['id_wf_stat1', 'id_wf_stat2', 'id_wf_stat3'],
  developments: [
    { dateKey: 'id_dev1_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'id_dev1_title', bodyKey: 'id_dev1_body' },
    { dateKey: 'id_dev2_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'id_dev2_title', bodyKey: 'id_dev2_body' },
    { dateKey: 'id_dev3_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'id_dev3_title', bodyKey: 'id_dev3_body' },
    { dateKey: 'id_dev4_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'id_dev4_title', bodyKey: 'id_dev4_body' },
    { dateKey: 'id_dev5_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'id_dev5_title', bodyKey: 'id_dev5_body' },
  ],
  ctaTitleKey: 'id_cta_title',
  ctaBodyKey:  'id_cta_body',
}

export default function IndonesiaContent() {
  return <CountryProfileLayout config={config} />
}
