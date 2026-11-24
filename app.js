/* CardioDose - formula transcription from the user-provided workbook.
   This app intentionally does not persist or transmit patient data. */
"use strict";

const $ = (id) => document.getElementById(id);
const number = (id) => {
  const v = parseFloat($(id).value);
  return Number.isFinite(v) ? v : null;
};
const fmt = (n, digits=2) => Number.isFinite(n) ? n.toLocaleString("id-ID",{minimumFractionDigits:digits,maximumFractionDigits:digits}) : "—";
const safe = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const labs = [
 ["Hb","Hemoglobin","g/dL"],["Ht","Hematokrit","%"],["WBC","Leukosit","/µL"],["Plt","Trombosit","/µL"],
 ["Na","Natrium","mmol/L"],["K","Kalium","mmol/L"],["Cl","Klorida","mmol/L"],["iCa","Kalsium ion","mmol/L"],
 ["Mg","Magnesium","mg/dL"],["Urea","Ureum","mg/dL"],["Creat","Kreatinin","mg/dL"],["eGFR","eGFR","mL/min/1,73 m²"],
 ["Glucose","Glukosa darah","mg/dL"],["PT","PT","detik"],["INR","INR","rasio"],["aPTT","aPTT","detik"],
 ["Fib","Fibrinogen","mg/dL"],["Alb","Albumin","g/dL"]
];
const monitoring = {
 bga1:["Jam","pH","pCO₂","pO₂","HCO₃","BE","SaO₂","Na","K","iCa","Hct","Hb"],
 bga2:["Jam","pH","pCO₂","pO₂","HCO₃","BE","SaO₂","Na","K","iCa","Hct","Hb"],
 hemo:["TD","Nadi","CVP","SpO₂","Suhu","PA pre","PA post","RV pre","RV post","ABP","ACT awal","ACT post heparin","ACT post protamin"]
};
function buildInputs(){
  $("labGrid").innerHTML = labs.map(([id,label,unit])=>`<label>${label} (${unit})<input id="lab_${id}" type="text" inputmode="decimal" placeholder="—"></label>`).join("");
  Object.entries(monitoring).forEach(([group,fields])=>{
    $(group).innerHTML=fields.map((name,i)=>`<label>${name}<input id="${group}_${i}" type="text" placeholder="—"></label>`).join("");
  });
}
function getWeight(){return number("weight");}
function makeTable(title,unit,rows,formula){
  return `<article class="dose-card"><h3>${safe(title)}</h3><div class="formula">${safe(formula)}</div><table><thead><tr><th>${safe(unit)}</th><th>Kecepatan (mL/jam)</th></tr></thead><tbody>${rows.map(([dose,rate])=>`<tr><td>${fmt(dose,dose%1?2:0)}</td><td>${fmt(rate,2)}</td></tr>`).join("")}</tbody></table></article>`;
}
function range(start,end,step){let a=[];for(let x=start;x<=end+1e-9;x+=step)a.push(Number(x.toFixed(4)));return a;}
function calculate(){
 const w=getWeight(),h=number("height");
 $("bsa").textContent=(w&&h)?`${fmt(Math.sqrt(w*h/3600),2)} m²`:"— m²";
 $("bmi").textContent=(w&&h)?`${fmt(w/((h/100)**2),1)} kg/m²`:"— kg/m²";
 $("weightMetric").textContent=w?`${fmt(w,1)} kg`:"— kg";
 if(!w||w<=0){$("weightPrompt").hidden=false;$("calculationOutput").hidden=true;return;}
 $("weightPrompt").hidden=true;$("calculationOutput").hidden=false;
 const tables=[];
 const add=(title,unit,doses,fn,formula)=>tables.push(makeTable(title,unit,doses.map(d=>[d,fn(d)]),formula));
 add("Dopamin 5 mg/cc","Gamma (µg/kg/menit)",range(1,10,1),d=>d*60*w/5000,"Formula workbook: dosis × 60 × BB / 5.000");
 add("Dobutamin 5 mg/cc","Gamma (µg/kg/menit)",range(1,10,1),d=>d*60*w/5000,"Formula workbook: dosis × 60 × BB / 5.000");
 add("Noradrenalin 0,1 mg/cc","Nano (ng/kg/menit)",[10,25,50,75,100,125,150,175,200,250],d=>d*60*w/100000,"Formula workbook: dosis × 60 × BB / 100.000");
 add("Noradrenalin 0,05 mg/cc","Nano (ng/kg/menit)",[10,25,50,75,100,125,150,175,200,250],d=>d*60*w/50000,"Formula workbook: dosis × 60 × BB / 50.000");
 add("Noradrenalin 0,0125 mg/cc","Nano (ng/kg/menit)",range(10,100,10),d=>d*60*w/12500,"Formula workbook: dosis × 60 × BB / 12.500");
 add("Milrinon 0,2 mg/cc","Gamma (µg/kg/menit)",range(.25,.75,.05),d=>d*60*w/200,"Formula workbook: dosis × 60 × BB / 200");
 add("Nitrocyn 0,5 mg/cc — tabel A","Micro (µg/menit)",range(5,50,5),d=>d*60/500,"Formula workbook: dosis × 60 / 500");
 add("Nitrocyn 0,5 mg/cc — tabel B","Micro (µg/menit)",range(10,450,50),d=>d*60/500,"Formula workbook: dosis × 60 / 500");
 add("Adrenalin 0,05 mg/cc","Nano (ng/kg/menit)",range(10,100,10),d=>d*60*w/50000,"Formula workbook: dosis × 60 × BB / 50.000");
 add("Adrenalin 0,0125 mg/cc","Nano (ng/kg/menit)",range(10,100,10),d=>d*60*w/12500,"Formula workbook: dosis × 60 × BB / 12.500");
 $("doseTables").innerHTML=tables.join("");
 const heparinUnits=4*w*100, heparinMl=heparinUnits/1000;
 const milrinoneLoading=w*50*6/200;
 const txInitialMg=50*w, txInitialMl=(txInitialMg/100)*2;
 const txMaintMgHr=4*w, txMaintMlHr=txMaintMgHr/100;
 const protamine=4*w;
 const precedex=range(.1,.7,.1).map(d=>[d,w*d/4]);
 const special=[
  ["Heparin",`${fmt(heparinUnits,0)} unit`,`${fmt(heparinMl,2)} mL pada konsentrasi 1.000 unit/mL`,"Formula sumber: 4 × BB × 100; sumber mencantumkan konsentrasi persiapan 1.000 unit/cc."],
  ["Milrinon loading (sesuai sel workbook)",`${fmt(milrinoneLoading,2)} mL/jam`,"Formula sumber: BB × 50 × 6 / 200.","Label workbook juga mencantumkan “50 µg/kg 10 mnt”; hubungan satuan dan interpretasi rumus perlu dikonfirmasi."],
  ["Transamin — tahap awal",`${fmt(txInitialMg,0)} mg dalam 30 menit`,`${fmt(txInitialMl,2)} mL/jam pada 100 mg/mL`,"Transkripsi rumus workbook: 50 × BB mg; laju mL/jam dihitung dengan faktor 2 untuk 30 menit."],
  ["Transamin — lanjutan",`${fmt(txMaintMgHr,0)} mg/jam`,`${fmt(txMaintMlHr,2)} mL/jam pada 100 mg/mL`,"Transkripsi workbook: 4 × BB mg/jam; konsentrasi tertulis 100 mg/mL."],
  ["Protamin",`${fmt(protamine,0)} mg`,"Konsentrasi tertulis pada workbook: 10 mg/mL.","Formula workbook: 4 × BB mg. Volume tidak ditampilkan sebagai instruksi pemberian."]
 ];
 $("specialCalculations").innerHTML=`<div class="special-grid">${special.map(([t,v,sub,n])=>`<div class="special-item"><b>${safe(t)}</b><strong>${safe(v)}</strong><small>${safe(sub)}<br>${safe(n)}</small></div>`).join("")}<div class="special-item"><b>Precedex 4 mcg/cc</b><table><thead><tr><th>Angka dosis sumber</th><th>mL/jam</th></tr></thead><tbody>${precedex.map(([d,r])=>`<tr><td>${fmt(d,1)}</td><td>${fmt(r,2)}</td></tr>`).join("")}</tbody></table><small>Formula workbook: BB × angka dosis / 4. Satuan angka dosis perlu dikonfirmasi.</small></div></div>`;
 renderPrint();
}
function value(id){return $(id)?.value?.trim()||""}
function renderPrint(){
 const fields=[["Nama",value("patientName")],["No. RM",value("mrn")],["Usia",value("age")],["Jenis kelamin",value("sex")],["BB",value("weight")?value("weight")+" kg":""],["TB",value("height")?value("height")+" cm":""],["BSA", $("bsa").textContent],["BMI",$("bmi").textContent],["Diagnosis",value("diagnosis")],["Operasi",value("operation")],["Tanggal operasi",value("operationDate")],["Golongan darah",value("bloodType")],["Alergi / catatan",value("allergy")]];
 $("printIdentity").innerHTML=kvTable(fields);
 $("printLabs").innerHTML=kvTable(labs.map(([id,label,unit])=>[`${label} (${unit})`,value("lab_"+id)]).filter(x=>x[1]));
 $("printDetails").innerHTML=kvTable([["Persiapan darah",value("bloodPrep")],["GSH",value("gsh")],["LVEF",value("lvef")?value("lvef")+"%":""],["CPB",value("cpb")],["Catatan klinis",value("clinicalNotes")]].filter(x=>x[1]));
 const all=[];
 Object.entries(monitoring).forEach(([g,arr])=>arr.forEach((name,i)=>{let v=value(`${g}_${i}`);if(v)all.push([`${g.toUpperCase()} — ${name}`,v]);}));
 $("printMonitoringContent").innerHTML=all.length?kvTable(all):"<p>Belum ada data pemantauan yang diinput.</p>";
}
function kvTable(rows){return `<table class="kv"><tbody>${rows.map(([a,b])=>`<tr><th>${safe(a)}</th><td>${safe(b||"—")}</td></tr>`).join("")}</tbody></table>`;}
function resetAll(){
 document.querySelectorAll("input,textarea,select").forEach(el=>{el.value="";});
 calculate();renderPrint();
}
buildInputs();
document.querySelectorAll("input,select,textarea").forEach(el=>el.addEventListener("input",()=>{calculate();renderPrint();}));
$("printBtn").addEventListener("click",()=>{calculate();renderPrint();window.print();});
$("resetBtn").addEventListener("click",()=>{if(confirm("Hapus seluruh data yang diinput pada halaman ini?"))resetAll();});
calculate();
