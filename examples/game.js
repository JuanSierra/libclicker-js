import { World, Currency, Creator, Modifier, Automator } from "./libclicker.min.mjs";
let Generator = Creator;

const $ = document.querySelector.bind(document), $$ = document.querySelectorAll.bind(document); var __ =function(){var e=this&&this.__spreadArray||function(e,n,t){if(t||2===arguments.length)for(var r,o=0,u=n.length;o<u;o++)!r&&o in n||(r||(r=Array.prototype.slice.call(n,0,o)),r[o]=n[o]);return e.concat(r||Array.prototype.slice.call(n))},n="\x3c!--".concat("➳❍","--\x3e"),t="\x3c!--".concat("❍⇚","--\x3e"),r=new Map,o=new Set,u=new Set,c=!1,a=new WeakMap;function f(e,n){r.forEach((function(t){var r=t.get(e);r||(r=new Set,t.set(e,r)),r.add(n)}))}function i(e){return"function"==typeof e&&!!e.isT}function l(e){return"object"==typeof e&&null!==e&&"function"==typeof e.$on}function p(e,n){return Object.prototype.hasOwnProperty.call(e,n)}function s(e){var n=document.createElement("template");n.innerHTML=e;var t=n.content.cloneNode(!0);return t.normalize(),t.childNodes}function d(n){void 0===n&&(n=Symbol());var r="",o=[],u=[],c=[],a=new Map,f=function(){u.length||v();var e=y(h(s(r),o)());return l(),e};f.ch=function(){return c},f.l=0,f.add=function(e){var n;if(e||0===e){var c,l,p=e,s=[];i(e)?(p=(n=e._h())[0],s=n[1],c=n[2]):p="\x3c!----\x3e"===(l=String(e))?l:l.replace(/[<>]/g,(function(e){return">"===e?"&gt;":"&lt;"})),r+=p,r+=t;var d=c&&a.get(c),h=d||{html:p,exp:s,dom:[],tpl:e,key:c};u.push(h),c&&(d?d.exp.forEach((function(e,n){return e._up(s[n].e)})):a.set(c,h)),s.forEach((function(e){return o.push(e)})),f.l++}},f._up=function(){var e=d(n),t=0,r=c[0].dom[0];u.length||v(document.createComment(""));var o=function(){if(e.l){var n=e(),o=n.lastChild;r[t?"after":"before"](n),g(e,u,t),r=o}};u.forEach((function(n,u){var a=c[u];n.key&&n.dom.length?(o(),a&&a.dom===n.dom||r[u?"after":"before"].apply(r,n.dom),r=n.dom[n.dom.length-1]):a&&n.html===a.html&&!a.key?(o(),a.exp.forEach((function(e,t){return e._up(n.exp[t].e)})),n.exp=a.exp,n.dom=a.dom,r=n.dom[n.dom.length-1]):(e.l||(t=u),e.add(n.tpl))})),o();for(var a=r.nextSibling;a&&p(a,n);){var f=a.nextSibling;m(a),a=f}l()};var l=function(){r="",f.l=0,o=[],c=e([],u,!0),u=[]},v=function(e){r="\x3c!----\x3e",u.push({html:r,exp:[],dom:e?[e]:[],tpl:r,key:0})},y=function(e){var t=0,r=[];return e.childNodes.forEach((function(e){if(8===e.nodeType&&"❍⇚"===e.data)return t++,void r.push(e);Object.defineProperty(e,n,{value:n}),u[t].dom.push(e)})),r.forEach((function(e){return e.remove()})),e},g=function(e,n,t){e.ch().forEach((function(e,r){n[t+r].dom=e.dom}))};return f}function h(e,n){for(var t,r=document.createDocumentFragment();t=e.item(0);)8!==t.nodeType||"➳❍"!==t.nodeValue?(t instanceof Element&&v(t,n),t.hasChildNodes()&&h(t.childNodes,n)(t),r.append(t),t instanceof HTMLOptionElement&&(t.selected=t.defaultSelected)):r.append(y(t,n));return function(e){return e?(e.appendChild(r),e):r}}function v(e,t){if(e.hasAttributes()){for(var r=e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement,o=e.attributes.length,u=[],c=[],f=0;f<o;f++)c.push(e.attributes[f]);c.forEach((function(o){var c,f=o.name;if(-1!==o.value.indexOf(n)){var i=t.shift();if("@"===f.charAt(0)){var l=f.substring(1);e.addEventListener(l,i),a.has(e)||a.set(e,new Map),null===(c=a.get(e))||void 0===c||c.set(l,i),u.push(f)}else E(i,(function(n){r&&"value"===f?e.value=n:!1!==n?e.setAttribute(f,n):e.removeAttribute(f)}))}})),u.forEach((function(n){return e.removeAttribute(n)}))}}function m(e){var n;e.remove(),null===(n=a.get(e))||void 0===n||n.forEach((function(n,t){return e.removeEventListener(t,n)}))}function y(e,n){var t=document.createDocumentFragment();e.remove();var r=d(),o=n.shift();if(o&&i(o.e))r.add(o.e);else{r.l&&t.appendChild(r());var u=document.createTextNode("");u=E(o,(function(e){return g(u,e)})),t.appendChild(u instanceof Node?u:u())}return r.l&&t.appendChild(r()),t}function g(e,n){if(!Array.isArray(n))return g(e,[n]);var t="function"==typeof e,r=t?e:d();return n.forEach((function(e){return r.add(e)})),t&&r._up(),r}function E(e,n){var t=Symbol();r.has(t)||r.set(t,new Map);var a=new Map,f=function(e){return function(n,t){o.size||setTimeout((function(){c=!0,o.forEach((function(e){return e(n,t)})),o.clear(),c=!1,u.forEach((function(e){return e()})),u.clear()})),!c&&o.add(e)}}(i);function i(){r.set(t,new Map);var o=e(),u=r.get(t);return r.delete(t),a.forEach((function(e,n){var t=u.get(n);t&&t.forEach((function(n){return e.delete(n)})),e.forEach((function(e){return n.$off(e,f)}))})),u.forEach((function(e,n){e.forEach((function(e){return n.$on(e,f)}))})),a=u,n?n(o):o}return function(e){return p(e,"$on")}(e)&&e.$on(i),i()}function _(e,n){var t=n._st();return t.o&&t.o.forEach((function(n,t){n.forEach((function(n){e.$on(t,n)}))})),t.p&&(e._p=t.p),e}function x(n,t,r,o){var u=function(){for(var o,u=[],c=0;c<arguments.length;c++)u[c]=arguments[c];var a=(o=Array.prototype[n]).call.apply(o,e([t],u,!1));if(t.forEach((function(e,n){return r._em(String(n),e)})),r._p){var f=r._p,i=f[0],l=f[1];l._em(i,r)}return a};switch(n){case"shift":case"pop":case"sort":case"reverse":case"copyWithin":return u;case"unshift":case"push":case"fill":return function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return u.apply(void 0,e.map((function(e){return b(e)})))};case"splice":return function(n,t){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];return u.apply(void 0,e([n,t],r.map((function(e){return b(e)})),!1))};default:return o}}function b(e,n){if(void 0===n&&(n={}),l(e)||"object"!=typeof e)return e;var t=n.o||new Map,r=n.op||new Map,o=Array.isArray(e),u=[],c=o?[]:Object.create(e,{});for(var a in e){var i=e[a];"object"==typeof i&&null!==i?(c[a]=l(i)?i:b(i),u.push(a)):c[a]=i}var s=function(e){return function(n,o){var u=t.get(n),c=r.get(o);u||(u=new Set,t.set(n,u)),c||(c=new Set,r.set(o,c)),u[e](o),c[e](n)}},d=s("add"),h=s("delete"),v=function(e,n,r){t.has(e)&&t.get(e).forEach((function(e){return e(n,r)}))},m={$on:d,$off:h,_em:v,_st:function(){return{o:t,op:r,r:c,p:y._p}},_p:void 0},y=new Proxy(c,{get:function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=e[1];if(Reflect.has(m,t))return Reflect.get(m,t);var r=Reflect.get.apply(Reflect,e);return f(y,t),o&&p(Array.prototype,t)?x(t,c,y,r):r},set:function(){for(var e,n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var r=n[0],o=n[1],u=n[2],c=Reflect.get(r,o);if(Reflect.has(m,o))return Reflect.set(m,o,u);if(u&&l(c)){var a=c,f=a._st(),i=l(u)?_(u,a):b(u,f);return Reflect.set(r,o,i),v(o,i),f.o.forEach((function(e,n){var t=Reflect.get(c,n),r=Reflect.get(i,n);t!==r&&a._em(n,r,t)})),!0}var p=Reflect.set.apply(Reflect,n);return p&&(c!==u&&v(o,u,c),y._p&&(e=y._p[1])._em.apply(e,y._p)),p}});return u.map((function(e){y[e]._p=[e,y]})),y}return{t:function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var o=[],u="",c=function(e,t){if("function"==typeof e){var r=function(){};return o.push(Object.assign((function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return e.apply(void 0,n)}),{e:e,$on:function(e){r=e},_up:function(n){e=n,r()}})),t+n}return Array.isArray(e)?e.reduce((function(e,n){return c(n,e)}),t):t+e},a=function(){return u||(u=e.reduce((function(e,n,r){return e+=n,void 0!==t[r]?c(t[r],e):e}),"")),u},f=function(e){var n=h(s(a()),o);return e?n(e):n()};return f.isT=!0,f._k=0,f._h=function(){return[a(),o,f._k]},f.key=function(e){return f._k=e,f},f},w:E,r:b}}();let {r, t, w} = __; 

