const inputData0 = [
    { value: 3.4, label: 'a' },
    { value: 3, label: 'b' },
    { value: 5, label: 'c' },
    { value: 3.4, label: 'd' },
    { value: -3.4, label: 'p' },
    { value: 6, label: 'q' },
]

const inputData1 = [];
const inputData2 = [
    { value: -3.4, label: 'a' },
    { value: -5.4, label: 'b' },
    { value: -1.4, label: 'c' },
    { value: -6.4, label: 'd' },
];
const inputData3 = null;
const inputData4 = undefined;
function handleData(data) {
    if (data == undefined || data.length === 0) {
        console.error("Invalid input");
        return ;
    }
    return data.map(plot => {
        const newValue = isNaN(parseInt(plot.value)) ? 0 : parseInt(plot.value);
        return {
            value: newValue,
            label: plot.label,
        }
    });
}

function drawGraph(data) {
    const xAxis = '-';
    const pixel = '#';
    const dataLength = data.length;
    const maxValue = Math.max(...data.map(plot => plot.value));
    const minValue = Math.min(...data.map(plot => plot.value)) < 0 ? Math.min(...data.map(plot => plot.value)) : 0;
    let cursor = maxValue;
    let output = '';
    if (maxValue < 0 && minValue < 0) {
        output += xAxis.repeat(data.length) + "\n";
        output = data.reduce((prev, next) => {
            return prev += next.label;
        }, output);
    }
    output += '\n';
    
    while (cursor >= 0) {
        for (let i = 0; i < dataLength; i += 1) {
            if (cursor === 0) {
                output += xAxis;
                continue;
            }
            if (data[i].value >= cursor) {
                output += pixel;
            } else {
                output += ' ';
            }
        }
        output += '\n';
        if (cursor === 0) {
            data.forEach(v => {
                output += v.label;
            })
            output += '\n';
        }
        cursor -= 1;
    }
    while (cursor >= minValue) {
        for (let i = 0; i < dataLength; i += 1) {
            if (data[i].value <= cursor) {
                    output += pixel;
            } else {
                output += ' ';
            }
        }
        output += '\n';
        cursor -= 1;
    }
    return output;
}
function solution(data) {
    const newData = handleData(data);
    if (newData && newData.length) {
        console.log(drawGraph(newData));
    }
    return '';
}

console.log('input0:\n', solution(inputData0));
console.log('input1:\n', solution(inputData1));
console.log('input2:\n', solution(inputData2));
console.log('input3:\n', solution(inputData3));
console.log('input4:\n', solution(inputData4));