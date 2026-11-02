import { useState } from 'react';
import { useI18n, L } from '@/lib/i18n';

// From the company profile (2026): four growth horizons. The profile states
// that timelines are illustrative, and that a horizon starts only once the
// previous one meets its exit signals. No dates are shown for that reason.
const HORIZONS = [
  { id: 'H1', place: L('Tanzania & East Africa', 'Tanzania na Afrika Mashariki'), status: L('Current focus', 'Lengo la sasa'), copy: L('Become a trusted ISO 15189 quality platform and partner at home, with labs that stay and a pricing model validated on evidence.', 'Kuwa jukwaa na mshirika wa ubora wa ISO 15189 anayeaminika nyumbani, na maabara zinazobaki na mfumo wa bei uliothibitishwa kwa ushahidi.'), exit: L('Exit signal: retained laboratories, validated pricing, and a national partnership.', 'Kigezo cha kuendelea: maabara zinazobaki, bei zilizothibitishwa, na ushirikiano wa kitaifa.') },
  { id: 'H2', place: L('Other Sub-Saharan Africa', 'Nchi nyingine za Afrika Kusini mwa Jangwa la Sahara'), status: L('Direction', 'Mwelekeo'), copy: L('Repeat the model in a second country, working through a professional body there.', 'Kurudia mfumo huu katika nchi ya pili, kupitia chama cha kitaaluma cha huko.'), exit: L('Exit signal: laboratories and a partnership in a second country.', 'Kigezo cha kuendelea: maabara na ushirikiano katika nchi ya pili.') },
  { id: 'H3', place: L('United States', 'Marekani'), status: L('Direction', 'Mwelekeo'), copy: L('An ISO 15189-focused offering built on case studies from the first two horizons.', 'Huduma inayolenga ISO 15189 iliyojengwa juu ya tafiti kifani kutoka vipindi viwili vya kwanza.'), exit: L('Starts only after the earlier horizons have proven the model.', 'Huanza tu baada ya vipindi vya awali kuthibitisha mfumo.') },
  { id: 'H4', place: L('UK, Canada & beyond', 'Uingereza, Kanada na kwingineko'), status: L('Direction', 'Mwelekeo'), copy: L('English-speaking markets that share the standard.', 'Masoko yanayozungumza Kiingereza yanayoshiriki kiwango hicho.'), exit: L('Starts only after the earlier horizons have proven the model.', 'Huanza tu baada ya vipindi vya awali kuthibitisha mfumo.') },
];

export function HorizonMap() {
  const { tr, tx } = useI18n();
  const [active, setActive] = useState(0);
  const h = HORIZONS[active];
  return (
    <div data-testid="horizon-map">
      <div role="tablist" aria-label={tr('Growth horizons', 'Vipindi vya ukuaji')} className="flex flex-wrap items-center gap-2">
        {HORIZONS.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="horizon-panel"
            onClick={() => setActive(i)}
            className="qt-focus font-mono-ui rounded-full border px-4 py-2 text-[11px] transition-colors"
            style={{
              background: i === active ? 'var(--qt-dark-navy)' : '#FFFFFF',
              color: i === active ? '#FFFFFF' : 'var(--qt-body-grey)',
              borderColor: i === active ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
            }}
          >
            {item.id} · {tx(item.place)}
          </button>
        ))}
      </div>
      <div id="horizon-panel" role="tabpanel" className="qt-card mt-5 p-6" aria-live="polite">
        <p className="qt-technical-label">{tx(h.status)}</p>
        <h3 className="font-brand mt-2 text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{tx(h.place)}</h3>
        <p className="mt-2 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{tx(h.copy)}</p>
        <p className="mt-3 text-xs leading-5" style={{ color: 'var(--qt-deep-teal)' }}>{tx(h.exit)}</p>
      </div>
      <p className="mt-3 font-mono-ui text-[10px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Direction, not commitments. Each horizon starts only when the one before it has earned it.', 'Mwelekeo, si ahadi. Kila kipindi huanza tu pale kilichotangulia kinapostahili.')}</p>
    </div>
  );
}
