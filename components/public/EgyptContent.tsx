import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/eg.png',
  heroTitleKey: 'eg_hero_title',
  heroSubKey: 'eg_hero_sub',
  statPills: [
    { key: 'eg_stat_phase',  icon: '🏗️' },
    { key: 'eg_stat_target', icon: '⚡' },
    { key: 'eg_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'eg_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'eg_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'eg_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'eg_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'eg_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'eg_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'eg_val_netzero'     },
  ],
  challenges: ['eg_ch1', 'eg_ch2', 'eg_ch3', 'eg_ch4', 'eg_ch5'],
  plants: [
    {
      name: 'El Dabaa NPP (Matrouh)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'eg_eldabaa_owner',
      techKey:      'eg_eldabaa_tech',
      capacityKey:  'eg_eldabaa_capacity',
      targetKey:    'eg_eldabaa_target',
      phaseKey:     'eg_eldabaa_cur_phase',
      milestoneKey: 'eg_eldabaa_milestone',
      progress: 55,
      partnerFlagUrl: 'https://flagcdn.com/w20/ru.png',
      partnerKey: 'eg_eldabaa_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/ru.png',
      nameKey: 'eg_ru_name',
      roleKey: 'eg_ru_role',
      orgsKey: 'eg_ru_orgs',
      agreementKey: 'eg_ru_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'eg_kr_name',
      roleKey: 'eg_kr_role',
      orgsKey: 'eg_kr_orgs',
      agreementKey: 'eg_kr_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/cn.png',
      nameKey: 'eg_cn_name',
      roleKey: 'eg_cn_role',
      orgsKey: 'eg_cn_orgs',
      agreementKey: 'eg_cn_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'eg_wf_card_title',
  workforceBadge: 'NPPA / ENRRA',
  workforceStats: [
    { labelKey: 'eg_wf_lbl1', valueKey: 'eg_wf_val1' },
    { labelKey: 'eg_wf_lbl2', valueKey: 'eg_wf_val2' },
    { labelKey: 'eg_wf_lbl3', valueKey: 'eg_wf_val3' },
    { labelKey: 'eg_wf_lbl4', valueKey: 'eg_wf_val4' },
  ],
  workforceNotes: ['eg_wf_stat1', 'eg_wf_stat2', 'eg_wf_stat3'],
  developments: [
    { dateKey: 'eg_dev1_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'eg_dev1_title', bodyKey: 'eg_dev1_body' },
    { dateKey: 'eg_dev2_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'eg_dev2_title', bodyKey: 'eg_dev2_body' },
    { dateKey: 'eg_dev3_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'eg_dev3_title', bodyKey: 'eg_dev3_body' },
    { dateKey: 'eg_dev4_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'eg_dev4_title', bodyKey: 'eg_dev4_body' },
    { dateKey: 'eg_dev5_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'eg_dev5_title', bodyKey: 'eg_dev5_body' },
  ],
  ctaTitleKey: 'eg_cta_title',
  ctaBodyKey:  'eg_cta_body',
}

export default function EgyptContent() {
  return <CountryProfileLayout config={config} />
}
