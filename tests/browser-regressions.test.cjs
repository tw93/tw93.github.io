const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const notes = fs.readFileSync('js/notes.js', 'utf8');
function section(start, end) { return notes.slice(notes.indexOf(start), notes.indexOf(end)); }
function select(values) {
  return { options: values.map(value => ({value, text:value})), selectedIndex:0,
    set value(v) {this.selectedIndex=this.options.findIndex(o=>o.value===v);},
    get value(){return this.options[this.selectedIndex]?.value || '';}, style:{} };
}
test('unknown filter values reset to a valid option in both language lists', () => {
  for (const years of [['','2026','2022'],['','2026']]) {
    const c={input:{},state:{q:'',c:'missing',y:'2021',t:'bad',sort:'bad'},cat:select(['','ai']),year:select(years),type:select(['','photo']),sort:select(['','likes']),ruler:{offsetWidth:20},searching(){}};
    vm.createContext(c);
    vm.runInContext(section('  var fit =', '  var searching =') + section('  var syncControls =', '  // Endless scrolling. Re-observing'),c);
    vm.runInContext('syncControls()',c);
    for(const key of ['c','y','t','sort'])assert.equal(c.state[key],'');
  }
});
test('month failures keep the cursor and a successful retry adds that month', async () => {
  for(const failure of ['offline','503','invalid']) {
    const c={token:0,mode:'months',monthAt:0,months:['/month/'],watch(){},document:{getElementById(){return null},adoptNode(x){return x}},list:{added:[],appendChild(x){this.added.push(x)}},DOMParser:class {parseFromString(text){return {querySelector(){return text==='valid'?{}:null},querySelectorAll(){return text==='valid'?[{id:'note-1'}]:[]}}}},fetch:async()=>{if(failure==='offline')throw Error('offline');return {ok:failure!=='503',text:async()=>failure==='invalid'?'bad':'valid'}}};
    vm.createContext(c);vm.runInContext(section('  var renderMore =','  var syncUrl ='),c);
    await assert.rejects(c.renderMore());assert.equal(c.monthAt,0);assert.equal(c.list.added.length,0);
    c.fetch=async()=>({ok:true,text:async()=> 'valid'});
    await c.renderMore();assert.equal(c.monthAt,1);assert.equal(c.list.added.length,1);
  }
});
test('a failed load leaves the existing more link usable', async()=>{
  const c={busy:false,token:0,more:{hidden:false,getAttribute:()=> 'More'},observer:{unobserve(){},observe(){}},sentinel:{},renderMore:()=>Promise.reject(Error('offline')),clearTimeout(){},waitTimer:null,list:{classList:{remove(){}}},mode:'months',months:['/month/'],monthAt:0,olderText:'Older',step:null};
  vm.createContext(c);vm.runInContext(section('  var step =','  var observer ='),c);c.step();await new Promise(setImmediate);assert.equal(c.more.hidden,false);assert.equal(c.more.href,'/month/');assert.equal(c.busy,false);
});
test('the first search resumes after its data arrives',async()=>{
  let resolve;const data=new Promise(r=>resolve=r);
  const elements={};for(const id of ['search-modal','search-input','search-results','search-btn','search-close'])elements[id]={value:'',innerHTML:'',addEventListener(){},setAttribute(){},classList:{contains:()=>true}};
  const c={document:{readyState:'complete',getElementById:id=>elements[id],addEventListener(){}},window:{location:{pathname:'/'}},fetch:()=>data,console,setTimeout,clearTimeout};
  let source=fs.readFileSync('js/search.js','utf8');source=source.replace('  // Initialize when DOM is loaded','  globalThis.probe = {loadSearchData,performSearch};\n  // Initialize when DOM is loaded');
  vm.runInNewContext(source,c);elements['search-input'].value='missing';c.probe.loadSearchData();c.probe.performSearch();assert.match(elements['search-results'].innerHTML,/Loading/);
  resolve({json:async()=>[]});await new Promise(setImmediate);assert.match(elements['search-results'].innerHTML,/No results/);
});
