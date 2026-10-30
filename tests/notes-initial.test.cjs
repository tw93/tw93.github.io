const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const layout = fs.readFileSync('_layouts/notes.html','utf8');
const source = fs.readFileSync('js/notes.js','utf8');

test('query bootstrap runs before notes and hides only valid nondefault requests',()=>{
 const match=layout.match(/<script data-notes-initial>([\s\S]*?)<\/script>/);
 assert.ok(match,'bootstrap must run before server-rendered notes');
 assert.ok(match.index<layout.indexOf('id="J_notes"'));
 for(const query of ['sort=old','sort=like','sort=reply','sort=bookmark','c=ai','y=2022','t=p','q=Mole','tag=AI','c=ai&sort=old','','sort=bad','y=2021','q=%20','unrelated=1']) {
  const classes=new Set();const selects={c:['','ai'],y:['','2022'],t:['','p'],sort:['','old','like','reply','bookmark']};
  const controls=Object.fromEntries(Object.entries(selects).map(([name,values])=>[name,{name,options:values.map(value=>({value})),value:''}]));
  const parent={classList:{add:x=>classes.add(x)}};
  const input={value:''},bar={classList:{add:x=>classes.add(x)}},find={setAttribute(k,v){this[k]=v}};
  const elements={J_notes_q:input,J_notes_bar:bar,J_notes_find:find};
  vm.runInNewContext(match[1],{URLSearchParams,location:{search:'?'+query},document:{getElementById:id=>elements[id],currentScript:{parentElement:parent},querySelectorAll:()=>Object.values(controls)}});
  if(query==='q=Mole'||query==='tag=AI'){assert.equal(input.value,query==='q=Mole'?'Mole':'#AI');assert.equal(classes.has('is-searching'),true);assert.equal(find['aria-expanded'],'true');}
  assert.equal(classes.has('is-initial'),!['','sort=bad','y=2021','q=%20','unrelated=1'].includes(query),query);
 }
});

test('first result completion releases the initial mask and empty state',()=>{
 const start=source.indexOf('  var settle =');const end=source.indexOf('  // Endless scrolling stops',start);
 for(const count of [0,1]) {
  const classes=new Set(['is-initial']);const c={fresh:true,waitTimer:1,clearTimeout(){},list:{innerHTML:'old',hidden:true,classList:{remove(){}},parentElement:{classList:{remove:x=>classes.delete(x)}}},empty:{hidden:true},results:Array(count)};
  vm.createContext(c);vm.runInContext(source.slice(start,end),c);c.settle();
  assert.equal(classes.has('is-initial'),false);assert.equal(c.list.hidden,false);assert.equal(c.empty.hidden,count>0);
 }
});


test('failed first filters remain masked and offer an explicit retry',()=>{
 const start=source.indexOf('  var failedFilter =');const end=source.indexOf('  var step =',start);
 const c={retryFilter:false,waitTimer:1,clearTimeout(){},location:{href:'/notes/?sort=old'},list:{hidden:false,classList:{remove(){}},parentElement:{classList:{contains:()=>true}}},more:{hidden:true,getAttribute:()=> 'Retry'}};
 vm.createContext(c);vm.runInContext(source.slice(start,end),c);c.failedFilter();
 assert.equal(c.retryFilter,true);assert.equal(c.list.hidden,true);assert.equal(c.more.hidden,false);assert.equal(c.more.textContent,'Retry');assert.equal(c.more.href,c.location.href);
});
