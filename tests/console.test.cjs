const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const XLSX = require('xlsx');
const html = fs.readFileSync(process.env.CONSOLE_HTML || 'BITS_Digital_CodeForge_Challenge.html', 'utf8');
const headers = ['BITS ID', 'Course', 'Total Marks'];

function setup(t) {
  const dom = new JSDOM(html.replace(/<script src=[^>]+><\/script>/g, ''), {runScripts:'dangerously', pretendToBeVisual:true, beforeParse(w){
    // jsdom has no layout engine; model visible text and canvas at these boundaries.
    Object.defineProperty(w.HTMLElement.prototype,'innerText',{get(){return this.textContent;},set(v){this.textContent=v;}});
    w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({}, {get:()=>()=>{},set:()=>true});
  }});
  const w = dom.window;
  t.after(()=>w.close());
  w.XLSX = XLSX;
  w.alert = ()=>{};
  w.confirm = ()=>true;
  const geometry = [];
  w.HTMLCanvasElement.prototype.getContext = ()=>new Proxy({}, {get:(_,key)=> (...args)=>{
    if(['fillRect','moveTo','lineTo'].includes(key)) geometry.push([key,...args]);
  },set:()=>true});
  const blobs=[];
  w.URL.createObjectURL = b=>{blobs.push(b);return 'blob:test';};
  w.URL.revokeObjectURL = ()=>{};
  w.HTMLAnchorElement.prototype.click = ()=>{};
  const el = id=>w.document.getElementById(id);
  const change = id=>el(id).dispatchEvent(new w.Event('change'));
  const input = (id,value)=>{el(id).value=value;el(id).dispatchEvent(new w.Event('input'));};
  async function upload(rows, name='marks.xlsx') {
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'Marks');
    const file=new w.File([XLSX.write(wb,{type:'array',bookType:'xlsx'})],name);
    Object.defineProperty(el('file'),'files',{configurable:true,value:[file]});
    change('file');
    await new Promise(r=>setTimeout(r,45));
  }
  function select(value='Math') {input('instructor','Teacher');el('course').value=value;change('course');}
  return {w,el,change,input,upload,select,geometry,blobs};
}

