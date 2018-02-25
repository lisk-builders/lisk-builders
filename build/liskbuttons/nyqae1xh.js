/*! Built with http://stenciljs.com */

liskButtons.loadStyles("lisk-button-send",":host .btn{transition:all .2s ease;appearance:none;background:#fff;border:1px solid #5755d9;border-radius:2px;color:#5755d9;cursor:pointer;display:inline-block;font-size:16px;height:36px;line-height:20px;outline:0;padding:7px 8px;text-align:center;text-decoration:none;user-select:none;vertical-align:middle;white-space:nowrap}:host .btn:focus{box-shadow:0 0 0 .1rem rgba(87,85,217,.2)}:host .btn:focus,:host .btn:hover{background:#f1f1fc;border-color:#4b48d6;text-decoration:none}:host .btn.active,:host .btn:active{background:#4b48d6;border-color:#3634d2;color:#fff;text-decoration:none}:host .btn.active.loading::after,:host .btn:active.loading::after{border-bottom-color:#fff;border-left-color:#fff}:host .btn.disabled,:host .btn:disabled,:host .btn[disabled]{cursor:default;opacity:.5;pointer-events:none}:host .btn.btn-primary{background:#5755d9;border-color:#4b48d6;color:#fff}:host .btn.btn-primary:focus,:host .btn.btn-primary:hover{background:#4240d4;border-color:#3634d2;color:#fff}:host .btn.btn-primary.active,:host .btn.btn-primary:active{background:#3a38d2;border-color:#302ecd;color:#fff}:host .btn.btn-primary.loading::after{border-bottom-color:#fff;border-left-color:#fff}:host .btn.btn-link{background:0 0;border-color:transparent;color:#5755d9}:host .btn.btn-link.active,:host .btn.btn-link:active,:host .btn.btn-link:focus,:host .btn.btn-link:hover{color:#4240d4}:host .btn.btn-sm{font-size:14px;height:28px;padding:3px 6px}:host .btn.btn-lg{font-size:18px;height:40px;padding:9px 12px}:host .btn.btn-block{display:block;width:100%}:host .btn.btn-action{width:36px;padding-left:0;padding-right:0}:host .btn.btn-action.btn-sm{width:28px}:host .btn.btn-action.btn-lg{width:40px}:host .btn.btn-clear{background:0 0;border:0;color:currentColor;height:16px;line-height:16px;margin-left:4px;margin-right:-2px;opacity:1;padding:0;text-decoration:none;width:16px}:host .btn.btn-clear:hover{opacity:.95}:host .btn.btn-clear::before{content:\"\2715\"}:host .btn-group{display:inline-flex;flex-wrap:wrap}:host .btn-group .btn{flex:1 0 auto}:host .btn-group .btn:first-child:not(:last-child){border-bottom-right-radius:0;border-top-right-radius:0}:host .btn-group .btn:not(:first-child):not(:last-child){border-radius:0;margin-left:-1px}:host .btn-group .btn:last-child:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}:host .btn-group .btn.active,:host .btn-group .btn:active,:host .btn-group .btn:focus,:host .btn-group .btn:hover{z-index:1}:host .btn-group.btn-group-block{display:flex}:host .btn-group.btn-group-block .btn{flex:1 0 0}:host .loading{color:transparent!important;min-height:16px;pointer-events:none;position:relative}:host .loading::after{animation:loading .5s infinite linear;border:2px solid #5755d9;border-radius:50%;border-right-color:transparent;border-top-color:transparent;content:\"\";display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px;z-index:1}:host .loading.loading-lg{min-height:40px}:host .loading.loading-lg::after{height:32px;margin-left:-16px;margin-top:-16px;width:32px}@keyframes loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes slide-down{0%{opacity:0;transform:translateY(-32px)}100%{opacity:1;transform:translateY(0)}}:host .tooltip{position:relative}:host .tooltip::after{background:rgba(69,77,93,.9);border-radius:2px;bottom:100%;color:#fff;content:attr(data-tooltip);display:block;font-size:14px;left:50%;max-width:320px;opacity:0;overflow:hidden;padding:4px 8px;pointer-events:none;position:absolute;text-overflow:ellipsis;transform:translate(-50%,8px);transition:all .2s ease;white-space:pre;z-index:300}:host .tooltip:focus::after,:host .tooltip:hover::after{opacity:1;transform:translate(-50%,-4px)}:host .tooltip.disabled,:host .tooltip[disabled]{pointer-events:auto}:host .tooltip.tooltip-right::after{bottom:50%;left:100%;transform:translate(-4px,50%)}:host .tooltip.tooltip-right:focus::after,:host .tooltip.tooltip-right:hover::after{transform:translate(4px,50%)}:host .tooltip.tooltip-bottom::after{bottom:auto;top:100%;transform:translate(-50%,-8px)}:host .tooltip.tooltip-bottom:focus::after,:host .tooltip.tooltip-bottom:hover::after{transform:translate(-50%,4px)}:host .tooltip.tooltip-left::after{bottom:50%;left:auto;right:100%;transform:translate(8px,50%)}:host .tooltip.tooltip-left:focus::after,:host .tooltip.tooltip-left:hover::after{transform:translate(-4px,50%)}:host .btn-success{background:#32b643;border-color:#2faa3f;color:#fff}:host .btn-success:focus{box-shadow:0 0 0 .1rem rgba(50,182,67,.2)}:host .btn-success:focus,:host .btn-success:hover{background:#30ae40;border-color:#2da23c;color:#fff}:host .btn-success.active,:host .btn-success:active{background:#2a9a39;border-color:#278e34;color:#fff}:host .btn-success.loading::after{border-bottom-color:#fff;border-left-color:#fff}:host .btn-outline-success{background:#fff;border-color:#32b643;color:#32b643}:host .btn-outline-success:focus{box-shadow:0 0 0 .1rem rgba(50,182,67,.2)}:host .btn-outline-success:focus,:host .btn-outline-success:hover{background:#edfaef;border-color:#30ae40;color:#32b643}:host .btn-outline-success.active,:host .btn-outline-success:active{background:#32b643;border-color:#2da23c;color:#fff}:host .btn-outline-success.loading::after{border-bottom-color:#32b643;border-left-color:#32b643}\n:host(.hydrated){visibility:inherit !important}","lisk-button-vote",":host .btn{transition:all .2s ease;appearance:none;background:#fff;border:1px solid #5755d9;border-radius:2px;color:#5755d9;cursor:pointer;display:inline-block;font-size:16px;height:36px;line-height:20px;outline:0;padding:7px 8px;text-align:center;text-decoration:none;user-select:none;vertical-align:middle;white-space:nowrap}:host .btn:focus{box-shadow:0 0 0 .1rem rgba(87,85,217,.2)}:host .btn:focus,:host .btn:hover{background:#f1f1fc;border-color:#4b48d6;text-decoration:none}:host .btn.active,:host .btn:active{background:#4b48d6;border-color:#3634d2;color:#fff;text-decoration:none}:host .btn.active.loading::after,:host .btn:active.loading::after{border-bottom-color:#fff;border-left-color:#fff}:host .btn.disabled,:host .btn:disabled,:host .btn[disabled]{cursor:default;opacity:.5;pointer-events:none}:host .btn.btn-primary{background:#5755d9;border-color:#4b48d6;color:#fff}:host .btn.btn-primary:focus,:host .btn.btn-primary:hover{background:#4240d4;border-color:#3634d2;color:#fff}:host .btn.btn-primary.active,:host .btn.btn-primary:active{background:#3a38d2;border-color:#302ecd;color:#fff}:host .btn.btn-primary.loading::after{border-bottom-color:#fff;border-left-color:#fff}:host .btn.btn-link{background:0 0;border-color:transparent;color:#5755d9}:host .btn.btn-link.active,:host .btn.btn-link:active,:host .btn.btn-link:focus,:host .btn.btn-link:hover{color:#4240d4}:host .btn.btn-sm{font-size:14px;height:28px;padding:3px 6px}:host .btn.btn-lg{font-size:18px;height:40px;padding:9px 12px}:host .btn.btn-block{display:block;width:100%}:host .btn.btn-action{width:36px;padding-left:0;padding-right:0}:host .btn.btn-action.btn-sm{width:28px}:host .btn.btn-action.btn-lg{width:40px}:host .btn.btn-clear{background:0 0;border:0;color:currentColor;height:16px;line-height:16px;margin-left:4px;margin-right:-2px;opacity:1;padding:0;text-decoration:none;width:16px}:host .btn.btn-clear:hover{opacity:.95}:host .btn.btn-clear::before{content:\"\2715\"}:host .btn-group{display:inline-flex;flex-wrap:wrap}:host .btn-group .btn{flex:1 0 auto}:host .btn-group .btn:first-child:not(:last-child){border-bottom-right-radius:0;border-top-right-radius:0}:host .btn-group .btn:not(:first-child):not(:last-child){border-radius:0;margin-left:-1px}:host .btn-group .btn:last-child:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}:host .btn-group .btn.active,:host .btn-group .btn:active,:host .btn-group .btn:focus,:host .btn-group .btn:hover{z-index:1}:host .btn-group.btn-group-block{display:flex}:host .btn-group.btn-group-block .btn{flex:1 0 0}:host .loading{color:transparent!important;min-height:16px;pointer-events:none;position:relative}:host .loading::after{animation:loading .5s infinite linear;border:2px solid #5755d9;border-radius:50%;border-right-color:transparent;border-top-color:transparent;content:\"\";display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px;z-index:1}:host .loading.loading-lg{min-height:40px}:host .loading.loading-lg::after{height:32px;margin-left:-16px;margin-top:-16px;width:32px}@keyframes loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes slide-down{0%{opacity:0;transform:translateY(-32px)}100%{opacity:1;transform:translateY(0)}}:host .tooltip{position:relative}:host .tooltip::after{background:rgba(69,77,93,.9);border-radius:2px;bottom:100%;color:#fff;content:attr(data-tooltip);display:block;font-size:14px;left:50%;max-width:320px;opacity:0;overflow:hidden;padding:4px 8px;pointer-events:none;position:absolute;text-overflow:ellipsis;transform:translate(-50%,8px);transition:all .2s ease;white-space:pre;z-index:300}:host .tooltip:focus::after,:host .tooltip:hover::after{opacity:1;transform:translate(-50%,-4px)}:host .tooltip.disabled,:host .tooltip[disabled]{pointer-events:auto}:host .tooltip.tooltip-right::after{bottom:50%;left:100%;transform:translate(-4px,50%)}:host .tooltip.tooltip-right:focus::after,:host .tooltip.tooltip-right:hover::after{transform:translate(4px,50%)}:host .tooltip.tooltip-bottom::after{bottom:auto;top:100%;transform:translate(-50%,-8px)}:host .tooltip.tooltip-bottom:focus::after,:host .tooltip.tooltip-bottom:hover::after{transform:translate(-50%,4px)}:host .tooltip.tooltip-left::after{bottom:50%;left:auto;right:100%;transform:translate(8px,50%)}:host .tooltip.tooltip-left:focus::after,:host .tooltip.tooltip-left:hover::after{transform:translate(-4px,50%)}:host .btn-success{background:#32b643;border-color:#2faa3f;color:#fff}:host .btn-success:focus{box-shadow:0 0 0 .1rem rgba(50,182,67,.2)}:host .btn-success:focus,:host .btn-success:hover{background:#30ae40;border-color:#2da23c;color:#fff}:host .btn-success.active,:host .btn-success:active{background:#2a9a39;border-color:#278e34;color:#fff}:host .btn-success.loading::after{border-bottom-color:#fff;border-left-color:#fff}:host .btn-outline-success{background:#fff;border-color:#32b643;color:#32b643}:host .btn-outline-success:focus{box-shadow:0 0 0 .1rem rgba(50,182,67,.2)}:host .btn-outline-success:focus,:host .btn-outline-success:hover{background:#edfaef;border-color:#30ae40;color:#32b643}:host .btn-outline-success.active,:host .btn-outline-success:active{background:#32b643;border-color:#2da23c;color:#fff}:host .btn-outline-success.loading::after{border-bottom-color:#32b643;border-left-color:#32b643}\n:host(.hydrated){visibility:inherit !important}");
liskButtons.loadComponents("nyqae1xh",function(t,n,e,o,i){"use strict";function r(t,n,e){return t.addEventListener?(t.addEventListener(n,e),{remove:function(){t.removeEventListener(n,e)}}):(t.attachEvent(n,e),{remove:function(){t.detachEvent(n,e)}})}function s(t,n){var e=document.createElement("iframe");return e.src=n,e.id="hiddenIframeUriHandler",e.style.display="none",t.appendChild(e),e}function a(t,n,e){var o=setTimeout(function(){n(),a.remove()},1e3),i=document.querySelector("#hiddenIframeUriHandler");i||(i=s(document.body,"about:blank"));var a=r(window,"blur",function(){clearTimeout(o),a.remove(),e()});i.contentWindow.location.href=t}function u(t,n,e){for(var o=setTimeout(function(){n(),s.remove()},1e3),i=window;i!==i.parent;)i=i.parent;var s=r(i,"blur",function(){clearTimeout(o),s.remove(),e()});window.location=t}function c(t,n,e){var o=document.querySelector("#hiddenIframeUriHandler");o||(o=s(document.body,"about:blank"));try{o.contentWindow.location.href=t,e()}catch(t){"NS_ERROR_UNKNOWN_PROTOCOL"===t.name&&n()}}function l(t,n,e){10===v()?p(t,n,e):9===v()||11===v()?a(t,n,e):f(t,n,e)}function p(t,n,e){var o=setTimeout(n,1e3);window.addEventListener("blur",function(){clearTimeout(o),e()});var i=document.querySelector("#hiddenIframeUriHandler");i||(i=s(document.body,"about:blank"));try{i.contentWindow.location.href=t}catch(t){n(),clearTimeout(o)}}function f(t,n,e){var o=window.open("","","width=0,height=0");o.document.write("<iframe src='"+t+"'></iframe>"),setTimeout(function(){try{o.location.href,o.setTimeout("window.close()",1e3),e()}catch(t){o.close(),n()}},1e3)}function d(t,n,e){navigator.msLaunchUri(t,e,n)}function h(){var t=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0;return{isOpera:t,isFirefox:"undefined"!=typeof InstallTrigger,isSafari:/^((?!chrome|android).)*safari/i.test(navigator.userAgent),isChrome:!!window.chrome&&!t,isIE:!!document.documentMode}}function v(){var t,n=-1;return"Microsoft Internet Explorer"===navigator.appName?(t=navigator.userAgent,null!==new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(t)&&(n=parseFloat(RegExp.$1)),n):("Netscape"===navigator.appName&&(t=navigator.userAgent,null!==new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})").exec(t)&&(n=parseFloat(RegExp.$1))),n)}var m=function(t,n,e){function o(){n&&n()}function i(){e&&e()}if(navigator.msLaunchUri)d(t,n,e);else{var r=h();r.isFirefox?c(t,o,i):r.isChrome?u(t,o,i):r.isSafari?a(t,n,e):r.isIE?l(t,o,i):o()}},g=function(t,n){switch(t){case"send":return"lisk://main/transactions/send?recipient="+n.recipient+"&amount="+n.amount;case"vote":return"lisk://main/voting/vote?"+(n.unvotes?"unvotes="+n.unvotes:"")+"&"+(n.votes?"votes="+n.votes:"")}},w=function(t,n,e){return m(t,n,e)},y=function(){function t(){this.showTooltip=!1,this.loading=!1,this.onSuccess=this.onSuccess.bind(this),this.onError=this.onError.bind(this)}return t.prototype.openUrl=function(t){this.loading=!0,this.showTooltip=!1,w(t,this.onError,this.onSuccess)},t.prototype.getTooltipText=function(){return"You need to install Lisk Nano wallet to use this feature"},t.prototype.onSuccess=function(){this.loading=!1,this.showTooltip=!1},t.prototype.onError=function(){this.loading=!1,this.showTooltip=!0},t}(),b=function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])};return function(n,e){function o(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}}(),T=function(t){function e(){var n=t.call(this)||this;return n.open=n.open.bind(n),n}return b(e,t),e.prototype.open=function(){var t=this,n=t.amount,e=t.recipient,o=g("send",{amount:n,recipient:e});this.openUrl(o)},e.prototype.render=function(){return n("button",{class:"btn btn-primary "+(this.loading?"loading":"")+" "+(this.showTooltip?"tooltip":""),onClick:this.open,"data-tooltip":this.getTooltipText()},this.title||"Send "+this.amount+" LSK to "+this.recipient)},e}(y),_=function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])};return function(n,e){function o(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}}(),E=function(t){function e(){var n=t.call(this)||this;return n.open=n.open.bind(n),n.getDefaultTitle=n.getDefaultTitle.bind(n),n}return _(e,t),e.prototype.open=function(){var t=this,n=t.votes,e=t.unvotes,o=g("vote",{votes:n,unvotes:e});this.openUrl(o)},e.prototype.getDefaultTitle=function(){if(this.votes){var t=this.votes.split(",");return"Vote for "+(e=t[0])+((o=t.slice(1)).length?" and "+o.length+" others...":"")}if(this.unvotes){var n=this.unvotes.split(","),e=n[0],o=n.slice(1);return"Unvote "+e+(o.length?" and "+o.length+" others...":"")}},e.prototype.render=function(){return n("button",{class:"btn btn-success "+(this.loading?"loading":"")+" "+(this.showTooltip?"tooltip":""),onClick:this.open,"data-tooltip":this.getTooltipText()},this.title||this.getDefaultTitle())},e}(y);t["lisk-button-send"]=T,t["lisk-button-vote"]=E},["lisk-button-send",[["amount",1,1,4],["recipient",1,1,2],["title",1,1,2]],{}],["lisk-button-vote",[["title",1,1,2],["unvotes",1,1,2],["votes",1,1,2]],{}]);;