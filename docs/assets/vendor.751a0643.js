function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function s(t,n){t.appendChild(n)}function a(t,n,e){t.insertBefore(n,e||null)}function u(t){t.parentNode.removeChild(t)}function i(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function l(){return f(" ")}function d(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function p(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function $(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function h(t,n){for(let e=0;e<t.options.length;e+=1){const o=t.options[e];if(o.__value===n)return void(o.selected=!0)}t.selectedIndex=-1}function g(t){const n=t.querySelector(":checked")||t.options[0];return n&&n.__value}let m;function _(t){m=t}const b=[],y=[],x=[],v=[],k=Promise.resolve();let E=!1;function w(t){x.push(t)}let j=!1;const A=new Set;function S(){if(!j){j=!0;do{for(let t=0;t<b.length;t+=1){const n=b[t];_(n),N(n.$$)}for(_(null),b.length=0;y.length;)y.pop()();for(let t=0;t<x.length;t+=1){const n=x[t];A.has(n)||(A.add(n),n())}x.length=0}while(b.length);for(;v.length;)v.pop()();E=!1,j=!1,A.clear()}}function N(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(w)}}const O=new Set;function q(t,n){-1===t.$$.dirty[0]&&(b.push(t),E||(E=!0,k.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function C(c,s,a,i,f,l,d,p=[-1]){const $=m;_(c);const h=c.$$={fragment:null,ctx:null,props:l,update:t,not_equal:f,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map($?$.$$.context:s.context||[]),callbacks:e(),dirty:p,skip_bound:!1,root:s.target||$.$$.root};d&&d(h.root);let g=!1;if(h.ctx=a?a(c,s.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return h.ctx&&f(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),g&&q(c,t)),n})):[],h.update(),g=!0,o(h.before_update),h.fragment=!!i&&i(h.ctx),s.target){if(s.hydrate){const t=(x=s.target,Array.from(x.childNodes));h.fragment&&h.fragment.l(t),t.forEach(u)}else h.fragment&&h.fragment.c();s.intro&&((b=c.$$.fragment)&&b.i&&(O.delete(b),b.i(y))),function(t,e,c,s){const{fragment:a,on_mount:u,on_destroy:i,after_update:f}=t.$$;a&&a.m(e,c),s||w((()=>{const e=u.map(n).filter(r);i?i.push(...e):o(e),t.$$.on_mount=[]})),f.forEach(w)}(c,s.target,s.anchor,s.customElement),S()}var b,y,x;_($)}class L{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}export{L as S,a,l as b,p as c,u as d,i as e,w as f,s as g,h,C as i,$ as j,g as k,d as l,t as n,o as r,c as s,f as t};
