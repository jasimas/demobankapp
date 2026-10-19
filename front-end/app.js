const app=document.getElementById("app"), topActions=document.getElementById("top-actions");
const state={
 page:"login", user:null, from:null, beneficiary:null, amount:"", fee:"Sender", purpose:"Bidding Fee",
 beneficiaries:JSON.parse(localStorage.getItem("jasima-beneficiaries")||"null")||[
  {name:"Hareesh Ponna",nick:"Hareesh",account:"AE6602600015784329201",bank:"EMIRATES NBD BANK PJSC",country:"UNITED ARAB EMIRATES",status:"ACTIVE"},
  {name:"GPSSA TWO THREE",nick:"GPSSA",account:"AE958510000000000017472",bank:"GPSSA Pension Contribution And Disbursements",country:"UNITED ARAB EMIRATES",status:"ACTIVE"},
  {name:"Hasneet Singh Nehra",nick:"Hasneet",account:"019100508652",bank:"Mashreq Bank",country:"UNITED ARAB EMIRATES",status:"ACTIVE"}
 ]};

function saveBen(){localStorage.setItem("jasima-beneficiaries",JSON.stringify(state.beneficiaries))}
function header(){topActions.innerHTML=state.user?`<span>${state.user}</span><button class="btn" onclick="logout()">Sign out</button>`:""}
function shell(content){header();app.innerHTML=content}
function logout(){state.user=null;state.page="login";render()}
function login(){
 const u=document.getElementById("username").value,p=document.getElementById("password").value;
 if(!u||!p){alert("Enter username and password");return}
 state.user=u;state.page="dashboard";render()
}
function sidebar(active){return `<aside class="sidebar">
${["dashboard:▦:Overview","accounts:▤:Accounts","loans:♙:Loans","wealth:⌁:Wealth","deposits:▣:Deposits","pay:↔:Pay & transfer","trade:◈:Trade finance","vas:☆:Value added services","other:⚙:Other services","queue:◴:Transaction queue","care:▢:Customer Care"].map(x=>{let [id,ic,t]=x.split(":");return `<div class="nav-item ${active===id?"active":""}" onclick="${id==='dashboard'?"go('dashboard')":id==='pay'?"go('pay')":""}">${ic}<span>${t}</span></div>`}).join("")}
</aside>`}
function dashboard(){
 shell(`<div class="layout">${sidebar("dashboard")}<section class="content">
<div class="hero"><div>Welcome</div><h1>${state.user||"Jasima User"}</h1><p>Last Sign in: 10 Aug 2026, 11:41 PM GMT +0400</p></div>
<div class="dashboard"><div class="cards">
<div class="panel"><h2>3 Accounts</h2><div class="amount">AED 2,744.25</div><small>Available Balance</small>
<div class="account-row"><span>🇦🇪 Company Account</span><b>AED 2,458.13</b></div><div class="account-row"><span>🇦🇪 Investment Account</span><b>AED 203.11</b></div></div>
<div class="panel"><h2>Useful links</h2>${["Customer Care","Track transfers","Statements","Cheque book request","Letter request","Cardless cash","KYC dashboard"].map(x=>`<div class="account-row">${x}<span>›</span></div>`).join("")}</div>
</div><h2 class="section-title">Pay & transfer</h2><div class="quick-grid">
<div class="service" onclick="go('pay')"><h3>💸 Send money</h3><p>Transfer money to a beneficiary</p></div>
<div class="service"><h3>▣ Collect money</h3><p>Collect payments</p></div>
<div class="service"><h3>▤ Bulk payments</h3><p>Make bulk payments</p></div>
</div></div></section></div>`)
}
function pay(){
 shell(`<div class="layout">${sidebar("pay")}<section class="content"><div class="hero"><h1>Pay & transfer</h1></div><div class="dashboard">
<h2 class="section-title">Money transfers</h2><div class="quick-grid">
<div class="service" onclick="startTransfer()"><h3>💸 Send money</h3><p>Send money to a beneficiary</p></div>
<div class="service"><h3>▣ Collect money</h3><p>Collect money</p></div><div class="service"><h3>▤ Bulk payments</h3><p>Bulk payments</p></div>
</div><h2 class="section-title">Manage your transfers</h2><div class="quick-grid">
<div class="service" onclick="manageBen()"><h3>📋 Track & manage</h3><p>Track every transfer you make</p></div>
<div class="service" onclick="manageBen()"><h3>👤 Manage beneficiaries</h3><p>Add or modify your beneficiaries</p></div>
<div class="service"><h3>⚙ Account settings</h3><p>Configure default accounts</p></div></div></div></section></div>`)
}
function startTransfer(){state.page="selectAccount";render()}
function transferLayout(main,active="start"){return `<div class="transfer-page"><aside class="steps">
<div class="step ${active==="start"?"active":""}">Start your transfer</div>
<div class="step ${active==="details"?"active":""}">Set transfer details</div>
<div class="step ${active==="review"?"active":""}">Review</div>
<div class="step ${active==="confirm"?"active":""}">Confirmation</div></aside><section class="transfer-content">${main}</section></div>`}
function selectAccount(){
 shell(transferLayout(`<h1>Select account</h1><div class="box"><h3>Transferring from</h3><div class="beneficiary-list">
${["Company NB AED test2|AED 2,458.13|019101245486","Investment Account|AED 203.11|019000089963","Hasneet Sanity Account|AED 2.64|019101406514"].map((x,i)=>{let[a,b,c]=x.split("|");return `<div class="beneficiary" onclick="chooseAccount('${a}','${b}','${c}')"><span><i class="flag"></i><b>${a}</b><br><small>${c}</small></span><strong>${b}</strong></div>`}).join("")}</div></div>`))
}
function chooseAccount(name,balance,number){state.from={name,balance,number};state.page="chooseBen";render()}
function chooseBen(){
 shell(transferLayout(`<h1>Start your transfer</h1><h3>Transferring from: ${state.from.name} - ${state.from.balance}</h3><button class="btn primary" onclick="addBen()">Add new beneficiary</button>
<input class="search" style="margin:20px 0" placeholder="Search beneficiary by name, nick name, bank name or bank country" oninput="filterBen(this.value)">
<div id="ben-list" class="beneficiary-list">${benRows(state.beneficiaries)}</div>`))
}
function benRows(arr){return arr.map((b,i)=>`<div class="beneficiary" onclick="chooseBen(${i})"><span><i class="flag"></i><b>${b.name}</b><br><small>${b.bank} · ${b.country}</small></span><span>${b.status}</span></div>`).join("")}
function filterBen(q){document.getElementById("ben-list").innerHTML=benRows(state.beneficiaries.filter(b=>(b.name+b.bank+b.country).toLowerCase().includes(q.toLowerCase())))}
function chooseBen(i){state.beneficiary=state.beneficiaries[i];state.page="amount";render()}
function amount(){
 shell(transferLayout(`<h1>Set transfer details</h1><div class="two-col"><div>
<h3>How much would you like to transfer?</h3><div class="field"><label>Currency</label><select id="currency"><option>AED</option><option>EUR</option><option>GBP</option></select></div>
<div class="field"><label>Transfer amount</label><input id="amount" type="number" min="1" max="2458.13" value="${state.amount||""}" placeholder="0.00"></div>
<div class="field"><label>Who will pay the bank fees?</label><select id="fee"><option>Sender</option><option>Beneficiary</option><option>Shared</option></select></div>
<label class="checkline"><input id="schedule" type="checkbox"> Do you want to schedule this payment for future? <small>(Optional)</small></label>
<div class="field"><label>Purpose of Payment</label><select id="purpose"><option>Bidding Fee</option><option>Invoice Payment</option><option>Salary</option><option>Supplier Payment</option></select></div>
<div class="field"><label>Payment note to beneficiary (Optional)</label><input id="note" placeholder="Enter note"></div>
<div class="actions"><button class="btn secondary" onclick="go('chooseBen')">Back</button><button class="btn primary" onclick="reviewTransfer()">Review Payment Details</button></div>
</div><aside class="right-card"><h3>Transfer details</h3><p><b>Transferring from</b><br>${state.from.name}<br>${state.from.number}</p><p><b>Transferring to</b><br>${state.beneficiary.name}<br>${state.beneficiary.account}</p><hr><b>Estimated processing time</b><p>Instant. There might be delays due to incomplete payment information, weekends or public holidays.</p></aside></div>`,`details`))
}
function reviewTransfer(){
 const amount=document.getElementById("amount").value;if(!amount||Number(amount)<=0){alert("Enter a valid transfer amount");return}
 state.amount=amount;state.fee=document.getElementById("fee").value;state.purpose=document.getElementById("purpose").value;state.page="reviewTransfer";render()
}
function reviewTransferPage(){
 shell(transferLayout(`<h1>Please review payment details</h1><div class="review-section"><h3>Beneficiary details</h3><div class="review-grid">${rv("Name",state.beneficiary.name)}${rv("Nickname",state.beneficiary.nick)}${rv("Account / IBAN",state.beneficiary.account)}${rv("Bank name",state.beneficiary.bank)}${rv("Bank country",state.beneficiary.country)}${rv("Account type","INDIVIDUAL")}</div></div>
<div class="review-section"><h3>Payment type</h3><div class="review-grid">${rv("Debit account",state.from.number)}${rv("Amount to be transferred","AED "+state.amount)}${rv("Debit amount","AED "+state.amount)}${rv("Fees will be paid by",state.fee)}${rv("Transfer type","Local")}</div></div>
<div class="review-section"><h3>Purpose of payment</h3>${rv("Payment category",state.purpose)}</div>
<label class="checkline"><input id="terms" type="checkbox"> I acknowledge and accept the Terms and Conditions and confirm the transaction details are correct.</label>
<div class="actions"><button class="btn secondary" onclick="go('amount')">Back</button><button id="proceed" class="btn disabled" onclick="proceedAuth()">Proceed to authentication</button></div>
<script>document.getElementById('terms').addEventListener('change',e=>document.getElementById('proceed').className='btn '+(e.target.checked?'primary':'disabled'))</script>`,`review`))
}
function rv(a,b){return `<div><div class="review-label">${a}</div><div class="review-value">${b}</div></div>`}
function proceedAuth(){if(!document.getElementById("terms").checked)return;state.page="authTransfer";render()}
function authTransfer(){shell(transferLayout(`<div class="auth-box"><h1>Authentication</h1><p>Enter the 6-digit OTP sent to your registered mobile number.</p><div class="otp">${[1,2,3,4,5,6].map((_,i)=>`<input maxlength="1" inputmode="numeric" aria-label="OTP digit ${i+1}" oninput="moveOtp(this,${i})">`).join("")}</div><button class="btn primary" onclick="completeTransfer()">Authenticate & transfer</button><p><button class="action-link" onclick="toast('A new OTP has been sent')">Resend OTP</button></p></div>`,`confirm`))}
function moveOtp(el,i){if(el.value&&i<5)el.nextElementSibling.focus()}
function completeTransfer(){let ok=[...document.querySelectorAll(".otp input")].every(x=>x.value);if(!ok){alert("Enter the 6-digit OTP");return}state.page="successTransfer";render()}
function successTransfer(){shell(`<div class="success"><div class="success-icon">✓</div><h1>Transfer successful</h1><p>Your payment of <b>AED ${state.amount}</b> to <b>${state.beneficiary.name}</b> has been submitted successfully.</p><div class="box"><p><b>Transaction reference</b></p><h2>JAS${Date.now().toString().slice(-8)}</h2><p>Status: <b style="color:green">SUCCESS</b></p></div><button class="btn primary" onclick="go('pay')">Back to Pay & transfer</button></div>`)}
function manageBen(){
 shell(`<div class="layout">${sidebar("pay")}<section class="content"><div class="hero"><h1>Manage Beneficiary</h1></div><div class="dashboard"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Money Transfer Beneficiaries</h2><button class="btn primary" onclick="addBen()">Add new beneficiary</button></div><input class="search" placeholder="Search beneficiary by name, nick name, bank name or bank country" oninput="filterTable(this.value)"><div class="panel" style="margin-top:20px"><table class="table"><thead><tr><th>Bene. name</th><th>Bene. account details</th><th>Bene. bank name</th><th>Bene. bank country</th><th>Status</th><th>Actions</th></tr></thead><tbody id="ben-table">${tableRows(state.beneficiaries)}</tbody></table></div></div></section></div>`)
}
function tableRows(arr){return arr.map((b,i)=>`<tr><td>🇦🇪 ${b.name}</td><td>${b.account}</td><td>${b.bank}</td><td>${b.country}</td><td>${b.status}</td><td><button class="action-link" onclick="deleteBen(${i})">Action ▾</button></td></tr>`).join("")}
function filterTable(q){document.getElementById("ben-table").innerHTML=tableRows(state.beneficiaries.filter(b=>(b.name+b.account+b.bank+b.country).toLowerCase().includes(q.toLowerCase())))}
function deleteBen(i){if(confirm("Delete this beneficiary?")){state.beneficiaries.splice(i,1);saveBen();manageBen()}}
function addBen(){
 state.page="addBen";render()
}
function addBenPage(){
 shell(transferLayout(`<h1>Let us know beneficiary details</h1><div class="box"><h3>Beneficiary bank details</h3>
<div class="field"><label>Beneficiary bank country</label><select id="country"><option>INDIA</option><option>UNITED ARAB EMIRATES</option><option>UNITED KINGDOM</option><option>GERMANY</option></select></div>
<div class="field"><label>SWIFT code</label><input id="swift" placeholder="Enter SWIFT code (8-11 alpha numeric)"></div>
<div class="field"><label>Beneficiary name *</label><input id="benName" placeholder="Enter beneficiary name"></div>
<div class="field"><label>Nickname</label><input id="nick" placeholder="Enter nickname"></div>
<div class="field"><label>Account / IBAN *</label><input id="account" placeholder="Enter account number or IBAN"></div>
<div class="field"><label>Bank name *</label><input id="bank" placeholder="Enter bank name"></div>
</div><div class="actions"><button class="btn secondary" onclick="go('pay')">Back</button><button class="btn primary" onclick="reviewBen()">Review beneficiary details</button></div>`,`start`))
}
function reviewBen(){
 const name=document.getElementById("benName").value,account=document.getElementById("account").value,bank=document.getElementById("bank").value;
 if(!name||!account||!bank){alert("Enter beneficiary name, account/IBAN and bank name");return}
 state.newBen={name,nick:document.getElementById("nick").value||name.split(" ")[0],account,bank,country:document.getElementById("country").value,status:"ACTIVE"};
 state.page="reviewBen";render()
}
function reviewBenPage(){
 const b=state.newBen;
 shell(transferLayout(`<h1>Review beneficiary details</h1><div class="panel"><h3>Beneficiary details</h3><div class="review-grid">${rv("Beneficiary name",b.name)}${rv("Nickname",b.nick)}${rv("Account / IBAN",b.account)}${rv("Bank name",b.bank)}${rv("Country",b.country)}${rv("Status","ACTIVE")}</div></div><label class="checkline"><input id="benTerms" type="checkbox"> I confirm that the beneficiary details entered are correct.</label><div class="actions"><button class="btn secondary" onclick="go('addBen')">Back</button><button class="btn primary" onclick="authBen()">Proceed to authentication</button></div>`,`review`))
}
function authBen(){if(!document.getElementById("benTerms").checked){alert("Please confirm beneficiary details");return}state.page="authBen";render()}
function authBenPage(){shell(transferLayout(`<div class="auth-box"><h1>Authentication</h1><p>Enter OTP to authenticate adding this beneficiary.</p><div class="otp">${[1,2,3,4,5,6].map((_,i)=>`<input maxlength="1" inputmode="numeric" aria-label="Beneficiary OTP digit ${i+1}" oninput="moveOtp(this,${i})">`).join("")}</div><button class="btn primary" onclick="completeBen()">Authenticate & add beneficiary</button></div>`,`confirm`))}
function completeBen(){if(![...document.querySelectorAll(".otp input")].every(x=>x.value)){alert("Enter the 6-digit OTP");return}state.beneficiaries.push(state.newBen);saveBen();state.page="successBen";render()}
function successBen(){shell(`<div class="success"><div class="success-icon">✓</div><h1>Beneficiary added successfully</h1><p><b>${state.newBen.name}</b> has been added to your beneficiaries.</p><div class="box"><p>Bank: ${state.newBen.bank}</p><p>Account / IBAN: ${state.newBen.account}</p><p>Status: <b style="color:green">ACTIVE</b></p></div><button class="btn primary" onclick="manageBen()">Manage beneficiaries</button></div>`)}

