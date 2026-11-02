import { L } from '@/lib/i18n';

// Real Django model STATUS_CHOICES from the QMS repository (documents/models.py),
// not an idealized or invented lifecycle. Each string carries its Kiswahili.
export const DOCUMENT_STAGES = [
  { label: L('Draft', 'Rasimu'), detail: L('A new SOP or policy starts here, editable, not yet in force.', 'SOP au sera mpya huanzia hapa, inaweza kuhaririwa, bado haijaanza kutumika.') },
  { label: L('Pending Collaboration', 'Inasubiri Ushirikiano'), detail: L('Open for co-author input before it moves to formal review.', 'Wazi kwa maoni ya waandishi wenza kabla ya kwenda kwenye mapitio rasmi.') },
  { label: L('Under Review', 'Inapitiwa'), detail: L("A reviewer checks it against the standard it's meant to satisfy.", 'Mhakiki huihakiki dhidi ya kiwango inachopaswa kukidhi.') },
  { label: L('Under Approval', 'Inasubiri Idhini'), detail: L('A final approver signs off before the document takes effect.', 'Mwidhinishaji wa mwisho husaini kabla hati haijaanza kutumika.') },
  { label: L('Approved', 'Imeidhinishwa'), detail: L('In force, version-locked, and citable as evidence from this point on.', 'Inatumika, toleo limefungwa, na inaweza kutajwa kama ushahidi kuanzia hapa.'), branch: L('Rejected sends it back to Draft, with the review history kept.', 'Ikikataliwa hurudi kwenye Rasimu, historia ya mapitio ikihifadhiwa.') },
];

// Real Django model STATUS_CHOICES from non_conformance/models.py, including
// the actual two-stage independent review, not the simplified version most
// QMS marketing copy assumes.
export const CAPA_STAGES = [
  { label: L('Registered', 'Imesajiliwa'), detail: L('A finding is logged with a unique, auto-generated NC number and classified Major or Minor.', 'Tatizo lililobainika huandikwa likiwa na namba ya NC ya kipekee inayotolewa kiotomatiki na huainishwa Kuu au Dogo.') },
  { label: L('Pending Review 1', 'Inasubiri Mapitio 1'), detail: L('Waiting on the first reviewer.', 'Inamsubiri mhakiki wa kwanza.') },
  { label: L('Review 1 Complete', 'Mapitio 1 Yamekamilika'), detail: L('First reviewer has signed off.', 'Mhakiki wa kwanza ameidhinisha.') },
  { label: L('Pending Review 2', 'Inasubiri Mapitio 2'), detail: L('A second, independent reviewer checks the first review, not a rubber stamp.', 'Mhakiki wa pili, huru, hukagua mapitio ya kwanza, si muhuri tu.') },
  { label: L('Review 2 Complete', 'Mapitio 2 Yamekamilika'), detail: L('Independent sign-off recorded.', 'Idhini huru imerekodiwa.') },
  { label: L('Pending Closure', 'Inasubiri Kufungwa'), detail: L('Corrective action taken; waiting on final closure sign-off.', 'Hatua ya kurekebisha imechukuliwa; inasubiri idhini ya mwisho ya kufunga.') },
  { label: L('Closed', 'Imefungwa'), detail: L('Resolved, with the full two-reviewer trail preserved.', 'Imetatuliwa, alama kamili ya wahakiki wawili ikihifadhiwa.'), branch: L('Declined at review 2 returns it for further work, not silently dropped.', 'Ikikataliwa kwenye mapitio 2 hurudishwa kwa kazi zaidi, haiachwi kimya.') },
];
