import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/tr.png',
  heroTitleKey: 'tr_hero_title',
  heroSubKey: 'tr_hero_sub',
  statPills: [
    { key: 'tr_stat_phase',  icon: '🏗️' },
    { key: 'tr_stat_target', icon: '⚡' },
    { key: 'tr_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'tr_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'tr_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'tr_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'tr_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'tr_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'tr_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'tr_val_netzero'     },
  ],
  challenges: ['tr_ch1', 'tr_ch2', 'tr_ch3', 'tr_ch4', 'tr_ch5'],
  plants: [
    {
      name: 'Akkuyu NPP (Mersin)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'tr_akkuyu_owner',
      techKey:      'tr_akkuyu_tech',
      capacityKey:  'tr_akkuyu_capacity',
      targetKey:    'tr_akkuyu_target',
      phaseKey:     'tr_akkuyu_cur_phase',
      milestoneKey: 'tr_akkuyu_milestone',
      progress: 75,
      partnerFlagUrl: 'https://flagcdn.com/w20/ru.png',
      partnerKey: 'tr_akkuyu_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/ru.png',
      nameKey: 'tr_ru_name',
      roleKey: 'tr_ru_role',
      orgsKey: 'tr_ru_orgs',
      agreementKey: 'tr_ru_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'tr_kr_name',
      roleKey: 'tr_kr_role',
      orgsKey: 'tr_kr_orgs',
      agreementKey: 'tr_kr_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'tr_us_name',
      roleKey: 'tr_us_role',
      orgsKey: 'tr_us_orgs',
      agreementKey: 'tr_us_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'tr_cn_name',
      roleKey: 'tr_cn_role',
      orgsKey: 'tr_cn_orgs',
      agreementKey: 'tr_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'tr_wf_card_title',
  workforceBadge: 'NDK / TENMAK / Akkuyu Nuclear JSC',
  workforceStats: [
    { labelKey: 'tr_wf_lbl1', valueKey: 'tr_wf_val1' },
    { labelKey: 'tr_wf_lbl2', valueKey: 'tr_wf_val2' },
    { labelKey: 'tr_wf_lbl3', valueKey: 'tr_wf_val3' },
    { labelKey: 'tr_wf_lbl4', valueKey: 'tr_wf_val4' },
  ],
  workforceNotes: ['tr_wf_stat1', 'tr_wf_stat2', 'tr_wf_stat3'],
  developments: [
    { dateKey: 'tr_dev1_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'tr_dev1_title', bodyKey: 'tr_dev1_body' },
    { dateKey: 'tr_dev2_date', category: 'Finance',     catKey: 'country_cat_finance',     titleKey: 'tr_dev2_title', bodyKey: 'tr_dev2_body' },
    { dateKey: 'tr_dev3_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'tr_dev3_title', bodyKey: 'tr_dev3_body' },
    { dateKey: 'tr_dev4_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'tr_dev4_title', bodyKey: 'tr_dev4_body' },
    { dateKey: 'tr_dev5_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'tr_dev5_title', bodyKey: 'tr_dev5_body' },
  ],
  ctaTitleKey: 'tr_cta_title',
  ctaBodyKey:  'tr_cta_body',
}

export default function TurkeyContent() {
  return <CountryProfileLayout config={config} />
}
