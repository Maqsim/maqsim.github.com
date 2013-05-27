function round_mod(value, precision) {
    // спецчисло для округления
    var precision_number = Math.pow(10, precision);

    // округляем
    return Math.round(value * precision_number) / precision_number;
}


scale = 40;
colors = [];
for (var i = 0; i < 20; i++) {
    colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
};
colors[0] = "#45688E";

zoom = 1;
move = false;

var axes={}, ctx=canvas.getContext("2d");
     axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
     axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
     axes.scale = scale;                 // 40 pixels from x=0 to x=1
     axes.doNegativeX = true;

window.onload = function() {
        simple = new Calculator(),
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

    elem.onclick=function(){
        move = true;
    };

    elem.onmousemove=function(){
        if (move)
    };


    function onWheel(e) {
        e = e || window.event;
        // wheelDelta не дает возможность узнать количество пикселей
        var delta = e.deltaY || e.detail || e.wheelDelta;
        scale += ((delta<0)?-scale/8:scale/8);
        document.querySelector('#graph form').querySelector('input[type=submit]').click()

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

   /* var  eps = 0.0000000000001;        // Требуемая точность
    var x0, x1, y0, y1, F, G, dFdx, dFdy, dGdx, dGdy, b1, b2;

    f1 = function(x, y) {return Math.Math.sin(2*x+y)+1.2*x-0.2};
      f2 = function(x, y) {return x^2+y^2-1};
      diffY = function(f, x, y) {return (f(x, y+eps) - f(x, y))/eps;}
      diffX = function(f, x, y) {return (f(x+eps, y) - f(x, y))/eps;}

      y1 = 1       // Нулевые приближения
      x1 = -2;
      dFdx =  diffX(f1, x1, y1);               // Неизменяемые первые частные
      dGdy =  diffY(f2, x1, y1);               // производные




// Итерационный цикл
  do {
    x0 = x1; y0 = y1;              // Предыдущее приближение
    dFdy =  diffY(f1, x0, y0);         // Изменяемые первые частные
    dGdx = diffX(f2, x0, y0);             // производные
    F = f1(x0,y0);
    G = f2(x0,y0);
    b1 = F - dFdx*x0 - dFdy*y0;
    b2 = G - dGdx*x0 - dGdy*y0;
    //Вычисление следующего приближения (решение системы двух линейных уравнений)
    x1 = (b2*dFdy-b1*dGdy)/(dGdy*dFdx - dFdy*dGdx);
    y1 = -(b1+dFdx*x1)/dFdy;
  // Итерации заканчиваются, когда следующие приближения отличаются
  // по модулю от предыдущих не более, чем на заданную точность
  } while ((Math.abs(x0-x1)<=eps) && (Math.abs(y0-y1)<=eps));

  console.log('  X= ',x1,'; Y= ',y1);
  console.log('  Проверка: ');
  b1 = f1(x1,y1);
  b2 = f2(x1,y1);
  console.log('f1 =',b1);
  console.log('f2 =',b2);

  i++;
                //Якобиан
                J = df1dx() * df2dy() - df1dy() * df2dx();
                //вычисление очередного значения х
                x_sled = x + (((-f1(x, y)) * df2dy() - (-f2(x, y)) * df1dy()) / J);
                y_sled = y + (((-f2(x, y)) * df1dx() - (-f1(x, y)) * df2dx()) / J);
                if (Math.Abs(x_sled - x) < eps && Math.Abs(y_sled - y) < eps)
                    break;
                x = x_sled;
                y = y_sled;*/



                var N = 5;

/* число переменных и функций (нумерация переменных и функций будет вестись с нуля) */
var EPS = 0.00005;


function SQR(x) {return Math.pow(x,2);}

function f0(x) { return x[0] + x[1] + x[2] + x[3] - 2.33; }
function f1(x) { return SQR(x[0]) + 2 * x[1] * Math.sin(x[2] + x[4]) - 0.68098912; }
function f2(x) { return x[0] * Math.cos(x[1]) + Math.atan(SQR(x[3])+ SQR(x[4])) - 1.8488879; }
function f3(x) { return Math.sqrt(SQR(x[0]) + SQR(x[2])) * Math.exp(x[3]/10) + 10 * SQR(x[4])  - 20.294897; }
function f4(x) { return Math.exp( -0.5 * SQR(x[1] + x[2]) ) - Math.log( SQR(Math.cos(x[3] + x[4])) ) - 1.0781266; }

function f00(x) { return 1; }
function f01(x) { return 1; }
function f02(x) { return 1; }
function f03(x) { return 1; }
function f04(x) { return 0; }

function f10(x) { return 2 * x[0]; }
function f11(x) { return 2 * Math.sin(x[2] + x[4]); }
function f12(x) { return 2 * x[1] * Math.cos(x[2] + x[4]); }
function f13(x) { return 0; }
function f14(x) { return 2 * x[1] * Math.cos(x[2] + x[4]); }

function f20(x) { return Math.cos(x[1]); }
function f21(x) { return -x[0] * Math.sin(x[1]); }
function f22(x) { return 0; }
function f23(x) { return 2 * x[3] / ( SQR( SQR(x[3]) + SQR(x[4]) ) + 1 ); }
function f24(x) { return 2 * x[4] / ( SQR( SQR(x[3]) + SQR(x[4]) ) + 1 ); }

function f30(x) { return Math.exp(x[3]/10) * x[0] / Math.sqrt(SQR(x[0]) + SQR(x[2])); }
function f31(x) { return 0; }
function f32(x) { return Math.exp(x[3]/10) * x[2] / Math.sqrt(SQR(x[0]) + SQR(x[2])); }
function f33(x) { return Math.sqrt(SQR(x[0]) + SQR(x[2])) * Math.exp(x[3]/10) / 10; }
function f34(x) { return 20 * x[4]; }

function f40(x) { return 0; }
function f41(x) { return - (x[1] + x[2]) * Math.exp( -0.5 * SQR(x[1] + x[2]) ); }
function f42(x) { return - (x[1] + x[2]) * Math.exp( -0.5 * SQR(x[1] + x[2]) ); }
function f43(x) { return 2 * Math.tan(x[3] + x[4]); }
function f44(x) { return 2 * Math.tan(x[3] + x[4]); }

x = [
        0.7,
        0.3,
        1.6,
        -0.4,
        1.3,
];

/* массив перечисленных функций */
f = [
        f0,
        f1,
        f2,
        f3,
        f4,
];

/* массив производных этих функций */
ff = [
        [ f00, f01, f02, f03, f04 ],
        [ f10, f11, f12, f13, f14 ],
        [ f20, f21, f22, f23, f24 ],
        [ f30, f31, f32, f33, f34 ],
        [ f40, f41, f42, f43, f44 ],
];

/* массивы с результатами текущего приближения */
var fx=[];
var ffx=[[],[],[],[],[]];

/* обратная матрица к ffx */
var ffx1=[[],[],[],[],[]];

/* невязка */
var nevyazka;

/* вывод текущих значений x[i] */
function printX()
{
        for (var i = 0; i < N; i++)
                console.log(x[i]);
}

/* печать информации о текущей итерации: шаг невязка x1 x2 ... xN */
function print(t)
{
        console.log(t, nevyazka);
        console.log('Answer: ');
        printX();
}

/* ----------------------------- */
/* MAIN функция (решение задачи) */
/* ----------------------------- */

if (0) { // если нужно как-то иначе задать начальное приближение
        //srand(time(null));
        for (var i = 0; i < N; i++)
                //x[i] = 5.0 * (rand() / RAND_MAX - 0.5);
                x[i] = i;

}

        // вывод текущих значений x[i]
        //printX();

        // основной итеративный цикл
        for (var t = 0; t < 100; t++)
        {
                /* -------------------------------------------------- */
                /* подсчет матриц с результатами текущего приближения */
                /* -------------------------------------------------- */

                console.log(f);
                // подсчет матрицы значений функции
                for (var i = 0; i < N; i++) {
                        fx[i] = f[i](x);
//                      console.log("%10f ", fx[i]);
                }
//              console.log("\n");

                // подсчет матрицы производных функции
                for (var i = 0; i < N; i++) {
                        for (var j = 0; j < N; j++) {
                                ffx[i][j] = ff[i][j](x);
                                //console.log(ffx);
                        }
//                      console.log("\n");
                }
//              console.log("\n");

                /* --------------------------------------------- */
                /* подсчет матрицы обратной ffx (методом Гаусса) */
                /* --------------------------------------------- */

                // зануляем массив
                ffx1 = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];

                // устанавливаем единички на диагонали будущей обратной матрице
                for (var i = 0; i < N; i++)
                        ffx1[i][i] = 1;

                var  r;

                for (var i = 0; i < N; i++)
                {
                        // вычитаем i-ую строку из k-ой строки
                        for (var i = 0; i < N; i++) {
                                for (var k = 0; k < N; k++) {
                                        // саму из себя строку нельзя вычитать
                                        if (i == k) continue;

                                        // вычисляем коэффициент вычитания
                                        r = ffx[k][i] / ffx[i][i];

                                        // вычитаем по очереди каждый элемент строки
                                        for (var j = 0; j < N; j++) {
                                                ffx[k][j] -= r * ffx[i][j];
                                                ffx1[k][j] -= r * ffx1[i][j];
                                        }
                                }
                        }
                }




                for (var i = 0; i < N; i++) {
                        // вычисляем коэффициент "нормализации" (предполагается, что i-ый элемент i-ой строки НЕ! равен нулю)
                        r = ffx[i][i];
                        // "нормализуем" строку матрицы
                        for (var j = 0; j < N; j++) {
                                ffx[i][j] /= r;
                                ffx1[i][j] /= r;
                        }

                }

                /* ------------------------------------- */
                /* проверяем: единичная ли вышла матрица */
                /* ------------------------------------- */

if(0) {
                for (var i = 0; i < N; i++) {
                        for (var j = 0; j < N; j++) {
                                var dx = 0;
                                for (var k = 0; k < N; k++)
                                        dx += ffx1[i][k] * ff[k][j](x);
                                console.log(Math.abs(dx));
                        }
                }
}

                /* ------------------------------------- */
                /* вычисление следующего приблизижения x */
                /* ------------------------------------- */

                for (var i = 0; i < N; i++) {
                        // вычисляем i-ую строку произведения матриц ffx1 на fx
                        var dx = 0;
                        for (var k = 0; k < N; k++)
                                dx += ffx1[i][k] * fx[k];
                        // следующее значение x_i+1 равно x_i - dx
                        x[i] = x[i] - dx;
                }

                /* ------------------ */
                /* вычисление невязки */
                /* ------------------ */

                nevyazka = 0;
                for (var i = 0; i < N; i++)
                        nevyazka += SQR( f[i](x) );
                nevyazka = Math.sqrt(nevyazka);

                /* ---------------- */
                /* вывод информации */
                /* ---------------- */

                //print(t);

                /* ------------------------------------------------ */
                /* вывод невязка ничтожна мала, то конец итерациям! */
                /* ------------------------------------------------ */

                if (nevyazka < EPS) {
                        break;
                }

                /* ------------------------------ */
                /* вывод кривой вывод, то выхоидм */
                /* ------------------------------ */

if (1) {
                if (isNaN(nevyazka)) {
                        break;
                }
        }
else {
        return 0;
}
}}






function draw(func) {
    if (null==canvas || !canvas.getContext) return;

    canvas.width  = 400;
    canvas.height = 300;

     var axes={}, ctx=canvas.getContext("2d");
     axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
     axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
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
}

function funGraph (ctx,axes,func,color,thick, pos) {
    pos = pos || 0;
    func = func.replace(/^\s+|\s+$/g, "");
     var xx, yy, dx=0.5, x0=axes.x0, y0=axes.y0, scale=axes.scale;
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

     for (var i = x0, counter=1; i < w; counter++) {
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

    for (var i = y0, counter=1; i < h; counter++) {
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
        for (var i = y0, counter=1; i < h; counter++) {
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

         for (var i = x0, counter=1; i < w; counter++) {
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

function isArray(inputArray) {
    return inputArray && !(inputArray.propertyIsEnumerable('length')) && typeof inputArray === 'object' && typeof inputArray.length === 'number';
}