let world = new World();
world.update(1.0 / 60.0);

let energy = new Currency.Builder(world)
    .name("Energy")
    .build();

let chips = new Currency.Builder(world)
  .name("Chips")
  .build();

let gen_energy_button = new Generator.Builder(world)
.price(5)
.baseAmount(1)
.multiplier(2)
.useRemainder()
.generate(energy)
.build();


let gen_chip_button = new Generator.Builder(world)
.baseAmount(1)
.multiplier(2)
.useRemainder()
.generate(energy)
.build();

//gen_energy_button.upgrade();
console.log(energy.value);

const data = r({
  energy: 0,
  chips: 0,
  energyLevel: 1
})

function addItem(e) {
  e.preventDefault();
  
  const input = $('#new-item')
  data.items.push({
    id: Math.random(),
    task: input.value,
  })
  input.value = ''
}

function addChip(e) {
  e.preventDefault()
  //const input = document.getElementById('new-item')
  /*data.items.push({
    id: Math.random(),
    task: input.value,
  })
  input.value = ''*/
  if(energy.value >= 10)
  {
  	energy.sub(10);
    chips.add(1);
  }
  
  render();
}

function addEnergy(e) {
  e.preventDefault()

	//generator_button.process();
  energy.add(1);
	render();
}

function canUpgradeEnergy(){
	if (data.energy > gen_energy_button.basePrice)
  	return false;
    
  return true;
}

