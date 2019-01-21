function round_mod(value, precision) {
    // спецчисло для округления
    var precision_number = Math.pow(10, precision);

    // округляем
    return Math.round(value * precision_number) / precision_number;
}

function addClass(el, className) {
    el.className += ' '+className;
}

function removeClass(el, className){
    var elClass = ' '+el.className+' ';
    while(elClass.indexOf(' '+className+' ') != -1)
         elClass = elClass.replace(' '+className+' ', '');
    el.className = elClass;
}

function hasNaN (arr) {
    for(var i = 0, l = arr.length; i < l; i++) {
        if(isNaN(arr[i])) {
            return true;
        }
    }
    return false;
}



plot = {};

scale = 40;
colors = [];
for (var i = 0; i < 20; i++) {
    colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
};
colors[0] = "#45688E";

zoom = 1;
move = false;

xPos = 200, yPos = 150, xPosMouse = 0, xx=0, yy=0;

window.onload = function() {
        simple = new Calculator(),
        transcendental2 = new Calculator('transcendental2'),
        transcendental = new Calculator('transcendental'),
        integral = new Calculator('integral');
        diff = new Calculator('diff');
        draw();

    document.querySelector("#integral form").onsubmit = function() {
        var a = simple(this.parentNode.querySelector(".a").value),
            b = simple(this.parentNode.querySelector(".b").value),
            n = 10000;
            fx = this.parentNode.querySelector(".fx").value;

        this.parentNode.querySelector("span.result").innerHTML = round_mod(integral(fx, a, b, n), 8);

        return false;
    }

    document.querySelector("#transcendental form").onsubmit = function() {
        var inputExpression = this.parentNode.querySelector(".fx").value.replace(/^\s+|\s+$/g, "").toLowerCase(),
            a, b, rangePos, eqPos, fx;
		var single = true;

        if (plot === null) plot = {};

        if((rangePos = inputExpression.indexOf('[')) >= 1) {
          a = inputExpression.substr(rangePos).split(';')[0].substr(1);
          b = inputExpression.substr(rangePos).split(';')[1].slice(0, -1);
          inputExpression = inputExpression.substr(0, rangePos);
		  plot.a = a;
		  plot.b = b;
        }

        fx = inputExpression;
        plot.fx = fx;

        if((eqPos = inputExpression.indexOf('=')) >= 1) {
          var f = inputExpression.split('=')[0].replace(/^\s+|\s+$/g, "");
          var g = inputExpression.split('=')[1].replace(/^\s+|\s+$/g, "");
          fx = '('+f+')-('+g+')';
          if (!parseFloat(g)) plot.fx = f+","+g;
          else plot.fx = f+" - "+g;
        }


        if(inputExpression.lastIndexOf('{') > inputExpression.indexOf('}') && inputExpression.lastIndexOf('{') < inputExpression.lastIndexOf('}')) {
            fx = inputExpression.slice(1, inputExpression.indexOf('}')).split(',');
            a = inputExpression.slice(inputExpression.lastIndexOf('{')+1, inputExpression.lastIndexOf('}')).split(',');
            plot = null;
			single = false;
        } else if(inputExpression.indexOf('{') !== -1 && inputExpression.indexOf('}') !== -1) {
            plot.fx = inputExpression.slice(1,-1);
            fx = null;
        }

        console.log(plot);

        var result = transcendental(fx, a, b);
        if (isNaN(result) && (isArray(result) && hasNaN(result))) {
            addClass(document.querySelector("#transcendental input"), 'red');
            return false;
        } else removeClass(document.querySelector("#transcendental input"), 'red');

        if(!plot || plot.length == 0 || JSON.stringify(plot).length === 2) {
            document.querySelector("canvas").style.display = "none";
        } else {
            document.querySelector("canvas").style.display = "block";
            draw(plot);
        }

		if (single && result) result = result.sort(function(a,b){return a-b;});
        if (isArray(result)) result = result.join('<br>');
        if (fx) this.parentNode.querySelector("span.result").innerHTML = result || 'Неможливо знайти корені.';

        return false;
    }

    document.querySelector("a[href='#more']").onclick = function() {
        document.querySelector("#integral").style.display = "block";
        this.style.display = "none";
        return false;
    }

    var elem = document.querySelector('canvas');

    if (elem.addEventListener) {
        if ('onwheel' in document) {
          // IE9+, FF17+
          elem.addEventListener ("wheel", onWheel, false);
        } else if ('onmousewheel' in document) {
          // устаревший вариант события
          elem.addEventListener ("mousewheel", onWheel, false);
        } else {
          // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
          elem.addEventListener ("MozMousePixelScroll", onWheel, false);
        }
    } else elem.attachEvent ("onmousewheel", onWheel); // IE<9

    elem.onmousedown=function(){
        move = true;
        var e = e || window.event;
        x = e.offsetX;
        y = e.offsetY;
    };

    elem.onmousemove=function(e){
        if (move) {
          var e = e || window.event;
          xx = xPos + e.offsetX - x;
          yy = yPos + e.offsetY - y;
		  xPosMouse = (e.offsetX - xPos)/scale;
		  draw(plot, xx, yy);
        }

    };

    elem.onmouseup=function(e){
        move = false;
        xPos = xx;
        yPos = yy;
    };


    function onWheel(e) {
        e = e || window.event;
        // wheelDelta не дает возможность узнать количество пикселей
        var delta = e.deltaY || e.detail || e.wheelDelta;
        scale += ((delta<0)?-scale/4:scale/4);
        draw(plot);

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }
}

