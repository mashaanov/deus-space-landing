import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { safeMediaUrl as imageUrl, videoSource } from '../media-utils';
import { ArrowLeft, ArrowRight, GripVertical, ImagePlus, Link, Plus, Trash2, Upload, Video, X } from 'lucide-react';

const acceptImages = 'image/png,image/jpeg,image/webp,image/gif';
function Thumbnail({ value }) {
  const [failed, setFailed] = useState(false);
  const source = imageUrl(value);
  return source && !failed ? <img src={source} alt="Фотография" onError={() => setFailed(true)} /> : <span className="admin-photo-placeholder"><ImagePlus size={25} aria-hidden="true" />{value ? 'Не удалось открыть фото' : 'Нет фотографии'}</span>;
}
function Preview({ dialog, value }) {
  const heading = useId();
  return <dialog ref={dialog} className="admin-dialog admin-photo-preview" aria-labelledby={heading} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
    <div className="admin-dialog-heading"><h2 id={heading}>Просмотр фотографии</h2><button type="button" className="admin-icon-button" aria-label="Закрыть фотографию" onClick={() => dialog.current.close()}><X size={20} /></button></div>
    <div className="admin-photo-large"><Thumbnail key={value} value={value} /></div>
  </dialog>;
}
function PhotoLink({ initial = '', onChange, disabled }) {
  const dialog = useRef(null);
  const heading = useId();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  return <>
    <button type="button" className="admin-photo-link" disabled={disabled} onClick={() => { setUrl(initial); setError(''); dialog.current.showModal(); }}><Link size={15} aria-hidden="true" />По ссылке</button>
    <dialog ref={dialog} className="admin-dialog" aria-labelledby={heading} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><form onSubmit={e => { e.preventDefault(); const next = imageUrl(url); if (!next) { setError('Укажите адрес изображения, начинающийся с https://, http:// или /.'); return; } onChange(next); dialog.current.close(); }}>
      <div className="admin-dialog-heading"><h2 id={heading}>Ссылка на фотографию</h2><button type="button" className="admin-icon-button" aria-label="Закрыть диалог" onClick={() => dialog.current.close()}><X size={20} /></button></div>
      <label className="admin-dialog-field">Адрес изображения<input autoFocus type="text" value={url} onChange={e => setUrl(e.target.value)} required aria-invalid={!!error} aria-describedby={error ? `${heading}-error` : undefined} /></label>
      {error && <p id={`${heading}-error`} role="alert">{error}</p>}
      <div className="admin-dialog-actions"><button type="button" onClick={() => dialog.current.close()}>Отменить</button><button className="admin-primary" type="submit">Применить</button></div>
    </form></dialog>
  </>;
}
function PhotoUpload({ upload, onUploaded, card = false, disabled, onBusy, video = false, onMessage }) {
  const uploadLabel = video ? 'Загрузить видео' : 'Загрузить фото';
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const updateMessage = message => { setMessage(message); onMessage?.(message); };
  const callback = useRef(onUploaded);
  callback.current = onUploaded;
  return <div className={card ? 'admin-photo-add' : 'admin-photo-upload'}><label className={card ? 'admin-photo-add-button' : 'admin-upload'}>
    {card ? <Plus size={28} aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}<span>{uploading ? 'Загрузка…' : card ? 'Добавить фото' : uploadLabel}</span>
    <input className="admin-file-input" type="file" accept={video ? 'video/mp4,video/webm' : acceptImages} aria-label={card ? 'Добавить фото' : uploadLabel} disabled={disabled || uploading} onChange={async e => {
      const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
      if (!(video ? /^video\/(mp4|webm)$/ : /^image\/(png|jpeg|webp|gif)$/).test(file.type)) { updateMessage(video ? 'Выберите MP4 или WebM.' : 'Выберите PNG, JPG, WebP или GIF.'); return; }
      setUploading(true); updateMessage(''); onBusy?.(true);
      try { const url = await upload(file); if (url) { callback.current(url); updateMessage(`Загружен: ${file.name}`); } else updateMessage(video ? 'Не удалось загрузить видео.' : 'Не удалось загрузить фото.'); }
      finally { setUploading(false); onBusy?.(false); }
    }} />
  </label>{message && !onMessage && <span className="admin-upload-message" role="status">{message}</span>}</div>;
}
export function AdminImage({ value, onChange, upload }) {
  const preview = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  return <div className="admin-image-field">
    <button type="button" className="admin-photo-thumbnail admin-single-photo" disabled={!value || uploading} aria-label="Открыть фотографию" onClick={e => { e.stopPropagation(); preview.current.showModal(); }}><Thumbnail key={value} value={value} /></button>
    <div className="admin-image-controls"><PhotoUpload upload={upload} onUploaded={onChange} onBusy={setUploading} onMessage={setMessage} /><PhotoLink initial={value} onChange={onChange} disabled={uploading} /><button type="button" className="admin-image-delete admin-danger" disabled={!value || uploading} title="Удалить фотографию" aria-label="Удалить фотографию" onClick={() => { onChange(''); setMessage(''); }}><Trash2 size={16} /><span>Удалить</span></button></div>
    {message && <span className="admin-upload-message admin-image-message" role="status">{message}</span>}
    <Preview dialog={preview} value={value} />
  </div>;
}
export function AdminPhotoGallery({ value, onChange, upload }) {
  const [model, setModel] = useState(() => ({ source: value, entries: value.map((url, id) => ({ id, url })), nextId: value.length }));
  let entries = model.entries;
  if (model.source !== value) {
    // Match duplicate URLs one by one, preserving a distinct identity for each card.
    const pool = [...model.entries];
    let nextId = model.nextId;
    entries = value.map(url => { const index = pool.findIndex(item => item.url === url); return index < 0 ? { id: nextId++, url } : pool.splice(index, 1)[0]; });
    setModel({ source: value, entries, nextId });
  }
  const latest = useRef({ entries, onChange });
  useLayoutEffect(() => { latest.current = { entries, onChange }; }, [entries, onChange]);
  const preview = useRef(null);
  const strip = useRef(null);
  const drag = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const publish = next => {
    const urls = next.map(item => item.url);
    latest.current = { ...latest.current, entries: next };
    setModel(previous => ({ source: urls, entries: next, nextId: Math.max(previous.nextId, ...next.map(item => item.id + 1)) }));
    latest.current.onChange(urls);
  };
  const append = url => {
    const current = latest.current.entries;
    const id = Math.max(model.nextId, ...current.map(item => item.id + 1));
    publish([...current, { id, url }]);
  };
  const move = (id, targetId) => {
    const current = [...latest.current.entries]; const from = current.findIndex(item => item.id === id); const to = current.findIndex(item => item.id === targetId);
    if (from < 0 || to < 0 || from === to) return;
    current.splice(to, 0, current.splice(from, 1)[0]); publish(current);
  };
  const finishDrag = e => {
    if (!drag.current) return;
    const { id, target } = drag.current; drag.current = null; setDragging(null);
    if (e.type !== 'pointercancel' && !uploading) move(id, target);
  };
  return <div className="admin-photo-gallery"><div className="admin-photo-strip" ref={strip} aria-label="Фотографии группы">
    {entries.map((item, index) => <div key={item.id} data-photo-id={item.id} className={`admin-photo-card${dragging === item.id ? ' is-dragging' : ''}`}>
      <button type="button" className="admin-photo-thumbnail" disabled={uploading} aria-label={`Открыть фотографию ${index + 1}`} onClick={e => { e.stopPropagation(); setPreviewUrl(item.url); preview.current.showModal(); }}><Thumbnail key={item.url} value={item.url} /></button>
      <button type="button" className="admin-icon-button admin-photo-delete admin-danger" disabled={uploading} title="Убрать фотографию" aria-label={`Убрать фотографию ${index + 1}`} onClick={() => publish(latest.current.entries.filter(entry => entry.id !== item.id))}><Trash2 size={16} /></button>
      <div className="admin-photo-order"><button type="button" className="admin-icon-button" disabled={uploading || index === 0} title="Переместить влево" aria-label={`Переместить фотографию ${index + 1} влево`} onClick={() => move(item.id, entries[index - 1].id)}><ArrowLeft size={15} /></button>
        <button type="button" className="admin-icon-button admin-photo-grip" disabled={uploading} title="Перетащите, чтобы изменить порядок" aria-label={`Перетащить фотографию ${index + 1}`} onPointerDown={e => { if (e.button !== 0 || uploading) return; e.preventDefault(); drag.current = { id: item.id, target: item.id }; setDragging(item.id); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => {
          if (!drag.current) return;
          const bounds = strip.current.getBoundingClientRect(); if (e.clientX < bounds.left + 32) strip.current.scrollLeft -= 16; if (e.clientX > bounds.right - 32) strip.current.scrollLeft += 16;
          const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-photo-id]');
          if (target && strip.current.contains(target)) drag.current.target = Number(target.dataset.photoId);
        }} onPointerUp={finishDrag} onPointerCancel={finishDrag}><GripVertical size={16} /></button>
        <button type="button" className="admin-icon-button" disabled={uploading || index === entries.length - 1} title="Переместить вправо" aria-label={`Переместить фотографию ${index + 1} вправо`} onClick={() => move(item.id, entries[index + 1].id)}><ArrowRight size={15} /></button></div>
    </div>)}
    <PhotoUpload card upload={upload} disabled={uploading} onBusy={setUploading} onUploaded={append} />
  </div><PhotoLink disabled={uploading} onChange={append} /><Preview dialog={preview} value={previewUrl} /></div>;
}