test('picker supports xlsx',t=>{const a=setup(t);assert.ok(a.el('file').accept.split(',').includes('.xlsx'));});
test('courses are unique and replaced on reupload',async t=>{const a=setup(t);await a.upload([headers,['1','Math',20],['2','Math',80]]);assert.equal(a.el('course').options.length,2);await a.upload([headers,['3','Science',50]]);assert.deepEqual(Array.from(a.el('course').options,o=>o.value),['','Science']);});
test('min/max labels and even median describe actual marks',async t=>{const a=setup(t);await a.upload([headers,['1','Math',20],['2','Math',80]]);a.select();assert.match(a.el('min').parentElement.textContent,/Min/);assert.equal(a.el('min').textContent,'20');assert.equal(a.el('max').textContent,'80');assert.equal(a.el('avg').textContent,'50.00');assert.equal(a.el('med').textContent,'50');});
test('numeric text marks are normalized before statistics',async t=>{const a=setup(t);await a.upload([headers,['1','Math','20'],['2','Math','80']]);a.select();assert.equal(a.el('avg').textContent,'50.00');assert.equal(a.el('med').textContent,'50');});
test('empty course clears statistics and disables export',async t=>{const a=setup(t);await a.upload([headers,['1','Math',20]]);a.select();a.el('course').value='';a.change('course');assert.equal(a.el('avg').textContent,'—');assert.equal(a.el('download').disabled,true);});
test('range coverage includes both 0 and 100',async t=>{const a=setup(t);await a.upload([headers,['1','Math',100]]);a.select();a.el('Amax').value=99;a.change('Amax');assert.equal(a.el('download').disabled,true);assert.ok(a.el('rangeError').textContent);});
test('single integer band is valid',async t=>{const a=setup(t);await a.upload([headers,['1','Math',100]]);a.select();a.el('Amin').value=100;a.change('Amin');assert.equal(a.el('download').disabled,false);assert.match(a.el('gradeSummary').textContent,/A: 1/);});
test('removing instructor invalidates export immediately',async t=>{const a=setup(t);await a.upload([headers,['1','Math',20]]);a.select();a.input('instructor','  ');assert.equal(a.el('download').disabled,true);});
test('reset is safe before selection and asks only once when used',async t=>{const a=setup(t);assert.equal(a.el('resetRanges').disabled,true);await a.upload([headers,['1','Math',20]]);a.select();let n=0;a.w.confirm=()=>{n++;return true;};a.el('resetRanges').click();assert.equal(n,1);});
test('invalid range hides untrustworthy distribution',async t=>{const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();a.el('Amax').value=79;a.change('Amax');assert.equal(a.el('gradeSummary').children.length,0);});
test('all 101 marks receive exactly one default grade',async t=>{const a=setup(t);await a.upload([headers,...Array.from({length:101},(_,i)=>[String(i),'Math',i])]);a.select();assert.deepEqual(Array.from(a.el('gradeSummary').children,e=>e.textContent),['A: 21','A-: 10','B: 10','B-: 10','C: 10','C-: 10','D: 10','E: 20']);assert.equal(a.el('avg').textContent,'50.00');});
for(const mark of ['',-1,101,80.5,'absent',true]) test('reject invalid mark '+JSON.stringify(mark),async t=>{const a=setup(t);await a.upload([headers,['1','Math',mark]]);assert.equal(a.el('course').options.length,1);assert.ok(a.el('uploadError')?.textContent);});
for(const rows of [[headers],[['ID','Course','Total Marks'],['1','Math',50]],[headers,['1','Math',50],['1','Math',60]],[headers,['','Math',50]],[headers,['1','',50]],[headers.concat('Extra'),['1','Math',50,'x']]]) test('reject malformed input '+JSON.stringify(rows),async t=>{const a=setup(t);await a.upload(rows);assert.equal(a.el('course').options.length,1);assert.ok(a.el('uploadError')?.textContent);});
test('documented student ID alias exports correctly',async t=>{const a=setup(t);await a.upload([["Student’s BITS ID",'Course','Total Marks'],['0001','Math',80]]);a.select();a.el('download').click();assert.equal(a.blobs.length,1);const text=await new Promise(r=>{const f=new a.w.FileReader();f.onload=()=>r(f.result);f.readAsText(a.blobs[0]);});assert.match(text,/0001,80,A/);assert.doesNotMatch(text,/undefined/);});
test('CSV quotes punctuation and neutralizes formulas',async t=>{const a=setup(t);await a.upload([headers,['=1+1','Math',80]]);a.select();a.input('instructor','Smith, "Jo"');a.el('download').click();const text=await new Promise(r=>{const f=new a.w.FileReader();f.onload=()=>r(f.result);f.readAsText(a.blobs[0]);});assert.match(text,/"Smith, ""Jo"""/);assert.match(text,/'=1\+1,80,A/);});
test('identical marks and large cohorts produce finite, bounded chart coordinates',async t=>{const a=setup(t);await a.upload([headers,...Array.from({length:40},(_,i)=>[String(i),'Math',80])]);a.select();await new Promise(r=>setTimeout(r,500));assert.ok(a.geometry.length);for(const [method,...args] of a.geometry){assert.ok(args.every(Number.isFinite),method+' finite');if(method==='fillRect')assert.ok(args[1]>=0,'bars stay inside canvas');}});
test('edits after export clear finalization message',async t=>{const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();a.el('download').click();assert.ok(a.el('thankyou').textContent);a.el('Amin').value=81;a.change('Amin');assert.equal(a.el('thankyou').textContent,'');});

test('lower endpoint, gaps, overlaps, reversed and empty bounds block export',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',0],['2','Math',100]]);a.select();
 for(const [id,value] of [['Emin','1'],['Bmax','68'],['Bmax','70'],['Bmin','70'],['Amin','0'],['Amax','']]){
  a.el('resetRanges').click();a.el(id).value=value;a.change(id);
  assert.equal(a.el('download').disabled,true,id+'='+value);
  a.el('download').onclick();assert.equal(a.blobs.length,0);
 }
});
test('same ID in different courses is allowed; reordered headers work',async t=>{
 const a=setup(t);await a.upload([['Course','Total Marks','BITS ID'],['Math',10,'0001'],['Science',90,'0001']]);a.select();
 assert.equal(a.el('avg').textContent,'10.00');a.select('Science');assert.equal(a.el('avg').textContent,'90.00');
});
test('odd median and whitespace normalization',async t=>{
 const a=setup(t);await a.upload([headers,['1',' Math ',100],['2','Math',' 0 '],['3','Math',40]]);a.select();
 assert.equal(a.el('course').options.length,2);assert.equal(a.el('med').textContent,'40');assert.equal(a.el('avg').textContent,'46.67');
});
test('failed replacement upload clears prior export and allows retry',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();
 await a.upload([headers,['1','Math',101]]);assert.equal(a.el('download').disabled,true);assert.equal(a.el('avg').textContent,'—');
 await a.upload([headers,['1','Math',70]]);a.select();assert.equal(a.el('avg').textContent,'70.00');
});
test('latest upload wins even when the earlier reader finishes last',async t=>{
 const a=setup(t),pending=[];
 a.w.FileReader=class {readAsArrayBuffer(file){pending.push(this);} };
 const payload=name=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([headers,['1',name,80]]),'Marks');return XLSX.write(wb,{type:'array',bookType:'xlsx'});};
 await a.upload([headers,['1','Old',80]]);await a.upload([headers,['1','New',80]]);
 pending[1].onload({target:{result:payload('New')}});pending[0].onload({target:{result:payload('Old')}});
 assert.deepEqual(Array.from(a.el('course').options,o=>o.value),['','New']);
});
test('reader error gives actionable feedback and no export',async t=>{
 const a=setup(t);a.w.FileReader=class {readAsArrayBuffer(){this.onerror();}};
 await a.upload([headers,['1','Math',80]]);assert.match(a.el('uploadError').textContent,/read/i);assert.equal(a.el('download').disabled,true);
});
test('missing Excel library and wrong extension are handled',async t=>{
 const a=setup(t);a.w.XLSX=undefined;await a.upload([headers,['1','Math',80]]);assert.match(a.el('uploadError').textContent,/reader/i);
 await a.upload([headers,['1','Math',80]],'marks.xls');assert.match(a.el('uploadError').textContent,/xlsx/);
});
test('pending histogram cannot redraw after empty course selection',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();a.el('course').value='';a.change('course');
 a.geometry.length=0;await new Promise(r=>setTimeout(r,100));assert.equal(a.geometry.length,0);
});
test('HTML-looking names remain plain text',async t=>{
 const a=setup(t),name='<img src=x onerror=alert(1)>';
 await a.upload([headers,['1',name,80]]);a.select(name);a.input('instructor',name);
 assert.equal(a.el('course').options[1].textContent,name);assert.equal(a.el('welcome').querySelector('img'),null);
});

