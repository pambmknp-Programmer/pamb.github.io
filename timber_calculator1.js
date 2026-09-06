let currentInput="0",previousInput="",operator=null,shouldResetDisplay=false;
const display=document.getElementById("display");

document.querySelectorAll(".tab-btn").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
 document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active"));
 btn.classList.add("active"); document.getElementById(btn.dataset.tab).classList.add("active");
}));

function updateDisplay(){display.value=currentInput}
function fmt(n){return Number.isFinite(n)?String(Number(n.toPrecision(12))):"Error"}
function appendNumber(n){if(currentInput==="0"||shouldResetDisplay||currentInput==="Error"){currentInput=n;shouldResetDisplay=false}else currentInput+=n;updateDisplay()}
function appendDecimal(){if(shouldResetDisplay||currentInput==="Error"){currentInput="0";shouldResetDisplay=false}if(!currentInput.includes("."))currentInput+=".";updateDisplay()}
function chooseOperator(op){if(currentInput==="Error")return;if(operator!==null&&!shouldResetDisplay)calculate();previousInput=currentInput;operator=op;shouldResetDisplay=true}
function calculate(){if(operator===null||previousInput==="")return;let a=parseFloat(previousInput),b=parseFloat(currentInput),r;
if(operator==="+")r=a+b;if(operator==="-")r=a-b;if(operator==="*")r=a*b;
if(operator==="/"){if(b===0){currentInput="Error";operator=null;previousInput="";updateDisplay();return}r=a/b}
currentInput=fmt(r);operator=null;previousInput="";shouldResetDisplay=true;updateDisplay()}
function clearDisplay(){currentInput="0";previousInput="";operator=null;shouldResetDisplay=false;updateDisplay()}
function deleteLast(){currentInput=currentInput.length===1||currentInput==="Error"?"0":currentInput.slice(0,-1);updateDisplay()}
function percentage(){let n=parseFloat(currentInput);if(!isNaN(n)){currentInput=fmt(n/100);updateDisplay()}}
function toggleSign(){let n=parseFloat(currentInput);if(!isNaN(n)){currentInput=fmt(-n);updateDisplay()}}
function useConstant(c){currentInput=fmt(c==="pi"?Math.PI:Math.E);shouldResetDisplay=false;updateDisplay()}
function scientific(t){let n=parseFloat(currentInput),r;if(isNaN(n))return;
if(t==="sin")r=Math.sin(n*Math.PI/180);if(t==="cos")r=Math.cos(n*Math.PI/180);if(t==="tan")r=Math.tan(n*Math.PI/180);
if(t==="sqrt"){if(n<0){currentInput="Error";updateDisplay();return}r=Math.sqrt(n)}if(t==="square")r=n**2;if(t==="cube")r=n**3;
if(t==="log"){if(n<=0){currentInput="Error";updateDisplay();return}r=Math.log10(n)}if(t==="ln"){if(n<=0){currentInput="Error";updateDisplay();return}r=Math.log(n)}
currentInput=fmt(r);shouldResetDisplay=true;updateDisplay()}

function num(id){
    let n=parseFloat(document.getElementById(id).value);if(!Number.isFinite(n)||n<0){alert("Please enter valid numbers (0 or greater).");return null}return n}
function calculateBoardFeet(){let t=num("bfThickness"),w=num("bfWidth"),l=num("bfLength");if([t,w,l].some(x=>x===null))return;let bf=t*w*l/12;document.getElementById("bfResult").innerHTML=`Result: <strong>${fmt(bf)} board feet</strong>`}
function calculateStanding(){
    const d = num("stDbh");
    const h = num("stHeight");
    const region = document.getElementById("stRegion").value;
    const species = document.getElementById("stSpecies").value;

    if (d === null || h === null) return;

    if (!region || !species) {
        alert("Please select both Region and Species Group.");
        return;
    }

    // FMB Technical Bulletin No. 3 regional volume equations.
    // D = DBH/DAB in centimeters; H = merchantable height in meters.
    const coefficients = {
        northern: {
            dipterocarp: 0.00005203,
            nonDipterocarp: 0.00005109
        },
        southern: {
            dipterocarp: 0.00005171,
            nonDipterocarp: 0.00005204
        },
        westernVisayas: {
            dipterocarp: 0.00004649,
            nonDipterocarp: 0.00004874
        },
        easternVisayas: {
            dipterocarp: 0.00005231,
            nonDipterocarp: 0.00005109
        },
        easternMindanao: {
            dipterocarp: 0.00005087,
            nonDipterocarp: 0.00004961
        },
        centralMindanao: {
            dipterocarp: 0.00005019,
            nonDipterocarp: 0.00005039
        },
        westernMindanao: {
            dipterocarp: 0.00004668,
            nonDipterocarp: 0.00004840
        }
    };

    const coefficient = coefficients[region]?.[species];

    if (!coefficient) {
        alert("No applicable FMB Technical Bulletin No. 3 equation was found.");
        return;
    }

    const v = coefficient * (d ** 2) * h;

    // Basal area in square meters; D is entered in centimeters.
    const ba = Math.PI * (d / 200) ** 2;

    document.getElementById("stResult").innerHTML =
        `Result: <strong>${fmt(v)} m³</strong><br>` +
        `Basal area: ${fmt(ba)} m²<br>` +
        `Coefficient: ${coefficient}`;
}
function calculateFelled(){let d1=num("rfD1"),d2=num("rfD2"),l=num("rfLength");if([d1,d2,l].some(x=>x===null))return;let v=Math.PI/8*(d1**2+d2**2)*l;document.getElementById("rfResult").innerHTML=`Result: <strong>${fmt(v)} m³</strong>`}
function clearTimberForm(p){
    let ids = p==="bf"
        ? ["bfThickness","bfWidth","bfLength"]
        : p==="st"
            ? ["stDbh","stHeight"]
            : ["rfD1","rfD2","rfLength"];

    ids.forEach(id => document.getElementById(id).value = "");

    if (p === "st") {
        document.getElementById("stRegion").value = "";
        document.getElementById("stSpecies").value = "";
    }

    document.getElementById(
        p==="bf" ? "bfResult" : p==="st" ? "stResult" : "rfResult"
    ).textContent = "Result: —";
}
// ============================================
// KEYBOARD SUPPORT
// ============================================
document.addEventListener("keydown", function(event) {

    // Numbers 0-9
    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
        return;
    }

    // Decimal
    if (event.key === ".") {
        appendDecimal();
        return;
    }

    // Operators
    if (event.key === "+") {
        chooseOperator("+");
        return;
    }

    if (event.key === "-") {
        chooseOperator("-");
        return;
    }

    if (event.key === "*") {
        chooseOperator("*");
        return;
    }

    if (event.key === "/") {
        event.preventDefault(); // Prevent browser quick-find behavior
        chooseOperator("/");
        return;
    }

    // Enter or =
    if (event.key === "Enter" || event.key === "=") {
        calculate();
        return;
    }

    // Escape = Clear
    if (event.key === "Escape") {
        clearDisplay();
        return;
    }

    // Backspace = Delete
    if (event.key === "Backspace") {
        deleteLast();
        return;
    }

    // Percentage
    if (event.key === "%") {
        percentage();
        return;
    }
});