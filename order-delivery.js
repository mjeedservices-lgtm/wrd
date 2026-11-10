(function(){
const style=document.createElement('style');
style.textContent='.delivery{max-width:850px;margin:auto}.delivery-card{background:#fffefa;border:1px solid var(--line);padding:24px;margin:18px 0;text-align:center}.delivery-card h2{font:400 28px var(--serif);margin:0 0 12px}.delivery-note{font-size:13px;color:var(--muted);line-height:1.9}.delivery-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:15px 0}.delivery-link{display:flex;gap:8px;direction:ltr;max-width:620px;margin:12px auto}.delivery-link input{flex:1;min-width:0;border:1px solid var(--line);padding:10px;font-size:11px}.delivery-image{display:block;max-height:min(68vh,760px);max-width:90%;width:auto;object-fit:contain;margin:16px auto;border:1px solid var(--line);box-shadow:0 10px 28px #3325}.transfer-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.transfer-method{padding:18px;background:#f7f4ee;border:1px solid var(--line)}.transfer-method b{display:block;margin-bottom:8px;color:var(--green)}.transfer-number{direction:ltr;font-weight:600;letter-spacing:.04em}.delivery-head{text-align:center;margin:10px auto 28px}.delivery-head h1{font:400 38px var(--serif)}@media(max-width:600px){.delivery-card{padding:18px 14px}.delivery-head h1{font-size:30px}.transfer-grid{grid-template-columns:1fr}.delivery-image{max-height:55vh}.delivery-link button{padding:8px}}';
document.head.appendChild(style);
const account=document.getElementById('accountPage');
if(account&&!document.getElementById('orderResult'))account.insertAdjacentHTML('afterend','<section id="orderResult" class="section account-page delivery" hidden></section>');
function drawWrap(ctx,text,x,y,maxWidth,lineHeight,maxLines){
 const words=String(text||'').split(/\s+/),lines=[];let line='';
 for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}
 if(line)lines.push(line);
 const visible=lines.slice(0,maxLines||4);visible.forEach((part,i)=>ctx.fillText(part,x,y+i*lineHeight));
 return y+visible.length*lineHeight;
}
async function renderFinalImage(d){
 await document.fonts.ready;
 const t=templates.find(x=>x.id===d.theme)||{kind:'art-family',orn:'❀'};
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
 const ctx=canvas.getContext('2d'),styles=d.styles||lineDefaults;
 const palette={'art-wed':'#715e43','art-kid':'#9b5c5b','art-grad':'#d8c290','art-eng':'#847455','art-bday':'#415b4c','art-adult':'#795943','art-circus':'#765244','art-family':'#68664b'};
 ctx.fillStyle=d.backgroundColor||'#f7f0e5';ctx.fillRect(0,0,1080,1920);
 ctx.save();ctx.globalAlpha=.12;ctx.strokeStyle=d.frameColor||'#b99a6b';ctx.lineWidth=2;
 for(let i=0;i<12;i++){const x=45+i*90;ctx.beginPath();ctx.arc(x,120,28,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(1080-x,1800,24,0,Math.PI*2);ctx.stroke()}
 ctx.restore();
 ctx.strokeStyle=d.frameColor||'#b99a6b';ctx.lineWidth=5;ctx.strokeRect(42,42,996,1836);ctx.lineWidth=1.5;ctx.strokeRect(58,58,964,1804);
 ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='middle';
 const defaultColor=palette[t.kind]||'#715e43';
 const get=(k)=>styles[k]||lineDefaults[k], set=(k)=>{const v=get(k);ctx.fillStyle=v.color||defaultColor;ctx.font=(k==='title'?'bold ':'')+Math.round((Number(v.size)||16)*2.3)+'px "'+(v.font||'Amiri')+'"';};
 set('title');ctx.font='72px "'+(get('title').font||'Amiri')+'"';ctx.fillText(t.orn||'❀',540,300);
 set('title');let y=drawWrap(ctx,d.title||'دعوتكم فرحتنا',540,430,830,112,2)+35;
 set('message');y=drawWrap(ctx,d.message||'يسعدنا حضوركم ومشاركتنا فرحتنا',540,y,800,74,5)+25;
 if(d.date){set('date');const dt=new Date(d.date+'T12:00:00').toLocaleDateString('en-GB-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'});y=drawWrap(ctx,dt,540,y,800,64,2)+12}
 if(d.time){set('time');y=drawWrap(ctx,'الساعة '+d.time,540,y,800,64,1)+12}
 if(d.locationName){set('location');y=drawWrap(ctx,'موقع الحضور · '+d.locationName,540,y,800,64,2)+12}
 if(d.locationUrl){set('location');y=drawWrap(ctx,'⌖  موقع الحضور',540,y,800,64,1)+12}
 if(d.rsvpEnabled){set('footer');y=drawWrap(ctx,'♡  تأكيد الحضور',540,y,800,64,1)+12}
 set('footer');drawWrap(ctx,d.footer||'ننتظركم بكل حب',540,Math.min(y+45,1710),800,70,2);
 return canvas.toDataURL('image/png');
}
function createReadyLink(d){const data=Object.assign({},d,{watermark:false});return location.href.split('#')[0]+'#invite='+encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(data)))))}
function formatOrder(d,link){
 const names={title:'العنوان',message:'نص الدعوة',date:'التاريخ',time:'الوقت',location:'الموقع',footer:'الختام'};
 const styleLines=Object.keys(names).map(k=>{const v=d.styles[k]||lineDefaults[k];return names[k]+': '+v.font+'، '+v.size+'px، '+v.color}).join('\n');
 const formats=d.formats.map(x=>x==='link'?'رابط تفاعلي':'صورة قابلة للتنزيل').join(' + ');
 return ['طلب دعوة من متجر ورد','القالب: '+(templates.find(t=>t.id===d.theme)?.name||'تصميم خاص'),'المناسبة: '+(templates.find(t=>t.id===d.theme)?.cat||'مناسبة خاصة'),'السعر: 15 ريال — الدفع بعد الطلب','برق: +966580807787 — عبدالمجيد العلياني','STC Bank: +966580807787 — عبدالمجيد العلياني','نوع التسليم: '+formats,'عنوان الدعوة: '+d.title,'نص الدعوة: '+d.message,'التاريخ: '+(d.date||'غير محدد'),'الوقت: '+(d.time||'غير محدد'),'موقع الحضور: '+(d.locationName||'غير محدد'),'رابط الموقع: '+(d.locationUrl||'غير مضاف'),'رابط تأكيد الحضور: '+(d.rsvpEnabled?(d.rsvpUrl||'أيقونة فقط'):'غير مطلوب'),'السطر الختامي: '+d.footer,'لون الخلفية: '+d.backgroundColor,'لون الإطار: '+d.frameColor,'رابط الدعوة للاستخدام: '+(link||'غير مطلوب'),'رقم حساب العميل: '+(sessionStorage.getItem('ward-phone')||'يرسله العميل عبر واتساب'),'تنسيق الأسطر:\n'+styleLines].join('\n');
}
function showDelivery(d,link,image,message){
 document.querySelectorAll('#home>section,#home>.trust').forEach(el=>el.hidden=true);
 document.getElementById('accountPage').hidden=true;
 const page=document.getElementById('orderResult');page.hidden=false;
 const linkHtml=link?'<section class="delivery-card"><h2>رابط دعوتك الجاهز</h2><p class="delivery-note">افتحي الرابط لمعاينة الدعوة ومشاركته مع ضيوفك.</p><div class="delivery-link"><input id="readyInviteLink" readonly><button class="primary" onclick="copyReadyLink()">نسخ الرابط</button></div><div class="delivery-actions"><a class="primary" id="openReadyInvite" target="_blank" rel="noopener">فتح الدعوة التفاعلية</a></div></section>':'';
 const imageHtml=image?'<section class="delivery-card"><h2>صورة دعوتك الجاهزة</h2><p class="delivery-note">الصورة متاحة للاستخدام والتنزيل مباشرة.</p><img id="readyInviteImage" class="delivery-image" alt="دعوتك الرقمية"><div class="delivery-actions"><a id="downloadReadyImage" class="primary" download="دعوة-ورد.png">تنزيل الصورة</a></div></section>':'';
 page.innerHTML='<div class="delivery-head"><div class="eyebrow" style="justify-content:center">تم تجهيز الطلب</div><h1>دعوتك جاهزة للاستخدام</h1><p class="delivery-note">لا يلزم دفع مسبق. حمّلي الصورة أو استخدمي الرابط الآن، ويمكنك التحويل بعد الطلب.</p></div>'+linkHtml+imageHtml+'<section class="delivery-card"><h2>التحويل بعد الطلب</h2><p class="delivery-note">المبلغ 15 ريال. رقم المستفيد نفسه في برق وSTC Bank.</p><div class="transfer-grid"><div class="transfer-method"><b>محفظة برق</b><div class="transfer-number">+966 580 807 787</div><div>المستفيد: عبدالمجيد العلياني</div></div><div class="transfer-method"><b>STC Bank</b><div class="transfer-number">+966 580 807 787</div><div>المستفيد: عبدالمجيد العلياني</div></div></div></section><section class="delivery-card"><h2>إرسال تفاصيل الطلب</h2><p class="delivery-note">أرسلي تفاصيل الطلب إلى واتساب لإشعارنا وإتمام التحويل بعده.</p><div class="delivery-actions"><a class="whatsapp-cta" id="sendOrderWhatsApp" target="_blank" rel="noopener">إرسال التفاصيل إلى واتساب</a><button class="secondary" onclick="returnToStore()">العودة إلى المتجر</button></div></section>';
 if(link){document.getElementById('readyInviteLink').value=link;document.getElementById('openReadyInvite').href=link}
 if(image){document.getElementById('readyInviteImage').src=image;document.getElementById('downloadReadyImage').href=image}
 const wa='https://wa.me/966580807787?text='+encodeURIComponent(message);
 document.getElementById('sendOrderWhatsApp').href=wa;
 window.scrollTo({top:0,behavior:'smooth'});
}
window.copyReadyLink=function(){const input=document.getElementById('readyInviteLink');navigator.clipboard.writeText(input.value).then(()=>toast('تم نسخ رابط الدعوة')).catch(()=>{input.select();toast('انسخي الرابط المحدد')})};
window.returnToStore=function(){document.getElementById('orderResult').hidden=true;showHome()};
window.makeInvite=async function(){
 const d=info();if(!d.formats.length){toast('اختاري الرابط أو الصورة أو كليهما');return}
 if(d.formats.includes('link')&&!d.date){toast('أضيفي تاريخ المناسبة لإظهار العد التنازلي');return}
 const button=document.querySelector('#editModal .editorbuttons .primary');if(button){button.disabled=true;button.textContent='جارٍ تجهيز الدعوة…'}
 try{
  const link=d.formats.includes('link')?createReadyLink(d):'';
  const image=d.formats.includes('image')?await renderFinalImage(d):'';
  const message=formatOrder(d,link);
  const phone=sessionStorage.getItem('ward-phone');
  if(phone){const key='ward-orders-'+phone,orders=JSON.parse(localStorage.getItem(key)||'[]');orders.unshift({id:Date.now().toString(36),title:d.title||'دعوة جديدة',created:new Date().toLocaleDateString('en-GB-u-ca-gregory-nu-latn'),status:'ready-unpaid',statusLabel:'جاهز — التحويل بعد الطلب',formats:d.formats,inviteUrl:link,data:d});localStorage.setItem(key,JSON.stringify(orders))}
  closeModal('editModal');showDelivery(d,link,image,message);
 }catch(error){console.error(error);toast('تعذر تجهيز الدعوة. حاولي مرة أخرى')}
 finally{if(button){button.disabled=false;button.textContent='أنشئي دعوتك واستخدميها الآن'}}
};
document.querySelectorAll('#editModal .editorbuttons .primary').forEach(b=>b.textContent='أنشئي دعوتك واستخدميها الآن');
})();