test('Stage 2: course bands persist independently and undo restores the preceding edit',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80],['2','Science',90]]);a.select();
 a.el('Amin').value='85';a.change('Amin');a.select('Science');assert.equal(a.el('Amin').value,'80');
 a.select('Math');assert.equal(a.el('Amin').value,'85');assert.equal(a.el('A-max').value,'84');
 a.el('undoRanges').click();assert.equal(a.el('Amin').value,'80');assert.equal(a.el('A-max').value,'79');
});
test('Stage 2: preview filters combine and do not change export cohort',async t=>{
 const a=setup(t);await a.upload([headers,['001','Math',80],['002','Math',79],['003','Science',40]]);a.select();
 assert.equal(a.el('studentRows').children.length,2);a.input('studentSearch','002');assert.equal(a.el('studentRows').children.length,1);
 assert.match(a.el('studentRows').textContent,/002/);a.el('gradeFilter').value='A';a.change('gradeFilter');assert.equal(a.el('studentRows').children.length,0);
 assert.match(a.el('previewStatus').textContent,/No students/);assert.match(a.el('exportCount').textContent,/2/);
 a.el('download').click();const text=await new Promise(r=>{const f=new a.w.FileReader();f.onload=()=>r(f.result);f.readAsText(a.blobs[0]);});assert.match(text,/001,80,A/);assert.match(text,/002,79,A-/);
});
test('Stage 2: grade distribution percentages and export ranges follow edits',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80],['2','Math',70]]);a.select();
 assert.match(a.el('distribution').textContent,/50\.0%/);assert.match(a.el('exportRanges').textContent,/80–100/);
 a.el('Amin').value='81';a.change('Amin');assert.match(a.el('distribution').textContent,/100\.0%/);assert.match(a.el('exportRanges').textContent,/81–100/);
});
test('Stage 2: invalid bands are identified and preview grades withheld',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();a.el('Amax').value='79';a.change('Amax');
 assert.equal(a.el('Amax').getAttribute('aria-invalid'),'true');assert.match(a.el('studentRows').textContent,/Pending/);assert.equal(a.el('distribution').children.length,0);
 a.el('undoRanges').click();assert.equal(a.el('Amax').getAttribute('aria-invalid'),'false');assert.match(a.el('studentRows').textContent,/A/);
});
test('Stage 2: replacement workbook clears per-course ranges and search',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();a.el('Amin').value='85';a.change('Amin');a.input('studentSearch','missing');
 await a.upload([headers,['2','Math',90]],'replacement.xlsx');a.select();assert.equal(a.el('Amin').value,'80');assert.equal(a.el('studentSearch').value,'');assert.equal(a.el('undoRanges').disabled,true);assert.match(a.el('fileStatus').textContent,/replacement.xlsx/);
});
test('Stage 2: preview pagination includes last record and resets on filtering',async t=>{
 const a=setup(t);await a.upload([headers,...Array.from({length:31},(_,i)=>['ID'+i,'Math',80])]);a.select();
 assert.equal(a.el('studentRows').children.length,25);a.el('nextPage').click();assert.equal(a.el('studentRows').children.length,6);assert.match(a.el('studentRows').textContent,/ID30/);
 a.input('studentSearch','ID30');assert.equal(a.el('studentRows').children.length,1);assert.equal(a.el('prevPage').disabled,true);
});
test('Stage 2: reset can be undone and drafts survive a blank course selection',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80]]);a.select();a.el('Amin').value='85';a.change('Amin');a.el('resetRanges').click();assert.equal(a.el('Amin').value,'80');
 a.el('undoRanges').click();assert.equal(a.el('Amin').value,'85');a.el('course').value='';a.change('course');a.select();assert.equal(a.el('Amin').value,'85');
});
test('Stage 2: invalid drafts persist without becoming exportable after course switching',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80],['2','Science',90]]);a.select();a.el('Amin').value='0';a.change('Amin');
 a.select('Science');assert.equal(a.el('download').disabled,false);a.select('Math');assert.equal(a.el('Amin').value,'0');assert.equal(a.el('A-max').value,'');assert.equal(a.el('download').disabled,true);
 a.el('undoRanges').click();assert.equal(a.el('download').disabled,false);
});
test('Stage 2: instructor is optional for review but mandatory for export',async t=>{
 const a=setup(t);await a.upload([headers,['1','Math',80]]);a.el('course').value='Math';a.change('course');
 assert.equal(a.el('avg').textContent,'80.00');assert.equal(a.el('studentRows').children.length,1);assert.equal(a.el('download').disabled,true);
 a.input('instructor','Teacher');assert.equal(a.el('download').disabled,false);
});