function go(page){state.page=page;render()}
function toast(msg){const t=document.querySelector(".toast")||document.createElement("div");t.className="toast";t.textContent=msg;t.style.display="block";document.body.appendChild(t);setTimeout(()=>t.style.display="none",2000)}
function render(){
 if(state.page==="login") loginPage();
 else if(state.page==="dashboard") dashboard();
 else if(state.page==="pay") pay();
 else if(state.page==="selectAccount") selectAccount();
 else if(state.page==="chooseBen") chooseBen();
 else if(state.page==="amount") amount();
 else if(state.page==="reviewTransfer") reviewTransferPage();
 else if(state.page==="authTransfer") authTransfer();
 else if(state.page==="successTransfer") successTransfer();
 else if(state.page==="manageBen") manageBen();
 else if(state.page==="addBen") addBenPage();
 else if(state.page==="reviewBen") reviewBenPage();
 else if(state.page==="authBen") authBenPage();
 else if(state.page==="successBen") successBen();
}
function loginPage(){
 topActions.innerHTML="";
 app.innerHTML=`<div class="page"><div class="login-page"><div class="login-card"><h1>Welcome to Jasima Biz<br>Online Banking</h1><div class="underline"></div>
<div class="field"><label>Username</label><input id="username" placeholder="Enter username"></div>
<div class="field"><label>Password</label><div class="password-wrap"><input id="password" type="password" placeholder="Enter password"><button onclick="togglePass()">◉</button></div></div>
<a class="link">Forgot credentials</a><label><input type="checkbox"> Virtual Keyboard</label><button class="btn primary" onclick="login()">Sign In</button>
<p style="font-size:12px;color:#777">Practice credentials: any non-empty username and password.</p></div><div class="login-art"><span>👩🏻‍💻</span></div></div></div>`;
}
function togglePass(){const p=document.getElementById("password");p.type=p.type==="password"?"text":"password"}
render();