function VideoPreview({ value }) {
  const source = videoSource(value);
  const [failed, setFailed] = useState(false);
  if (!source || failed) return <span className="admin-video-placeholder"><Video size={30} aria-hidden="true" />{value ? 'Видео недоступно' : 'Видео не добавлено'}</span>;
  return source.type === 'file' ? <video src={source.url} controls preload="metadata" onError={() => setFailed(true)} aria-label="Просмотр видео" /> : <iframe src={source.url} title="Просмотр видео" sandbox="allow-scripts allow-same-origin allow-presentation" allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
}
export function AdminVideo({ value, onChange, upload }) {
  const dialog = useRef(null);
  const heading = useId();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  return <div className="admin-video-field">
    <div className="admin-video-frame"><VideoPreview key={value} value={value} /></div>
    <div className="admin-video-controls"><PhotoUpload video upload={upload} onUploaded={onChange} onBusy={setUploading} />
      <button type="button" className="admin-photo-link" disabled={uploading} onClick={() => { setUrl(value); setError(''); dialog.current.showModal(); }}><Link size={15} aria-hidden="true" />По ссылке</button>
      {value && <button type="button" className="admin-icon-button admin-danger" disabled={uploading} title="Убрать видео" aria-label="Убрать видео" onClick={() => onChange('')}><Trash2 size={17} /></button>}
    </div>
    <dialog ref={dialog} className="admin-dialog" aria-labelledby={heading} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><form onSubmit={e => { e.preventDefault(); const next = url.trim(); if (!videoSource(next)) { setError('Укажите ссылку на MP4, WebM, YouTube или Vimeo.'); return; } onChange(next); dialog.current.close(); }}>
      <div className="admin-dialog-heading"><h2 id={heading}>Ссылка на видео</h2><button type="button" className="admin-icon-button" aria-label="Закрыть диалог" onClick={() => dialog.current.close()}><X size={20} /></button></div>
      <label className="admin-dialog-field">Адрес видео<input autoFocus type="text" value={url} onChange={e => setUrl(e.target.value)} required aria-invalid={!!error} aria-describedby={error ? `${heading}-error` : undefined} /></label>
      {error && <p id={`${heading}-error`} role="alert">{error}</p>}
      <div className="admin-dialog-actions"><button type="button" onClick={() => dialog.current.close()}>Отменить</button><button className="admin-primary" type="submit">Применить</button></div>
    </form></dialog>
  </div>;
}
