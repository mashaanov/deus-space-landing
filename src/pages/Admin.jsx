import React, { useEffect, useState } from 'react';
import defaults from '../../content/default-content.json';
import './Admin.css';

const labels = {
  site: 'Сайт', home: 'Главная', blocks: 'Блоки страницы', groups: 'Музыкальные группы',
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
const itemName = (item, i) => (typeof item === 'object' && item !== null && (item.title || item.name || item.label || item.type)) || `Элемент ${i + 1}`;
const mediaField = key => /image|avatar|photo|video|audio|poster|src|file/i.test(key);

async function api(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `Ошибка ${response.status}`);
  return data;
}

function Field({ value, onChange, fieldKey, template, upload, depth = 0 }) {
  const [newType, setNewType] = useState('');
  if (Array.isArray(value)) {
    const example = template?.[0] ?? value[0] ?? '';
    const models = Array.isArray(template) ? template.filter((item, i, list) => item && typeof item === 'object' && item.type && list.findIndex(other => other.type === item.type) === i) : [];
    const selectedModel = models.find(item => item.type === newType) || example;
    return <div className="admin-array">
      {value.map((item, index) => <details key={index} open={depth < 1} className="admin-item">
        <summary>{String(itemName(item, index))}</summary>
        <div className="admin-actions">
          <button type="button" disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>↑ Выше</button>
          <button type="button" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}>↓ Ниже</button>
          <button type="button" onClick={() => onChange([...value.slice(0, index + 1), newItem(item), ...value.slice(index + 1)])}>Дублировать</button>
          <button type="button" className="admin-danger" onClick={() => { if (window.confirm('Удалить этот элемент? Изменения применятся после сохранения.')) onChange(value.filter((_, i) => i !== index)); }}>Удалить</button>
        </div>
        <Field value={item} fieldKey={fieldKey} template={template?.find?.(candidate => typeof candidate === 'object' && candidate !== null && typeof item === 'object' && item !== null && ((item.type && candidate.type === item.type) || (item.id && candidate.id === item.id))) ?? example} upload={upload} depth={depth + 1} onChange={next => onChange(value.map((old, i) => i === index ? next : old))} />
      </details>)}
      {models.length > 1 && <label>Тип нового блока <select aria-label="Тип нового блока" value={newType || models[0].type} onChange={e => setNewType(e.target.value)}>{models.map(model => <option key={model.type} value={model.type}>{model.title || model.label || model.type}</option>)}</select></label>}
      {example !== undefined && <button type="button" onClick={() => onChange([...value, newItem(selectedModel)])}>+ Добавить элемент</button>}
    </div>;
  }
  if (value !== null && typeof value === 'object') return <div className="admin-fields">{Object.entries(value).map(([key, child]) => {
    const structured = child !== null && typeof child === 'object';
    const content = <Field value={child} fieldKey={key} template={template?.[key]} upload={upload} depth={depth + 1} onChange={next => onChange({ ...value, [key]: next })} />;
    return structured ? <details key={key} open={depth === 0} className="admin-group"><summary>{title(key)}</summary>{content}</details> : <div className="admin-field" key={key}><label>{title(key)}</label>{content}</div>;
  })}</div>;
  if (typeof value === 'boolean') return <label className="admin-check"><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />{value ? 'Да' : 'Нет'}</label>;
  if (typeof value === 'number') return <input aria-label={title(fieldKey)} type="number" value={value} onChange={e => onChange(Number(e.target.value))} />;
  if (value === null) return <span>Не задано</span>;
  return <div>
    {value.length > 100 || /description|text|about|message/i.test(fieldKey)
      ? <textarea aria-label={title(fieldKey)} rows={4} value={value} onChange={e => onChange(e.target.value)} />
      : <input aria-label={title(fieldKey)} type="text" readOnly={['type', 'id', 'popupId'].includes(fieldKey)} value={value} onChange={e => onChange(e.target.value)} />}
    {mediaField(fieldKey) && <label className="admin-upload">Загрузить файл<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,audio/mpeg,application/pdf" onChange={async e => { const file = e.target.files?.[0]; if (file) { const url = await upload(file); if (url) onChange(url); } e.target.value = ''; }} /></label>}
  </div>;
}

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [content, setContent] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
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
  useEffect(() => { refresh().catch(e => { setAuth({ authenticated: false }); setStatus(e.message); }); }, []);
  useEffect(() => { const handler = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler); }, [dirty]);
  const mutation = async (url, options) => api(url, { ...options, headers: { 'X-CSRF-Token': auth.csrfToken, ...options?.headers } });
  const upload = async file => {
    if (file.size > 25 * 1024 * 1024) { setStatus('Размер файла не должен превышать 25 МБ.'); return null; }
    setBusy(true);
    try {
      const data = await mutation('/api/admin/uploads', { method: 'POST', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
      setFiles((await api('/api/admin/uploads')).files || []);
      setStatus('Файл загружен. Сохраните контент, чтобы применить изменения.');
      return data.url;
    } catch (e) { setStatus(e.message); return null; } finally { setBusy(false); }
  };
  const login = async e => {
    e.preventDefault(); setBusy(true); setStatus('');
    try { await api('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }); setCredentials({ username: '', password: '' }); await refresh(); }
    catch (err) { setStatus(err.message); } finally { setBusy(false); }
  };
  const save = async () => {
    setBusy(true); setStatus('');
    try { await mutation('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }); setDirty(false); setStatus('Изменения сохранены и доступны на сайте.'); }
    catch (e) { setStatus(e.message); } finally { setBusy(false); }
  };
  return <main className="admin-shell">
    <header className="admin-header"><h1>Управление сайтом</h1><a href="/" target="_blank" rel="noreferrer">Открыть сайт ↗</a></header>
    {status && <p role="status" className="admin-status">{status}</p>}
    {auth === null ? <p>Загрузка…</p> : !auth.authenticated ? <form className="admin-login" onSubmit={login}>
      <h2>Вход администратора</h2>
      <label>Логин<input required autoComplete="username" value={credentials.username} onChange={e => setCredentials({ ...credentials, username: e.target.value })} /></label>
      <label>Пароль<input required type="password" autoComplete="current-password" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} /></label>
      <button disabled={busy}>{busy ? 'Вход…' : 'Войти'}</button>
    </form> : content && <>
      <div className="admin-toolbar"><strong>{dirty ? 'Есть несохранённые изменения' : 'Контент сохранён'}</strong><button type="button" disabled={busy || !dirty} onClick={save}>Сохранить изменения</button><button type="button" disabled={busy} onClick={async () => { if (dirty && !window.confirm('Выйти без сохранения?')) return; try { await mutation('/api/admin/logout', { method: 'POST' }); setDirty(false); setContent(null); setAuth({ authenticated: false }); } catch (e) { setStatus(e.message); } }}>Выйти</button></div>
      <p className="admin-hint">Откройте раздел и нужный блок. Изменяйте поля, добавляйте, дублируйте, удаляйте и перемещайте элементы. Изменения публикуются кнопкой «Сохранить изменения». Для нового типа блока главной дублируйте существующий блок нужного типа.</p>
      <nav className="admin-tabs" aria-label="Разделы редактора">{Object.keys(content).filter(key => key !== 'version').map(key => <button type="button" disabled={busy} key={key} aria-pressed={active === key} onClick={() => setActive(key)}>{title(key)}</button>)}<button type="button" disabled={busy} aria-pressed={active === '_media'} onClick={() => setActive('_media')}>Файлы</button></nav>
      {active === '_media' ? <section><h2>Загруженные файлы</h2><label className="admin-upload">Загрузить файл<input disabled={busy} type="file" onChange={e => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = ''; }} /></label><p>Скопируйте адрес файла в поле изображения, видео или ссылки. Удаление файла необратимо; сначала уберите его из контента.</p>{files.map(file => <div className="admin-media" key={file.url}><a href={file.url} target="_blank" rel="noreferrer">{file.name || file.url.split('/').pop()}</a><input readOnly aria-label="Адрес файла" value={file.url} /><button type="button" disabled={busy} onClick={async () => { if (!window.confirm('Удалить файл навсегда?')) return; try { await mutation(`/api/admin/uploads/${encodeURIComponent(file.url.split('/').pop())}`, { method: 'DELETE' }); setFiles((await api('/api/admin/uploads')).files || []); setStatus('Файл удалён.'); } catch (e) { setStatus(e.message); } }}>Удалить</button></div>)}</section>
        : Object.hasOwn(content, active) && <section><h2>{title(active)}</h2><fieldset disabled={busy} className="admin-editor"><Field value={content[active]} fieldKey={active} template={defaults[active]} upload={upload} onChange={value => { setContent({ ...content, [active]: value }); setDirty(true); }} /></fieldset></section>}
    </>}
  </main>;
}