function draw(func, startX, startY) {
    var canvas = document.querySelector("canvas");
    if (null==canvas || !canvas.getContext) return;

    canvas.width  = 400;
    canvas.height = 300;

     axes={}, ctx=canvas.getContext("2d");
     axes.x0 = startX || xPos;  // x0 pixels from left to x=0
     axes.y0 = startY || yPos; // y0 pixels from top to y=0
     axes.scale = scale;        // 40 pixels from x=0 to x=1
     axes.doNegativeX = true;

     showAxes(ctx,axes);

     if(!func || func.length == 0 || JSON.stringify(func).length === 2) {
        if(func === null) {
            ctx.font="16px Georgia";
            ctx.fillStyle="000";
            ctx.fillText("Неможливо побудувати графік системи", 55,100);
        }
        return;
     }

	 var a = func.a;
	 var b = func.b;
	 func = func.fx;

     var functions = func.split(",");
	 array_unique(functions);
     if (typeof func == 'string' && !functions[1]) funGraph(ctx, axes, func, colors[0], 1);
     else {
        for (var i = functions.length - 1; i >= 0; i--) {
            funGraph(ctx, axes, functions[i], colors[i], 1, i);
        };
     }

    ctx.font="9px sans-serif";
    ctx.fillStyle="000";
    ctx.fillText("x: "+xPosMouse, 350,290);

	ctx.beginPath();
	ctx.globalAlpha=0.2;
	ctx.fillStyle = "#FC1212";
    ctx.fillRect(axes.x0 + a * axes.scale,0,(b-a)*axes.scale, ctx.canvas.height);
	ctx.globalAlpha=1;
	ctx.fillStyle="#000";
	ctx.fill();
}

function funGraph (ctx,axes,func,color,thick, pos) {
    pos = pos || 0;
    func = func.replace(/^\s+|\s+$/g, "");
     var xx, yy, dx=0.3, x0=axes.x0, y0=axes.y0, scale=axes.scale;
     var iMax = Math.round((ctx.canvas.width-x0)/dx);
     var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
     ctx.beginPath();
     ctx.lineWidth = thick;
     ctx.strokeStyle = color;

     for (var i=iMin;i<=iMax;i++) {
      xx = dx*i; yy = scale*simple(func.replace(/\bx\b/g, '('+xx/scale+')').replace(/\by\b/g, '('+xx/scale+')'));
      if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
      else         ctx.lineTo(x0+xx,y0-yy);
     }
     ctx.stroke();

     ctx.beginPath();
     ctx.lineWidth = thick;
     ctx.strokeStyle = color;

     ctx.fillText(func, 35,pos*13+13);

     ctx.moveTo(10,pos*13+10);
     ctx.lineTo(30,pos*13+10);
     ctx.stroke();
}

