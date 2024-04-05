const n = 40;
const array = [];
let audioCtx = null;
let sortingTimeout = null;
let currentSwaps = [];

init();

function init() {
    clearSorting();
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function startSorting() {
    init();
    const algorithm = document.getElementById("algorithm-select").value;
    currentSwaps = getSwaps(algorithm, [...array]);
    animate();
}

function clearSorting() {
    currentSwaps = [];
}

function animate() {
    if (currentSwaps.length === 0) {
        showBars();
        return;
    }
    const [i, j] = currentSwaps.shift();
    [array[i], array[j]] = [array[j], array[i]];
    showBars();
    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);
    sortingTimeout = setTimeout(animate, 30);
    document.querySelectorAll('.bar')[j].classList.add('moving');
}

function showBars() {
    const container = document.getElementById("container");
    container.innerHTML = "";
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.style.height = value * 100 + "%";
        bar.classList.add("bar");
        container.appendChild(bar);
    });
}

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function getSwaps(algorithm, arr) {
    switch (algorithm) {
        case "bubble": return bubbleSort([...arr]);
        case "quick": return quickSort([...arr]);
        case "insertion": return insertionSort([...arr]);
        case "selection": return selectionSort([...arr]);
        default: console.error("Invalid algorithm selected"); return [];
    }
}

// Sorting algorithms
function bubbleSort(arr) {
    const swaps = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swaps.push([j, j + 1]);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return swaps;
}

function quickSort(arr) {
    const swaps = [];
    function partition(low, high) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swaps.push([i, j]);
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        swaps.push([i + 1, high]);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }
    function quickSortRecursive(low, high) {
        if (low < high) {
            const partitionIndex = partition(low, high);
            quickSortRecursive(low, partitionIndex - 1);
            quickSortRecursive(partitionIndex + 1, high);
        }
    }
    quickSortRecursive(0, arr.length - 1);
    return swaps;
}

function insertionSort(arr) {
    const swaps = [];
    for (let i = 1; i < arr.length; i++) {
        let currentIndex = i;
        while (currentIndex > 0 && arr[currentIndex - 1] > arr[currentIndex]) {
            swaps.push([currentIndex - 1, currentIndex]);
            [arr[currentIndex - 1], arr[currentIndex]] = [arr[currentIndex], arr[currentIndex - 1]];
            currentIndex--;
        }
    }
    return swaps;
}

function selectionSort(arr) {
    const swaps = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swaps.push([i, minIndex]);
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return swaps;
}
