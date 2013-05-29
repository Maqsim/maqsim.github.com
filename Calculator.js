function factorial(n) {return (n!=1) ? n*factorial(n-1) : 1;}

function sinh(aValue) {
   var myTerm1 = Math.pow(Math.E, aValue);
   var myTerm2 = Math.pow(Math.E, -aValue);

   return (myTerm1-myTerm2)/2;
}

function cosh(aValue) {
   var myTerm1 = Math.pow(Math.E, aValue);
   var myTerm2 = Math.pow(Math.E, -aValue);

   return (myTerm1+myTerm2)/2;
}

function tanh(aValue) {
    var pos = Math.exp(aValue);
    var neg = Math.exp(-aValue);
    return (pos - neg) / (pos + neg);
}

function array_unique(array) {
    var p, i, j;
    for(i = array.length; i;){
        for(p = --i; p > 0;){
            if(array[i] === array[--p]){
                for(j = p; --p && array[i] === array[p];);
                i -= array.splice(p + 1, j - p).length;
            }
        }
    }
    return true;
}

function isArray(inputArray) {
    return inputArray && !(inputArray.propertyIsEnumerable('length')) && typeof inputArray === 'object' && typeof inputArray.length === 'number';
}

function Calculator(mode) {
    var operators = {
        '(':{'priority':5},
        ')':{'priority':5},
        '±':{'priority':3, 'left': true},
        '!': {'priority':4},
        '^':{'priority':3, 'rightImportant': true},
        '*':{'priority':2},
        '/':{'priority':2},
        '+':{'priority':1},
        '-':{'priority':1},
        'abs':{'priority':3, 'left': true},
        'exp':{'priority':3, 'left': true},
        'sin':{'priority':3, 'left': true},
        'cos':{'priority':3, 'left': true},
        'tg':{'priority':3, 'left': true},
        'ctg':{'priority':3, 'left': true},
        'arcsin':{'priority':3, 'left': true},
        'arccos':{'priority':3, 'left': true},
        'arctg':{'priority':3, 'left': true},
        'arcctg':{'priority':3, 'left': true},
        'arcsec':{'priority':3, 'left': true},
        'arccsc':{'priority':3, 'left': true},
        'sec':{'priority':3, 'left': true},
        'csc':{'priority':3, 'left': true},
        'sinh':{'priority':3, 'left': true},
        'cosh':{'priority':3, 'left': true},
        'tanh':{'priority':3, 'left': true},
        'cth':{'priority':3, 'left': true},
        'sech':{'priority':3, 'left': true},
        'csch':{'priority':3, 'left': true},
        'sqrt':{'priority':3, 'left': true},
        'ln':{'priority':3, 'left': true},
        'log':{'priority':3, 'left': true}
    };

    var constants = {
        'e': Math.E,
        'pi': Math.PI,
        'i': Math.sqrt(-1),
        'degree': Math.PI/180,
        'EulerGamma': 0.577216,
        'GoldenRatio': (1+Math.sqrt(5))/2
    }

    var re =  new RegExp("[^\\w]","gi");

    var toRPN = function(str) {
        for (constant in constants) str = str.replace(new RegExp("\\b"+constant+"\\b","gi"), constants[constant]);
        var positions = [];
        var temp=[];

        while (re.exec(str) != null) positions.push(re.lastIndex-1);

        var i, lastIndex;
        for (i = 0, lastIndex=0; i < str.length; i++) {
               if (positions.indexOf(i) !== -1) {
                    if (str.substr(lastIndex, i-lastIndex) !== '') temp.push(str.substr(lastIndex, i-lastIndex));
                    temp.push(((temp[temp.length-1] == '(' || temp[temp.length-1] == 'undefined' || temp[temp.length-1] == null) && str[i] == '-')?'±':str.substr(i, 1));
                    lastIndex = i+1;
               }
           };
        if (str.substr(lastIndex) !== '') temp.push(str.substr(lastIndex));
        str = temp;

        var ret = [];
        var token = '';
        var stack = [];

        for(ind in str) {
            //читаем очередной символ
            var ch = str[ind];
            if(ch == ' ') {
                if(token.length > 0)
                    ret.push(token);

                token = '';
                continue;
            }

            if(ch in operators) {
                if(token.length > 0)
                    ret.push(token);

                token = '';
                if(ch == ')') {
                    var t = '';
                    var c = 0;
                    while( (t=stack.pop()) != '(') {
                        c++;
                        ret.push(t);
                        if(c > 50) break;
                    }
                }
                else {
                    var t = stack[stack.length - 1];
                    if(t != undefined && t != null) {
                        if ( t != '(' && ((operators[t].priority > operators[ch].priority) || operators[ch].left)) {
                            for(;;) {
                                t = stack[stack.length - 1];
                                if(t == undefined || t == null || ((operators[t].priority < operators[ch].priority) || operators[ch].left) || t == '(')
                                    break;

                                t = stack.pop();
                                ret.push(t);
                            }
                        } else if(t!='(' && ((operators[t].priority == operators[ch].priority) && !operators[ch].rightImportant)) {
                            t = stack.pop();
                            ret.push(t);
                        }
                    }
                    stack.push(ch);
                }
            } else {
                token += str[ind];
            }
        }

        if(token.length > 0)
            ret.push(token);


        while(stack.length!=0) {
            ret.push(stack.pop());
        }

        //console.log(ret);
        return ret;
    }

    var calcRPN = function(arrRPN) {
        var stack = [];
        var a = 0;
        var b = 0;

        for(var i in arrRPN) {
            var token = arrRPN[i].toLowerCase();

            if(!(token in operators)) {
                stack.push(token);
                continue;
            }

            switch(token) {
                case '+':
                    b = stack.pop();
                    a = stack.pop();
                    stack.push(parseFloat(a) + parseFloat(b));
                    break;
                case '-':
                    b = stack.pop();
                    a = stack.pop();
                    stack.push(parseFloat(a) - parseFloat(b));
                    break;
                case '*':
                    b = stack.pop();
                    a = stack.pop();
                    stack.push(parseFloat(a) * parseFloat(b));
                    break;
                case '/':
                    b = stack.pop();
                    a = stack.pop();
                    stack.push(parseFloat(a) / parseFloat(b));
                    break;
                case 'abs':
                    a = stack.pop();
                    stack.push(Math.abs(parseFloat(a)));
                    break;
                case 'exp':
                    a = stack.pop();
                    stack.push(Math.exp(parseFloat(a)));
                    break;
                case 'sin':
                    a = stack.pop();
                    stack.push(Math.sin(parseFloat(a)));
                    break;
                case 'cos':
                    a = stack.pop();
                    stack.push(Math.cos(parseFloat(a)));
                    break;
                case 'tg':
                    a = stack.pop();
                    stack.push(Math.tan(parseFloat(a)));
                    break;
                case 'ctg':
                    a = stack.pop();
                    stack.push(1/Math.tan(parseFloat(a)));
                    break;
                case 'arcsin':
                    a = stack.pop();
                    stack.push(Math.asin(parseFloat(a)));
                    break;
                case 'arccos':
                    a = stack.pop();
                    stack.push(Math.acos(parseFloat(a)));
                    break;
                case 'arctg':
                    a = stack.pop();
                    stack.push(Math.atan(parseFloat(a)));
                    break;
                case 'arcctg':
                    a = stack.pop();
                    stack.push(Math.PI/2 - Math.atan(parseFloat(a)));
                    break;
                case 'arcsec':
                    a = stack.pop();
                    stack.push(Math.acos(parseFloat(1/a)));
                    break;
                case 'arccsc':
                    a = stack.pop();
                    stack.push(Math.asin(parseFloat(1/a)));
                    break;
                case 'sec':
                    a = stack.pop();
                    stack.push(1/Math.cos(parseFloat(a)));
                    break;
                case 'csc':
                    a = stack.pop();
                    stack.push(1/Math.sin(parseFloat(a)));
                    break;
                case 'sinh':
                    a = stack.pop();
                    stack.push(sinh(parseFloat(a)));
                    break;
                case 'cosh':
                    a = stack.pop();
                    stack.push(cosh(parseFloat(a)));
                    break;
                case 'tanh':
                    a = stack.pop();
                    stack.push(tanh(parseFloat(a)));
                    break;
                case 'cth':
                    a = stack.pop();
                    stack.push(1/tanh(parseFloat(a)));
                    break;
                case 'sech':
                    a = stack.pop();
                    stack.push(1/(1/Math.cos(parseFloat(a))));
                    break;
                case 'csch':
                    a = stack.pop();
                    stack.push(1/(1/Math.sin(parseFloat(a))));
                    break;
                case 'sqrt':
                    a = stack.pop();
                    stack.push(Math.sqrt(parseFloat(a)));
                    break;
                case 'ln':
                    a = stack.pop();
                    stack.push(Math.log(parseFloat(a)));
                    break;
                case 'log':
                    b = stack.pop();
                    a = stack.pop();
                    stack.push(Math.log(parseFloat(b))/Math.log(parseFloat(a)));
                    break;
                case '^':
                    b = stack.pop();
                    a = stack.pop();
                    stack.push(Math.pow(parseFloat(a), parseFloat(b)));
                    break
                case '±':
                    a = stack.pop();
                    stack.push(-parseFloat(a));
                    break;
                case '!':
                    a = stack.pop();
                    stack.push(parseFloat(factorial(a)));
                    break;
            }
        }

        return stack.pop();
    }

    var f = function(expression, x) {
        if (isArray(x)) {
            for(i=0; i<=x.length-1; i++) {
                expression = expression.replace(new RegExp("\\bx"+(i+1)+"\\b", 'g'), "("+parseFloat(x[i])+")");
            }
        } else expression = expression.replace(/\bx\b/g, "("+parseFloat(x)+")")
        return parseFloat(calcRPN(toRPN(expression)));
    }

    var returnFunction;
    switch(mode) {
        case 'diff':
            returnFunction = function(expression, x, diffParam) {
                var originX = x.concat();

                if (isArray(originX)) {
                    originX[diffParam-1] += 0.0000001;
                } else originX += 0.0000001;
                return (f(expression, originX)-f(expression, x))/0.0000001;
            }
            break;
        case 'transcendental':
            returnFunction = function(expression, aMax, bMax, e) {
                if (!expression) return;
                if (!isArray(expression) && !isArray(aMax)) {
                    e = (!!document.querySelector("#highAccuracy").checked)?0.000001:0.0001;
    				aMax = aMax || -20;
    				bMax = bMax || 20;
                    var c;

                    aMax = parseFloat(aMax); bMax = parseFloat(bMax);
                    var dmax = 10;
                        d = e,
                        x0 = aMax + (Math.abs(aMax - bMax))/2,
                        f0 = f(expression, x0),
                        D = d,
                        a = x0 - D,
                        b = x0,
                        fa = f(expression, a),
                        fb = f(expression, b),
                        result = [];

                    while(D <= dmax && a >= aMax) {
                        D = D + d;
                        if (f0 >= 0) {
                            if (fa < 0) {b = x0; result.push(a+":"+b); x0 = a; f0 = f(expression, x0);}
                            if (fb < 0) {b = x0; result.push(a+":"+b); x0 = a; f0 = f(expression, x0);}

    						if(fa > fb) {b=x0; x0=b;  fa=f0; f0=fb; }
                            else if(fa<fb) {b=x0; x0=a; a-=D; fb=f0; f0=fa; fa=f(expression, b);}
                            else {a-=D; fa=f(expression, a);fb=f(expression, b);}
                        } else {
                            if(fa>=0) {b=x0;result.push(a+":"+b); x0 = a; f0 = f(expression, x0);}
                            else if(fb>=0) {a=x0;result.push(a+":"+b); x0 = a; f0 = f(expression, x0);}
                            if(fa<fb) {b=x0; x0=(b); fa=f0; f0=fb; fb=f(expression, b);}
                            else if(fa>fb) {b=x0; x0=(a); a-=D; fb=f0; f0=fa; fa=f(expression, a);}
                            else {a-=D;  fa=f(expression, a);fb=f(expression, b);}
                        }

                    }

                    var x0 = aMax + (Math.abs(aMax - bMax))/2,
                        f0 = f(expression, x0),
                        D = d,
                        a = x0,
                        b = x0 + D,
                        fa = f(expression, a),
                        fb = f(expression, b);

    				while(D <= dmax && b<=bMax) {
                        D = D + d;
                        if (f0 >= 0) {
                            if (fa < 0) {a = x0; result.push(a+":"+b); x0 = b; f0 = f(expression, x0);}
                            if (fb < 0) {a = x0; result.push(a+":"+b); x0 = b; f0 = f(expression, x0);}

                            if(fa> fb) {a=x0; x0=b; b+=D; fa=f0; f0=fb; fb=f(expression, b);}
                            else if(fa<fb) {a=x0; x0=a; fb=f0; f0=fa; fa=f(expression, b);}
                            else {b+=D; fa=f(expression, a);fb=f(expression, b);}
                        } else {
                            if(fa>=0) {a=x0; result.push(a+":"+b); x0 = b; f0 = f(expression, x0);}
                            else if(fb>=0) {a=x0; result.push(a+":"+b); x0 = b; f0 = f(expression, x0);}
                            if(fa<fb) {a=x0; x0=(b); b+=D; fa=f0; f0=fb; fb=f(expression, b);}
                            else if(fa>fb) {a=x0; x0=(a); fb=f0; f0=fa; fa=f(expression, a);}
                            else {b+=D; fa=f(expression, a);fb=f(expression, b);}
                        }
                    }
                    array_unique(result);

                    if (result.length < 1) return;
                    //половинчастого деления, дихотомии
                    var roots = [];
                    for (var i = 0; i < result.length; i++) {
                        a = parseFloat(result[i].split(":")[0]);
                        b = parseFloat(result[i].split(":")[1]);
                        while (Math.abs(b - a) >= e) {
                            c = (a + b) / 2;
                            if (f(expression, a) * f(expression, c) < 0) b = c;
                            else a = c;
                        }
                        roots.push(round_mod(parseFloat(c), 8));
                    };
                    // метод Хорд
                    /*do {
                        c = a-f(expression, a)*(b-a)/(f(expression, b)-f(expression, a));
                        if (f(expression, a) * f(expression, c) < 0) b = c;
                        else a = c;
                    } while (Math.abs(f(expression, c))<e);*/
                } else {
                    var Fx = expression;
                    var x = aMax;
                    var N = Fx.length;
                    var EPS = e * 2;

                    /* массивы с результатами текущего приближения */
                    var fx=[];
                    var ffx=[[],[],[]];
                    /* обратная матрица к ffx */
                    var ffx1=[];
                    /* невязка */
                    var nevyazka;
                    /* вывод текущих значений x[i] */
                    function printX() { for (var i = 0; i < N; i++) console.log(x[i]); }
                    /* печать информации о текущей итерации: шаг невязка x1 x2 ... xN */
                    function print(t) {
                            console.log(t, nevyazka);
                            console.log('Answer: ');
                            printX();
                    }

                    // основной итеративный цикл
                    for (var t = 0; t < 1000; t++) {
                        // массив производных функций
                        ff=[];
                        for (var i = 0; i < N; i++) {
                            ff[i] = [];
                                for (var j = 0; j < N; j++) {
                                        ff[i][j] = diff(Fx[i],x,j+1)
                                }
                        }

                        // подсчет матрицы значений функции
                        for (var i = 0; i < N; i++) {
                                fx[i] = f(Fx[i], x);
                        }

                        // подсчет матрицы производных функции
                        for (var i = 0; i < N; i++) {
                                for (var j = 0; j < N; j++) {
                                        ffx[i][j] = ff[i][j];
                                        //console.log(ffx);
                                }
                        }

                        // зануляем массив
                        for (var i = 0; i < N; i++) {
                            ffx1[i] = [];
                                for (var j = 0; j < N; j++) {
                                        ffx1[i][j] = 0
                                }
                        }

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

                        for (var i = 0; i < N; i++) {
                                // вычисляем i-ую строку произведения матриц ffx1 на fx
                                var dx = 0;
                                for (var k = 0; k < N; k++)
                                        dx += ffx1[i][k] * fx[k];
                                // следующее значение x_i+1 равно x_i - dx
                                x[i] = x[i] - dx;
                        }

                        nevyazka = 0;
                        for (var i = 0; i < N; i++)
                                nevyazka += Math.pow( f(Fx[i], x), 2);
                        nevyazka = Math.sqrt(nevyazka);
                        roots = x || roots;
                        if (nevyazka < EPS && isNaN(nevyazka)) break;
                    }
                }
                return roots;
            }
        break;
        case 'transcendental2':
            returnFunction = function(Fx, x) {}
        break;
        case 'integral':
            returnFunction = function(expression, a, b, n) {
                parseFloat(a); parseFloat(b); parseFloat(n);
                n = n || 1000;
                var t,j;
                var result=0;
                for(j = 1; j <= n; j++) result = result + (f(expression, parseFloat(a+(b-a)/n*j)) * (b-a)/n);
                return parseFloat(result);
            }
        break;
        default: case '': case 'normal': returnFunction = function(expression) {return parseFloat(calcRPN((typeof expression === 'string')?toRPN(expression):expression))}
    }

    return returnFunction;
}