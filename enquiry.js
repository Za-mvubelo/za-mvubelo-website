/* Route direct enquiries to ZA, and general/agency enquiries to Contractors Artists.
   This page only opens the visitor's mail application. Nothing is sent or stored here. */
(()=>{'use strict';
const form=document.getElementById('enquiryForm');if(!form)return;
const feedback=document.getElementById('formFeedback');
const emailRecipients={direct:'nmvubelonl@gmail.com',agency:'info@contractors.org.za'};
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const d=new FormData(form);
  const name=String(d.get('name')||'').trim();
  const email=String(d.get('email')||'').trim();
  const topic=String(d.get('topic')||'General enquiry').trim();
  const details=String(d.get('details')||'').trim();
  const kind=d.get('recipient')==='agency'?'agency':'direct';
  const to=emailRecipients[kind];
  if(!name||!email||!details)return;
  const subject='ZA Mvubelo | '+(kind==='direct'?'Direct':'General')+' · '+topic+' · '+name;
  const greeting=kind==='direct'?'Hello ZA,':'Hello Contractors Artists,';
  const body=[greeting,'','I would like to enquire about ZA Mvubelo.','','Enquiry type: '+topic,'Name: '+name,'Reply email: '+email,'','Project details:',details,'','Kind regards,',name].join('\n');
  feedback.textContent='Your email app should open a message to '+to+'. Please press Send there to complete the enquiry.';
  window.location.href='mailto:'+to+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
})();