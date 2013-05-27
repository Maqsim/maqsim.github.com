function round_mod(value, precision) {
    // спецчисло для округления
    var precision_number = Math.pow(10, precision);

    // округляем
    return Math.round(value * precision_number) / precision_number;
}

plot = "";

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
            n = (!!this.parentNode.querySelector("#highAccuracy").checked)?100000:1000;
            fx = this.parentNode.querySelector(".fx").value;

        this.parentNode.querySelector("span.result").innerHTML = round_mod(integral(fx, a, b, n), 8);

        return false;
    }

    document.querySelector("#transcendental form").onsubmit = function() {
        var fx = this.parentNode.querySelector(".fx").value,
            a, b, rangePos, eqPos;

        if((rangePos = fx.indexOf('[')) > 1) {
          a = fx.substr(rangePos).split(';')[0].substr(1);
          b = fx.substr(rangePos).split(';')[1].slice(0, -1);
          fx = fx.substr(0, rangePos);
        }

        plot = fx;

        if((eqPos = fx.indexOf('=')) > 1) {
          var f = fx.split('=')[0].replace(/^\s+|\s+$/g, "");
          var g = fx.split('=')[1].replace(/^\s+|\s+$/g, "");
          fx = '('+f+')-('+g+')';
          plot = f+","+g;
        }

        if(fx.indexOf('{') !== -1 && fx.indexOf('}') !== -1) {
          plot = fx.slice(1,-1);
          fx = null;
        }

        draw(plot);
        var result = transcendental(fx, a, b);
        if (isArray(result)) result = result.join('<br>');
        if (fx) this.parentNode.querySelector("span.result").innerHTML = result;

        return false;
    }

    document.querySelector("#transcendental2 form").onsubmit = function() {
        var x1 = simple(this.parentNode.querySelector(".x1").value),
            x2 = simple(this.parentNode.querySelector(".x2").value),
            fx1 = this.parentNode.querySelector(".fx1").value,
            fx2 = this.parentNode.querySelector(".fx2").value;
        var result = transcendental([fx1,fx2], [x1,x2]);
        if (isArray(result)) result = result.join('<br>');

        this.parentNode.querySelector("span.result").innerHTML = result;
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
        }
        xPosMouse = (e.offsetX - xPos)/scale;
        draw(plot, xx, yy);
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
     axes.scale = scale;                 // 40 pixels from x=0 to x=1
     axes.doNegativeX = true;

     showAxes(ctx,axes);
     if(!func || func.length == 0) return;
     var functions = func.split(",");
     if (typeof func == 'string' && !functions[1]) funGraph(ctx, axes, func, colors[0], 1);
     else {
        for (var i = functions.length - 1; i >= 0; i--) {
            funGraph(ctx, axes, functions[i], colors[i], 1, i);
        };
     }

     ctx.font="9px sans-serif";
      ctx.fillStyle="000";
     ctx.fillText("x: "+xPosMouse, 350,290);
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
         ctx.fillStyle="000";
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
         ctx.fillStyle="444";
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
             ctx.fillStyle="a5abb0";
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