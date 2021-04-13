function drawOverlays(
    ctx1,
    ctx2,
    numPx,
    al_max,
    disp_size_mrad,
    obj_ap_r,
    rmax
) {
    let scalar = 256;
    ctx1.font = (numPx / scalar) * 14 + "px Arial";
    ctx1.fillStyle = "white";
    ctx1.fillText(
        math.round((disp_size_mrad / 0.07) * 30) + " mrad",
        numPx - (70 / scalar) * numPx,
        numPx - (10 / scalar) * numPx
    );

    ctx1.beginPath();
    ctx1.moveTo(numPx - (70 / scalar) * numPx, numPx - (30 / scalar) * numPx);
    ctx1.lineTo(numPx - (15 / scalar) * numPx, numPx - (30 / scalar) * numPx);
    ctx1.strokeStyle = "white";
    ctx1.lineWidth = (5 * numPx) / scalar;
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.arc(
        numPx / 2,
        numPx / 2,
        ((rmax * numPx) / (2 * al_max)) * mrad,
        0,
        2 * PI
    );
    ctx1.strokeStyle = "blue";
    ctx1.lineWidth = (1 * numPx) / scalar;
    ctx1.stroke();

    /// right panel
    ctx2.beginPath();
    ctx2.arc(
        numPx / 2,
        numPx / 2,
        ((rmax * numPx) / (2 * al_max)) * mrad,
        0,
        2 * PI
    );
    ctx2.strokeStyle = "blue";
    ctx2.lineWidth = 2;
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.arc(
        numPx / 2,
        numPx / 2,
        (obj_ap_r * numPx) / (2 * al_max),
        0,
        2 * PI
    );
    ctx2.strokeStyle = "red";
    ctx2.lineWidth = 2;
    ctx2.stroke();
}

function drawGrayscaleBitmap2(ctx, input, numPx) {
    var imData = ctx.getImageData(0, 0, numPx, numPx);
    var data = imData.data;

    let red;
    for (let i = 0; i < numPx; i++) {
        for (let j = 0; j < numPx; j++) {
            red = i * (numPx * 4) + j * 4;

            data[red] = input[i][j];
            data[red + 1] = input[i][j];
            data[red + 2] = input[i][j];
            data[red + 3] = 255;
        }
    }
    ctx.putImageData(imData, 0, 0);
}

function getAberrations() {
    let ab_mags = [];
    let ab_angles = [];
    let abers = [];
    let numAbers = aberrations.length;
    for (let it = 0; it < numAbers; it++) {
        let aberration = aberrations[it];
        let mag_val = Number(aberration.mag_el.value) * aberration.mag_unit;
        let arg_val =
            (aberration.arg_el ? Number(aberration.arg_el.value) : 0) * deg;
        ab_mags.push(mag_val);
        ab_angles.push(arg_val);
    }
    abers.push(ab_mags);
    abers.push(ab_angles);
    abers.push(numAbers);
    return abers;
}

function randButton() {
    //document.getElementById('loading').innerHTML = "Calculating..."
    setTimeout(function () {
        randomize();
    }, 0);
}

function getObjAperture() {
    let obj_ap_r = Number(document.getElementById("aperture").value) * mrad;

    if (obj_ap_r < 0) {
        obj_ap_r = 0;
        document.getElementById("aperture").value = 0;
    }
    return obj_ap_r;
}


function drawEverything(
    out_ronch,
    out_phase_map,
    numPx,
    al_max,
    disp_size_mrad,
    obj_ap_r,
    rmax,
    draw_overlay
) {
    // drawing part
    canvas1.width = numPx;
    canvas1.height = numPx;
    canvas2.width = numPx;
    canvas2.height = numPx;
    drawGrayscaleBitmap2(ctx1, out_ronch, numPx);
    drawGrayscaleBitmap2(ctx2, out_phase_map, numPx);
    if (draw_overlay) {
        drawOverlays(ctx1, ctx2, numPx, al_max, disp_size_mrad, obj_ap_r, rmax);
    }

    document.getElementById("alpha_max").value = math.round(rmax, 2);
}

