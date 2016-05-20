/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2016
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(F){function p(d,a,b){var g=0,f=[],c=0,e,k,l,h,m,u,q,v=!1,n=[],r=[],t,p=!1;b=b||{};e=b.encoding||"UTF8";t=b.numRounds||1;l=y(a,e);if(t!==parseInt(t,10)||1>t)throw Error("numRounds must a integer >= 1");if("SHA-1"===d)m=512,u=z,q=G,h=160;else throw Error("Chosen SHA variant is not supported");k=w(d);this.setHMACKey=function(a,b,c){var f;if(!0===v)throw Error("HMAC key already set");if(!0===p)throw Error("Cannot set HMAC key after calling update");e=(c||{}).encoding||"UTF8";b=
y(b,e)(a);a=b.binLen;b=b.value;f=m>>>3;c=f/4-1;if(f<a/8){for(b=q(b,a,0,w(d));b.length<=c;)b.push(0);b[c]&=4294967040}else if(f>a/8){for(;b.length<=c;)b.push(0);b[c]&=4294967040}for(a=0;a<=c;a+=1)n[a]=b[a]^909522486,r[a]=b[a]^1549556828;k=u(n,k);g=m;v=!0};this.update=function(a){var b,d,e,h=0,q=m>>>5;b=l(a,f,c);a=b.binLen;d=b.value;b=a>>>5;for(e=0;e<b;e+=q)h+m<=a&&(k=u(d.slice(e,e+q),k),h+=m);g+=h;f=d.slice(h>>>5);c=a%m;p=!0};this.getHash=function(a,b){var e,l,m,n;if(!0===v)throw Error("Cannot call getHash after setting HMAC key");
m=A(b);switch(a){case "HEX":e=function(a){return B(a,m)};break;case "B64":e=function(a){return C(a,m)};break;case "BYTES":e=D;break;case "ARRAYBUFFER":try{l=new ArrayBuffer(0)}catch(L){throw Error("ARRAYBUFFER not supported by this environment");}e=E;break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}n=q(f.slice(),c,g,k.slice());for(l=1;l<t;l+=1)n=q(n,h,0,w(d));return e(n)};this.getHMAC=function(a,b){var e,l,n,p;if(!1===v)throw Error("Cannot call getHMAC without first setting HMAC key");
n=A(b);switch(a){case "HEX":e=function(a){return B(a,n)};break;case "B64":e=function(a){return C(a,n)};break;case "BYTES":e=D;break;case "ARRAYBUFFER":try{e=new ArrayBuffer(0)}catch(t){throw Error("ARRAYBUFFER not supported by this environment");}e=E;break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");}l=q(f.slice(),c,g,k.slice());p=u(r,w(d));p=q(l,h,m,p);return e(p)}}function H(d,a,b){var g=d.length,f,c,e,k,l;a=a||[0];b=b||0;l=b>>>3;if(0!==g%2)throw Error("String of HEX type must be in byte increments");
for(f=0;f<g;f+=2){c=parseInt(d.substr(f,2),16);if(isNaN(c))throw Error("String of HEX type contains invalid characters");k=(f>>>1)+l;for(e=k>>>2;a.length<=e;)a.push(0);a[e]|=c<<8*(3-k%4)}return{value:a,binLen:4*g+b}}function I(d,a,b){var g=[],f,c,e,k,g=a||[0];b=b||0;c=b>>>3;for(f=0;f<d.length;f+=1)a=d.charCodeAt(f),k=f+c,e=k>>>2,g.length<=e&&g.push(0),g[e]|=a<<8*(3-k%4);return{value:g,binLen:8*d.length+b}}function J(d,a,b){var g=[],f=0,c,e,k,l,h,m,g=a||[0];b=b||0;a=b>>>3;if(-1===d.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");
e=d.indexOf("=");d=d.replace(/\=/g,"");if(-1!==e&&e<d.length)throw Error("Invalid '=' found in base-64 string");for(e=0;e<d.length;e+=4){h=d.substr(e,4);for(k=l=0;k<h.length;k+=1)c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[k]),l|=c<<18-6*k;for(k=0;k<h.length-1;k+=1){m=f+a;for(c=m>>>2;g.length<=c;)g.push(0);g[c]|=(l>>>16-8*k&255)<<8*(3-m%4);f+=1}}return{value:g,binLen:8*f+b}}function K(d,a,b){var g=[],f,c,e,g=a||[0];b=b||0;f=b>>>3;for(a=0;a<d.byteLength;a+=1)e=a+
f,c=e>>>2,g.length<=c&&g.push(0),g[c]|=d[a]<<8*(3-e%4);return{value:g,binLen:8*d.byteLength+b}}function B(d,a){var b="",g=4*d.length,f,c;for(f=0;f<g;f+=1)c=d[f>>>2]>>>8*(3-f%4),b+="0123456789abcdef".charAt(c>>>4&15)+"0123456789abcdef".charAt(c&15);return a.outputUpper?b.toUpperCase():b}function C(d,a){var b="",g=4*d.length,f,c,e;for(f=0;f<g;f+=3)for(e=f+1>>>2,c=d.length<=e?0:d[e],e=f+2>>>2,e=d.length<=e?0:d[e],e=(d[f>>>2]>>>8*(3-f%4)&255)<<16|(c>>>8*(3-(f+1)%4)&255)<<8|e>>>8*(3-(f+2)%4)&255,c=0;4>
c;c+=1)8*f+6*c<=32*d.length?b+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>>6*(3-c)&63):b+=a.b64Pad;return b}function D(d){var a="",b=4*d.length,g,f;for(g=0;g<b;g+=1)f=d[g>>>2]>>>8*(3-g%4)&255,a+=String.fromCharCode(f);return a}function E(d){var a=4*d.length,b,g=new ArrayBuffer(a);for(b=0;b<a;b+=1)g[b]=d[b>>>2]>>>8*(3-b%4)&255;return g}function A(d){var a={outputUpper:!1,b64Pad:"="};d=d||{};a.outputUpper=d.outputUpper||!1;!0===d.hasOwnProperty("b64Pad")&&(a.b64Pad=
d.b64Pad);if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function y(d,a){var b;switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(d){case "HEX":b=H;break;case "TEXT":b=function(b,d,c){var e=[],k=[],l=0,h,m,n,q,p,e=d||[0];d=c||0;n=d>>>3;if("UTF8"===a)for(h=0;h<b.length;h+=1)for(c=b.charCodeAt(h),
k=[],128>c?k.push(c):2048>c?(k.push(192|c>>>6),k.push(128|c&63)):55296>c||57344<=c?k.push(224|c>>>12,128|c>>>6&63,128|c&63):(h+=1,c=65536+((c&1023)<<10|b.charCodeAt(h)&1023),k.push(240|c>>>18,128|c>>>12&63,128|c>>>6&63,128|c&63)),m=0;m<k.length;m+=1){p=l+n;for(q=p>>>2;e.length<=q;)e.push(0);e[q]|=k[m]<<8*(3-p%4);l+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(h=0;h<b.length;h+=1){c=b.charCodeAt(h);"UTF16LE"===a&&(m=c&255,c=m<<8|c>>>8);p=l+n;for(q=p>>>2;e.length<=q;)e.push(0);e[q]|=c<<8*(2-p%4);l+=2}return{value:e,
binLen:8*l+d}};break;case "B64":b=J;break;case "BYTES":b=I;break;case "ARRAYBUFFER":try{b=new ArrayBuffer(0)}catch(g){throw Error("ARRAYBUFFER not supported by this environment");}b=K;break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");}return b}function n(d,a){return d<<a|d>>>32-a}function r(d,a){var b=(d&65535)+(a&65535);return((d>>>16)+(a>>>16)+(b>>>16)&65535)<<16|b&65535}function x(d,a,b,g,f){var c=(d&65535)+(a&65535)+(b&65535)+(g&65535)+(f&65535);return((d>>>16)+
(a>>>16)+(b>>>16)+(g>>>16)+(f>>>16)+(c>>>16)&65535)<<16|c&65535}function w(d){if("SHA-1"===d)d=[1732584193,4023233417,2562383102,271733878,3285377520];else throw Error("No SHA variants supported");return d}function z(d,a){var b=[],g,f,c,e,k,l,h;g=a[0];f=a[1];c=a[2];e=a[3];k=a[4];for(h=0;80>h;h+=1)b[h]=16>h?d[h]:n(b[h-3]^b[h-8]^b[h-14]^b[h-16],1),l=20>h?x(n(g,5),f&c^~f&e,k,1518500249,b[h]):40>h?x(n(g,5),f^c^e,k,1859775393,b[h]):60>h?x(n(g,5),f&c^f&e^c&e,k,2400959708,b[h]):x(n(g,5),f^c^e,k,3395469782,
b[h]),k=e,e=c,c=n(f,30),f=g,g=l;a[0]=r(g,a[0]);a[1]=r(f,a[1]);a[2]=r(c,a[2]);a[3]=r(e,a[3]);a[4]=r(k,a[4]);return a}function G(d,a,b,g){var f;for(f=(a+65>>>9<<4)+15;d.length<=f;)d.push(0);d[a>>>5]|=128<<24-a%32;d[f]=a+b;b=d.length;for(a=0;a<b;a+=16)g=z(d.slice(a,a+16),g);return g}"function"===typeof define&&define.amd?define(function(){return p}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=p:exports=p:F.jsSHA=p})(this);
