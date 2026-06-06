import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/gh.png',
  heroTitleKey: 'gh_hero_title',
  heroSubKey: 'gh_hero_sub',
  statPills: [
    { key: 'gh_stat_phase',  icon: '🔬' },
    { key: 'gh_stat_target', icon: '⚡' },
    { key: 'gh_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'gh_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'gh_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'gh_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'gh_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'gh_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'gh_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'gh_val_netzero'     },
  ],
  challenges: ['gh_ch1', 'gh_ch2', 'gh_ch3', 'gh_ch4', 'gh_ch5'],
  plants: [
    {
      name: 'Ghana NPP (Nsuban)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'gh_npg1_owner',
      techKey:      'gh_npg1_tech',
      capacityKey:  'gh_npg1_capacity',
      targetKey:    'gh_npg1_target',
      phaseKey:     'gh_npg1_cur_phase',
      milestoneKey: 'gh_npg1_milestone',
      progress: 10,
      partnerFlagUrl: 'https://flagcdn.com/w20/us.png',
      partnerKey: 'gh_npg1_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'gh_us_name',
      roleKey: 'gh_us_role',
      techKey: 'gh_us_tech',
      orgsKey: 'gh_us_orgs',
      agreementKey: 'gh_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'gh_kr_name',
      roleKey: 'gh_kr_role',
      orgsKey: 'gh_kr_orgs',
      agreementKey: 'gh_kr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/fr.png',
      nameKey: 'gh_fr_name',
      roleKey: 'gh_fr_role',
      orgsKey: 'gh_fr_orgs',
      agreementKey: 'gh_fr_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/ru.png',
      nameKey: 'gh_ru_name',
      roleKey: 'gh_ru_role',
      orgsKey: 'gh_ru_orgs',
      agreementKey: 'gh_ru_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'gh_wf_card_title',
  workforceBadge: 'GAEC / NPG',
  workforceStats: [
    { labelKey: 'gh_wf_lbl1', valueKey: 'gh_wf_val1' },
    { labelKey: 'gh_wf_lbl2', valueKey: 'gh_wf_val2' },
    { labelKey: 'gh_wf_lbl3', valueKey: 'gh_wf_val3' },
    { labelKey: 'gh_wf_lbl4', valueKey: 'gh_wf_val4' },
  ],
  workforceNotes: ['gh_wf_stat1', 'gh_wf_stat2', 'gh_wf_stat3'],
  developments: [
    { dateKey: 'gh_dev1_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'gh_dev1_title', bodyKey: 'gh_dev1_body' },
    { dateKey: 'gh_dev2_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'gh_dev2_title', bodyKey: 'gh_dev2_body' },
    { dateKey: 'gh_dev3_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'gh_dev3_title', bodyKey: 'gh_dev3_body' },
    { dateKey: 'gh_dev4_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'gh_dev4_title', bodyKey: 'gh_dev4_body' },
    { dateKey: 'gh_dev5_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'gh_dev5_title', bodyKey: 'gh_dev5_body' },
  ],
  ctaTitleKey: 'gh_cta_title',
  ctaBodyKey:  'gh_cta_body',
}

export default function GhanaContent() {
  return <CountryProfileLayout config={config} />
}