function calculateWASM(Module) {
    ////////
    //reading in constants from ui:
    ////////
    let numPx = 256;
    let disp_size_mrad = 0.100;
    let al_max = disp_size_mrad;
    let obj_ap_r = getObjAperture();
    let keV = 300;
    let scalefactor = 8;
    let draw_overlay = document.getElementById("draw_overlay").checked; //figure out how to read from checkbox

    // getting aberrations into tidy arrays of magnitude, angle. degree, order  are assumed based on order in C++ section, units are baked in!
    let abers = getAberrations();
    let ab_mags = abers[0];
    let ab_angles = abers[1];
    globalTest = 250;
    let params = [numPx, al_max, obj_ap_r, scalefactor, keV];
    const arrayDataToPass = params.concat(ab_mags, ab_angles);
    let buffer;
    let error;
    let result;
    try {
        const typedArray = new Float32Array(arrayDataToPass.length);
        for (let i = 0; i < arrayDataToPass.length; i++) {
            typedArray[i] = arrayDataToPass[i];
        }
        buffer = Module._malloc(
            typedArray.length * typedArray.BYTES_PER_ELEMENT
        );
        Module.HEAPF32.set(typedArray, buffer >> 2);
        result = Module.ccall(
            "calcRonch",
            null,
            ["number", "number"],
            [buffer, arrayDataToPass.length]
        );
    } catch (e) {
        error = e;
    } finally {
        // To avoid memory leaks we need to always clear out the allocated heap data
        // This needs to happen in the finally block, otherwise thrown errors will stop code execution before this happens
        Module._free(buffer);
    }
    if (error) throw error;

    let arrayData1 = [];
    let arrayData2 = [];
    let out_ronch = [];
    let out_phase_map = [];
    let im2Offset = numPx * numPx;
    for (let j = 0; j < numPx; j++) {
        for (let i = 0; i < numPx; i++) {
            arrayData1.push(
                Module.HEAPF32[
                    result / Float32Array.BYTES_PER_ELEMENT + i + numPx * j
                ]
            );
            arrayData2.push(
                Module.HEAPF32[
                    result / Float32Array.BYTES_PER_ELEMENT +
                        i +
                        numPx * j +
                        im2Offset
                ]
            );
        }
        out_ronch.push(arrayData1);
        out_phase_map.push(arrayData2);
        arrayData1 = [];
        arrayData2 = [];
    }
    let rmax =
        Module.HEAPF32[
            result / Float32Array.BYTES_PER_ELEMENT + 2 * (numPx * numPx)
        ];

    drawEverything(
        out_ronch,
        out_phase_map,
        numPx,
        al_max,
        disp_size_mrad,
        obj_ap_r,
        rmax,
        draw_overlay
    );
}

function calculate() {
    let t0 = performance.now();

    let curInstance = ronchModule().then(function (Module) {
        calculateWASM(Module);
        Module.delete;
    });
    console.log("T = " + (performance.now() - t0) + " ms");
}

function initialize() {
    calculate();
}

function randomize() {
    for (let it = 0; it < aberrations.length; it++) {
        let aberration = aberrations[it];
        aberration.mag_el.value = Math.round(Math.random() * 100);
        if (aberration.arg_el) {
            aberration.arg_el.value = Math.round(Math.random() * 180);
        }
    }
    calculate();
}

function allZero() {
    for (let it = 0; it < aberrations.length; it++) {
        let aberration = aberrations[it];
        aberration.mag_el.value = 0;
        if (aberration.arg_el) {
            aberration.arg_el.value = 0;
        }
    }
}

function changeStepSize(C,UPDN) {
    console.log(C)
    if (C=='c10') {
        if (UPDN) {
            steps.C10 = steps.C10*5;
        } else {
            steps.C10 = steps.C10/5;
        }
    }
    if (C=='c21') {
        if (UPDN) {
            steps.C21 = steps.C21*5;
        } else {
            steps.C21 = steps.C21/5;
        }
    }
    if (C=='c12') {
        if (UPDN) {
            steps.C12 = steps.C12*5;
        } else {
            steps.C12 = steps.C12/5;
        }
    }
}


function setC(c_in) {
    for (let it = 0; it < aberrations.length; it++) {
        if (c_in == "" + aberrations[it].m + aberrations[it].n) {
            aberrations[it].mag_el.value =
                Number(aberrations[it].mag_el.value) + 50;
        }
    }
}

var pm = math.pow(10, -12);
var ang = math.pow(10, -10);
var nm = math.pow(10, -9);
var um = math.pow(10, -6);
var mm = math.pow(10, -3);
var mrad = math.pow(10, -3);
var PI = math.pi;
var deg = PI / 180;
var correction_factor = 1;

var canvas1 = document.getElementById("canvas1");
var ctx1 = canvas1.getContext("2d");
var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");

var steps = {}
steps.C10 = 10
steps.C12 = 1
steps.C21 = 100

var forceJS = document.getElementById("forceJS"); //figure out how to read from checkbox
var aberration_list = [
    "C10",
    "C12",
    "C21",
    "C23",
    "C30",
    "C32",
    "C34",
    "C41",
    "C43",
    "C45",
    "C50",
    "C52",
    "C54",
    "C56",
];
var aberrations = [];

for (var it = 0; it < aberration_list.length; it++) {
    var ab_name = aberration_list[it];
    var ab_obj = {};
    ab_obj.m = Number(ab_name[1]);
    ab_obj.n = Number(ab_name[2]);
    ab_obj.mag_el = document.getElementById(ab_name);
    if (ab_obj.m == 1 && ab_obj.n == 0) {
        ab_obj.mag_unit = ang;
    } else if (ab_obj.m < 4) {
        ab_obj.mag_unit = nm;
    } else if (ab_obj.m < 5) {
        ab_obj.mag_unit = um;
    } else {
        ab_obj.mag_unit = mm;
    }
    if (ab_obj.n != 0) {
        ab_obj.arg_el = document.getElementById("P" + ab_obj.m + ab_obj.n);
    }
    ab_obj.mag_unit = ab_obj.mag_unit * correction_factor;
    aberrations.push(ab_obj);
}

