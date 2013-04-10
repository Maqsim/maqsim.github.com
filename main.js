function round_mod(value, precision) {
    // спецчисло для округления
    var precision_number = Math.pow(10, precision);

    // округляем
    return Math.round(value * precision_number) / precision_number;
}

window.onload = function() {
        simple = new Calculator(),
        transcendental = new Calculator('transcendental'),
        integral = new Calculator('integral');
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
        var a = simple(this.parentNode.querySelector(".a").value),
            b = simple(this.parentNode.querySelector(".b").value),
            e = simple(this.parentNode.querySelector(".e").value),
            fx = this.parentNode.querySelector(".fx").value;

        var result = round_mod(transcendental(fx, a, b), 8);
        this.parentNode.querySelector("span.result").innerHTML = result;
        this.parentNode.querySelector('a.graph').style.display = (!isNaN(result) && typeof result === 'number')?'block':'none'; 

        return false;
    }

    document.querySelector("#graph form").onsubmit = function() {
        var fx = this.parentNode.querySelector(".fx").value;
        if (fx.length>0) draw(fx); 
        return false;
    }

    document.querySelector('#transcendental a.graph').onclick = function() {
        document.querySelector('#graph input.fx').value = this.parentNode.querySelector('input.fx').value;
        document.querySelector('#graph form').querySelector('input[type=submit]').click()
        return false;
    }
}

function draw(func) {
     var canvas = document.querySelector("canvas");
     if (null==canvas || !canvas.getContext) return;

     canvas.width  = 400;
    canvas.height = 300;

     var axes={}, ctx=canvas.getContext("2d");
     axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
     axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
     axes.scale = 40;                 // 40 pixels from x=0 to x=1
     axes.doNegativeX = true;

     showAxes(ctx,axes);
     if (typeof func == 'string' && func.length > 0) funGraph(ctx, axes, func, "#45688E", 1); 
}

function funGraph (ctx,axes,func,color,thick) {
     var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
     var iMax = Math.round((ctx.canvas.width-x0)/dx);
     var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
     ctx.beginPath();
     ctx.lineWidth = thick;
     ctx.strokeStyle = color;

     for (var i=iMin;i<=iMax;i++) {
      xx = dx*i; yy = scale*simple(func.replace(/\bx\b/g, '('+xx/scale+')'));
      if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
      else         ctx.lineTo(x0+xx,y0-yy);
     }
     ctx.stroke();
}

function showAxes(ctx,axes) {
     var x0=axes.x0, w=ctx.canvas.width;
     var y0=axes.y0, h=ctx.canvas.height;
     var xmin = axes.doNegativeX ? 0 : x0;
     ctx.beginPath();
     ctx.strokeStyle = "#DAE1E8"; 
     ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
     ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
     ctx.stroke();
}