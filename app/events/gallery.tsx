'use client';
import {useEffect,useRef,useState} from 'react';
import {Dialog,DialogContent,DialogTitle} from '@/components/ui/dialog';

const photos=[
 {src:'/events/night-one-1.webp',alt:'The illuminated Tent of Hope at night'},
 {src:'/events/night-one-2.webp',alt:'A group of visitors and volunteers gathered inside the tent'},
 {src:'/events/night-one-3.webp',alt:'Chairs arranged for a video presentation inside the tent'},
 {src:'/events/night-one-4.webp',alt:'Volunteers speaking together inside the tent'},
 {src:'/events/night-one-5.webp',alt:'Tent of Hope set up with refreshments and resources'},
 {src:'/events/night-one-6.webp',alt:'Welcome table inside the Tent of Hope'},
 {src:'/events/night-one-7.webp',alt:'Three volunteers smiling beneath the Tent of Hope banner'},
 {src:'/events/night-one-8.webp',alt:'Visitors watching a video inside the tent'},
];
type Tile={current:number;previous:number|null;step:number};
const initial:Tile[]=photos.map((_,index)=>({current:index,previous:null,step:0}));
export default function Gallery(){
 const [tiles,setTiles]=useState(initial);
 const [hovered,setHovered]=useState(false);
 const [visible,setVisible]=useState(true);
 const [reduced,setReduced]=useState(false);
 const [mobile,setMobile]=useState(false);
 const [selected,setSelected]=useState<number|null>(null);
 const lastTile=useRef(-1);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery=window.matchMedia('(max-width: 750px)');
  const update=()=>{setReduced(preference.matches);setMobile(mobileQuery.matches)};
  update();preference.addEventListener('change',update);mobileQuery.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:0.1});
  const node=document.getElementById('night-one-gallery');if(node)observer.observe(node);
  const visibility=()=>setVisible(!document.hidden);
  document.addEventListener('visibilitychange',visibility);
  return()=>{preference.removeEventListener('change',update);mobileQuery.removeEventListener('change',update);observer.disconnect();document.removeEventListener('visibilitychange',visibility)};
 },[]);
 useEffect(()=>{
  if(hovered||reduced||!visible||selected!==null)return;
  const timer=window.setInterval(()=>setTiles(previous=>{
   const count=mobile?4:photos.length;
   const choices=Array.from({length:count},(_,index)=>index).filter(index=>index!==lastTile.current);
   const tile=choices[Math.floor(Math.random()*choices.length)];
   lastTile.current=tile;
   const used=new Set(previous.slice(0,count).map(item=>item.current));
   const available=photos.map((_,index)=>index).filter(index=>index!==previous[tile].current&&(!mobile||!used.has(index)));
   const pool=available.length?available:photos.map((_,index)=>index).filter(index=>index!==previous[tile].current);
   const nextPhoto=pool[Math.floor(Math.random()*pool.length)];
   const next=[...previous];next[tile]={current:nextPhoto,previous:previous[tile].current,step:previous[tile].step+1};
   return next;
  }),3000);
  return()=>window.clearInterval(timer);
 },[hovered,reduced,visible,mobile,selected]);
 return <div className="gallery-wrap" id="night-one-gallery" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}><div className="gallery-toolbar"><div><p className="eyebrow">MOMENTS FROM THE HILL OF HOPE</p><h2>Night one Gallery.</h2></div></div><div className="bento-grid" aria-label="Photos from the first night of Tent of Hope">{tiles.map((tile,index)=><button className={'bento-tile tile-'+index} type="button" key={index} onClick={()=>setSelected(tile.current)} aria-label={'View photo: '+photos[tile.current].alt}>{tile.previous!==null&&<img key={'old-'+tile.step} className="gallery-image gallery-old" src={photos[tile.previous].src} alt="" aria-hidden="true"/>}<img key={'new-'+tile.step} className={tile.previous!==null?'gallery-image gallery-new':'gallery-image'} src={photos[tile.current].src} alt="" loading={index<3?'eager':'lazy'}/></button>)}</div><Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="gallery-lightbox" aria-describedby={undefined}><DialogTitle className="sr-only">{selected!==null?photos[selected].alt:'Event photo'}</DialogTitle>{selected!==null&&<img src={photos[selected].src} alt={photos[selected].alt}/>}</DialogContent></Dialog></div>;
}
