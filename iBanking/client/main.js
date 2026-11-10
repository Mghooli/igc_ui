const capabilities = {
  onboarding: {
    title:"Customer Onboarding & KYC", short:"Customer Onboarding", icon:"🪪",
    description:"Register customers, collect identity details and track KYC verification.",
    method:"POST", path:"/customers/onboarding", id:"ONB",
    fields:[
      ["customerType","Customer type","select",["INDIVIDUAL","BUSINESS"]],
      ["firstName","First name","text","Aarav"],
      ["lastName","Last name","text","Sharma"],
      ["dateOfBirth","Date of birth","date","1995-04-18"],
      ["email","Email","email","aarav.demo@example.com"],
      ["mobile","Mobile number","text","+919876543210"],
      ["pan","PAN (demo)","text","ABCDE1234F"],
      ["kycLevel","KYC level","select",["BASIC","STANDARD","ENHANCED"]]
    ],
    sample:{customerType:"INDIVIDUAL",firstName:"Aarav",lastName:"Sharma",dateOfBirth:"1995-04-18",email:"aarav.demo@example.com",mobile:"+919876543210",pan:"ABCDE1234F",kycLevel:"STANDARD"}
  },
  accounts: {
    title:"Accounts & Balance Inquiry",short:"Accounts & Balance",icon:"🏦",
    description:"Retrieve account details, currency and available/current balances.",
    method:"GET",path:"/accounts/balance",id:"ACC",
    fields:[
      ["customerId","Customer ID","text","CUS-100245"],
      ["accountId","Account ID","text","AC-0012345678"],
      ["accountType","Account type","select",["SAVINGS","CURRENT","SALARY"]],
      ["currency","Currency","select",["INR","USD","EUR","GBP"]]
    ],
    sample:{customerId:"CUS-100245",accountId:"AC-0012345678",accountType:"SAVINGS",currency:"INR"}
  },
  payments: {
    title:"Payments & Fund Transfers",short:"Payments & Transfers",icon:"💸",
    description:"Simulate domestic transfers with beneficiary, amount and idempotency.",
    method:"POST",path:"/payments/transfers",id:"PAY",
    fields:[
      ["sourceAccount","Source account","text","AC-0012345678"],
      ["beneficiaryAccount","Beneficiary account","text","AC-0098765432"],
      ["beneficiaryName","Beneficiary name","text","Priya Demo"],
      ["amount","Amount","number","2500.00"],
      ["currency","Currency","select",["INR","USD","EUR"]],
      ["paymentMode","Payment mode","select",["IMPS","NEFT","RTGS","INTERNAL"]],
      ["idempotencyKey","Idempotency key","text","IDEMP-DEMO-10001"]
    ],
    sample:{sourceAccount:"AC-0012345678",beneficiaryAccount:"AC-0098765432",beneficiaryName:"Priya Demo",amount:2500,currency:"INR",paymentMode:"IMPS",idempotencyKey:"IDEMP-DEMO-10001"}
  },
  cards: {
    title:"Cards & Card Controls",short:"Cards & Controls",icon:"💳",
    description:"Inspect a card profile and simulate freeze, unfreeze or limit changes.",
    method:"POST",path:"/cards/controls",id:"CRD",
    fields:[
      ["customerId","Customer ID","text","CUS-100245"],
      ["cardId","Card ID","text","CARD-DEMO-0001"],
      ["cardType","Card type","select",["DEBIT","CREDIT"]],
      ["action","Control action","select",["VIEW","FREEZE","UNFREEZE","SET_LIMIT"]],
      ["channel","Transaction channel","select",["POS","ECOMMERCE","ATM","ALL"]],
      ["dailyLimit","Daily limit","number","25000"]
    ],
    sample:{customerId:"CUS-100245",cardId:"CARD-DEMO-0001",cardType:"DEBIT",action:"VIEW",channel:"ALL",dailyLimit:25000}
  },
  loans: {
    title:"Loans & Loan Applications",short:"Loans & Applications",icon:"🏠",
    description:"Capture a loan application and simulate eligibility assessment.",
    method:"POST",path:"/loans/applications",id:"LON",
    fields:[
      ["customerId","Customer ID","text","CUS-100245"],
      ["loanType","Loan type","select",["PERSONAL","HOME","VEHICLE","EDUCATION"]],
      ["requestedAmount","Requested amount","number","500000"],
      ["tenureMonths","Tenure (months)","number","36"],
      ["monthlyIncome","Monthly income","number","75000"],
      ["employmentType","Employment type","select",["SALARIED","SELF_EMPLOYED"]],
      ["currency","Currency","select",["INR","USD"]]
    ],
    sample:{customerId:"CUS-100245",loanType:"PERSONAL",requestedAmount:500000,tenureMonths:36,monthlyIncome:75000,employmentType:"SALARIED",currency:"INR"}
  },
  transactions: {
    title:"Transactions & Statements",short:"Transactions & Statements",icon:"📄",
    description:"Query transaction history and generate statement metadata.",
    method:"GET",path:"/accounts/transactions",id:"TXN",
    fields:[
      ["customerId","Customer ID","text","CUS-100245"],
      ["accountId","Account ID","text","AC-0012345678"],
      ["fromDate","From date","date","2026-10-01"],
      ["toDate","To date","date","2026-10-20"],
      ["transactionType","Transaction type","select",["ALL","CREDIT","DEBIT"]],
      ["page","Page number","number","1"],
      ["pageSize","Page size","number","10"]
    ],
    sample:{customerId:"CUS-100245",accountId:"AC-0012345678",fromDate:"2026-10-01",toDate:"2026-10-20",transactionType:"ALL",page:1,pageSize:10}
  },
  deposits: {
    title:"Fixed Deposits",short:"Fixed Deposits",icon:"📈",
    description:"Simulate FD creation, maturity details and deposit inquiry.",
    method:"POST",path:"/deposits/fixed",id:"FD",
    fields:[
      ["customerId","Customer ID","text","CUS-100245"],
      ["accountId","Funding account","text","AC-0012345678"],
      ["action","Action","select",["CREATE","INQUIRY","MATURITY_DETAILS"]],
      ["principalAmount","Principal amount","number","100000"],
      ["tenureMonths","Tenure (months)","number","12"],
      ["interestPayout","Interest payout","select",["MATURITY","MONTHLY","QUARTERLY"]],
      ["autoRenew","Auto renew","select",["true","false"]]
    ],
    sample:{customerId:"CUS-100245",accountId:"AC-0012345678",action:"CREATE",principalAmount:100000,tenureMonths:12,interestPayout:"MATURITY",autoRenew:true}
  }
};

