import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, Plus, Upload, ChevronDown, X } from 'lucide-react';
import defaults from '../../content/default-content.json';
import './Admin.css';

const labels = {
  site: 'Сайт', home: 'Главная', blocks: 'Блоки страницы', groups: 'Группы',
  techRider: 'Команда и оборудование', contacts: 'Контакты', form: 'Форма заявки',
  brand: 'Название агентства', nav: 'Навигация', footer: 'Подвал', title: 'Заголовок',
  subtitle: 'Подзаголовок', description: 'Описание', text: 'Текст', name: 'Название / имя',
  label: 'Подпись', value: 'Значение', image: 'Изображение', images: 'Изображения',
  avatar: 'Фото', url: 'Адрес', href: 'Ссылка', path: 'Адрес страницы', video: 'Видео',
  videos: 'Видео', enabled: 'Показывать блок', items: 'Элементы', features: 'Особенности',
  price: 'Цена', button: 'Кнопка', phone: 'Телефон', email: 'Почта', type: 'Тип блока',
  id: 'Идентификатор', rating: 'Оценка', event: 'Мероприятие', badge: 'Значок',
  links: 'Ссылки', cards: 'Карточки', socials: 'Соцсети', options: 'Варианты',
};
Object.assign(labels, {errors:'Сообщения проверки формы', fullDescription:'Полное описание', popupId:'Идентификатор окна', groupLabels:'Подписи карточек групп', tagline:'Краткое описание', menuLabel:'Подпись меню', cta:'Основная кнопка', copyright:'Авторские права', hours:'Часы работы', plans:'Тарифы', audience:'Размер мероприятия', featured:'Выделенный тариф', more:'Подробнее', previous:'Предыдущий', next:'Следующий', goTo:'Перейти к слайду', members:'Состав', concerts:'Выступления', duration:'Длительность', experience:'Опыт', about:'О группе', repertoire:'Репертуар', order:'Заказать', orderPath:'Адрес заказа', close:'Закрыть', benefits:'Преимущества', photos:'Фотографии', genre:'Жанр', videoUrl:'Адрес видео', videoThumbnail:'Обложка видео', included:'Входит в стоимость', sections:'Разделы', menu:'Меню', socialTitle:'Заголовок соцсетей', formTitle:'Заголовок формы', formDescription:'Описание формы', responseNote:'Примечание об ответе', group:'Группа', groupPlaceholder:'Подсказка выбора группы', equipment:'Оборудование', equipmentOptions:'Варианты оборудования', date:'Дата', location:'Место', locationPlaceholder:'Подсказка места', namePlaceholder:'Подсказка имени', phonePlaceholder:'Подсказка телефона', submit:'Отправить', submitting:'Отправка', loading:'Загрузка', success:'Успешная отправка', error:'Ошибка отправки', privacy:'Согласие на обработку данных', desc:'Описание', category:'Категория', role:'Роль', details:'Подробности', slug:'Код группы', phoneUrl:'Ссылка телефона', emailUrl:'Ссылка почты'});
const title = key => labels[key] || key;
const copy = value => JSON.parse(JSON.stringify(value));
function newItem(value) {
  const next = copy(value);
  if (next && typeof next === 'object' && !Array.isArray(next)) {
    const suffix = Array.from(crypto.getRandomValues(new Uint8Array(4)), byte => byte.toString(16).padStart(2, '0')).join('');
    for (const key of ['id', 'slug', 'popupId']) {
      if (typeof next[key] === 'number') next[key] = Date.now() * 1000 + Math.floor(Math.random() * 1000);
      if (typeof next[key] === 'string') next[key] = `${next[key]}-${suffix}`;
    }
  }
  return next;
}
const blockNames = { hero: 'Главный экран', groups: 'Группы', stats: 'Статистика', pricing: 'Тарифы', reviews: 'Отзывы', equipment: 'Оборудование', specialist: 'Специалист' };
const itemName = (item, i) => {
  if (item && typeof item === 'object') {
    const name = item.title || item.name || item.label;
    return item.type ? `${blockNames[item.type] || 'Блок'}${name ? ` · ${name}` : ''}` : name || `Элемент ${i + 1}`;
  }
  return typeof item === 'string' && item ? item : `Элемент ${i + 1}`;
};
const hiddenFields = new Set(['id', 'type', 'popupId']);
const mediaField = key => /image|avatar|photo|video|audio|poster|src|file/i.test(key);

