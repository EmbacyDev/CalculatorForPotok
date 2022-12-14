// import '../src/style.css'
import '../src/scss/main.scss'

import {Chart, registerables} from 'chart.js';

const totalBtn = document.getElementById('total')
const clearBtn = document.getElementById('clear')

const first_payment_input = document.getElementById('first_payment')
const first_payment_range = document.getElementById('first_payment_range')

const monthly_payment_input = document.getElementById('monthly_payment')
const monthly_payment_range = document.getElementById('monthly_payment_range')

const interest_rate_input = document.getElementById('interest_rate')

const time_input = document.getElementById('time')
const time_range = document.getElementById('time_range')

// const table = document.getElementById('table')

const inputArr = [first_payment_input, first_payment_range, monthly_payment_input, monthly_payment_range, time_input, time_range]

const total_sum = document.getElementById('total_sum')
const total_payment = document.getElementById('total_payment')
const total_percent = document.getElementById('total_percent')

Chart.register(...registerables);
const ctx = document.getElementById("myChart");

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: ["начальная сумма"],
                data: [],
                backgroundColor: "#10273D",
                // borderColor: "#10273D",
            },
            {
                label: ["пополнения"],
                data: [],
                backgroundColor: "#0D6579",
                // borderColor: "#0D6579",
            },
            {
                label: ["начисленные %"],
                data: [],
                backgroundColor: "#04CCD9",
                // borderColor: "#04CCD9",
            }
        ]
    },
    options: {
        responsive: true,
        interaction: {
            mode: 'point'
        },
        plugins: {

            tooltip: {
                backgroundColor: "#FFFFFF",
                titleColor: "#000000",
                callbacks: {
                    labelTextColor: function(context) {
                        return '#000000';
                    },
                    label: function(context) {
                        let label = context.dataset.label[0] || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += convertToRub(context.parsed.y.toFixed());
                        }
                        return label;
                    },
                    title: function(tooltipItem, data) {
                        return tooltipItem[0].label + ' мес.';
                    }
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                useBorderRadius: true,
                borderRadius: 10,
                labels: {
                    color: 'rgba(16, 39, 61, 0.5)'
                }
            }
        },
        transitions: {
            show: {
                animations: {
                    tension: {
                        duration: 800,
                        easing: 'linear',
                        from: 0,
                        to: 1,
                        loop: true
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                display:false
            },
            y: {
                stacked: true,
                ticks: {
                    callback: function(value) {
                        return convertToRub(value.toFixed());
                    }
                }
            }
        }
    }
});

first_payment_input.value = 1000000
monthly_payment_input.value = 50000
time_input.value = 60

const period = 12

let profit
let totalArr = []
let profitArr = []
let sumProfitArr = []
let monthlyPaymentArr = []
let labelsArr = []
let firstPaymentArr = []

function getProfit(f, m, i, p) {
    profit = Number(((f + m) * i) / p)
}

function clearResult(chart) {
    if (totalArr.length > 0) {
        totalArr = []
        profitArr = []
        sumProfitArr = []
        monthlyPaymentArr = []
        addTotals([0, 0], [0, 0], [0, 0])
        for (let i = 0; i < 3; i++) {
            myChart.data.datasets[i].data = []
            myChart.data.labels = []
        }
        chart.update();
        // table.innerHTML = ``
    }
}

function addTotals(t_sum, t_payment, t_percent) {
    let sum = t_payment.pop() + t_sum[0]
    total_sum.innerText = `${convertToRub(t_sum.pop())}`
    total_payment.innerText = `${convertToRub(sum)}`
    total_percent.innerText = `${convertToRub(t_percent.pop())}`
}

function addDataChart(labels, data1, data2, data3) {
    myChart.data.datasets[0].data.push(data1)
    myChart.data.datasets[1].data.push(data2)
    myChart.data.datasets[2].data.push(data3)
    myChart.data.labels.push(`${labels}`)

    if(myChart.data.labels.length >= Number(time_input.value)) {
        myChart.update();
    }

}

function convertToRub(n) {
    return new Intl.NumberFormat(
        'ru-RU',
        {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }
    ).format(n)
}

