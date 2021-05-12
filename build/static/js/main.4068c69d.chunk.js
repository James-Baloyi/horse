(this.webpackJsonpdriverapp=this.webpackJsonpdriverapp||[]).push([[0],{25:function(e,t,a){},39:function(e,t,a){},48:function(e,t,a){"use strict";a.r(t);var n=a(4),s=a.n(n),c=a(32),r=a.n(c),i=(a(39),a(14)),o=a(15),l=a(17),d=a(16),u=(a(25),a(33)),b=a(9),h=a(29);h.a.initializeApp({apiKey:"AIzaSyDmxvEat9bQme3dRK5_Z79-tLWYrptYb6A",authDomain:"zipi-app.firebaseapp.com",databaseURL:"https://zipi-app.firebaseio.com",projectId:"zipi-app",storageBucket:"zipi-app.appspot.com",messagingSenderId:"1060972970372",appId:"1:1060972970372:web:787f7055d0de929a92ddd1",measurementId:"G-NGXNY0KN8X"});var j=h.a,p=a(2),v=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){var e;return Object(i.a)(this,a),(e=t.call(this)).state={deliveryData:{},driverId:""},e}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=JSON.parse(localStorage.getItem("activeDelivery"));this.setState({deliveryData:e});var t=JSON.parse(localStorage.getItem("currentUser")).uid;this.setState({driverId:t})}},{key:"saveToComplete",value:function(e){var t={date:e,delivery:this.state.deliveryData,driverId:this.state.driverId};j.database().ref("API_complete/"+this.state.driverId).push({data:t})}},{key:"deleteChildKey",value:function(){var e=this,t=this.state.deliveryData.key,a=localStorage.getItem("parentKey");j.database().ref("apiReq/"+a+"/reqKeys").once("value",(function(n){var s=n.val(),c=s.indexOf(t),r=s.splice(1,c);j.database().ref("apiReq/"+a+"/reqKeys").update(r),e.deleteFromNewReq(t),r.length<1&&(window.location.href="innerlist")}))}},{key:"deleteFromNewReq",value:function(e){j.database().ref("newReq/"+e).remove()}},{key:"confirmPin",value:function(){if(this.deleteChildKey(),document.getElementsByClassName("releaseInput")[0].value==this.state.deliveryData.pu_pin){var e=new Date;this.saveToComplete(e),this.deleteChildKey()}}},{key:"goToCancel",value:function(){window.location.href="cancel"}},{key:"render",value:function(){var e=this;return Object(p.jsxs)("div",{className:"currentDelivery",children:[Object(p.jsx)("h4",{style:{marginTop:-40,position:"absolute",transform:"translate(100%)"},children:"Current Trip"}),Object(p.jsxs)("div",{className:"cdTopArea",children:[Object(p.jsx)("table",{style:{width:"100%"},children:Object(p.jsx)("tr",{children:Object(p.jsxs)("td",{children:[Object(p.jsx)("b",{children:this.state.deliveryData.booking_name}),Object(p.jsx)("br",{}),Object(p.jsx)("small",{style:{color:"grey"},children:this.state.deliveryId})]})})}),Object(p.jsx)("hr",{style:{border:0,height:1,backgroundColor:"silver"}}),Object(p.jsxs)("div",{className:"deliveryInfo",children:[Object(p.jsx)("small",{children:"Drop Off"}),Object(p.jsxs)("div",{className:"dropOff",children:[Object(p.jsx)("br",{}),Object(p.jsx)("b",{children:this.state.deliveryData.do_location}),Object(p.jsx)("br",{})]}),Object(p.jsxs)("div",{className:"pinArea",children:[Object(p.jsx)("b",{children:"Insert RELEASE PIN that you will receive from the customer"}),Object(p.jsx)("br",{}),Object(p.jsx)("input",{type:"number",placeholder:"Release PIN",className:"releaseInput"})]})]}),Object(p.jsx)("button",{className:"cancelLoad",onClick:function(){e.goToCancel()},children:"Cancel Load"}),Object(p.jsx)("button",{className:"verifyPin",onClick:function(){e.confirmPin()},children:"Verify PIN"})]})]})}}]),a}(s.a.Component),m=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){var e;return Object(i.a)(this,a),(e=t.call(this)).state={reason:"Customer Unavailable"},e}return Object(o.a)(a,[{key:"cancelDelivery",value:function(){var e=localStorage.getItem("parentKey"),t=JSON.parse(localStorage.getItem("activeDelivery")).key,a=JSON.parse(localStorage.getItem("activeDelivery")),n="https://us-central1-zipi-app.cloudfunctions.net/cancelRequest?childKey=".concat(t,"&parentKey=").concat(e),s=new XMLHttpRequest;s.open("GET",n,!1),s.send();var c=s.responseText,r=new Date;"success"==c?j.database().ref("API_cancelled").push({parentKey:e,delivery:a,date:r,reason:this.state.reason}).then((function(){document.getElementsByTagName("small")[0].innerText="Successfully Cancelled",localStorage.removeItem("parentKey"),localStorage.removeItem("childKeys"),localStorage.removeItem("activeDelivery"),window.location.href="innerlist"})):document.getElementsByTagName("small")[0].innerText=c+". Contact support with a screenshot of this error."}},{key:"render",value:function(){var e=this;return Object(p.jsx)("div",{children:Object(p.jsxs)("center",{children:[Object(p.jsxs)("h2",{children:["Cancel Delivery",Object(p.jsx)("br",{}),Object(p.jsx)("br",{}),Object(p.jsx)("small",{children:"Please make sure that you've tried to reach the customer to a reasonable degree."})]}),Object(p.jsx)("br",{}),Object(p.jsxs)("select",{className:"cancelDropdown",onChange:function(t){e.setState({reason:t.target.value})},children:[Object(p.jsx)("option",{value:"Customer Unavailable",children:"Customer Unavailable"}),Object(p.jsx)("option",{value:"Driver Error",children:"Traffic Problem"}),Object(p.jsx)("option",{value:"Customer Unreachable",children:"Can't Reach Customer"})]}),Object(p.jsx)("br",{}),Object(p.jsx)("br",{}),Object(p.jsx)("button",{className:"send",onClick:function(){e.cancelDelivery()},children:"Cancel Delivery"})]})})}}]),a}(s.a.Component),g=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){var e;return Object(i.a)(this,a),(e=t.call(this)).state={email:"",password:""},e}return Object(o.a)(a,[{key:"verifyLogin",value:function(){j.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((function(e){var t=j.auth().currentUser;console.log(t),localStorage.setItem("currentUser",JSON.stringify(t)),window.location.reload()})).catch((function(e){alert(e)}))}},{key:"componentDidMount",value:function(){localStorage.getItem("currentUser")&&(window.location.href="/home")}},{key:"render",value:function(){var e=this;return Object(p.jsx)("div",{className:"login showing",children:Object(p.jsxs)("center",{children:[Object(p.jsx)("br",{}),Object(p.jsxs)("div",{className:"login-panel",children:[Object(p.jsx)("b",{children:"Login"}),Object(p.jsx)("br",{}),Object(p.jsx)("input",{type:"email",id:"email",onChange:function(t){e.setState({email:t.target.value})},placeholder:"Email"}),Object(p.jsx)("br",{}),Object(p.jsx)("input",{type:"password",id:"password",onChange:function(t){e.setState({password:t.target.value})},placeholder:"Password"}),Object(p.jsx)("br",{}),Object(p.jsx)("button",{className:"button",onClick:function(){e.verifyLogin()},children:"Login"})]})]})})}}]),a}(s.a.Component),f="data:image/png;base64,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",O=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){var e;return Object(i.a)(this,a),(e=t.call(this)).state={requests:[]},e}return Object(o.a)(a,[{key:"componentDidMount",value:function(){localStorage.getItem("currentUser")?this.getRequestBuckets():window.location.href="/login"}},{key:"getRequestBuckets",value:function(){var e=this,t=[];j.database().ref("apiReq/").on("value",(function(a){var n=a.val();for(var s in n){var c=n[s];return c.key=s,t.push(c),e.setState({requests:t}),null}}))}},{key:"logOut",value:function(){localStorage.clear(),j.auth().signOut()&&window.location.reload()}},{key:"openPackage",value:function(e,t){console.log(t),void 0!==t?(localStorage.setItem("parentKey",e),localStorage.setItem("childKeys",JSON.stringify(t)),window.location.href="/innerlist"):alert("Can't find deliveries under this pack. Hiding it for now.")}},{key:"render",value:function(){var e=this,t=this.state.requests.map((function(t){return console.log(e.state.requests),Object(p.jsx)("div",{className:"packagePill",onClick:function(){e.openPackage(t.key,t.reqKeys)},children:Object(p.jsx)("table",{style:{width:"100%"},children:Object(p.jsxs)("tr",{children:[Object(p.jsxs)("td",{style:{paddingLeft:10},children:[Object(p.jsx)("b",{children:t.id}),Object(p.jsx)("br",{}),Object(p.jsx)("small",{style:{color:"grey"},children:t.distance})]}),Object(p.jsxs)("td",{children:["\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ",Object(p.jsx)("button",{className:"smallButton noBg",children:"Start Trip"})]})]})})})}));return Object(p.jsx)("div",{className:"groupedList",children:Object(p.jsxs)("div",{className:"header",children:[Object(p.jsx)("img",{src:f}),Object(p.jsx)("button",{className:"smallButton noBg",onClick:function(){e.logOut()},children:"Sign out"}),Object(p.jsx)("br",{}),Object(p.jsx)("br",{}),Object(p.jsxs)("div",{className:"mainDiv",children:[Object(p.jsx)("small",{children:"Bookings"}),Object(p.jsx)("br",{}),Object(p.jsx)("div",{className:"list",children:t}),Object(p.jsx)("button",{className:"refresh",onClick:function(){e.getRequestBuckets()},children:"Refresh Packages"})]})]})})}}]),a}(s.a.Component),y=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){var e;return Object(i.a)(this,a),(e=t.call(this)).state={deliveryId:"LOADING",deliveryArray:[],parentKey:"",childKeys:[],deliveryData:{}},e}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=localStorage.getItem("childKeys"),t=JSON.parse(e);this.setState({childKeys:t});var a=localStorage.getItem("parentKey");this.setState({parentKey:a}),this.loadDeliveries(t)}},{key:"loadDeliveries",value:function(e){var t=this,a=[];console.log(),e.map((function(e){j.database().ref("newReq/"+e).on("value",(function(n){var s=n.val();s.key=e,a.push(s),t.setState({deliveryArray:a}),t.setState({deliveryId:s.tripId})}))}))}},{key:"cancel",value:function(e,t,a,n){var s="https://us-central1-zipi-app.cloudfunctions.net/cancelRequest?childKey=".concat(t,"&parentKey=").concat(a),c=new XMLHttpRequest;c.open("GET",s,!1),c.send();var r=c.responseText;if("success"==r){e.style.display="none";var i=e.getAttribute("data");document.getElementById(i).style.display="none"}else alert(r+". Contact support with a screenshot of this error.")}},{key:"sendSMSs",value:function(){var e=this,t=this.state.deliveryArray,a=t.length,n=0;t.map((function(t){++n>=a&&document.getElementsByClassName("sendNotifs")[0].classList.add("hidden"),console.log(t);var s=t.cellphone,c=t.pu_pin;e.sendMessage(s,c)}))}},{key:"sendMessage",value:function(e,t){var a="Thank you for using Zipi Delivery. Zipi PIN: ".concat(t,". Please present it to your driver."),n="https://api.bulksms.com/v1/messages/send?to="+e.replace("0","27")+"&body="+a,s=new XMLHttpRequest;s.open("GET","https://cors-anywhere.herokuapp.com/"+n,!0),s.setRequestHeader("path","api.bulksms.com/v1/messages/send?"),s.setRequestHeader("Authority","api.bulksms.com"),s.setRequestHeader("scheme","https"),s.setRequestHeader("origin","https://zipi.co.za"),s.setRequestHeader("Access-Control-Allow-Origin","https://zipi.co.za"),s.setRequestHeader("Authorization","Basic emlwaW5vdzpaaXBpMTIzNDU="),s.onreadystatechange=function(){"4"==s.readyState&&console.log("Sent",e.replace("0","27"),a)},s.send()}},{key:"openMap",value:function(e){var t=e.do_coords,a=t.lat,n=t.lng;-1==navigator.platform.indexOf("iPhone")&&-1==navigator.platform.indexOf("iPad")&&-1==navigator.platform.indexOf("iPod")||window.open("maps://maps.google.com/maps?daddr=".concat(a,",").concat(n,"&amp;ll="),"blank"),window.open("https://maps.google.com/maps?daddr=".concat(a,",").concat(n,"&amp;ll="),"blank")}},{key:"openP54Map",value:function(){var e="-29.79832313852812",t="31.011521516240354";-1==navigator.platform.indexOf("iPhone")&&-1==navigator.platform.indexOf("iPad")&&-1==navigator.platform.indexOf("iPod")||window.open("maps://maps.google.com/maps?daddr=".concat(e,",").concat(t,"&amp;ll="),"blank"),window.open("https://maps.google.com/maps?daddr=".concat(e,",").concat(t,"&amp;ll="),"blank")}},{key:"saveThenNav",value:function(){var e=JSON.stringify(this.state.deliveryData);console.log(e),localStorage.setItem("activeDelivery",e),window.location.href="/current_delivery"}},{key:"render",value:function(){var e=this,t=this.state.deliveryArray.map((function(t){return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)("div",{className:"deliveryPill",onClick:function(){e.openMap(t),e.setState({deliveryData:t},(function(){e.saveThenNav()}))},id:t.key.replace("-",""),children:Object(p.jsx)("table",{style:{width:"100%"},children:Object(p.jsxs)("tr",{children:[Object(p.jsxs)("td",{children:["\xa0 \xa0",Object(p.jsx)("b",{children:t.booking_name}),Object(p.jsx)("br",{}),Object(p.jsxs)("small",{style:{color:"grey"},children:["\xa0 \xa0 ",t.booking_ref]})]}),Object(p.jsx)("td",{children:"\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0  \xa0"})]})})},t.key),Object(p.jsx)("button",{className:"redText nudgeUp",data:t.key.replace("-",""),onClick:function(a){e.cancel(a.target,t.key,e.state.parentKey)},children:"Remove"}),Object(p.jsx)("br",{})]})}));return Object(p.jsxs)("div",{className:"destinationList",children:[Object(p.jsx)("div",{className:"header",children:Object(p.jsx)("img",{src:f})}),Object(p.jsx)("br",{}),Object(p.jsxs)("center",{children:[Object(p.jsx)("br",{}),Object(p.jsxs)("h2",{children:["Pack ID: ",this.state.deliveryId]}),Object(p.jsx)("br",{}),Object(p.jsx)("div",{className:"currentDeliveries",children:t}),Object(p.jsx)("div",{className:"sendNotifs",children:Object(p.jsx)("button",{className:"send",onClick:function(){e.sendSMSs(),e.openP54Map()},children:"Start Deliveries"})})]})]})}}]),a}(s.a.Component),A=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"render",value:function(){return Object(p.jsx)("div",{children:Object(p.jsx)(u.a,{children:Object(p.jsxs)(b.c,{children:[Object(p.jsx)(b.a,{path:"/login",exact:!0,component:g}),Object(p.jsx)(b.a,{path:"/",exact:!0,component:O}),Object(p.jsx)(b.a,{path:"/home",exact:!0,component:O}),Object(p.jsx)(b.a,{path:"/innerlist",exact:!0,component:y}),Object(p.jsx)(b.a,{path:"/current_delivery",exact:!0,component:v}),Object(p.jsx)(b.a,{path:"/cancel",exact:!0,component:m})]})})})}}]),a}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var x=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,49)).then((function(t){var a=t.getCLS,n=t.getFID,s=t.getFCP,c=t.getLCP,r=t.getTTFB;a(e),n(e),s(e),c(e),r(e)}))};r.a.render(Object(p.jsx)(s.a.StrictMode,{children:Object(p.jsx)(A,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)})),x()}},[[48,1,2]]]);
//# sourceMappingURL=main.4068c69d.chunk.js.map