async function api(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `Ошибка ${response.status}`);
  return data;
}

function UploadControl({ upload, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const latestChange = useRef(onUploaded);
  latestChange.current = onUploaded;
  return <div className="admin-upload-control">
    <label className={`admin-upload${uploading ? ' is-uploading' : ''}`}>
      <Upload size={17} aria-hidden="true" /><span>{uploading ? 'Загрузка…' : 'Загрузить файл'}</span>
      <input className="admin-file-input" disabled={uploading} type="file" aria-label="Загрузить файл" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,audio/mpeg,application/pdf" onChange={async e => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setUploading(true); setMessage('');
        try {
          const url = await upload(file);
          if (url) { latestChange.current?.(url); setMessage(`Загружен: ${file.name}`); }
          else setMessage('Не удалось загрузить файл.');
        } finally { setUploading(false); }
      }} />
    </label>
    {message && <span className="admin-upload-message" role="status">{message}</span>}
  </div>;
}

function AddItemDialog({ models, example, onAdd, isBlocks }) {
  const dialog = useRef(null);
  const headingId = useId();
  const [newType, setNewType] = useState(models[0]?.type || '');
  const openDialog = () => {
    if (models.length <= 1) {
      onAdd(newItem(models[0] || example));
      return;
    }
    setNewType(models[0]?.type || '');
    dialog.current.showModal();
  };
  return <>
    <button type="button" className="admin-add-item" aria-label="Добавить элемент" title="Добавить элемент" onClick={openDialog}><Plus size={22} aria-hidden="true" /><span>Добавить элемент</span></button>
    {models.length > 1 && <dialog ref={dialog} className="admin-dialog" aria-labelledby={headingId} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <form onSubmit={e => { e.preventDefault(); const model = models.find(item => item.type === newType) || example; onAdd(newItem(model)); dialog.current.close(); }}>
        <div className="admin-dialog-heading"><h2 id={headingId}>{isBlocks ? 'Новый блок' : 'Новый элемент'}</h2><button type="button" className="admin-icon-button" aria-label="Закрыть диалог" onClick={() => dialog.current.close()}><X size={20} /></button></div>
        <label className="admin-dialog-field">Тип нового блока<select autoFocus value={newType} onChange={e => setNewType(e.target.value)}>{models.map(model => <option key={model.type} value={model.type}>{blockNames[model.type] || 'Блок'}</option>)}</select></label>
        <div className="admin-dialog-actions"><button type="button" onClick={() => dialog.current.close()}>Отменить</button><button className="admin-primary" type="submit">Добавить</button></div>
      </form>
    </dialog>}
  </>;
}