function addData(data, mp, pr, fp) {

    let sum = 0
    for (let i = 0; i < data.length - 1; i++) {
        let percent = pr[i]
        let totals = data[i] + mp + pr[i]
        let sumMP = sum += mp
        monthlyPaymentArr.push(sumMP)
        if (i < data.length - 2) {
            let sumPercent = sumProfitArr[i] + profitArr[i + 1]
            sumProfitArr.push(sumPercent)
        }
        firstPaymentArr.push(fp)

        labelsArr.push(i + 1)
        addDataChart(i + 1, fp, sumMP, sumProfitArr[i])


        // table.innerHTML +=
        //     `<tr>
        //         <td>${i + 1}</td>
        //         <td>${convertToRub(data[i].toFixed(2))}</td>
        //         <td>${convertToRub(mp.toFixed(2))}</td>
        //         <td>${convertToRub(sumMP.toFixed(2))}</td>
        //         <td>${convertToRub(percent.toFixed(2))}</td>
        //         <td>${convertToRub(sumProfitArr[i].toFixed(2))}</td>
        //         <td>${convertToRub(totals.toFixed(2))}</td>
        //     </tr>`
    }
    // console.log(totalArr)
    // console.log(profitArr)
    // console.log(sumProfitArr)
    // console.log(monthlyPaymentArr)
}

function validator(num, min, max) {
    let re = /^[0-9\s]*$/;
    return re.test(num) && num >= min && num <= max;
}

function getTotal() {
    clearResult(myChart)
    let first_payment = Number(first_payment_input.value)
    let monthly_payment = Number(monthly_payment_input.value)
    let interest_rate = Number(interest_rate_input.value)
    let time = Number(time_input.value)
    let inputsArr = [first_payment_input, monthly_payment_input, time_input]
    let validatorArr = [
        validator(first_payment, 1000, 10000000),
        validator(monthly_payment, 0, 1000000),
        validator(time, 1, 120)
    ]

    const even = (element) => element;

    if (validatorArr.every(even)) {
        // console.log(validatorArr.every(even))
        inputsArr.forEach(el => {
            el.classList.remove('error')
            totalBtn.disabled = false
        })
        totalArr.push(first_payment)

        let deposit = first_payment + monthly_payment

        getProfit(first_payment, monthly_payment, interest_rate, period)

        profitArr.push(profit)
        sumProfitArr.push(profit)
        totalArr.push(deposit + profit)

        for (let i = 1; i < time; i++) {
            let new_first_payment = totalArr[i]
            getProfit(new_first_payment, monthly_payment, interest_rate, period)
            let total = new_first_payment + monthly_payment + profit
            profitArr.push(profit)
            totalArr.push(total)
        }

        addData(totalArr, monthly_payment, profitArr, first_payment)
        addTotals(totalArr, monthlyPaymentArr, sumProfitArr)
    } else {
        validatorArr.forEach((el, i) => {
            if (!el) {
                inputsArr[i].classList.add('error')
                totalBtn.disabled = true
            }
        })
    }
}

function rangeLine() {
    for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
        e.style.setProperty('--value', e.value);
        e.style.setProperty('--min', e.min === '' ? '0' : e.min);
        e.style.setProperty('--max', e.max === '' ? '100' : e.max);
        e.style.setProperty('--value', e.value)
        e.addEventListener('input', () => e.style.setProperty('--value', e.value));
        e.addEventListener('change', () => e.style.setProperty('--value', e.value));
    }
}

const inputValue = function (event) {
    rangeLine()
    if (event.target.type === "range") {
        let firstLetter = event.target.id.slice(0, 1)
        let numbInput = document.querySelectorAll('input[type=number]')
        numbInput.forEach(inputId => {
            if (firstLetter === inputId.id.slice(0, 1)) {
                inputId.value = event.target.value
                inputId.classList.remove('error')
                totalBtn.disabled = false
            }
        })
    } else if (event.target.type === "number") {
        let firstLetter = event.target.id.slice(0, 1)
        let numbInput = document.querySelectorAll('input[type=range]')
        numbInput.forEach(inputId => {
            if (firstLetter === inputId.id.slice(0, 1)) {
                if (event.target.value === '' ||
                    Number(event.target.value) < Number(event.target.min) ||
                    Number(event.target.value) > Number(event.target.max) || event.target.value === 0) {
                    event.target.classList.add('error')
                    totalBtn.disabled = true
                    inputId.value = 0
                    inputId.style.setProperty('--value', 0);
                } else {
                    event.target.classList.remove('error')
                    totalBtn.disabled = false
                    inputId.value = event.target.value
                    inputId.style.setProperty('--value', event.target.value);
                }
            }
        })

    }
};

const eventListener = function () {
    inputArr.forEach(input => {
        input.addEventListener('input', inputValue, false);
        input.addEventListener('change', inputValue, false);
        input.addEventListener('focus', inputValue, false);
        input.addEventListener('paste', inputValue, false);
    })
}

eventListener()
totalBtn.onclick = function () {
    getTotal()
};
clearBtn.onclick = function () {
    clearResult(myChart)
};
rangeLine()
document.addEventListener("DOMContentLoaded", getTotal);