window.addEventListener(
    "keydown",
    function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "ArrowDown":
                aberrations[0].mag_el.value =
                    Number(aberrations[0].mag_el.value) - steps.C10;
                calculate();
                break;
            case "ArrowUp":
                aberrations[0].mag_el.value =
                    Number(aberrations[0].mag_el.value) + steps.C10;
                calculate();
                break;
            case "w":
                sx =
                    Number(aberrations[1].mag_el.value) *
                    math.cos(Number(aberrations[1].arg_el.value) * deg);
                sy =
                    Number(aberrations[1].mag_el.value) *
                    math.sin(Number(aberrations[1].arg_el.value) * deg);

                sy += steps.C12;
                aberrations[1].mag_el.value = math.sqrt(sx * sx + sy * sy);
                aberrations[1].arg_el.value = math.atan2(sy, sx) / deg;
                calculate();
                break;
            case "s":
                sx =
                    Number(aberrations[1].mag_el.value) *
                    math.cos(Number(aberrations[1].arg_el.value) * deg);
                sy =
                    Number(aberrations[1].mag_el.value) *
                    math.sin(Number(aberrations[1].arg_el.value) * deg);

                sy -= steps.C12;
                aberrations[1].mag_el.value = math.sqrt(sx * sx + sy * sy);
                aberrations[1].arg_el.value = math.atan2(sy, sx) / deg;
                calculate();
                break;
            case "a":
                sx =
                    Number(aberrations[1].mag_el.value) *
                    math.cos(Number(aberrations[1].arg_el.value) * deg);
                sy =
                    Number(aberrations[1].mag_el.value) *
                    math.sin(Number(aberrations[1].arg_el.value) * deg);

                sx -= steps.C12;
                aberrations[1].mag_el.value = math.sqrt(sx * sx + sy * sy);
                aberrations[1].arg_el.value = math.atan2(sy, sx) / deg;
                calculate();
                break;
            case "d":
                sx =
                    Number(aberrations[1].mag_el.value) *
                    math.cos(Number(aberrations[1].arg_el.value) * deg);
                sy =
                    Number(aberrations[1].mag_el.value) *
                    math.sin(Number(aberrations[1].arg_el.value) * deg);

                sx += steps.C12;
                aberrations[1].mag_el.value = math.sqrt(sx * sx + sy * sy);
                aberrations[1].arg_el.value = math.atan2(sy, sx) / deg;
                calculate();
                break;
            case "i":
                cx =
                    Number(aberrations[2].mag_el.value) *
                    math.cos(Number(aberrations[2].arg_el.value) * deg);
                cy =
                    Number(aberrations[2].mag_el.value) *
                    math.sin(Number(aberrations[2].arg_el.value) * deg);

                cy += steps.C21;
                aberrations[2].mag_el.value = math.sqrt(cx * cx + cy * cy);
                aberrations[2].arg_el.value = math.atan2(cy, cx) / deg;
                calculate();
                break;
            case "k":
                cx =
                    Number(aberrations[2].mag_el.value) *
                    math.cos(Number(aberrations[2].arg_el.value) * deg);
                cy =
                    Number(aberrations[2].mag_el.value) *
                    math.sin(Number(aberrations[2].arg_el.value) * deg);

                cy -= steps.C21;
                aberrations[2].mag_el.value = math.sqrt(cx * cx + cy * cy);
                aberrations[2].arg_el.value = math.atan2(cy, cx) / deg;
                calculate();
                break;
            case "j":
                cx =
                    Number(aberrations[2].mag_el.value) *
                    math.cos(Number(aberrations[2].arg_el.value) * deg);
                cy =
                    Number(aberrations[2].mag_el.value) *
                    math.sin(Number(aberrations[2].arg_el.value) * deg);

                cx += steps.C21;
                aberrations[2].mag_el.value = math.sqrt(cx * cx + cy * cy);
                aberrations[2].arg_el.value = math.atan2(cy, cx) / deg;
                calculate();
                break;
            case "l":
                cx =
                    Number(aberrations[2].mag_el.value) *
                    math.cos(Number(aberrations[2].arg_el.value) * deg);
                cy =
                    Number(aberrations[2].mag_el.value) *
                    math.sin(Number(aberrations[2].arg_el.value) * deg);

                cx -= steps.C21;
                aberrations[2].mag_el.value = math.sqrt(cx * cx + cy * cy);
                aberrations[2].arg_el.value = math.atan2(cy, cx) / deg;
                calculate();
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    },
    true
);

initialize();
