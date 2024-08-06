document.addEventListener('DOMContentLoaded', function() {
    const screen = document.getElementById('screen');
    const buttons = document.querySelectorAll('button');
    const historyList = document.getElementById('history-list');
    const clearHistoryButton = document.querySelector('.clear-history');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    let firstOperand = '';
    let secondOperand = '';
    let operator = null;
    let result = null;
    let memory = 0;
    let history = [];

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleButtonClick(button.textContent, button.dataset.key);
        });
    });

    clearHistoryButton.addEventListener('click', () => {
        history = [];
        updateHistory();
    });

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const button = Array.from(buttons).find(button => button.dataset.key === key);
        if (button) {
            handleButtonClick(button.textContent, key);
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        }
    });

    function handleButtonClick(value, key) {
        if ('0123456789.'.includes(key)) {
            handleDigit(value);
        } else if ('+-*/^'.includes(key)) {
            handleOperator(value);
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Escape') {
            clear();
        } else if (['MC', 'MR', 'MS'].includes(value)) {
            handleMemory(value);
        } else if (['√', 'sin', 'cos', 'tan'].includes(value)) {
            handleFunction(value);
        }
        updateScreen();
    }

    function handleDigit(digit) {
        if (operator === null) {
            firstOperand += digit;
        } else {
            secondOperand += digit;
        }
    }

    function handleOperator(op) {
        if (operator !== null) {
            calculate();
        }
        operator = op;
    }

    function calculate() {
        if (operator === null || !secondOperand) return;
        switch (operator) {
            case '+':
                result = parseFloat(firstOperand) + parseFloat(secondOperand);
                break;
            case '-':
                result = parseFloat(firstOperand) - parseFloat(secondOperand);
                break;
            case '*':
                result = parseFloat(firstOperand) * parseFloat(secondOperand);
                break;
            case '/':
                result = parseFloat(firstOperand) / parseFloat(secondOperand);
                break;
            case '^':
                result = Math.pow(parseFloat(firstOperand), parseFloat(secondOperand));
                break;
        }

        addHistory(`${firstOperand} ${operator} ${secondOperand} = ${result}`);
        firstOperand = result.toString();
        secondOperand = '';
        operator = null;
        result = null;
    }

    function handleFunction(func) {
        if (!firstOperand) return;
        switch (func) {
            case '√':
                result = Math.sqrt(parseFloat(firstOperand));
                break;
            case 'sin':
                result = Math.sin(parseFloat(firstOperand));
                break;
            case 'cos':
                result = Math.cos(parseFloat(firstOperand));
                break;
            case 'tan':
                result = Math.tan(parseFloat(firstOperand));
                break;
        }
        addHistory(`${func}(${firstOperand}) = ${result}`);
        firstOperand = result.toString();
        secondOperand = '';
        operator = null;
        result = null;
    }

    function handleMemory(mem) {
        switch (mem) {
            case 'MC':
                memory = 0;
                break;
            case 'MR':
                firstOperand = memory.toString();
                break;
            case 'MS':
                memory = parseFloat(screen.textContent);
                break;
        }
    }

    function clear() {
        firstOperand = '';
        secondOperand = '';
        operator = null;
        result = null;
        screen.textContent = '';
    }

    function updateScreen() {
        screen.textContent = secondOperand || firstOperand || '';
    }

    function addHistory(entry) {
        history.push(entry);
        updateHistory();
    }

    function updateHistory() {
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
    }
});
