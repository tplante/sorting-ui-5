(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{196:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(72),i=n.n(r),l=n(12),c=n(13),s=n(34),d=n(48),u=n(20),p=n(79),m=n(80),h=n(89),b=n(81),f=n(88),g=n(19),v=n(38),E=n(87),y=n(5),x=n(47),I=n(37),O="skip",j=[{label:"Hillary Clinton",optionId:0},{label:"George Washington",optionId:1},{label:"Barack Obama",optionId:2},{label:"Bernie Sanders",optionId:3},{label:"John Adams",optionId:4},{label:"Marco Rubio",optionId:5},{label:"Donald Trump",optionId:6},{label:"Ron Swanson",optionId:7},{label:"Ron Burgandy",optionId:8},{label:"Abraham Lincoln",optionId:9},{label:"Jeb Bush",optionId:10},{label:"Kanye West",optionId:11}],w=function(e,t,n){var a=Array.from(e),o=a.splice(t,1),r=Object(E.a)(o,1)[0];return a.splice(n,0,r),a},S=function(e){return parseInt(e.split("-")[1])},k={position:"absolute",left:-30,padding:"".concat(20,"px ").concat(5,"px")},B=function(e){var t=e.children,n=e.stroke,a=e.style,r=void 0===a?{}:a;return o.a.createElement("svg",{stroke:n,strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",width:20,height:20,viewBox:"0 0 ".concat(20," ").concat(20),style:r},t)},C=function(){return o.a.createElement(B,{stroke:"rgb(37, 43, 54)",style:k},o.a.createElement("polyline",{points:"3.7 7.3 1 10 3.7 12.7"}),o.a.createElement("polyline",{points:"7.3 3.7 10 1 12.7 3.7"}),o.a.createElement("polyline",{points:"12.7 16.3 10 19 7.3 16.3"}),o.a.createElement("polyline",{points:"16.3 7.3 19 10 16.3 12.7"}),o.a.createElement("path",{d:"M1,10 L19,10"}),o.a.createElement("path",{d:"M10,1 L10,19"}))},D=function(){return o.a.createElement(B,{stroke:"white"},o.a.createElement("path",{d:"M1,10 L19,10"}),o.a.createElement("path",{d:"M10,1 L10,19"}))},M=function(e){function t(){var e,n;Object(p.a)(this,t);for(var o=arguments.length,r=new Array(o),i=0;i<o;i++)r[i]=arguments[i];return(n=Object(h.a)(this,(e=Object(b.a)(t)).call.apply(e,[this].concat(r)))).state={items:[],options:[],submitted:!1},n.container=Object(a.createRef)(),n.getPlaceholderItem=function(e,t){var a=Object(v.a)({},e[t+1]);return a.id="option-".concat(e.length+n.keyGenerationIndex),n.keyGenerationIndex++,a},n.setOptions=function(){var e=j.map(function(e,t){return{id:"option-".concat(t),optionId:e.optionId,label:e.label,selected:!1,showMovableIcon:!1,val:O}});n.setState({items:[e[0]],options:e})},n.handleDragEnd=function(e){var t=Object(g.a)(Object(g.a)(n)).container.current,a=e.destination,o=e.source,r=e.draggableId,i=t.querySelector("#".concat(r," select")),l=Array.from(t.querySelectorAll("select")),c=i.value===O;if(a&&!c){var s=l.some(function(e,t){return e.value===O&&a.index===t})?a.index-1:a.index,d=w(n.state.items,o.index,s);n.setState({items:d})}},n.handleChange=function(e){var t=e.target,a=e.target,o=a.value,r=a.id,i=a.previousValue,l=Object(u.a)(n.state.options),c=Object(u.a)(n.state.items);i&&(l.find(function(e){return e.id===i}).selected=!1);if(o!==O){l.find(function(e){return e.id===o}).selected=!0;var s=S(r),d=S(o),p=c[s];if(p.val=o,p.optionId=d,c.length<l.length&&s===c.length-1){var m=n.getPlaceholderItem(l,s);c.push(m)}c.length>2&&c.forEach(function(e){return e.showMovableIcon=e.val!==O})}t.previousValue=o,n.setState({options:l,items:c})},n.handleDeselect=function(e){var t=e.currentTarget.id,a=Object(u.a)(n.state.options),o=Object(u.a)(n.state.items),r=S(t),i=a[S(o[r].val)];if(i){i.selected=!1,o.forEach(function(e,t){t!==r&&e.val===O&&o.splice(t,1)});var l=n.getPlaceholderItem(a,r);o.splice(r,1),o.push(l),n.setState({options:a,items:o})}},n.handleSubmit=function(){var e=[];n.state.items.forEach(function(t){t.val!==O&&e.push(t.optionId)});n.setState({submitted:!n.state.submitted})},n}return Object(f.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){this.keyGenerationIndex=1,this.setOptions()}},{key:"render",value:function(){var e=this,t=function(t,n){return!t.showMovableIcon&&n===e.state.items.length-1&&1!==e.state.items.length};return o.a.createElement(y.Box,{ref:this.container,alignItems:"center"},o.a.createElement(y.Box,{width:"80%",maxWidth:"350px"},o.a.createElement(y.Box,{mt:4},o.a.createElement(y.Text,{fontSize:4,fontWeight:"bold",textAlign:"center"},"Choose your favorite candidates")),o.a.createElement(y.Box,{my:2},o.a.createElement(y.Text,{fontSize:1},"Select as many as you want in the order you prefer.\n              There are ".concat(j.length," options in total."))),o.a.createElement(y.Box,{width:"100%",alignItems:"center"},o.a.createElement(I.a,{onDragEnd:this.handleDragEnd},o.a.createElement(I.c,{droppableId:"droppable"},function(n){return o.a.createElement(y.Box,{ref:n.innerRef,width:"100%"},e.state.items.map(function(n,a){return o.a.createElement(I.b,{key:n.id,draggableId:n.id,index:a},function(r,i){return o.a.createElement(y.BoxBorder,Object.assign({id:n.id,ref:r.innerRef},r.draggableProps,r.dragHandleProps,{width:"100%",flexDirection:"columns",alignItems:"center",mb:10,bg:i.isDragging||t(n,a)?"transparent":"shade-2",borderRadius:1,p:"".concat(10,"px 0 ").concat(10,"px ").concat(10,"px"),style:Object(v.a)({},function(e,t,n){return Object(v.a)({position:"relative",userSelect:"none",overflow:"visible",border:e||n?"".concat(2,"px dashed ").concat("rgb(195, 200, 213)"):"".concat(2,"px solid ").concat("rgb(195, 200, 213)")},t)}(i.isDragging,r.draggableProps.style,t(n,a)))}),!t(n,a)&&n.showMovableIcon&&o.a.createElement(C,null),o.a.createElement(y.Label,{value:t(n,a)?"+":a+1,htmlFor:"menu-".concat(a),color:"white",mt:1,fontWeight:"bold"},o.a.createElement(y.BoxBorder,{alignItems:"center",justifyContent:"center",width:40,height:40,bg:t(n,a)?"shade-2":"brand",mr:10,borderRadius:"50%",border:"2px solid",borderColor:"gray"},t(n,a)?o.a.createElement(D,null):a+1)),o.a.createElement(y.Box,{flex:1},o.a.createElement(y.Select,{id:"menu-".concat(a),name:"menu-".concat(a),onChange:e.handleChange,pr:"20px"},o.a.createElement(y.Select.Option,{id:O,value:O,defaultValue:!0,disabled:n.val!==O},"Select an option"),e.state.options.map(function(e){var t=e.label,a=e.id;return(!e.selected||n.val===a)&&o.a.createElement(y.Select.Option,{key:a,id:a,value:a},t)}))),o.a.createElement(y.Box,{id:"deselect-".concat(a),onClick:e.handleDeselect,px:2},!t(n,a)&&e.state.items.length>1&&o.a.createElement(x.CrossIcon,null)))})}),n.placeholder)})),o.a.createElement(y.Box,{my:3},o.a.createElement(y.Button,{onClick:this.handleSubmit},this.state.submitted?"Nice!":"Submit")))))}}]),t}(o.a.PureComponent),P=Object(l.createRenderer)();P.renderStatic(Object(d.reset)(Object(d.setup)("body, #root"))),Object.keys(s).forEach(function(e){P.renderFont("Gilroy",s[e].files,s[e].style)}),i.a.render(o.a.createElement(l.Provider,{renderer:P},o.a.createElement(l.ThemeProvider,{theme:c.designSystemConfig},o.a.createElement(M,null))),document.getElementById("root"))},90:function(e,t,n){e.exports=n(196)}},[[90,2,1]]]);
//# sourceMappingURL=main.4ed2ad87.chunk.js.map