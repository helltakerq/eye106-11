!function(t){"use strict";function e(e,s){this.element=e,this.options=t.extend({},o,s),this._defaults=o,this._name=i,this._shadow="",this.init()}var i="longShadow",o={colorShadow:"#ccc",sizeShadow:50,directionShadow:""};e.prototype={init:function(){for(var t="",e=this.options.colorShadow,i=0,o=this.options.sizeShadow;i<o;i++)switch(this.options.directionShadow){case"top":t+="0 "+-i+"px 0 "+e+",";break;case"right":t+=i+"px 0 0 "+e+",";break;case"bottom":t+="0 "+i+"px 0 "+e+",";break;case"left":t+=-i+"px 0 0 "+e+",";break;case"top-left":t+=-i+"px "+-i+"px 0 "+e+",";break;case"top-right":t+=i+"px "+-i+"px 0 "+e+",";break;case"bottom-left":t+=-i+"px "+i+"px 0 "+e+",";break;case"bottom-right":default:t+=i+"px "+i+"px 0 "+e+","}this._shadow=t.slice(0,-1),this.element.style.textShadow=this._shadow},destroy:function(){this.element.style=""}},t.fn[i]=function(o){return this.each(function(){t.data(this,"plugin_"+i)||t.data(this,"plugin_"+i,new e(this,o))})}}(jQuery);