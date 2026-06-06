import CountryProfileLayout from './CountryProfileLayout'
import type { CountryProfileConfig } from './CountryProfileLayout'

const config: CountryProfileConfig = {
  flagUrl: 'https://flagcdn.com/w80/bd.png',
  heroTitleKey: 'bd_hero_title',
  heroSubKey: 'bd_hero_sub',
  statPills: [
    { key: 'bd_stat_phase',  icon: '🏗️' },
    { key: 'bd_stat_target', icon: '⚡' },
    { key: 'bd_stat_invest', icon: '💰' },
  ],
  summaryRows: [
    { labelKey: 'country_lbl_prog_status', valueKey: 'bd_val_prog_status' },
    { labelKey: 'country_lbl_legal',       valueKey: 'bd_val_legal'       },
    { labelKey: 'country_lbl_regulator',   valueKey: 'bd_val_regulator'   },
    { labelKey: 'country_lbl_authority',   valueKey: 'bd_val_authority'   },
    { labelKey: 'country_lbl_iaea_phase',  valueKey: 'bd_val_iaea_phase'  },
    { labelKey: 'country_lbl_inir',        valueKey: 'bd_val_inir'        },
    { labelKey: 'country_lbl_netzero',     valueKey: 'bd_val_netzero'     },
  ],
  challenges: ['bd_ch1', 'bd_ch2', 'bd_ch3', 'bd_ch4', 'bd_ch5'],
  plants: [
    {
      name: 'Rooppur NPP Unit 1',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'bd_rp1_owner',
      techKey:      'bd_rp1_tech',
      capacityKey:  'bd_rp1_capacity',
      targetKey:    'bd_rp1_target',
      phaseKey:     'bd_rp1_cur_phase',
      milestoneKey: 'bd_rp1_milestone',
      progress: 88,
      partnerFlagUrl: 'https://flagcdn.com/w20/ru.png',
      partnerKey: 'bd_rp1_partner_label',
    },
    {
      name: 'Rooppur NPP Unit 2',
      statusKey: 'country_badge_active',
      statusVariant: 'active',
      ownerKey:     'bd_rp2_owner',
      techKey:      'bd_rp2_tech',
      capacityKey:  'bd_rp2_capacity',
      targetKey:    'bd_rp2_target',
      phaseKey:     'bd_rp2_cur_phase',
      milestoneKey: 'bd_rp2_milestone',
      progress: 72,
      partnerFlagUrl: 'https://flagcdn.com/w20/ru.png',
      partnerKey: 'bd_rp2_partner_label',
    },
  ],
  partners: [
    {
      flagUrl: 'https://flagcdn.com/w20/ru.png',
      nameKey: 'bd_ru_name',
      roleKey: 'bd_ru_role',
      orgsKey: 'bd_ru_orgs',
      agreementKey: 'bd_ru_agreement',
      statusVariant: 'active',
      statusKey: 'country_badge_active',
    },
    {
      flagUrl: 'https://flagcdn.com/w20/in.png',
      nameKey: 'bd_in_name',
      roleKey: 'bd_in_role',
      orgsKey: 'bd_in_orgs',
      agreementKey: 'bd_in_agreement',
      statusVariant: 'secondary',
      statusKey: 'country_badge_secondary',
    },
  ],
  workforceTitleKey: 'bd_wf_card_title',
  workforceBadge: 'NPCBL / BAEC / BNRDA',
  workforceStats: [
    { labelKey: 'bd_wf_lbl1', valueKey: 'bd_wf_val1' },
    { labelKey: 'bd_wf_lbl2', valueKey: 'bd_wf_val2' },
    { labelKey: 'bd_wf_lbl3', valueKey: 'bd_wf_val3' },
    { labelKey: 'bd_wf_lbl4', valueKey: 'bd_wf_val4' },
  ],
  workforceNotes: ['bd_wf_stat1', 'bd_wf_stat2', 'bd_wf_stat3'],
  developments: [
    { dateKey: 'bd_dev1_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'bd_dev1_title', bodyKey: 'bd_dev1_body' },
    { dateKey: 'bd_dev2_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'bd_dev2_title', bodyKey: 'bd_dev2_body' },
    { dateKey: 'bd_dev3_date', category: 'Technical',   catKey: 'country_cat_technical',   titleKey: 'bd_dev3_title', bodyKey: 'bd_dev3_body' },
    { dateKey: 'bd_dev4_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'bd_dev4_title', bodyKey: 'bd_dev4_body' },
    { dateKey: 'bd_dev5_date', category: 'Regulatory',  catKey: 'country_cat_regulatory',  titleKey: 'bd_dev5_title', bodyKey: 'bd_dev5_body' },
  ],
  ctaTitleKey: 'bd_cta_title',
  ctaBodyKey:  'bd_cta_body',
}

export default function BangladeshContent() {
  return <CountryProfileLayout config={config} />
}