function render(){
	data.energy = energy.value;
	data.chips = chips.value;
	data.energyLevel = gen_energy_button.itemLevel + 1;
}

function indicators(){

  return t`
    <div class="column col-5">
      <div class="text-center">
        <span>⚡</span>
        <span>Qty: ${() => data.energy}</span>
      </div>
    </div>
    <div class="divider-vert text-center column col-2"></div>
    <div class="column col-5">
      <div class="text-center">
        <span>💵</span>
        <span>Qty: 13</span>
      </div>
    </div>
  `
}

t`
<div class="container">
  <div class="columns">
  	${() => indicators(data.energyLevel)}
     <div class="column col-10 flex-centered">
       <button class="btn btn-block p-centered">
        press
      </button>
     </div>
      <div class="column col-2">
        <label class="form-checkbox">
          <input type="checkbox">
          <i class="form-icon"></i> auto
        </label>
        <button class="btn btn-sm btn-block">
            lvl 2
        </button>
      </div>
    <div class="column col-12">
      <span>
       ${() => data.energy} 
      </span>

      <button @click="${addEnergy}">
        energy
      </button>

      <button disabled="${canUpgradeEnergy}">
        auto: lvl ${() => data.energyLevel}
      </button>
    </div>
  <div class="column col-12">
    <span>
     ${() => data.chips} 
    </span>

    <button @click="${addChip}">
      chips
    </button>
  </div>
</div>  
<div class="divider"></div>
</div>  
`($('#app'));