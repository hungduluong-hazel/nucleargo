import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/ph.png',
  heroTitleKey: 'ph_hero_title',
  heroSubKey: 'ph_hero_sub',
  statPills: [
    { key: 'ph_stat_phase',  icon: '🔬' },
    { key: 'ph_stat_target', icon: '⚡' },
    { key: 'ph_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'ph_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'ph_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'ph_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'ph_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'ph_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'ph_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'ph_val_netzero'     },
  ],
  challenges: ['ph_ch1', 'ph_ch2', 'ph_ch3', 'ph_ch4', 'ph_ch5'],
  plants: [
    {
      name: 'Bataan NPP (Morong, Bataan)',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'ph_bat_owner',
      techKey:      'ph_bat_tech',
      capacityKey:  'ph_bat_capacity',
      targetKey:    'ph_bat_target',
      phaseKey:     'ph_bat_cur_phase',
      milestoneKey: 'ph_bat_milestone',
      progress: 15,
      partnerFlagUrl: 'https://flagcdn.com/w20/kr.png',
      partnerKey: 'ph_bat_partner_label',
    },
    {
      name: 'Philippines New NPP (TBD Site)',
      statusKey: 'country_badge_planned',
      statusVariant: 'planned',
      ownerKey:     'ph_new_owner',
      techKey:      'ph_new_tech',
      capacityKey:  'ph_new_capacity',
      targetKey:    'ph_new_target',
      phaseKey:     'ph_new_cur_phase',
      milestoneKey: 'ph_new_milestone',
      progress: 5,
      partnerFlagUrl: 'https://flagcdn.com/w20/us.png',
      partnerKey: 'ph_new_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/us.png',
      nameKey: 'ph_us_name',
      roleKey: 'ph_us_role',
      orgsKey: 'ph_us_orgs',
      agreementKey: 'ph_us_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/kr.png',
      nameKey: 'ph_kr_name',
      roleKey: 'ph_kr_role',
      orgsKey: 'ph_kr_orgs',
      agreementKey: 'ph_kr_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
  ],
  workforceTitleKey: 'ph_wf_card_title',
  workforceBadge: 'PNRI / NPC / DOE',
  workforceStats: [
    { labelKey: 'ph_wf_lbl1', valueKey: 'ph_wf_val1' },
    { labelKey: 'ph_wf_lbl2', valueKey: 'ph_wf_val2' },
    { labelKey: 'ph_wf_lbl3', valueKey: 'ph_wf_val3' },
    { labelKey: 'ph_wf_lbl4', valueKey: 'ph_wf_val4' },
  ],
  workforceNotes: ['ph_wf_stat1', 'ph_wf_stat2', 'ph_wf_stat3'],
  developments: [
    { dateKey: 'ph_dev1_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'ph_dev1_title', bodyKey: 'ph_dev1_body' },
    { dateKey: 'ph_dev2_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ph_dev2_title', bodyKey: 'ph_dev2_body' },
    { dateKey: 'ph_dev3_date', category: 'Partnership', catKey: 'country_cat_partnership', titleKey: 'ph_dev3_title', bodyKey: 'ph_dev3_body' },
    { dateKey: 'ph_dev4_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ph_dev4_title', bodyKey: 'ph_dev4_body' },
    { dateKey: 'ph_dev5_date', category: 'Policy',      catKey: 'country_cat_policy',      titleKey: 'ph_dev5_title', bodyKey: 'ph_dev5_body' },
  ],
  ctaTitleKey: 'ph_cta_title',
  ctaBodyKey:  'ph_cta_body',
}

export default function PhilippinesContent() {
  return <CountryProfileLayout config={config} />
}