const routeMap = Object.fromEntries(Object.entries(capabilities).map(([key,c])=>[key,c.path]));
let selectedCap = "onboarding";
let history = [];
let lastResponse = null;
let toastTimer;

function esc(s) {
  return String(s).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function capCard(key) {
  const c=capabilities[key];
  return `<div class="cap-card" aria-label="${esc(c.title)}">
    <div class="cap-top"><span class="cap-icon">${c.icon}</span><span class="tag">${c.method}</span></div>
    <h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>
    <div class="cap-footer"><span class="mono">${esc(c.path)}</span><span>${esc(c.id)}</span></div>
    <div class="cap-card-actions"><button class="btn small primary" onclick="selectCap('${key}')">Open simulator</button><button class="btn small" onclick="openCapabilityDocs('${key}')">Documentation</button></div>
  </div>`;
}
function renderCaps() {
  document.getElementById("overviewCaps").innerHTML=Object.keys(capabilities).slice(0,6).map(capCard).join("")+
    `<button class="cap-card" onclick="go('capabilities')"><div class="cap-top"><span class="cap-icon">＋</span><span class="tag green">Catalog</span></div><h3>Explore all capabilities</h3><p>Open the full catalog of seven reusable banking domains.</p><div class="cap-footer"><span>7 domains available</span><span>View →</span></div></button>`;
  document.getElementById("allCaps").innerHTML=Object.keys(capabilities).map(capCard).join("");
  document.getElementById("simCapList").innerHTML=Object.entries(capabilities).map(([key,c])=>`
    <button class="nav-item ${key===selectedCap?'active':''}" style="color:${key===selectedCap?'white':'#58667d'};background:${key===selectedCap?'#253654':'transparent'}" onclick="selectCap('${key}')">
    <span class="nav-icon">${c.icon}</span><span>${esc(c.short)}</span></button>`).join("");
}
const docTabLabels = {overview:"Overview",request:"Request schema",response:"Response example",errors:"Errors & testing"};
let selectedDocTab = "overview";
let selectedDocCap = "onboarding";
function openCapabilityDocs(key) {
  if (capabilities[key]) selectedDocCap = key;
  selectedDocTab = "overview";
  go("documentation");
  renderDocumentation();
}
function renderDocCapabilityList() {
  const list = document.getElementById("docCapabilityList");
  if (!list) return;
  const q = (document.getElementById("docSearch")?.value || "").trim().toLowerCase();
  const entries = Object.entries(capabilities).filter(([key,c]) =>
    [key,c.title,c.short,c.description,c.path,...c.fields.map(f=>f[0])].join(" ").toLowerCase().includes(q));
  list.innerHTML = entries.map(([key,c]) => `<button class="doc-cap ${key===selectedDocCap?'active':''}" onclick="selectDocumentationCapability('${key}')"><span class="doc-cap-icon">${c.icon}</span><span><strong>${esc(c.short)}</strong><br><small class="hint">${esc(c.method)} · ${esc(c.path)}</small></span></button>`).join("") || '<div class="empty">No matching capabilities.</div>';
}
function selectDocumentationCapability(key) {
  if (!capabilities[key]) return;
  selectedDocCap = key;
  selectedDocTab = "overview";
  renderDocumentation();
}
function docExampleResponse(key, bank) {
  const c = capabilities[key];
  const base = {requestId:"REQ-DOC-10001",correlationId:"COR-DOC-10001",bankAdapter:bank,status:"SUCCESS"};
  if (key === "onboarding") Object.assign(base,{customerId:"CUS-DEMO-1001",onboardingStatus:"RECEIVED",kycStatus:"PENDING"});
  if (key === "accounts") Object.assign(base,{accountId:"AC-0012345678",currency:"INR",ledgerBalance:25000,availableBalance:23000});
  if (key === "payments") Object.assign(base,{transactionId:"TXN-DEMO-1001",transferStatus:"ACCEPTED",amount:2500,currency:"INR"});
  if (key === "cards") Object.assign(base,{cardId:"CARD-DEMO-0001",cardStatus:"ACTIVE",action:"VIEW"});
  if (key === "loans") Object.assign(base,{applicationId:"LOAN-DEMO-1001",applicationStatus:"SUBMITTED",requestedAmount:500000,currency:"INR"});
  if (key === "transactions") Object.assign(base,{accountId:"AC-0012345678",transactions:[{transactionId:"TXN-DEMO-1001",type:"DEBIT",amount:1500,currency:"INR",status:"COMPLETED"}],page:1,pageSize:10});
  if (key === "deposits") Object.assign(base,{depositId:"FD-DEMO-1001",depositStatus:"SUBMITTED",principalAmount:100000,currency:"INR",tenureMonths:12});
  return base;
}
function renderDocumentation() {
  const c = capabilities[selectedDocCap] || capabilities.onboarding;
  const bank = document.getElementById("docBank")?.value || "BANK_A";
  const bankLabels = {BANK_A:"Bank A",BANK_B:"Bank B",BANK_C:"Bank C"};
  document.getElementById("docTitle").textContent = c.title;
  document.getElementById("docPurpose").textContent = c.description;
  document.getElementById("docMethod").textContent = c.method;
  document.getElementById("docMethodMeta").textContent = c.method;
  document.getElementById("docPath").textContent = c.path;
  document.getElementById("docBankMeta").textContent = bankLabels[bank] || bank;
  document.querySelectorAll("[data-doc-tab]").forEach(b=>b.classList.toggle("active",b.dataset.docTab===selectedDocTab));
  renderDocCapabilityList();
  const pane = document.getElementById("docPane");
  if (selectedDocTab === "overview") {
    pane.innerHTML = `<h3>Purpose</h3><p>${esc(c.description)}</p><h3 style="margin-top:18px">Typical processing flow</h3><ol><li>Validate request structure and required business fields.</li><li>Authenticate the calling application and authorize access.</li><li>Apply business rules, correlation IDs and idempotency where applicable.</li><li>Route the request through the configured MuleSoft API and bank adapter.</li><li>Normalize the response and log operational metadata without exposing sensitive data.</li></ol><div class="notice" style="margin-top:16px"><b>Bank-specific note — ${esc(bankLabels[bank]||bank)}:</b> this UI currently uses shared mock contract examples. Replace the path, field mappings, authentication and error mappings with this adapter's verified API contract.</div><div class="doc-actions"><button class="btn primary" onclick="selectCap('${selectedDocCap}')">Open in API simulator</button><button class="btn" onclick="setDocTab('request')">View request schema</button></div>`;
  } else if (selectedDocTab === "request") {
    const rows = c.fields.map(f=>`<tr><td><code>${esc(f[0])}</code></td><td>${esc(f[1])}</td><td>${esc(Array.isArray(f[3])?"string (enum)":f[2])}</td><td>${f[3]!==undefined?`<code>${esc(Array.isArray(f[3])?f[3].join(", "):String(f[3]))}</code>`:"—"}</td></tr>`).join("");
    pane.innerHTML = `<p>Fields are derived from the current UI simulator form. Required/optional status is not declared by the mock model and must be confirmed in the real API specification.</p><div style="overflow:auto"><table class="doc-field-table"><thead><tr><th>FIELD</th><th>DESCRIPTION</th><th>TYPE</th><th>DEMO VALUE / OPTIONS</th></tr></thead><tbody>${rows}<tr><td><code>requestId</code></td><td>Unique request tracking identifier</td><td>string</td><td>Generated by the simulator</td></tr><tr><td><code>channel</code></td><td>Request origin</td><td>string</td><td>WEB</td></tr><tr><td><code>sourceSystem</code></td><td>Calling application identifier</td><td>string</td><td>BANKING-CAPABILITY-FACTORY</td></tr></tbody></table></div><h3 style="margin-top:18px">Sample request JSON</h3><pre id="docRequestJson"></pre><button class="btn small" onclick="copyDocText('docRequestJson')">Copy request JSON</button>`;
    const sample = {...c.sample,requestId:"REQ-DOC-10001",channel:"WEB",sourceSystem:"BANKING-CAPABILITY-FACTORY"};
    document.getElementById("docRequestJson").textContent = JSON.stringify(sample,null,2);
  } else if (selectedDocTab === "response") {
    pane.innerHTML = `<p>Illustrative success payload for the selected adapter. Exact fields and status values depend on the deployed MuleSoft API.</p><pre id="docResponseJson"></pre><div class="doc-actions"><button class="btn small" onclick="copyDocText('docResponseJson')">Copy response JSON</button><button class="btn small" onclick="setDocTab('errors')">View error scenarios</button></div>`;
    document.getElementById("docResponseJson").textContent = JSON.stringify(docExampleResponse(selectedDocCap,bank),null,2);
  } else {
    const errors = [["400","Bad Request","Request body, query parameters or field validation failed."],["401","Unauthorized","Missing or invalid credentials; verify the configured API policy."],["403","Forbidden","Caller is authenticated but is not permitted to access the resource."],["404","Not Found","Requested account, customer or resource was not found."],["409","Conflict","Duplicate or conflicting request; check idempotency and current state."],["429","Too Many Requests","Rate limit reached; follow the API retry policy."],["500","Internal Server Error","Unexpected processing failure; inspect correlation ID and server logs."],["502 / 504","Upstream error / timeout","Check bank adapter availability and timeout configuration."]];
    pane.innerHTML = `<h3>Common error scenarios</h3><div style="overflow:auto"><table class="doc-field-table"><thead><tr><th>HTTP</th><th>ERROR</th><th>HANDLING GUIDANCE</th></tr></thead><tbody>${errors.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><h3 style="margin-top:18px">Testing checklist</h3><ul><li>Test a valid request in mock mode first.</li><li>Test missing fields, invalid values and unknown resource IDs.</li><li>Verify authentication and authorization against the deployed policy.</li><li>Confirm duplicate payment protection before testing live transfers.</li><li>Verify correlation IDs, logging, masking and timeout behavior.</li><li>Never use real customer data or production credentials in the demo UI.</li></ul><div class="notice"><b>Note:</b> HTTP status mappings above are general guidance, not confirmed bank-specific behavior.</div>`;
  }
}
function setDocTab(tab) { selectedDocTab = tab; renderDocumentation(); }
function copyDocText(id) {
  const value = document.getElementById(id)?.textContent || "";
  if (!value) return;
  navigator.clipboard?.writeText(value).then(()=>toast("Documentation copied")).catch(()=>toast("Clipboard unavailable — select and copy the text manually."));
}
function go(page) {
  document.querySelectorAll(".page").forEach(el=>el.classList.remove("active"));
  document.getElementById("page-"+page).classList.add("active");
  document.querySelectorAll(".nav-item[data-page]").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
  const labels={overview:"Overview",capabilities:"Capabilities",simulator:"API Simulator",activity:"Test Activity",endpoints:"MuleSoft Endpoints",architecture:"Architecture",documentation:"Documentation"};
  document.getElementById("crumb").textContent=labels[page]||page;
  if(page==="simulator") renderSimHeader();
  if(page==="activity") renderActivity();
  if(page==="endpoints") renderMappings();
  if(page==="documentation") renderDocumentation();
  window.scrollTo({top:0,behavior:"smooth"});
}
function selectCap(key) {
  if(!capabilities[key])return;
  selectedCap=key;
  go("simulator");
  renderCaps();
  loadSample();
  renderSimHeader();
  updateRouteLabel();
}
function renderSimHeader() {
  const c=capabilities[selectedCap];
  document.getElementById("simTitle").textContent=c.title;
  document.getElementById("simSubtitle").textContent=c.description;
}
function makeRequest(c) {
  const payload=JSON.parse(JSON.stringify(c.sample));
  payload.requestId="REQ-"+Date.now().toString(36).toUpperCase();
  payload.channel="WEB";
  payload.sourceSystem="BANKING-CAPABILITY-FACTORY";
  return payload;
}
function loadSample() {
  document.getElementById("requestEditor").value=JSON.stringify(makeRequest(capabilities[selectedCap]),null,2);
  updateRouteLabel();
}
function resetRequest() {
  loadSample();
  document.getElementById("responseEmpty").classList.remove("hidden");
  document.getElementById("responseContent").classList.add("hidden");
  toast("Request reset to sample payload");
}
function formatRequest() {
  try {document.getElementById("requestEditor").value=JSON.stringify(JSON.parse(document.getElementById("requestEditor").value),null,2);toast("JSON formatted");}
  catch(e){toast("Invalid JSON: "+e.message);}
}
function getSettings() {
  try{return JSON.parse(localStorage.getItem("bankingFactorySettings")||"{}");}catch(e){return {};}
}
function saveEndpoints() {
  const settings={
    baseUrl:document.getElementById("baseUrl").value.trim().replace(/\/+$/,""),
    authType:document.getElementById("authType").value,
    authToken:document.getElementById("authToken").value.trim(),
    clientId:document.getElementById("clientId").value.trim(),
    clientSecret:document.getElementById("clientSecret").value.trim(),
    timeoutMs:Math.max(1000,Math.min(120000,Number(document.getElementById("timeoutMs").value)||15000)),
    customHeader:document.getElementById("customHeader").value.trim(),
    customHeaderValue:document.getElementById("customHeaderValue").value.trim()
  };
  try {
    localStorage.setItem("bankingFactorySettings",JSON.stringify(settings));
    document.getElementById("endpointMessage").textContent="Settings saved in this browser. Do not use this storage for production secrets.";
    updateStats();updateRouteLabel();toast("Endpoint configuration saved");
  } catch(e) {document.getElementById("endpointMessage").textContent="Could not save settings in browser storage.";}
}
function loadEndpoints() {
  const s=getSettings();
  for(const [id,key] of [["baseUrl","baseUrl"],["authType","authType"],["authToken","authToken"],["clientId","clientId"],["clientSecret","clientSecret"],["timeoutMs","timeoutMs"],["customHeader","customHeader"],["customHeaderValue","customHeaderValue"]]) {
    const el=document.getElementById(id);if(el&&s[key]!==undefined)el.value=s[key];
  }
  updateStats();syncMode();renderMappings();
}
function clearEndpoints() {
  if(!confirm("Clear the saved MuleSoft endpoint configuration from this browser?"))return;
  localStorage.removeItem("bankingFactorySettings");
  ["baseUrl","authToken","clientId","clientSecret","customHeader","customHeaderValue"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("authType").value="none";
  document.getElementById("timeoutMs").value="15000";
  document.getElementById("endpointMessage").textContent="Endpoint configuration cleared.";
  updateStats();updateRouteLabel();toast("Settings cleared");
}
function updateStats() {
  document.getElementById("statTests").textContent=history.length;
  document.getElementById("statSuccess").textContent=history.filter(x=>x.ok).length;
  const s=getSettings();
  document.getElementById("statEndpoints").textContent=s.baseUrl?1:0;
  const connected=!!s.baseUrl;
  document.getElementById("muleStatusText").textContent=connected?s.baseUrl:"Not configured";
  document.getElementById("muleStatus").textContent=connected?"CONFIGURED":"SETUP";
  document.getElementById("muleStatus").className="status-text "+(connected?"ok":"");
  document.getElementById("sideMode").textContent=connected?"Endpoint configured":"Mock environment active";
}
function updateRouteLabel() {
  const c=capabilities[selectedCap],s=getSettings();
  const live=document.getElementById("executionMode").value==="live";
  document.getElementById("routeDot").className="dot "+(live&&s.baseUrl?"ok":"");
  document.getElementById("routeLabel").textContent=live?(s.baseUrl?s.baseUrl+c.path:"Live mode selected — configure base URL first"):"Mock route · "+c.method+" "+c.path;
}
function syncMode() {
  const live=document.getElementById("executionMode").value==="live";
  const pill=document.getElementById("modePill");
  pill.textContent=live?"● LIVE API MODE":"● MOCK MODE";
  pill.style.background=live?"#fff5e5":"#effaf4";
  pill.style.color=live?"#a66a0a":"#137950";
  pill.style.borderColor=live?"#f3ddb4":"#cdebdc";
  updateRouteLabel();
}
function renderMappings() {
  document.getElementById("routeMappings").innerHTML=Object.entries(capabilities).map(([key,c])=>`
    <div class="endpoint-card"><div class="endpoint-card-head"><strong>${c.icon} ${esc(c.title)}</strong><span class="tag">${c.method}</span></div>
    <div class="mono">${esc(c.path)}</div><div style="margin-top:9px"><button class="btn small" onclick="selectCap('${key}')">Test this route →</button></div></div>`).join("");
}
function toast(message) {
  const el=document.getElementById("toast");
  el.textContent=message;el.style.display="block";
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.style.display="none",3200);
}
function sampleResponse(status,body,bank) {
  const now=new Date().toISOString();
  const c=capabilities[selectedCap];
  const requestId=body.requestId||("REQ-"+Math.random().toString(36).slice(2,10).toUpperCase());
  const envelope={timestamp:now,requestId:requestId,correlationId:"COR-"+Math.random().toString(36).slice(2,10).toUpperCase(),bank:bank,httpStatus:status};
  if(status>=400) {
    const codes={400:["VALIDATION_ERROR","One or more request fields are invalid."],401:["UNAUTHORIZED","Authentication is required or invalid."],404:["RESOURCE_NOT_FOUND","The requested banking resource was not found."],409:["DUPLICATE_OR_CONFLICT","The request conflicts with an existing resource."],500:["INTERNAL_SERVER_ERROR","An unexpected server error occurred."],504:["GATEWAY_TIMEOUT","The downstream banking system did not respond in time."]};
    const err=codes[status]||codes[500];
    return {meta:envelope,success:false,error:{code:err[0],message:err[1],details:status===400?[{field:"exampleField",issue:"Required or invalid value"}]:[],retryable:[500,504].includes(status)}};
  }
  let data={};
  if(selectedCap==="onboarding") data={customerId:"CUS-"+Math.floor(100000+Math.random()*899999),status:"PENDING_KYC",kyc:{level:body.kycLevel||"STANDARD",verificationStatus:"IN_REVIEW"},createdAt:now};
  if(selectedCap==="accounts") data={customerId:body.customerId,accountId:body.accountId,accountType:body.accountType||"SAVINGS",currency:body.currency||"INR",status:"ACTIVE",balance:{available:48250.75,current:50250.75,hold:2000},asOf:now};
  if(selectedCap==="payments") data={paymentId:"PAY-"+Math.random().toString(36).slice(2,10).toUpperCase(),status:"ACCEPTED",amount:Number(body.amount||0),currency:body.currency||"INR",paymentMode:body.paymentMode||"IMPS",debitAccount:body.sourceAccount,creditAccount:body.beneficiaryAccount,fees:0,acceptedAt:now,idempotencyKey:body.idempotencyKey};
  if(selectedCap==="cards") data={cardId:body.cardId,status:body.action==="FREEZE"?"FROZEN":body.action==="UNFREEZE"?"ACTIVE":"ACTIVE",action:body.action||"VIEW",cardType:body.cardType||"DEBIT",lastFour:"4242",dailyLimit:Number(body.dailyLimit||25000),updatedAt:now};
  if(selectedCap==="loans") data={applicationId:"LN-"+Math.random().toString(36).slice(2,10).toUpperCase(),status:"RECEIVED",loanType:body.loanType,requestedAmount:Number(body.requestedAmount||0),currency:body.currency||"INR",tenureMonths:Number(body.tenureMonths||0),assessment:{status:"PRELIMINARY_REVIEW",estimatedApr:null,note:"Final eligibility and pricing require bank underwriting."},submittedAt:now};
  if(selectedCap==="transactions") data={accountId:body.accountId,period:{from:body.fromDate,to:body.toDate},transactions:[{transactionId:"TXN-DEMO-1001",date:now.slice(0,10),description:"Demo salary credit",type:"CREDIT",amount:75000,currency:"INR",status:"POSTED"},{transactionId:"TXN-DEMO-1002",date:now.slice(0,10),description:"Demo utility payment",type:"DEBIT",amount:1250,currency:"INR",status:"POSTED"}],pagination:{page:Number(body.page||1),pageSize:Number(body.pageSize||10),totalRecords:2},dataType:"SYNTHETIC_DEMO"};
  if(selectedCap==="deposits") data={depositId:"FD-"+Math.random().toString(36).slice(2,10).toUpperCase(),customerId:body.customerId,status:"BOOKED",principalAmount:Number(body.principalAmount||0),currency:"INR",tenureMonths:Number(body.tenureMonths||0),interestPayout:body.interestPayout||"MATURITY",indicativeAnnualRate:6.75,maturityDate:new Date(Date.now()+Number(body.tenureMonths||12)*30*86400000).toISOString().slice(0,10),maturityAmountEstimate:Math.round(Number(body.principalAmount||0)*Math.pow(1+0.0675/12,Number(body.tenureMonths||12))*100)/100,note:"Illustrative demo rate and estimate; not a bank quote."};
  return {meta:envelope,success:true,data};
}
function scenarioStatus(s) {return ({success:200,validation:400,unauthorized:401,duplicate:409,notfound:404,timeout:504,server:500})[s]||200;}
function validatePayload(body) {
  if(!body||typeof body!=="object"||Array.isArray(body))return "Request body must be a JSON object.";
  const required={onboarding:["firstName","lastName","email","mobile"],accounts:["accountId"],payments:["sourceAccount","beneficiaryAccount","amount","idempotencyKey"],cards:["cardId","action"],loans:["customerId","loanType","requestedAmount"],transactions:["accountId","fromDate","toDate"],deposits:["customerId","action","principalAmount"]}[selectedCap];
  for(const key of required)if(body[key]===undefined||body[key]===null||body[key]==="")return "Missing required field: "+key;
  if(["amount","requestedAmount","principalAmount"].some(k=>body[k]!==undefined&&Number(body[k])<=0))return "Amount must be greater than zero.";
  if(body.fromDate&&body.toDate&&body.fromDate>body.toDate)return "fromDate cannot be later than toDate.";
  return null;
}
function authHeaders(settings) {
  const headers={"Content-Type":"application/json","Accept":"application/json"};
  if(settings.authType==="bearer"&&settings.authToken)headers.Authorization="Bearer "+settings.authToken;
  if(settings.authType==="clientid") {
    if(settings.clientId)headers["client_id"]=settings.clientId;
    if(settings.clientSecret)headers["client_secret"]=settings.clientSecret;
  }
  if(settings.customHeader)headers[settings.customHeader]=settings.customHeaderValue||"";
  return headers;
}
async function runRequest() {
  let body;
  try {body=JSON.parse(document.getElementById("requestEditor").value);}
  catch(e){toast("Invalid JSON: "+e.message);return;}
  const validation=validatePayload(body);
  if(validation&&document.getElementById("scenario").value==="success") {
    toast(validation);showResponse(400,{success:false,error:{code:"CLIENT_VALIDATION_ERROR",message:validation}},0,"LOCAL");return;
  }
  const mode=document.getElementById("executionMode").value;
  const bank=document.getElementById("bank").value;
  const scenario=document.getElementById("scenario").value;
  const btn=document.getElementById("runBtn");
  btn.disabled=true;btn.textContent="⏳ Running...";
  const started=performance.now();
  try {
    let status,result,source;
    if(mode==="live") {
      const settings=getSettings();
      if(!settings.baseUrl)throw new Error("Configure your MuleSoft API base URL before using live mode.");
      if(scenario!=="success")throw new Error("Live mode sends requests to the configured endpoint. Select the success scenario; use mock mode to test simulated error scenarios.");
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),settings.timeoutMs||15000);
      try {
        const c=capabilities[selectedCap];
        const method=c.method;
        let url=settings.baseUrl+c.path;
        let options={method,headers:authHeaders(settings),signal:controller.signal};
        if(method==="GET") {
          const params=new URLSearchParams();
          Object.entries(body).forEach(([k,v])=>{if(v!==undefined&&v!==null&&typeof v!=="object")params.set(k,String(v));});
          if(params.toString())url+="?"+params.toString();
        } else options.body=JSON.stringify(body);
        const res=await fetch(url,options);
        status=res.status;
        const textBody=await res.text();
        try{result=JSON.parse(textBody);}catch(e){result={rawResponse:textBody};}
        source="MULESOFT";
      } finally {clearTimeout(timeout);}
    } else {
      await new Promise(r=>setTimeout(r,180+Math.random()*260));
      status=scenarioStatus(scenario);
      result=sampleResponse(status,body,bank);
      source="MOCK";
    }
    const elapsed=Math.round(performance.now()-started);
    showResponse(status,result,elapsed,source);
    addHistory({time:new Date().toLocaleTimeString(),cap:capabilities[selectedCap].short,bank,mode:source,status,ok:status>=200&&status<300,latency:elapsed});
  } catch(e) {
    const elapsed=Math.round(performance.now()-started);
    const isTimeout=e.name==="AbortError";
    const status=isTimeout?504:0;
    const result={success:false,error:{code:isTimeout?"REQUEST_TIMEOUT":"CONNECTION_ERROR",message:e.message||"Could not connect to the configured endpoint.",details:"Check the base URL, API availability, browser CORS policy and authentication configuration."}};
    showResponse(status,result,elapsed,mode==="live"?"MULESOFT":"MOCK");
    addHistory({time:new Date().toLocaleTimeString(),cap:capabilities[selectedCap].short,bank,mode:mode==="live"?"MULESOFT":"MOCK",status,ok:false,latency:elapsed});
  } finally {
    btn.disabled=false;btn.textContent="▶ Run request";
  }
}
function showResponse(status,result,elapsed,source) {
  lastResponse=result;
  document.getElementById("responseEmpty").classList.add("hidden");
  document.getElementById("responseContent").classList.remove("hidden");
  const s=document.getElementById("responseStatus");
  s.textContent="● "+(status||"NETWORK")+" "+(status===200?"OK":status===201?"CREATED":status===400?"BAD REQUEST":status===401?"UNAUTHORIZED":status===404?"NOT FOUND":status===409?"CONFLICT":status===504?"TIMEOUT":status===500?"SERVER ERROR":status===0?"CONNECTION ERROR":"RESPONSE");
  s.className="response-status "+(status>=400||status===0?"error":status===200||status===201?"":"warn");
  document.getElementById("responseTime").textContent="Latency: "+elapsed+" ms";
  document.getElementById("responseRequestId").textContent="Source: "+source;
  document.getElementById("responseEditor").value=JSON.stringify(result,null,2);
  document.getElementById("responseNote").textContent=source==="MOCK"?"Simulated response — no banking system was contacted.":"Response received from the configured endpoint. Verify the payload and server-side audit logs.";
}
function addHistory(item) {
  history.unshift(item);history=history.slice(0,200);
  updateStats();renderRecent();renderActivity();
}
function renderRecent() {
  const items=history.slice(0,4);
  document.getElementById("recentActivity").innerHTML=items.length?items.map(x=>`
    <div class="activity-row"><div class="activity-icon">${x.ok?"✓":"!"}</div><div class="activity-info"><strong>${esc(x.cap)}</strong><small>${esc(x.time)} · ${esc(x.mode)} · HTTP ${x.status}</small></div><span class="status-text ${x.ok?'ok':'fail'}">${x.ok?"SUCCESS":"FAILED"}</span></div>`).join(""):`<div class="empty">No test executions yet. Run a scenario in the API simulator.</div>`;
}
function renderActivity() {
  const body=document.getElementById("activityTable");
  if(!history.length){body.innerHTML='<tr><td colspan="7" class="empty">No executions yet.</td></tr>';return;}
  body.innerHTML=history.map(x=>`<tr><td>${esc(x.time)}</td><td>${esc(x.cap)}</td><td>${esc(x.bank)}</td><td>${esc(x.mode)}</td><td>${esc(x.status)}</td><td><span class="status-text ${x.ok?'ok':'fail'}">${x.ok?'SUCCESS':'FAILED'}</span></td><td>${x.latency} ms</td></tr>`).join("");
}
function clearActivity() {
  if(!confirm("Clear all test activity from this browser session?"))return;
  history=[];updateStats();renderActivity();renderRecent();toast("Activity cleared");
}
function copyRequest() {
  navigator.clipboard?.writeText(document.getElementById("requestEditor").value).then(()=>toast("Request JSON copied")).catch(()=>toast("Clipboard unavailable — select and copy the JSON manually."));
}
function copyResponse() {
  const text=document.getElementById("responseEditor").value;
  if(!text){toast("No response to copy");return;}
  navigator.clipboard?.writeText(text).then(()=>toast("Response JSON copied")).catch(()=>toast("Clipboard unavailable — select and copy the JSON manually."));
}
async function testEndpoint() {
  const s=getSettings();
  if(!s.baseUrl){document.getElementById("endpointMessage").textContent="Add and save a MuleSoft base URL first.";return;}
  document.getElementById("endpointMessage").textContent="Testing endpoint with an OPTIONS preflight request…";
  try {
    const controller=new AbortController(),t=setTimeout(()=>controller.abort(),Math.min(s.timeoutMs||15000,10000));
    let response;
    try {response=await fetch(s.baseUrl,{method:"OPTIONS",headers:authHeaders(s),signal:controller.signal});}
    finally {clearTimeout(t);}
    document.getElementById("endpointMessage").textContent="Endpoint responded with HTTP "+response.status+". This does not guarantee that the banking routes or authentication work.";
  } catch(e) {
    document.getElementById("endpointMessage").textContent="Connectivity test failed or was blocked: "+e.message+". Check URL, CORS, gateway availability and authentication. Some APIs do not support OPTIONS.";
  }
}
document.querySelectorAll(".nav-item[data-page]").forEach(el=>el.addEventListener("click",()=>go(el.dataset.page)));
document.getElementById("bank").addEventListener("change",updateRouteLabel);
document.getElementById("scenario").addEventListener("change",updateRouteLabel);
document.getElementById("executionMode").addEventListener("change",syncMode);
document.getElementById("docBank").addEventListener("change",renderDocumentation);
document.getElementById("docSearch").addEventListener("input",renderDocCapabilityList);
document.querySelectorAll("[data-doc-tab]").forEach(b=>b.addEventListener("click",()=>setDocTab(b.dataset.docTab)));
renderCaps();
loadSample();
loadEndpoints();
renderRecent();
renderActivity();
renderMappings();
renderSimHeader();
renderDocumentation();
updateStats();