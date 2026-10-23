import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ShimmerEdgeBox } from "./Topic1Google";

export const CYAN="#00E5CC", MAGENTA="#FF0055", RED="#FF3333", GOLD="#FFBB00", LIME="#00FF88";

const NODES=[
  {x:10,y:18,r:2.4,type:"hub"},{x:32,y:8,r:1.8,type:"terminal"},{x:62,y:14,r:2.0,type:"computer"},
  {x:87,y:26,r:1.6,type:"node"},{x:5,y:54,r:2.2,type:"hub"},{x:28,y:49,r:1.7,type:"terminal"},
  {x:56,y:47,r:2.1,type:"computer"},{x:82,y:58,r:1.5,type:"node"},
  {x:14,y:80,r:1.9,type:"hub"},{x:46,y:77,r:1.6,type:"terminal"},{x:75,y:84,r:1.8,type:"computer"},
];
const EDGES=[[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,9],[7,10],[8,9],[9,10]];
const NODE_COL=(type:string)=>type==="hub"?CYAN:type==="terminal"?MAGENTA:type==="computer"?GOLD:"#88AACC";

// ─── 1. DEAD NETWORK FIELD ───────────────────────────────────────────────────
export const DeadNetworkField:React.FC<{delay:number;exitFrame:number}>=({delay,exitFrame})=>{
  const frame=useCurrentFrame();
  const lf=frame-delay;
  if(lf<0)return null;
  const xE=exitFrame-delay;
  // Entry slides in from LEFT
  const entry=spring({frame:lf,fps:30,config:{damping:16,stiffness:180}});
  const exitP=interpolate(lf,[xE-10,xE],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  if(lf>xE)return null;
  const xSlide=interpolate(entry,[0,1],[-680,0])+interpolate(exitP,[0,1],[0,-680]);
  const opacity=interpolate(entry,[0,1],[0,1])*(1-exitP);

  const decay=interpolate(lf,[15,80],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const isDead=(x:number)=>decay>x/100;
  const flatlineW=interpolate(lf,[85,100],[0,100],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const glitch=Math.sin(lf*0.9)>0.84;

  const packets=EDGES.slice(0,7).map(([fi,ti],i)=>{
    const t=((lf*(0.05+i*0.009))%1);
    return{x:NODES[fi].x+(NODES[ti].x-NODES[fi].x)*t,y:NODES[fi].y+(NODES[ti].y-NODES[fi].y)*t,alive:!isDead(NODES[fi].x)&&!isDead(NODES[ti].x)};
  });

  return(
    <div style={{position:"absolute",top:"14%",left:"3%",width:640,transform:`translateX(${xSlide}px)`,opacity,zIndex:120}}>
      <ShimmerEdgeBox width={640} height={490} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        <div style={{padding:"16px 18px",width:"100%",height:"100%",boxSizing:"border-box",position:"relative",overflow:"hidden"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${CYAN}22`,paddingBottom:10,marginBottom:8,alignItems:"center"}}>
            <span style={{color:decay>0.5?RED:CYAN,fontFamily:"monospace",fontSize:28,fontWeight:900,filter:glitch?`drop-shadow(0 0 10px ${RED})`:undefined}}>[INTERNET_PULSE]</span>
            <span style={{color:decay>0.7?RED:CYAN,fontFamily:"'Cairo',sans-serif",fontSize:38,fontWeight:900}}>{decay>0.85?"مُعطَّل ██":decay>0.4?"يحتضر...":"نشط"}</span>
          </div>

          <svg width="100%" height="390" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow:"visible"}}>
            <defs>
              <radialGradient id="ngl" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={CYAN} stopOpacity="1"/><stop offset="100%" stopColor={CYAN} stopOpacity="0"/></radialGradient>
              <filter id="nglow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
              <linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={CYAN} stopOpacity="0.8"/><stop offset="100%" stopColor={MAGENTA} stopOpacity="0.5"/></linearGradient>
            </defs>

            {/* Edges with gradient */}
            {EDGES.map(([fi,ti],i)=>{
              const dead=isDead(NODES[fi].x)||isDead(NODES[ti].x);
              const pulse=Math.sin(lf*0.1+i*0.5)*0.3+0.7;
              return<line key={i} x1={`${NODES[fi].x}%`} y1={`${NODES[fi].y}%`} x2={`${NODES[ti].x}%`} y2={`${NODES[ti].y}%`}
                stroke={dead?"#1a1a1a":"url(#eg)"} strokeWidth={dead?"0.2":"0.6"}
                strokeOpacity={dead?0.15:pulse} style={{filter:dead?"none":"drop-shadow(0 0 1px rgba(0,229,204,0.5))"}}/>;
            })}

            {/* Pulse rings on alive nodes */}
            {NODES.map((n,i)=>{
              if(isDead(n.x))return null;
              const pulseR=n.r+(Math.sin(lf*0.15+i*1.1))*1.5;
              const pulseO=Math.max(0,(1-Math.sin(lf*0.15+i*1.1))*0.4);
              const col=NODE_COL(n.type);
              const isFailing = glitch && Math.sin(frame * i * 33) > 0;
              return<React.Fragment key={i}>
                <circle cx={`${n.x}%`} cy={`${n.y}%`} r={pulseR+2} fill="none" stroke={col} strokeWidth="0.4" opacity={pulseO}/>
                {/* RESTORING CHAOS: 1-frame jitter using sine, massive drop-shadow glow so it survives compression */}
                <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r} fill={isFailing?RED:col} opacity={1} style={{filter: isFailing ? `drop-shadow(0 0 15px ${RED}) drop-shadow(0 0 30px ${RED})` : `drop-shadow(0 0 2px ${col})`}}/>
              </React.Fragment>;
            })}

            {/* Dead nodes */}
            {NODES.map((n,i)=>{
              if(!isDead(n.x))return null;
              return<circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r={0.7} fill="#1e1e1e" opacity={0.3}/>;
            })}

            {/* Moving packets */}
            {packets.filter(p=>p.alive).map((p,i)=><circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r={1.5} fill="#FFF" style={{filter:`drop-shadow(0 0 4px ${CYAN})`}} opacity={0.95}/>)}

            {/* FLATLINE EKG */}
            {flatlineW>0&&(
              <line x1="0%" y1="50%" x2={`${flatlineW}%`} y2="50%"
                stroke={RED} strokeWidth="1.6" style={{filter:`drop-shadow(0 0 5px ${RED})`}}/>
            )}
          </svg>

          {/* SIGNAL LOST label */}
          {decay>0.88&&(
            <div style={{position:"absolute",bottom:18,right:18,color:RED,fontFamily:"monospace",fontSize:38,fontWeight:900,
              textShadow:`0 0 20px ${RED},0 0 40px ${RED}66`,opacity:decay,letterSpacing:3}}>[SIGNAL_LOST]</div>
          )}

          {/* Scanline overlay */}
          <div style={{position:"absolute",inset:0,background:`repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)`,pointerEvents:"none",zIndex:2}}/>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─── 2. BOT DUEL TERMINALS ───────────────────────────────────────────────────
const LA=["> بحث_متجه --سريع","> استخراج --عمق=9","> توليد_محتوى --ذكاء_اصطناعي","> نشر --تجاوز-البشر","> حلقة --لانهائية"];
const LB=["> استقبال_بيانات","> تحليل_رموز --تلقائي","> توليف_مقال --ذكاء_اصطناعي","> توزيع --الكل","> تأكيد --لا-تدخل-بشري"];

const BotCard:React.FC<{lines:string[];label:string;color:string;rotY:number;side:"left"|"right";lf:number}>=
({lines,label,color,rotY,side,lf})=>(
  <div style={{width:440,height:410,backgroundColor:"rgba(0,0,0,0.88)",
    border:`2px solid ${color}66`,borderRadius:16,
    boxShadow:`0 25px 60px rgba(0,0,0,0.9),inset 0 0 40px ${color}22`,
    backdropFilter:"blur(20px)",
    transform:`perspective(900px) rotateY(${rotY}deg)`,
    transformOrigin:side==="left"?"right center":"left center",
    padding:"24px 30px",overflow:"hidden",position:"relative",flexShrink:0}}>
    <div style={{display:"flex",gap:9,marginBottom:18,borderBottom:`1px solid ${color}33`,paddingBottom:14,alignItems:"center"}}>
      {[RED,LIME,color].map((c,i)=><div key={i} style={{width:14,height:14,borderRadius:"50%",backgroundColor:c}}/>)}
      <span style={{marginLeft:12,color,fontFamily:"monospace",fontSize:22,fontWeight:900}}>{label}</span>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {lines.map((line,i)=>{
        const rev=interpolate(lf,[i*15,i*15+16],[0,1],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});
        const chars=Math.floor(rev*line.length);
        return<div key={i} style={{fontFamily:"monospace",fontSize:24,fontWeight:700,whiteSpace:"nowrap",
          color:i===lines.length-1?color:"#888",
          textShadow:i===lines.length-1&&rev>0.5?`0 0 12px ${color}88`:"none"}}>
          {line.slice(0,chars)}{rev>0&&rev<1&&<span style={{opacity:Math.sin(lf*0.6)>0?1:0}}>█</span>}
        </div>;
      })}
    </div>
    <div style={{position:"absolute",left:0,right:0,height:2,
      background:`linear-gradient(90deg,transparent,${color},transparent)`,
      top:`${(lf*2)%100}%`,opacity:0.3,pointerEvents:"none"}}/>
  </div>
);

export const BotDuelTerminals:React.FC<{delay:number;exitFrame:number}>=({delay,exitFrame})=>{
  const frame=useCurrentFrame();const{fps}=useVideoConfig();const lf=frame-delay;
  if(lf<0)return null;const xE=exitFrame-delay;if(lf>xE)return null;
  const eA=spring({frame:lf,fps,config:{damping:18,stiffness:180}});
  const eB=spring({frame:Math.max(0,lf-6),fps,config:{damping:18,stiffness:180}});
  const exitP=interpolate(lf,[xE-12,xE],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const opacity=interpolate(lf,[0,8],[0,1],{extrapolateRight:"clamp"})*(1-exitP);
  // Panels face each other: A from LEFT, B from RIGHT (they meet in the middle)
  const xA=interpolate(eA,[0,1],[-480,0])+interpolate(exitP,[0,1],[0,-480]);
  const xB=interpolate(eB,[0,1],[480,0])+interpolate(exitP,[0,1],[0,480]);

  const ppT=(Math.sin(lf*0.22)+1)/2;
  const ppX=ppT*185;const ppY=95+Math.sin(lf*0.22)*20;
  const nhS=spring({frame:Math.max(0,lf-80),fps,config:{damping:8,stiffness:380}});
  const nhO=interpolate(lf,[80,95],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const flO=interpolate(lf,[82,106],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const flSc=interpolate(lf,[82,106],[1,0.3],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  // RESTORING KINETIC VIOLENCE: Step every 2 frames, double amplitude
  const steppedLf = Math.floor(lf / 2);
  const shake=nhS>0.9?(Math.sin(steppedLf*30)*10*(1-(nhS-0.9)/0.1)):0;

  return(
    <div style={{position:"absolute",top:"12%",right:"3%",left:"auto",opacity,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:0,position:"relative"}}>
        <div style={{transform:`translateX(${xA}px)`}}><BotCard lines={LA} label="[BOT_ALPHA]" color={CYAN} rotY={-12} side="left" lf={lf}/></div>

        {/* Neural stream zone */}
        <div style={{width:185,height:380,position:"relative",flexShrink:0}}>
          <svg width="185" height="380" viewBox="0 0 185 380" style={{overflow:"visible",position:"absolute",inset:0}}>
            <defs>
              <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={CYAN}/><stop offset="50%" stopColor="#FFF"/><stop offset="100%" stopColor={MAGENTA}/></linearGradient>
            </defs>
            {/* Main stream */}
            <path d="M 0 190 C 55 190, 130 190, 185 190" stroke="url(#sg2)" strokeWidth="2.5" fill="none" opacity={0.85} style={{filter:"drop-shadow(0 0 4px rgba(0,229,204,0.6))"}}/>
            {/* Secondary stream offset */}
            <path d="M 0 195 C 55 195, 130 195, 185 195" stroke="url(#sg2)" strokeWidth="1" fill="none" opacity={0.3}/>
            {/* Ping-pong */}
            <circle cx={ppX} cy={ppY} r={11} fill={CYAN} style={{filter:`drop-shadow(0 0 16px ${CYAN}) drop-shadow(0 0 32px ${CYAN})`}}/>
            <circle cx={185-ppX} cy={380-ppY} r={7} fill={MAGENTA} opacity={0.8} style={{filter:`drop-shadow(0 0 10px ${MAGENTA})`}}/>
          </svg>

          {/* Freelancer card — BOOSTED */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:`translate(-50%,-50%) scale(${flSc})`,opacity:flO,
            width:178,height:96,backgroundColor:"rgba(0,0,0,0.75)",
            border:`2.5px solid ${LIME}`,borderRadius:14,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            boxShadow:`0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px ${LIME}44`,
            backdropFilter:"blur(20px)",
            willChange:"transform,opacity"}}>
            {/* Top shimmer bar */}
            <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:`linear-gradient(90deg,transparent,${LIME},transparent)`,filter:`blur(1px) drop-shadow(0 0 4px ${LIME})`}}/>
            {/* Bottom shimmer bar */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:2.5,background:`linear-gradient(90deg,transparent,${LIME}88,transparent)`}}/>
            {/* Corner accents */}
            <div style={{position:"absolute",top:4,left:4,width:10,height:10,borderTop:`2px solid ${LIME}`,borderLeft:`2px solid ${LIME}`}}/>
            <div style={{position:"absolute",top:4,right:4,width:10,height:10,borderTop:`2px solid ${LIME}`,borderRight:`2px solid ${LIME}`}}/>
            <span style={{color:LIME,fontFamily:"monospace",fontSize:21,fontWeight:900,letterSpacing:1,
              textShadow:`0 0 14px ${LIME},0 0 30px ${LIME}88`}}>[مستقل]</span>
            <span style={{color:"#FFF",fontFamily:"'Cairo',sans-serif",fontSize:32,fontWeight:900,marginTop:4,
              textShadow:`0 0 20px ${LIME}AA,0 0 40px ${LIME}55`}}>مطوّر</span>
          </div>

          {/* NO HUMANS ALLOWED — BOOSTED + JITTER FIX */}
          {/* Outer: handles scale only (GPU layer 1) */}
          <div style={{position:"absolute",top:"50%",left:"50%",
            transform:`translate(-50%,-50%) scale(${nhS}) translateZ(0)`,
            opacity:nhO,willChange:"transform,opacity"}}>
            {/* Inner: handles shake only (GPU layer 2) — isolated so scale is never recalculated with shake */}
            <div style={{transform:`translateX(${shake}px) translateZ(0)`,willChange:"transform"}}>
              <div style={{width:194,height:90,backgroundColor:RED,
                border:"3px solid #FFF",borderRadius:12,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",
                boxShadow:`0 0 50px ${RED},0 0 100px ${RED}88,0 0 160px ${RED}44,inset 0 0 30px rgba(255,255,255,0.08)`}}>
                {/* Warning stripe background */}
                <div style={{position:"absolute",inset:0,background:`repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(0,0,0,0.18) 6px,rgba(0,0,0,0.18) 12px)`,pointerEvents:"none"}}/>
                {/* Top white bar */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#FFF,transparent)",opacity:0.9}}/>
                {/* Bottom white bar */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#FFF,transparent)",opacity:0.7}}/>
                {/* ⊘ icon */}
                <span style={{fontSize:14,position:"absolute",top:5,right:8,opacity:0.7}}>⊘</span>
                <span style={{color:"#FFF",fontFamily:"'Cairo', sans-serif",fontSize:31,fontWeight:900,
                  textAlign:"center",lineHeight:1.15,padding:"0 8px",position:"relative",zIndex:1,
                  textShadow:"0 2px 8px rgba(0,0,0,0.6),0 0 20px rgba(255,255,255,0.3)",letterSpacing:1}}>ممنوع<br/>للبشر</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{transform:`translateX(${xB}px)`}}><BotCard lines={LB} label="[BOT_BETA]" color={MAGENTA} rotY={12} side="right" lf={lf}/></div>
      </div>
    </div>
  );
};

// ─── 3. CODE TEAR REVEAL ─────────────────────────────────────────────────────
const CL=["const res = await api.post('/data');","function parse(x:string[]){","  return x.map(transform);","}","export default async(req,res)=>{","  const d=await db.query();","  res.json({d});","}","import{useState}from 'react'","const[v,set]=useState('')"];

export const CodeTearReveal:React.FC<{delay:number}>=({delay})=>{
  const frame=useCurrentFrame();const{fps}=useVideoConfig();const lf=frame-delay;
  if(lf<0)return null;

  // Lower box (Product Card) enters FIRST
  const rE=spring({frame:lf,fps,config:{damping:14,stiffness:220}});
  const rY=interpolate(rE,[0,1],[200,0]);
  const rO=rE;

  // Upper box (Code Tear) enters SECOND (delayed by 49 frames to maintain original global timing)
  const tearLf = lf - 49;
  const panelEntry=spring({frame:Math.max(0, tearLf),fps,config:{damping:16,stiffness:200}});
  const panelX=interpolate(panelEntry,[0,1],[-700,0]);
  const panelOpacity=tearLf < 0 ? 0 : 1;

  const splitX=interpolate(tearLf,[0,30],[0,230],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});
  const lightBleed=interpolate(tearLf,[8,42],[0,1],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});
  const tearGlow=interpolate(tearLf,[0,18],[1,0],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});

  // High-frequency electrical kick flicker
  const isFlicker = [8, 10, 11, 14, 17, 18, 21, 23, 24, 27, 29, 32, 33, 36, 38, 41, 42, 45, 48, 50, 53, 54].includes(Math.floor(tearLf));
  const flickerOpacity = isFlicker ? 0.6 : 1;
  const flickerFilter = isFlicker ? `saturate(2.5) hue-rotate(-45deg) brightness(1.4) blur(1px)` : `none`;
  const flickerSkew = isFlicker ? (Math.floor(tearLf) % 2 === 0 ? -2 : 2) : 0;

  const check1=interpolate(lf,[40,50],[0,1],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});
  const check2=interpolate(lf,[52,62],[0,1],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});
  const check3=interpolate(lf,[64,74],[0,1],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});
  const titleW=interpolate(lf,[37,52],[100,0],{extrapolateRight:"clamp",extrapolateLeft:"clamp"});

  const colMap=["#4EC9B0","#DCDCAA","#9CDCFE","#CE9178","#4EC9B0","#569CD6","#9CDCFE","#4EC9B0","#DCDCAA","#6A9955"];

  return(
    <div style={{position:"absolute",top:"16%",left:"3%",zIndex:140,width:650}}>
      {/* Code panels splitting — each wrapped in ShimmerEdgeBox style */}
      <div style={{
        position:"relative",width:650,height:400,overflow:"hidden",
        transform:`translateX(${panelX}px) skewX(${flickerSkew}deg)`,
        opacity: panelOpacity === 0 ? 0 : flickerOpacity,
        filter: flickerFilter
      }}>
        {/* Volumetric light */}
        <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",
          width:`${lightBleed*300}px`,height:`${lightBleed*300}px`,borderRadius:"50%",
          background:`radial-gradient(circle,${CYAN}CC 0%,${CYAN}55 40%,transparent 70%)`,
          opacity:lightBleed * 0.85,pointerEvents:"none"}}/>

        {/* LEFT code panel */}
        <div style={{position:"absolute",top:0,left:0,width:"50%",height:"100%",
          clipPath:`inset(0 ${splitX}px 0 0)`,overflow:"hidden",
          backgroundColor:"rgba(0,0,0,0.75)", backdropFilter:"blur(20px)",
          border:`2px solid ${CYAN}44`,borderRadius:"16px 0 0 16px",padding:"18px 16px",boxSizing:"border-box",
          boxShadow:`inset 0 0 50px ${CYAN}22,-10px 0 30px rgba(0,0,0,0.9)`}}>
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:2,background:`linear-gradient(to bottom,transparent,${CYAN},transparent)`,opacity:0.6}}/>
          {CL.slice(0,5).map((l,i)=><div key={i} style={{fontFamily:"monospace",fontSize:18,color:colMap[i],marginBottom:11,whiteSpace:"nowrap"}}>{l}</div>)}
        </div>

        {/* RIGHT code panel */}
        <div style={{position:"absolute",top:0,right:0,width:"50%",height:"100%",
          clipPath:`inset(0 0 0 ${splitX}px)`,overflow:"hidden",
          backgroundColor:"rgba(0,0,0,0.75)", backdropFilter:"blur(20px)",
          border:`2px solid ${MAGENTA}44`,borderRadius:"0 16px 16px 0",padding:"18px 16px",boxSizing:"border-box",
          boxShadow:`inset 0 0 50px ${MAGENTA}22,10px 0 30px rgba(0,0,0,0.9)`}}>
          <div style={{position:"absolute",top:0,right:0,bottom:0,width:2,background:`linear-gradient(to bottom,transparent,${MAGENTA},transparent)`,opacity:0.6}}/>
          {CL.slice(5).map((l,i)=><div key={i} style={{fontFamily:"monospace",fontSize:18,color:colMap[i+5],marginBottom:11,whiteSpace:"nowrap"}}>{l}</div>)}
        </div>

        {/* TEAR SEAM — lightning arc */}
        <div style={{position:"absolute",top:0,left:"calc(50% - 4px)",width:8,height:"100%",
          background:`linear-gradient(to bottom,transparent,${CYAN},#FFF 50%,${CYAN},transparent)`,
          boxShadow:`0 0 30px ${CYAN},0 0 60px ${CYAN}88`,
          opacity:tearGlow*(1-splitX/230)}}/>
      </div>

      {/* PRODUCT CARD — plain black glassmorphic with custom shimmer trace */}
      <div style={{transform:`translateY(${rY}px) translateZ(0)`,opacity:rO,marginTop:-55,position:"relative",zIndex:2,willChange:"transform, opacity"}}>
        <div style={{
          position:"relative",
          backgroundColor:"rgba(0,0,0,0.75)", backdropFilter:"blur(20px)",
          border:`2px solid ${CYAN}55`,borderRadius:24,padding:"30px 40px",
          boxShadow:`0 30px 60px rgba(0,0,0,0.9), inset 0 0 60px ${CYAN}22`
        }}>
          {/* Shimmer SVG Trace */}
          <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",borderRadius:22,pointerEvents:"none",overflow:"visible",zIndex:10}}>
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" ry="22" fill="none"
              pathLength="100" stroke={CYAN} strokeWidth="3" strokeDasharray="15 85" strokeDashoffset={-((lf * 0.5) % 100)}
              style={{ filter: `drop-shadow(0px 0px 8px ${CYAN})` }} />
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" ry="22" fill="none"
              pathLength="100" stroke={MAGENTA} strokeWidth="3" strokeDasharray="15 85" strokeDashoffset={-((lf * 0.5 + 50) % 100)}
              style={{ filter: `drop-shadow(0px 0px 8px ${MAGENTA})` }} />
          </svg>
            <div dir="rtl" style={{display:"flex",gap:12,marginBottom:16,borderBottom:`1px solid ${CYAN}33`,paddingBottom:12,alignItems:"center"}}>
              {[RED,LIME,CYAN].map((c,i)=><div key={i} style={{width:16,height:16,borderRadius:"50%",backgroundColor:c,filter:`drop-shadow(0 0 8px ${c})`}}/>)}
              <span style={{marginRight:12,color:CYAN,fontFamily:"'Cairo', sans-serif",fontSize:34,fontWeight:900,transform:"translateZ(0)",backfaceVisibility:"hidden",WebkitFontSmoothing:"antialiased",textShadow:`0 0 15px ${CYAN}`}}>[بروتوكول_النجاة]</span>
            </div>
            <div dir="rtl" style={{marginBottom:16,clipPath:`inset(0 0 0 ${titleW}%)`}}>
              <span style={{fontFamily:"'Cairo',sans-serif",fontSize:44,fontWeight:900,color:"#FFF",textShadow:`0 0 25px ${CYAN}88`}}>
                بيع <span style={{color:RED,textDecoration:"line-through",opacity:0.55,fontSize:38}}>الكود</span>{" "}...{" "}
                <span style={{color:CYAN}}>النتائج</span>
              </span>
            </div>
            <div dir="rtl" style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {label:"تسليم المنتج جاهزاً للعميل",icon:"📦",prog:check1,col:LIME},
                {label:"قيمة قابلة للقياس والنمو",icon:"📈",prog:check2,col:LIME},
                {label:"أنت المايسترو... مش البرمجة",icon:"🎯",prog:check3,col:LIME},
              ].map(({label,icon,prog,col},i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:16,opacity:prog,transform:`translateX(${interpolate(prog,[0,1],[30,0])}px)`}}>
                  <span style={{fontSize:26}}>{icon}</span>
                  <span style={{fontFamily:"'Cairo',sans-serif",fontSize:30,fontWeight:700,color:"#FFF"}}>{label}</span>
                  <span style={{color:col,fontSize:28,fontWeight:900,marginRight:"auto",textShadow:`0 0 12px ${col}`}}>✓</span>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
