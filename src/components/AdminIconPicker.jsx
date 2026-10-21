import React, { useId, useRef, useState } from 'react';
import { Image, Link, Search, Upload, X } from 'lucide-react';
import ContentIcon from './ContentIcon';
import { safeMediaUrl } from '../media-utils';
import './AdminIconPicker.css';

export default function AdminIconPicker({ value, onChange, upload }) {
  const dialog = useRef(null);
  const heading = useId();
  const [catalogue, setCatalogue] = useState(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(120);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const latest = useRef(onChange); latest.current = onChange;
  async function open() {
    setMessage(''); setQuery(''); setLimit(120); setLink(safeMediaUrl(value));
    dialog.current.showModal();
    if (!catalogue) {
      try { const { icons } = await import('./icon-library'); setCatalogue(icons); }
      catch { setMessage('Не удалось загрузить список иконок. Попробуйте ещё раз.'); }
    }
  }
  const names = catalogue ? Object.keys(catalogue).filter(name => name.toLowerCase().includes(query.toLowerCase())).sort() : [];
  return <div className="admin-icon-picker">
    <div className="admin-icon-selected"><ContentIcon value={value} size={28} /><span>{safeMediaUrl(value) ? 'Своя иконка' : value || 'Иконка не выбрана'}</span><button type="button" onClick={open} disabled={busy}>Выбрать иконку</button></div>
    <dialog ref={dialog} className="admin-dialog admin-icons-dialog" aria-labelledby={heading} onClick={e => { if (e.target === dialog.current && !busy) dialog.current.close(); }}>
      <div className="admin-dialog-heading"><h2 id={heading}>Выбор иконки</h2><button type="button" className="admin-icon-button" aria-label="Закрыть выбор иконки" disabled={busy} onClick={() => dialog.current.close()}><X size={20} /></button></div>
      <div className="admin-icon-sources"><label className="admin-upload"><Upload size={16} aria-hidden="true" /><span>{busy ? 'Загрузка…' : 'Загрузить свою иконку'}</span><input className="admin-file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy} onChange={async e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) { setMessage('Выберите PNG, JPG, WebP или GIF.'); return; } setBusy(true); setMessage(''); try { const url = await upload(file); if (url) { latest.current(url); dialog.current.close(); } else setMessage('Не удалось загрузить иконку.'); } catch { setMessage('Не удалось загрузить иконку.'); } finally { setBusy(false); } }} /></label>
        <form className="admin-icon-url" onSubmit={e => { e.preventDefault(); const url = safeMediaUrl(link); if (!url) { setMessage('Укажите безопасный адрес: https://, http:// или /.'); return; } latest.current(url); dialog.current.close(); }}><input aria-label="Ссылка на свою иконку" placeholder="Ссылка на изображение" value={link} onChange={e => setLink(e.target.value)} disabled={busy} /><button type="submit" disabled={busy || !link}><Link size={15} />Применить ссылку</button></form>
      </div>
      <label className="admin-icon-search"><Search size={18} aria-hidden="true" /><input autoFocus value={query} placeholder="Поиск иконки, например Music, Heart, Telegram" aria-label="Найти иконку по названию" onChange={e => { setQuery(e.target.value); setLimit(120); }} /></label>
      {message && <p role="alert">{message}</p>}
      {!catalogue ? <p role="status">Загрузка иконок…</p> : <><div className="admin-icon-grid">{names.slice(0, limit).map(name => { const Icon = catalogue[name] || Image; return <button type="button" key={name} disabled={busy} title={name} aria-label={`Выбрать ${name}`} aria-pressed={value === name} onClick={() => { latest.current(name); dialog.current.close(); }}><Icon size={25} aria-hidden="true" /><span>{name}</span></button>; })}</div>{names.length === 0 && <p>Иконки не найдены.</p>}{names.length > limit && <button type="button" className="admin-icon-more" onClick={() => setLimit(previous => previous + 120)}>Показать ещё ({names.length - limit})</button>}</>}
    </dialog>
  </div>;
}
