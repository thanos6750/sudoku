// initializing elements and their functions 

var cell_number;        // defining cell number
var sud;        // defining sudoku board
var number;     // defining numbers that can come in board
var indexs;     // for storing the predefined value
var ini = true;     // for not starting initially
const parent = document.body.children[1].children[0].children[0].children[0].children[0].children;      // sudoku grid elements
const css = document.head.children[6];      // for changing the css of cell

// giving cell attributes

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let temp1 = `${i+1}${j+1}`;
        parent[i].children[j].children[0].id = temp1;        // giving id to all
        parent[i].children[j].children[0].setAttribute("oninput", "single_input(" + temp1 + ")");     // giving functions to all 
        parent[i].children[j].children[0].setAttribute("onclick", "element(" + temp1 + ")"); 
        for(let k = 0; k < 3; k++){
            for(let l = 0; l < 3; l++){
                parent[i].children[j].children[k+1].children[l].setAttribute("onclick", "element(" + temp1 + ")");
                let temp2 = `${i+1}${j+1}${3*k + l + 1}`
                parent[i].children[j].children[k+1].children[l].id = temp2;
            }
        }
    }
}

// functions for creating sudoku

function create() {     // initializing sudoku board entries
    indexs = {};
    sud = [];
    for (let i = 0; i < 9; i++) {
        sud.push([]);
        for (let j = 0; j < 9; j++) {
            sud[i].push(0);
            temp1 = `${i+1}${j+1}`;
            document.getElementById(temp1).value = "";
            document.getElementById(temp1).removeAttribute("style");
            document.getElementById(temp1).removeAttribute("readonly");
            for(let k = 0; k < 9; k++){
                temp2 = temp1 + (k+1).toString(); 
                document.getElementById(temp2).style.display = "none";
            }
            
        }
    }
    css.innerHTML = ".cell{visibility: visible;}";
}

