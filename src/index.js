
var ronchModule = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(ronchModule) {
  ronchModule = ronchModule || {};


var b;b||(b=typeof ronchModule !== 'undefined' ? ronchModule : {});var m,q;b.ready=new Promise(function(a,c){m=a;q=c});var r={},w;for(w in b)b.hasOwnProperty(w)&&(r[w]=b[w]);var x=!1,y=!1,z=!1,A=!1;x="object"===typeof window;y="function"===typeof importScripts;z="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;A=!x&&!z&&!y;var C="",D,E,F,G,H;
if(z)C=y?require("path").dirname(C)+"/":__dirname+"/",D=function(a,c){G||(G=require("fs"));H||(H=require("path"));a=H.normalize(a);return G.readFileSync(a,c?null:"utf8")},F=function(a){a=D(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",function(a){throw a;}),process.on("unhandledRejection",I),b.inspect=function(){return"[Emscripten Module object]"};else if(A)"undefined"!=
typeof read&&(D=function(a){return read(a)}),F=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(x||y)y?C=self.location.href:"undefined"!==typeof document&&document.currentScript&&(C=document.currentScript.src),_scriptDir&&(C=_scriptDir),0!==
C.indexOf("blob:")?C=C.substr(0,C.lastIndexOf("/")+1):C="",D=function(a){var c=new XMLHttpRequest;c.open("GET",a,!1);c.send(null);return c.responseText},y&&(F=function(a){var c=new XMLHttpRequest;c.open("GET",a,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}),E=function(a,c,e){var d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="arraybuffer";d.onload=function(){200==d.status||0==d.status&&d.response?c(d.response):e()};d.onerror=e;d.send(null)};
var aa=b.print||console.log.bind(console),J=b.printErr||console.warn.bind(console);for(w in r)r.hasOwnProperty(w)&&(b[w]=r[w]);r=null;var L;b.wasmBinary&&(L=b.wasmBinary);var noExitRuntime=b.noExitRuntime||!0;"object"!==typeof WebAssembly&&I("no native wasm support detected");var M,N=!1;function assert(a,c){a||I("Assertion failed: "+c)}function ba(a){var c=b["_"+a];assert(c,"Cannot call unknown function "+a+", make sure it is exported");return c}
var ca="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function da(a,c,e){var d=c+e;for(e=c;a[e]&&!(e>=d);)++e;if(16<e-c&&a.subarray&&ca)return ca.decode(a.subarray(c,e));for(d="";c<e;){var f=a[c++];if(f&128){var h=a[c++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|h);else{var t=a[c++]&63;f=224==(f&240)?(f&15)<<12|h<<6|t:(f&7)<<18|h<<12|t<<6|a[c++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}var ea,fa,O,P;
function ha(){var a=M.buffer;ea=a;b.HEAP8=fa=new Int8Array(a);b.HEAP16=new Int16Array(a);b.HEAP32=P=new Int32Array(a);b.HEAPU8=O=new Uint8Array(a);b.HEAPU16=new Uint16Array(a);b.HEAPU32=new Uint32Array(a);b.HEAPF32=new Float32Array(a);b.HEAPF64=new Float64Array(a)}var Q,ia=[],ja=[],ka=[],la=[];function ma(){var a=b.preRun.shift();ia.unshift(a)}var R=0,S=null,T=null;b.preloadedImages={};b.preloadedAudios={};
function I(a){if(b.onAbort)b.onAbort(a);J(a);N=!0;a=new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");q(a);throw a;}function U(a){var c=V;return String.prototype.startsWith?c.startsWith(a):0===c.indexOf(a)}function na(){return U("data:application/octet-stream;base64,")}var V="index.wasm";if(!na()){var oa=V;V=b.locateFile?b.locateFile(oa,C):C+oa}
function pa(){var a=V;try{if(a==V&&L)return new Uint8Array(L);if(F)return F(a);throw"both async and sync fetching of the wasm failed";}catch(c){I(c)}}
function qa(){if(!L&&(x||y)){if("function"===typeof fetch&&!U("file://"))return fetch(V,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+V+"'";return a.arrayBuffer()}).catch(function(){return pa()});if(E)return new Promise(function(a,c){E(V,function(e){a(new Uint8Array(e))},c)})}return Promise.resolve().then(function(){return pa()})}
function W(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c(b);else{var e=c.u;"number"===typeof e?void 0===c.s?Q.get(e)():Q.get(e)(c.s):e(void 0===c.s?null:c.s)}}}
var ra=[null,[],[]],sa={e:function(){I()},c:function(a,c,e){O.copyWithin(a,c,c+e)},d:function(a){var c=O.length;if(2147483648<a)return!1;for(var e=1;4>=e;e*=2){var d=c*(1+.2/e);d=Math.min(d,a+100663296);d=Math.max(a,d);0<d%65536&&(d+=65536-d%65536);a:{try{M.grow(Math.min(2147483648,d)-ea.byteLength+65535>>>16);ha();var f=1;break a}catch(h){}f=void 0}if(f)return!0}return!1},f:function(){return 0},b:function(){},a:function(a,c,e,d){for(var f=0,h=0;h<e;h++){for(var t=P[c+8*h>>2],n=P[c+(8*h+4)>>2],B=
0;B<n;B++){var g=O[t+B],p=ra[a];0===g||10===g?((1===a?aa:J)(da(p,0)),p.length=0):p.push(g)}f+=n}P[d>>2]=f;return 0},g:function(a){var c=Date.now()/1E3|0;a&&(P[a>>2]=c);return c}};
(function(){function a(f){b.asm=f.exports;M=b.asm.h;ha();Q=b.asm.m;ja.unshift(b.asm.i);R--;b.monitorRunDependencies&&b.monitorRunDependencies(R);0==R&&(null!==S&&(clearInterval(S),S=null),T&&(f=T,T=null,f()))}function c(f){a(f.instance)}function e(f){return qa().then(function(h){return WebAssembly.instantiate(h,d)}).then(f,function(h){J("failed to asynchronously prepare wasm: "+h);I(h)})}var d={a:sa};R++;b.monitorRunDependencies&&b.monitorRunDependencies(R);if(b.instantiateWasm)try{return b.instantiateWasm(d,
a)}catch(f){return J("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return L||"function"!==typeof WebAssembly.instantiateStreaming||na()||U("file://")||"function"!==typeof fetch?e(c):fetch(V,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(c,function(h){J("wasm streaming compile failed: "+h);J("falling back to ArrayBuffer instantiation");return e(c)})})})().catch(q);return{}})();
b.___wasm_call_ctors=function(){return(b.___wasm_call_ctors=b.asm.i).apply(null,arguments)};b._calcRonch=function(){return(b._calcRonch=b.asm.j).apply(null,arguments)};b._malloc=function(){return(b._malloc=b.asm.k).apply(null,arguments)};b._free=function(){return(b._free=b.asm.l).apply(null,arguments)};
var ta=b.stackSave=function(){return(ta=b.stackSave=b.asm.n).apply(null,arguments)},ua=b.stackRestore=function(){return(ua=b.stackRestore=b.asm.o).apply(null,arguments)},X=b.stackAlloc=function(){return(X=b.stackAlloc=b.asm.p).apply(null,arguments)};
b.ccall=function(a,c,e,d){var f={string:function(g){var p=0;if(null!==g&&void 0!==g&&0!==g){var u=(g.length<<2)+1;p=X(u);var l=p,v=O;if(0<u){u=l+u-1;for(var K=0;K<g.length;++K){var k=g.charCodeAt(K);if(55296<=k&&57343>=k){var va=g.charCodeAt(++K);k=65536+((k&1023)<<10)|va&1023}if(127>=k){if(l>=u)break;v[l++]=k}else{if(2047>=k){if(l+1>=u)break;v[l++]=192|k>>6}else{if(65535>=k){if(l+2>=u)break;v[l++]=224|k>>12}else{if(l+3>=u)break;v[l++]=240|k>>18;v[l++]=128|k>>12&63}v[l++]=128|k>>6&63}v[l++]=128|k&
63}}v[l]=0}}return p},array:function(g){var p=X(g.length);fa.set(g,p);return p}},h=ba(a),t=[];a=0;if(d)for(var n=0;n<d.length;n++){var B=f[e[n]];B?(0===a&&(a=ta()),t[n]=B(d[n])):t[n]=d[n]}e=h.apply(null,t);e=function(g){return"string"===c?g?da(O,g,void 0):"":"boolean"===c?!!g:g}(e);0!==a&&ua(a);return e};var Y;T=function wa(){Y||Z();Y||(T=wa)};
function Z(){function a(){if(!Y&&(Y=!0,b.calledRun=!0,!N)){W(ja);W(ka);m(b);if(b.onRuntimeInitialized)b.onRuntimeInitialized();if(b.postRun)for("function"==typeof b.postRun&&(b.postRun=[b.postRun]);b.postRun.length;){var c=b.postRun.shift();la.unshift(c)}W(la)}}if(!(0<R)){if(b.preRun)for("function"==typeof b.preRun&&(b.preRun=[b.preRun]);b.preRun.length;)ma();W(ia);0<R||(b.setStatus?(b.setStatus("Running..."),setTimeout(function(){setTimeout(function(){b.setStatus("")},1);a()},1)):a())}}b.run=Z;
if(b.preInit)for("function"==typeof b.preInit&&(b.preInit=[b.preInit]);0<b.preInit.length;)b.preInit.pop()();Z();


  return ronchModule.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = ronchModule;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return ronchModule; });
else if (typeof exports === 'object')
  exports["ronchModule"] = ronchModule;
