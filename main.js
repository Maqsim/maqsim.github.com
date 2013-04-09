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
            fx = this.parentNode.querySelector(".fx").value;

        this.parentNode.querySelector("span.result").innerHTML = round_mod(transcendental(fx, a, b), 8);

        return false;
    }
}