function showAxes(ctx,axes) {
     var x0=axes.x0, w=ctx.canvas.width;
     var y0=axes.y0, h=ctx.canvas.height;
     var xmin = axes.doNegativeX ? 0 : x0;
     ctx.beginPath();
     ctx.strokeStyle = "#DAE1E8";
     ctx.lineWidth = 1;
     ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
     ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
     ctx.stroke();

     if (axes.scale*zoom <= 20) zoom++;
     else if(axes.scale*zoom > 40 && zoom != 1) zoom--;

     for (var i = x0, counter=1; (i-x0)/2 < w; counter++) {
        i=i+axes.scale*zoom;
         ctx.beginPath();
         ctx.font="9px sans-serif";
         ctx.fillStyle="#000";
         ctx.fillText(counter*zoom, i-3, y0+13);
         ctx.lineCap = "round";
         ctx.strokeStyle = "#848c94";
         ctx.moveTo(i,y0-2);
         ctx.lineTo(i,y0+2);  // X axis
         ctx.stroke();

         ctx.beginPath();
         ctx.fillText(-counter*zoom, x0-(i-x0)-3, y0+13);
         ctx.moveTo(x0-(i-x0),y0-2);
         ctx.lineTo(x0-(i-x0),y0+2);  // -X axis
         ctx.stroke();
     };

    for (var i = y0, counter=1; (i-y0)/2 < h; counter++) {
        i=i+axes.scale*zoom;
         ctx.beginPath();
         ctx.font="9px sans-serif";
         ctx.fillStyle="#444";
         ctx.fillText(-counter*zoom, x0+7, i+2);
         ctx.lineCap = "round";
         ctx.strokeStyle = "#848c94";
         ctx.moveTo(x0-2, i);
         ctx.lineTo(x0+2, i);  // Y axis
         ctx.stroke();

         ctx.beginPath();
         ctx.fillText(counter*zoom, x0+7, y0-(i-y0)+2);
         ctx.moveTo(x0-2, y0-(i-y0));
         ctx.lineTo(x0+2, y0-(i-y0));  // -Y axis
         ctx.stroke();
     };

     if (scale>100) {
        for (var i = y0, counter=1; (i-y0)/2 < h; counter++) {
            i=i+axes.scale*zoom/10;
             ctx.beginPath();

             ctx.font="8px sans-serif";
             ctx.fillStyle="#a5abb0";
             ctx.fillText(-counter*zoom/10, x0+7, i+2);
             ctx.lineWidth=1;
             ctx.lineCap = "round";
             ctx.strokeStyle = "#97a1aa";
             ctx.moveTo(x0-2, i);
             ctx.lineTo(x0+2, i);  // Y axis
             ctx.stroke();

             ctx.beginPath();
             ctx.fillText(counter*zoom/10, x0+7, y0-(i-y0)+2);
             ctx.moveTo(x0-2, y0-(i-y0));
             ctx.lineTo(x0+2, y0-(i-y0));  // -Y axis
             ctx.stroke();
         };

         for (var i = x0, counter=1; (i-x0)/2 < w; counter++) {
            i=i+axes.scale*zoom/5;
             ctx.beginPath();
             ctx.fillText(counter*zoom/5, i-3, y0+13);
             ctx.moveTo(i,y0-2);
             ctx.lineTo(i,y0+2);  // X axis
             ctx.stroke();

             ctx.beginPath();
             ctx.fillText(-counter*zoom/5, x0-(i-x0)-3, y0+13);
             ctx.moveTo(x0-(i-x0),y0-2);
             ctx.lineTo(x0-(i-x0),y0+2);  // -X axis
             ctx.stroke();
         };
     };

}