(() => {
  const $ = (id) => document.getElementById(id);
  const form = $("ebpForm"), formView = $("formView"), reviewView = $("reviewView");
  const reviewFields = $("reviewFields"), scanSummary = $("scanSummary");
  const warningBlock = $("warningBlock"), highRiskBlock = $("highRiskBlock");
  const warningAck = $("warningAck"), copyBtn = $("copyBtn"), copyStatus = $("copyStatus");

  const fields = [
    ["issue","Practical problem / issue"],
    ["target","Target population / setting"],
    ["known","What is currently known"],
    ["currentMeasures","Current measures"],
    ["ideas","Measures being considered"],
    ["outcome","Intended outcomes"],
    ["data","Available data"],
    ["constraints","Staffing, time, budget, and other constraints"],
    ["other","Other operational context"]
  ];

  const highRiskRules = [
    {label:"email address", re:/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi},
    {label:"phone-number-like string", re:/(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?){2,4}\d{3,4}/g},
    {label:"postal/ZIP-code-like string", re:/\b(?:\d{5}(?:-\d{4})?|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}|\d{3}[-ー]\d{4})\b/gi},
    {label:"street-address-like string", re:/\b\d{1,5}\s+[A-Za-z0-9.'-]+(?:\s+[A-Za-z0-9.'-]+){0,4}\s+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Boulevard|Blvd|Court|Ct|Way)\b/gi},
    {label:"detailed Japanese address-like expression", re:/(?:都|道|府|県).{0,20}(?:市|区|町|村).{0,30}\d{1,4}(?:番地?|丁目|[-ー]\d)/g}
  ];

  const warningKeywords = [
    "full name","real name","address","phone number","email address","date of birth","DOB",
    "suspect","offender","victim","witness","arrest","detention","warrant","case number",
    "active investigation","ongoing investigation","investigation information","investigative method",
    "surveillance","covert","undercover","intelligence","confidential","classified","restricted",
    "non-public","unpublished","internal document","secret","operational method","reference number",
    "被疑者","容疑者","被害者","参考人","捜査中","捜査情報","捜査手法","未公表","部外秘","秘匿","秘密"
  ];

  function getData(){
    const o={};
    for(const [id] of fields) o[id]=$(id).value.trim();
    return o;
  }

  function scanText(text){
    const high=[],warn=[];
    highRiskRules.forEach(rule=>{
      rule.re.lastIndex=0;
      const m=[...text.matchAll(rule.re)];
      if(m.length) high.push(`${rule.label} (${m.length} possible match${m.length>1?"es":""})`);
    });
    const lower=text.toLowerCase();
    warningKeywords.forEach(k=>{
      if(lower.includes(k.toLowerCase())) warn.push(`Check term: “${k}”`);
    });
    return {high,warn};
  }

  function esc(s){
    return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }

  function renderReview(data){
    let totalHigh=0,totalWarn=0;
    reviewFields.innerHTML="";
    for(const [id,label] of fields){
      const value=data[id]||"Not entered";
      const r=scanText(data[id]||"");
      totalHigh+=r.high.length;
      totalWarn+=r.warn.length;
      const cls=r.high.length?"flag-high":r.warn.length?"flag-warn":"";
      const badge=r.high.length
        ?'<span class="badge high">Change needed</span>'
        :r.warn.length
          ?'<span class="badge warn">Check</span>'
          :'<span class="badge ok">No flag</span>';
      const findings=[...r.high,...r.warn];
      reviewFields.insertAdjacentHTML("beforeend",
        `<article class="review-item ${cls}">
          <div class="review-label"><span>${esc(label)}</span>${badge}</div>
          <p class="review-text">${esc(value)}</p>
          ${findings.length?`<ul class="findings">${findings.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
        </article>`);
    }

    scanSummary.innerHTML=`
      <div class="scan-chip ${totalHigh?"block":"ok"}">
        <strong>${totalHigh?"Possible direct identifiers found":"No obvious direct identifiers found"}</strong>
        <span>Email, phone, postal code, street-address patterns, etc.</span>
      </div>
      <div class="scan-chip ${totalWarn?"warn":"ok"}">
        <strong>${totalWarn?"Sensitive terms require review":"No sensitive-term flag"}</strong>
        <span>Investigation, operational, non-public, or confidential terms</span>
      </div>
      <div class="scan-chip warn">
        <strong>You remain responsible for the final check</strong>
        <span>The automated scan cannot detect every sensitive detail.</span>
      </div>`;

    highRiskBlock.classList.toggle("hidden",totalHigh===0);
    warningBlock.classList.toggle("hidden",totalWarn===0||totalHigh>0);
    warningAck.checked=false;
    copyBtn.disabled=totalHigh>0||totalWarn>0;
  }

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!$("issue").value.trim()){
      $("issue").setCustomValidity("Please describe the practical problem or issue.");
      $("issue").reportValidity();
      $("issue").setCustomValidity("");
      $("issue").focus();
      return;
    }
    renderReview(getData());
    formView.classList.add("hidden");
    reviewView.classList.remove("hidden");
    copyStatus.textContent="";
    window.scrollTo({top:reviewView.offsetTop-16,behavior:"smooth"});
  });

  warningAck.addEventListener("change",()=>{
    if(!highRiskBlock.classList.contains("hidden")){
      copyBtn.disabled=true;
      return;
    }
    copyBtn.disabled=!warningAck.checked;
  });

  $("backBtn").addEventListener("click",()=>{
    reviewView.classList.add("hidden");
    formView.classList.remove("hidden");
    copyStatus.textContent="";
    window.scrollTo({top:formView.offsetTop-16,behavior:"smooth"});
  });

  $("clearBtn").addEventListener("click",()=>{
    if(confirm("Clear all entered information?")){
      form.reset();
      $("issue").focus();
    }
  });

  copyBtn.addEventListener("click",async()=>{
    const data=getData(), whole=Object.values(data).join("\n"), check=scanText(whole);
    if(check.high.length){
      copyStatus.textContent="The prompt cannot be copied because possible direct identifiers were detected. Please revise the input.";
      return;
    }
    if(check.warn.length&&!warningAck.checked){
      copyStatus.textContent="Review the warning and tick the confirmation box before copying.";
      return;
    }
    const prompt=window.buildMasterPrompt(data);
    try{
      await navigator.clipboard.writeText(prompt);
      copyStatus.textContent="Copied. Paste the prompt into a new chat in your approved AI service.";
    }catch(err){
      const ta=document.createElement("textarea");
      ta.value=prompt;
      ta.setAttribute("readonly","");
      ta.style.position="absolute";
      ta.style.left="-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok=document.execCommand("copy");
      document.body.removeChild(ta);
      copyStatus.textContent=ok
        ?"Copied. Paste the prompt into a new chat in your approved AI service."
        :"Automatic copying failed. Check your browser permissions and try again.";
    }
  });
})();