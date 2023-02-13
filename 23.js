"use strict";(self.webpackChunkmifosx_web_app=self.webpackChunkmifosx_web_app||[]).push([[23],{5023:function(m,l,f){f.d(l,{o:function(){return p}});var v=f(5671),h=f(3144),c=f(520),d=f(5542),p=function(){var i=function(){function _(e){(0,v.Z)(this,_),this.http=e}return(0,h.Z)(_,[{key:"getStandingInstructionsData",value:function(t){return this.http.get("/standinginstructions/".concat(t))}},{key:"getStandingInstructionsDataAndTemplate",value:function(t){var n=(new c.LE).set("associations","template");return this.http.get("/standinginstructions/".concat(t),{params:n})}},{key:"updateStandingInstructionsData",value:function(t,n){var a=(new c.LE).set("command","update");return this.http.put("/standinginstructions/".concat(t),n,{params:a})}},{key:"getStandingInstructionsTemplate",value:function(t,n,a,s){var r=(new c.LE).set("fromAccountType",a).set("fromClientId",t).set("fromOfficeId",n);if(s)for(var o=Object.getOwnPropertyNames(s),u=0;u<o.length;u++){var g=o[u];r=r.set(g,s[g])}return this.http.get("/standinginstructions/template",{params:r})}},{key:"createStandingInstructions",value:function(t){return this.http.post("/standinginstructions",t)}},{key:"newAccountTranferResource",value:function(t,n,a){var s=(new c.LE).set("fromAccountId",t).set("fromAccountType",n);if(a)for(var r=Object.getOwnPropertyNames(a),o=0;o<r.length;o++){var u=r[o];s=s.set(u,a[u])}return this.http.get("/accounttransfers/template",{params:s})}},{key:"createAccountTransfer",value:function(t){return this.http.post("/accounttransfers",t)}},{key:"getStandingInstructions",value:function(t){for(var n=new c.LE,a=Object.getOwnPropertyNames(t),s=0;s<a.length;s++){var r=a[s];""===t[r]||null==t[r]||(n=n.set(r,t[r]))}return this.http.get("/standinginstructions",{params:n})}},{key:"deleteStandingInstrucions",value:function(t){var n=(new c.LE).set("command","delete");return this.http.delete("/standinginstructions/".concat(t),{params:n})}},{key:"getStandingInstructionsTransactions",value:function(t,n,a){var s=(new c.LE).set("associations","transactions").set("dateFormat",n).set("limit","14").set("locale",a).set("offset","0");return this.http.get("/standinginstructions/".concat(t),{params:s})}},{key:"getViewAccountTransferDetails",value:function(t){return this.http.get("/accounttransfers/".concat(t))}}]),_}();return i.\u0275fac=function(e){return new(e||i)(d.LFG(c.eN))},i.\u0275prov=d.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i}()}}]);