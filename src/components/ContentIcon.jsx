import React, { lazy, Suspense } from 'react';
import { Phone, Mail, MapPin, Instagram, Youtube, Send, Image, Users, Star, Music, Award, Mic2, Building2, Heart } from 'lucide-react';
import { safeMediaUrl } from '../media-utils';
const common = { Phone, Mail, MapPin, Instagram, Youtube, Send, Image, Users, Star, Music, Award, Mic2, Building2, Heart };
const LibraryIcon = lazy(() => import('./icon-library').then(({ icons }) => ({ default: function LibraryIcon({ name, fallback: Fallback = Image, ...props }) { const Icon = Object.hasOwn(icons, name) ? icons[name] : Fallback; return <Icon {...props} />; } })));
export default function ContentIcon({ value, size = 22, fallback: Fallback = Image, ...props }) {
  const source = safeMediaUrl(value);
  if (source) return <img {...props} src={source} width={size} height={size} alt="" style={{ width: size, height: size, objectFit: 'contain', ...props.style }} />;
  const Icon = Object.hasOwn(common, value) ? common[value] : null;
  if (Icon) return <Icon size={size} {...props} />;
  if (!/^[A-Z][A-Za-z0-9]*$/.test(value || '')) return value && !/[<>/]/.test(value) ? <span {...props} style={{ fontSize: size, lineHeight: 1, ...props.style }}>{value}</span> : <Fallback size={size} {...props} />;
  return <Suspense fallback={<Fallback size={size} {...props} />}><LibraryIcon name={value} fallback={Fallback} size={size} {...props} /></Suspense>;
}