function check(x, r, c) {       // function to check the numbers that can come in board 
    for (let i = 0; i < 9; i++) {
        if (x === sud[r][i]) {
            return false;
        }
        if (x === sud[i][c]) {
            return false;
        }
    }
    for (let i = Math.floor(r / 3) * 3; i < Math.floor(r / 3) * 3 + 3; i++) {
        for (let j = Math.floor(c / 3) * 3; j < Math.floor(c / 3) * 3 + 3; j++) {
            if (x === sud[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function ranarray() {       // creating an random array of number 1 to 9
    number = [];
    let random = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
        let temp = Math.floor(Math.random() * (9 - i));
        number.push(random[temp])
        random.splice(temp, 1);
    }
}

function solve(r, c, p) {       // solve the sudoku and can be used to generate it too
    if (c === 9) {
        c = 0;
        r++;
    }
    if (r === 9) {
        return true;
    }
    if (sud[r][c] === 0) {
        for (let i of number) {
            if (check(i, r, c)) {
                sud[r][c] = i;
                if (solve(r, c + 1, p)) {       
                    if (Math.random() < p) {        // showing value using probability
                        parent[r].children[c].children[0].value = i.toString();
                        parent[r].children[c].children[0].setAttribute("readonly", true);
                    }
                    else {
                        indexs[`${r + 1}${c + 1}`] = `${i}`;        // storing the non shown values
                    }
                    return true;
                }
            }
        }
        sud[r][c] = 0;
        return false;
    } else if (solve(r, c + 1, p)) {
        return true;
    }
    return false;
}

// defining time variables 
var second = 0;
var minute = 0;
var k;      // for setInterval function 

// defining time functions

function time() {       // showing time attribute
    if(ini){
        return true;
    }
    let name = document.getElementById("time_icon").alt;
    if (name == "pause") {
        k = setInterval(start, 1000);
        css.innerHTML = ".cell{visibility: visible;}";
        document.getElementById("time_icon").alt = "play";
        document.getElementById("time_icon").src = "play.svg";
    }
    else if (name == "play") {
        clearInterval(k);
        css.innerHTML = ".cell{visibility: hidden;}";
        document.getElementById("time_icon").alt = "pause";
        document.getElementById("time_icon").src = "pause.svg";
    }
}

function start() {      // displaying as stopwatch 
    let sec = `0${second}`.substr(-2);
    let min = `0${minute}`.substr(-2);
    document.getElementById("time_show").innerHTML = min + ":" + sec;
    second += 1;
    if (second == 60) {
        second = 0;
        minute += 1;
    }
}

// initializing the hint variable

var hints = 0;
var max_hint = 3;

function hint() {
    if( ini == true || hints == max_hint || document.getElementById(cell_number).style.color == "green" || document.getElementById(cell_number).style.color == "blue"){     // only few hints and given 
        return true;        // should not be in indexs
    }
    document.getElementById(cell_number).value = sud[Number(cell_number[0]) - 1][Number(cell_number[1]) - 1].toString();
    hints += 1;
    document.getElementById("hints").innerHTML = `${hints}/${max_hint}`;
    document.getElementById(cell_number).style.color = "blue";
    document.getElementById(cell_number).setAttribute("readonly", true);
    delete indexs[cell_number];
}

// initializing the mistake variable

var mistakes = 0;
var max_mistake = 3;

// functions for mistake

function error() {
    if (mistakes > max_mistake) {
        document.getElementById("gameover").style.display = "block";
        css.innerHTML = ".cell{visibility: hidden;}";
        time();
    }
}

function second_chance() {
    css.innerHTML = ".cell{visibility: visible;}";
    max_mistake += 1;
    document.getElementById("gameover").style.display = "none";
    document.getElementById("mistakes").innerHTML = `${mistakes}/${max_mistake}`;
    time();
}

// function for new game

function newgame() {
    ini = false;
    css.innerHTML = ".cell{visibility: visible;}";      // to start with shown cell values
    document.getElementById("gameover").style.display = "none";
    hints = 0;
    max_hint = 3;
    document.getElementById("hints").innerHTML = `${hints}/${max_hint}`;
    mistakes = 0;
    max_mistake = 3;
    document.getElementById("mistakes").innerHTML = `${mistakes}/${max_mistake}`;
    clearInterval(k);
    second = 0;
    minute = 0;
    ranarray();
    create();
    solve(0, 0, 0.5);
    document.getElementById("time_icon").alt = "pause";
    document.getElementById("time_icon").src = "pause.svg";
    document.getElementById("time_show").innerHTML = "";
    time();
}

// function for correctness

function correct(id){
    let temp = document.getElementById(id).value;
    if (temp != "") {
        if (sud[Number(id[0]) - 1][Number(id[1]) - 1] == temp) {
            document.getElementById(id).style.color = "green";
            document.getElementById(id).setAttribute("readonly", true);
            delete indexs[id];
        }
        else {
            mistakes += 1;
            error();
            document.getElementById("mistakes").innerHTML = `${mistakes}/${max_mistake}`;
            document.getElementById(id).style.color = "red";
        }
    }
}

// defining input functions 

function single_input(id){
    id = id.toString();
    const cell = document.getElementById(id);
    const digit = cell.value;
    var bool = 0;
    for (let i of digit) {
        code = i.charCodeAt(0);
        if (code > 48 && code < 58) {
            cell.value = i;
            bool = 1;
        }
    }
    if (bool == 0) {
        cell.value = "";
    }
    correct(id);
}

// for getting the id of cell 

function element(id) {
    cell_number = id.toString();
}

// for printing the grid 

function printgrid() {
    if(ini){
        return true;
    }
    for (i in indexs) {
        document.getElementById(i).value = indexs[i];
        document.getElementById(i).style.color = "blue";
    }
    document.body.style.visibility = "hidden";
    document.body.children[1].children[0].style.visibility = "visible";
    window.print();
    for (i in indexs) {
        document.getElementById(i).value = "";
        document.getElementById(i).style.color = "";
    }
    document.body.style.visibility = "visible";
}

// initializing variable for notes
var note;
var selected = 0;

// function for notes 

function notes(){
    if(cell_number in indexs && selected != 0){
        document.getElementById(cell_number).style.display = "none";
        document.getElementById(cell_number+selected.toString()).style.display = "block";
    }
}

function numpad(x){
    selected = x;
}

// function for clearing the notes

function clear_notes(){
    document.getElementById(cell_number).style.display = "block";
    for(let i = 0; i < 9; i++){
        document.getElementById(cell_number+(i+1).toString()).style.display = "none";
    }
}

// reset game 

function reset(){
    for (const i in indexs) {
        document.getElementById(i).value = "";
        document.getElementById(i).removeAttribute("style");
        document.getElementById("hints").innerHTML = `${hints}/${max_hint}`;
        document.getElementById("mistakes").innerHTML = `${mistakes}/${max_mistake}`;
        second = 0;
        minute = 0;
        mistakes = 0;
        hints = 0;
        max_mistake = 3;
        max_hint = 3;
    }
}