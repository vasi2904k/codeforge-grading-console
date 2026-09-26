// Standalone headless Edge fallback: no connected Browser plugin is available.
const {chromium}=require('playwright-core');
const XLSX=require('xlsx');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
function workbook(rows){const w=XLSX.utils.book_new();XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(rows),'Marks');return XLSX.write(w,{type:'buffer',bookType:'xlsx'});}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
 const page=await browser.newPage({acceptDownloads:true,viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',d=>d.accept());
 await page.goto(process.env.TEST_URL||pathToFileURL(path.resolve('BITS_Digital_CodeForge_Challenge.html')).href);
 fs.mkdirSync('.impeccable/review',{recursive:true});
 assert.equal(await page.locator('#avg').innerText(),'—');
 assert.equal(await page.locator('#resetRanges').isDisabled(),true);
 const headers=['BITS ID','Course','Total Marks'];
 const rows=[headers,...[0,19,20,29,30,39,40,49,50,59,60,69,70,79,80,100].map((m,i)=>['2024'+i,'Course A',m]),['other','Course B',42]];
 fs.mkdirSync('tests/fixtures',{recursive:true});
 fs.writeFileSync('tests/fixtures/boundaries.xlsx',workbook(rows));
 await page.locator('#file').setInputFiles({name:'boundaries.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:workbook(rows)});
 await page.waitForFunction(()=>document.querySelector('#course').options.length===3);
 assert.equal(await page.locator('#file').evaluate(el=>el.files[0]?.name),'boundaries.xlsx');
 await page.locator('#instructor').fill('Smith, "Jo"');
 await page.locator('#course').selectOption('Course A');
 assert.equal(await page.locator('#min').innerText(),'0');assert.equal(await page.locator('#max').innerText(),'100');
 // The 16 boundary marks total 793: 793 / 16 = 49.5625.
 assert.equal(await page.locator('#avg').innerText(),'49.56');assert.equal(await page.locator('#med').innerText(),'49.5');
 assert.deepEqual(await page.locator('#gradeSummary span').allTextContents(),['A: 2','A-: 2','B: 2','B-: 2','C: 2','C-: 2','D: 2','E: 2']);
 const downloadEvent=page.waitForEvent('download');await page.locator('#download').click();const download=await downloadEvent;
 assert.match(download.suggestedFilename(),/^grades-Course-A-\d{4}-\d{2}-\d{2}\.csv$/);
 await download.saveAs('tests/fixtures/exported-grades.csv');
 const csv=fs.readFileSync('tests/fixtures/exported-grades.csv','utf8');
 assert.match(csv,/Instructor,"Smith, ""Jo"""/);assert.ok(!csv.includes('other'));
 const exported=XLSX.utils.sheet_to_json(XLSX.read(csv,{type:'string'}).Sheets.Sheet1,{header:1});
 const studentRows=exported.filter(r=>String(r[0]).startsWith('2024'));
 assert.equal(studentRows.length,16);assert.deepEqual(studentRows.map(r=>r[2]),['E','E','D','D','C-','C-','C','C','B-','B-','B','B','A-','A-','A','A']);
 const timerBefore=await page.locator('#timerText').innerText();
 await page.waitForFunction(before=>document.querySelector('#timerText').innerText!==before,timerBefore,{timeout:3000});
 await page.locator('#Amax').selectOption('99');assert.equal(await page.locator('#download').isDisabled(),true);assert.equal(await page.locator('#gradeSummary span').count(),0);
 await page.locator('#resetRanges').click();assert.equal(await page.locator('#download').isEnabled(),true);
 await page.locator('#Amin').selectOption('100');assert.equal(await page.locator('#download').isEnabled(),true);
 await page.locator('#instructor').fill('');assert.equal(await page.locator('#download').isDisabled(),true);
 await page.locator('#instructor').fill('Teacher');
 await page.locator('#course').selectOption('Course B');assert.equal(await page.locator('#avg').innerText(),'42.00');
 await page.locator('#course').selectOption('');assert.equal(await page.locator('#avg').innerText(),'—');
 await page.locator('#file').setInputFiles({name:'invalid.xlsx',mimeType:'application/octet-stream',buffer:Buffer.from('not a workbook')});
 await page.waitForFunction(()=>document.querySelector('#uploadError').textContent.length>0);
 assert.equal(await page.locator('#course option').count(),1);assert.equal(await page.locator('#download').isDisabled(),true);
 await page.locator('#file').setInputFiles('tests/fixtures/boundaries.xlsx');await page.waitForFunction(()=>document.querySelector('#course').options.length===3);
 await page.locator('#course').selectOption('Course A');
 // Stage 2 integration: course drafts, undo, filters, accessible controls and responsive layout.
 await page.getByRole('combobox',{name:'A minimum mark',exact:true}).selectOption('85');
 assert.equal(await page.locator('#studentRows .grade-badge').last().innerText(),'A');
 await page.locator('#course').selectOption('Course B');assert.equal(await page.locator('#Amin').inputValue(),'80');
 await page.locator('#course').selectOption('Course A');assert.equal(await page.locator('#Amin').inputValue(),'85');
 await page.getByRole('button',{name:'Undo change'}).click();assert.equal(await page.locator('#Amin').inputValue(),'80');
 await page.getByRole('searchbox',{name:'Find a student'}).fill('202414');assert.equal(await page.locator('#studentRows tr').count(),1);
 await page.getByRole('combobox',{name:'Grade',exact:true}).selectOption('A-');assert.equal(await page.locator('#studentRows tr').count(),0);
 assert.equal(await page.locator('#exportCount').innerText(),'16');
 await page.locator('#studentSearch').fill('');await page.locator('#gradeFilter').selectOption('');
 await page.locator('#Amax').selectOption('79');assert.equal(await page.locator('#Amax').getAttribute('aria-invalid'),'true');assert.equal(await page.locator('#studentRows .pending').count(),16);
 await page.locator('#undoRanges').click();
 await page.keyboard.press('Tab'); // Native controls remain in the keyboard focus order.
 assert.ok(await page.evaluate(()=>document.activeElement!==document.body));
 for(const width of [1440,1024,768,390,320]){
  await page.setViewportSize({width,height:900});
  await page.waitForFunction(()=>{
   const canvas=document.querySelector('#hist');return canvas.width===Math.round(canvas.clientWidth*devicePixelRatio);
  });
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`no page overflow at ${width}`);
 }
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>scrollTo(0,0));
 await page.waitForFunction(()=>document.querySelector('#hist').width===Math.round(document.querySelector('#hist').clientWidth*devicePixelRatio));
 if(!process.env.TEST_URL) await page.screenshot({path:'.impeccable/review/desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));
 await page.waitForFunction(()=>document.querySelector('#hist').width===Math.round(document.querySelector('#hist').clientWidth*devicePixelRatio));
 if(!process.env.TEST_URL) await page.screenshot({path:'.impeccable/review/mobile.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).scrollBehavior),'auto');
 assert.deepEqual(errors,[]);
 console.log('PASS: headless Edge Stage 1 workflow plus Stage 2 drafts, undo, search/filter, pending grades, export filename, keyboard controls, reduced motion and no page overflow at 1440/1024/768/390/320 px; no page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
