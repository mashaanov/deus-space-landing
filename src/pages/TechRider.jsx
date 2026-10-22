import React from 'react';
import ContentIcon from '../components/ContentIcon';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import TechRiderCard from '../components/TechRiderCard';
import {useContent} from '../content';
export default function TechRider(){const {techRider}=useContent();return <><Layout><div className="site-page min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100"><nav aria-label={techRider.sections} className="site-section-nav sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-purple-200"><div className="container mx-auto px-4 flex flex-wrap justify-center gap-2 p-2">{techRider.items.map((item,i)=><button key={i} onClick={()=>document.getElementById(item.id)?.scrollIntoView({behavior:'smooth',block:'start'})} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-100"><ContentIcon value={item.icon} size={20} />{item.label}</button>)}</div></nav><div className="container mx-auto px-4 py-8 space-y-8">{techRider.items.map((item,index)=><TechRiderCard key={`${item.id}-${index}`} item={item} index={index}/>)}</div></div></Layout><Footer/></>}