function Field({ value, onChange, fieldKey, template, upload, depth = 0 }) {
  if (Array.isArray(value)) {
    const example = template?.[0] ?? value[0] ?? '';
    const models = Array.isArray(template) ? template.filter((item, i, list) => item && typeof item === 'object' && item.type && list.findIndex(other => other.type === item.type) === i) : [];
    const isBlocks = fieldKey === 'blocks';
    return <div className={`admin-array${isBlocks ? ' admin-blocks' : ''}`}>
      {value.map((item, index) => {
        const name = String(itemName(item, index));
        const action = callback => e => { e.preventDefault(); e.stopPropagation(); callback(); };
        return <details key={item?.id ?? index} className="admin-item">
          <summary><ChevronDown size={17} className="admin-chevron" aria-hidden="true" /><span className="admin-item-title" title={name}>{name}</span><span className="admin-actions">
            <button type="button" className="admin-icon-button" title="Переместить выше" aria-label={`Переместить выше: ${name}`} disabled={index === 0} onClick={action(() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); })}><ArrowUp size={17} /></button>
            <button type="button" className="admin-icon-button" title="Переместить ниже" aria-label={`Переместить ниже: ${name}`} disabled={index === value.length - 1} onClick={action(() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); })}><ArrowDown size={17} /></button>
            <button type="button" className="admin-icon-button" title="Дублировать" aria-label={`Дублировать: ${name}`} onClick={action(() => onChange([...value.slice(0, index + 1), newItem(item), ...value.slice(index + 1)]))}><Copy size={17} /></button>
            <button type="button" className="admin-icon-button admin-danger" title="Удалить" aria-label={`Удалить: ${name}`} onClick={action(() => { if (window.confirm('Удалить этот элемент? Изменения применятся после сохранения.')) onChange(value.filter((_, i) => i !== index)); })}><Trash2 size={17} /></button>
          </span></summary>
          <div className="admin-item-content"><Field value={item} fieldKey={fieldKey} template={template?.find?.(candidate => typeof candidate === 'object' && candidate !== null && typeof item === 'object' && item !== null && ((item.type && candidate.type === item.type) || (item.id && candidate.id === item.id))) ?? example} upload={upload} depth={depth + 1} onChange={next => onChange(value.map((old, i) => i === index ? next : old))} /></div>
        </details>;
      })}
      <AddItemDialog models={models} example={example} isBlocks={isBlocks} onAdd={item => onChange([...value, item])} />
    </div>;
  }
  if (value !== null && typeof value === 'object') return <div className="admin-fields">{Object.entries(value).filter(([key]) => !hiddenFields.has(key)).map(([key, child]) => {
    const structured = child !== null && typeof child === 'object';
    const content = <Field value={child} fieldKey={key} template={template?.[key]} upload={upload} depth={depth + 1} onChange={next => onChange({ ...value, [key]: next })} />;
    if (key === 'blocks') return <React.Fragment key={key}>{content}</React.Fragment>;
    if (typeof child === 'boolean') return <div className="admin-field admin-boolean-field" key={key}>{content}</div>;
    return structured ? <details key={key} className="admin-group"><summary>{title(key)}</summary>{content}</details> : <div className="admin-field" key={key}><label>{title(key)}</label>{content}</div>;
  })}</div>;
  if (typeof value === 'boolean') return <label className="admin-switch-label"><span>{title(fieldKey)}</span><input className="admin-switch" type="checkbox" role="switch" aria-label={title(fieldKey)} checked={value} onChange={e => onChange(e.target.checked)} /></label>;
  if (typeof value === 'number') return <input aria-label={title(fieldKey)} type="number" value={value} onChange={e => onChange(Number(e.target.value))} />;
  if (value === null) return <span>Не задано</span>;
  return <div>
    {value.length > 100 || /description|text|about|message/i.test(fieldKey)
      ? <textarea aria-label={title(fieldKey)} rows={4} value={value} onChange={e => onChange(e.target.value)} />
      : <input aria-label={title(fieldKey)} type="text" value={value} onChange={e => onChange(e.target.value)} />}
    {mediaField(fieldKey) && <UploadControl upload={upload} onUploaded={onChange} />}
  </div>;
}

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [content, setContent] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState(null);
  const notify = useCallback((message, severity = 'success') => {
    setStatus({ message, severity });
  }, []);
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(null), status.severity === 'error' ? 6000 : 4000);
    return () => window.clearTimeout(timer);
  }, [status]);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState('home');
  const [files, setFiles] = useState([]);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const refresh = async () => {
    const session = await api('/api/admin/session');
    setAuth(session);
    if (session.authenticated) {
      const data = await api('/api/content');
      setContent(data.content || data);
      const uploaded = await api('/api/admin/uploads');
      setFiles(uploaded.files || []);
    }
  };
  useEffect(() => { refresh().catch(e => { setAuth({ authenticated: false }); notify(e.message, 'error'); }); }, [notify]);
  useEffect(() => { const handler = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler); }, [dirty]);
  const mutation = async (url, options) => api(url, { ...options, headers: { 'X-CSRF-Token': auth.csrfToken, ...options?.headers } });
  const upload = async file => {
    if (file.size > 25 * 1024 * 1024) { notify('Размер файла не должен превышать 25 МБ.', 'error'); return null; }
    setBusy(true);
    try {
      const data = await mutation('/api/admin/uploads', { method: 'POST', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
      setFiles((await api('/api/admin/uploads')).files || []);
      notify('Файл загружен. Сохраните контент, чтобы применить изменения.');
      return data.url;
    } catch (e) { notify(e.message, 'error'); return null; } finally { setBusy(false); }
  };
  const login = async e => {
    e.preventDefault(); setBusy(true); setStatus(null);
    try { await api('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }); setCredentials({ username: '', password: '' }); await refresh(); }
    catch (err) { notify(err.message, 'error'); } finally { setBusy(false); }
  };
  const save = async () => {
    setBusy(true); setStatus(null);
    try { await mutation('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }); setDirty(false); notify('Изменения сохранены и доступны на сайте.'); }
    catch (e) { notify(e.message, 'error'); } finally { setBusy(false); }
  };
  return <main className="admin-shell">
    {status && <div className="admin-toast" role={status.severity === 'error' ? 'alert' : 'status'} aria-live={status.severity === 'error' ? 'assertive' : 'polite'} aria-atomic="true">{status.message}</div>}
    {auth === null ? <p>Загрузка…</p> : !auth.authenticated ? <form className="admin-login" onSubmit={login}>
      <h2>Вход администратора</h2>
      <label>Логин<input required autoComplete="username" value={credentials.username} onChange={e => setCredentials({ ...credentials, username: e.target.value })} /></label>
      <label>Пароль<input required type="password" autoComplete="current-password" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} /></label>
      <button disabled={busy}>{busy ? 'Вход…' : 'Войти'}</button>
    </form> : content && <>
      <div className="admin-toolbar"><h1>Панель администрирования</h1><div className="admin-toolbar-actions"><a className="admin-open-site" href="/" target="_blank" rel="noreferrer">Открыть сайт ↗</a><button className="admin-save" type="button" disabled={busy || !dirty} onClick={save}>Сохранить изменения</button><button type="button" disabled={busy} onClick={async () => { if (dirty && !window.confirm('Выйти без сохранения?')) return; try { await mutation('/api/admin/logout', { method: 'POST' }); setDirty(false); setContent(null); setAuth({ authenticated: false }); } catch (e) { notify(e.message, 'error'); } }}>Выйти</button></div></div>
      <nav className="admin-tabs" aria-label="Разделы редактора">{Object.keys(content).filter(key => key !== 'version').map(key => <button type="button" disabled={busy} key={key} aria-pressed={active === key} onClick={() => setActive(key)}>{title(key)}</button>)}<button type="button" disabled={busy} aria-pressed={active === '_media'} onClick={() => setActive('_media')}>Файлы</button></nav>
      {active === '_media' ? <section key={active} aria-label="Загруженные файлы"><fieldset disabled={busy} className="admin-editor"><UploadControl upload={upload} /></fieldset>{files.map(file => <div className="admin-media" key={file.url}><a href={file.url} target="_blank" rel="noreferrer">{file.name || file.url.split('/').pop()}</a><input readOnly aria-label="Адрес файла" value={file.url} /><button type="button" disabled={busy} onClick={async () => { if (!window.confirm('Удалить файл навсегда?')) return; try { await mutation(`/api/admin/uploads/${encodeURIComponent(file.url.split('/').pop())}`, { method: 'DELETE' }); setFiles((await api('/api/admin/uploads')).files || []); notify('Файл удалён.'); } catch (e) { notify(e.message, 'error'); } }}>Удалить</button></div>)}</section>
        : Object.hasOwn(content, active) && <section key={active} aria-label={title(active)}><fieldset disabled={busy} className="admin-editor"><Field value={content[active]} fieldKey={active} template={defaults[active]} upload={upload} onChange={value => { setContent(previous => ({ ...previous, [active]: value })); setDirty(true); }} /></fieldset></section>}
    </>}
  </main>;
}
