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
 
function Calculator(mode) {
    var operators = {
        '(':{'priority':5},
        ')':{'priority':5},
        '±':{'priority':0},
        '!': {'priority':4},
        '^':{'priority':3},
        '*':{'priority':2},
        '/':{'priority':2},
        '+':{'priority':1},
        '-':{'priority':1},
        'abs':{'priority':3},
        'exp':{'priority':3},
        'sin':{'priority':3},
        'cos':{'priority':3},
        'tg':{'priority':3},
        'ctg':{'priority':3},
        'arcsin':{'priority':3},
        'arccos':{'priority':3},
        'arctg':{'priority':3},
        'arcctg':{'priority':3},
        'arcsec':{'priority':3},
        'arccsc':{'priority':3},
        'sec':{'priority':3},
        'csc':{'priority':3},
        //asfsaf
        'sinh':{'priority':3},
        'cosh':{'priority':3},
        'tanh':{'priority':3},
        'cth':{'priority':3},
        'sech':{'priority':3},
        'csch':{'priority':3},

        'sqrt':{'priority':3},
        'ln':{'priority':3},
        'log':{'priority':3}
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
                    temp.push(((temp[temp.length-1] == '(' || temp[temp.length-1] == 'undefined' || temp[temp.length-1] == null || str[i-1] == ' ') && str[i] == '-')?'±':str.substr(i, 1));
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
                    while( (t=stack.pop()) != '(' ) {
                        ret.push(t);
                    }
                }
                else {
                    var t = stack[stack.length - 1];
                    if(t != 'undefined' && t != null) {
                        if ( t != '(' && (operators[t].priority > operators[ch].priority)) {
                            for(;;) {
                                t = stack[stack.length - 1];
                                if(t == undefined || t == null || operators[t].priority <= operators[ch].priority)
                                    break;
                                t = stack.pop();
                                ret.push(t);
                            }
                        } else if(t!='(' && (operators[t].priority >= operators[ch].priority)) ret.push(stack.pop());
                    }
                    stack.push(ch);
                }
            } 
            else token += str[ind];
        }
     
        if(token.length > 0)
            ret.push(token);
     
        while(stack.length!=0)
            ret.push(stack.pop());

        console.log(ret);
        return ret;
    }
     
    var calcRPN = function(arrRPN) {
        var stack = [];
        var a = 0;
        var b = 0;
     
        for(var i in arrRPN) {
            var token = arrRPN[i];
     
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

                //asfasf
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
                    stack.push(parseFloat(-a));
                    break;
                case '!':
                    a = stack.pop();
                    stack.push(parseFloat(factorial(a)));
                    break;
            }
        }

        return stack.pop();
    }

    var f = function(expression, x){
        return parseFloat(calcRPN(toRPN(expression.replace(/\bx\b/g, x))));
    }

    var returnFunction;

    switch(mode) {
        case 'transcendental':
            returnFunction = function(expression, a, b, e) {
                e = e || 0.0001; 
                var c;
                while (Math.abs(a - b) > e) {
                    c = (a + b) / 2;
                    if (f(expression, a) * f(expression, c) < 0) b = c;
                    else a = c;
                }

                return parseFloat((a + b) / 2);
            }
        break;
        case 'integral':
            returnFunction = function(expression, a, b, n) {
                parseFloat(a); parseFloat(b); parseFloat(n);
                n = n || 1000;
                var t,j;
                var result=0;
                for(j = 1; j <= n; j++) result = result + (f(expression, "("+parseFloat(a+(b-a)/n*j)+")") * (b-a)/n);
                return parseFloat(result);
            }
        break;
        default: case '': case 'normal': returnFunction = function(expression) {return parseFloat(calcRPN(toRPN(expression)))}
    }

    return returnFunction;
}