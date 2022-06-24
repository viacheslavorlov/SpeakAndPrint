const resultText = document.querySelector('#result-text');
const resultFinal = document.querySelector('#result-final');

// Создаем распознаватель
const recognizer = new webkitSpeechRecognition();

// Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
recognizer.interimResults = false;

// Какой язык будем распознавать?
recognizer.lang = 'ru-Ru';

// Используем колбек для обработки результатов
recognizer.onresult = function (event) {
	const result = event.results[event.resultIndex];
	// console.log('Вы сказали: ' + result[0].transcript);
	if (resultText.value === '') {
		resultText.value = result[0].transcript;
	} else {
		alert('Возможно, у вас есть несохраненное значение в поле голосового ввода!');
	}

};
const addBtn = document.querySelector('#add');

function addToResult(text, addTo) {
	if (text.value !== '') {
		if (addTo.value === '') {
			addTo.value += (text.value + '.');
			text.value = '';
		} else {
			addTo.value += (' ' + text.value + '.');
			text.value = '';
		}
	} else {
		alert('Введите данные с помощью голосового ввода');
	}
}

addBtn.addEventListener('click', () => addToResult(resultText, resultFinal))

function speech() {
	// Начинаем слушать микрофон и распознавать голос
	recognizer.start();
}

// const synth = window.speechSynthesis;
// const utterance = new SpeechSynthesisUtterance('Какого хрена здесь вообще происходит.');

// function talk() {
// 	synth.speak(utterance);
// }
//
// function stop() {
// 	synth.pause();
// }

// Загрузка файла
const downloadBtn = document.querySelector('#download__button'),
	fileName = document.querySelector('#download__input-name'),
	textForPrint = document.querySelector('#result-for-print');

function download(filename, text) {
	if (text.length > 0 && filename.length > 0) {
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	} else {
		alert('You need to enter some text!')
		text.value = '';
	}
}

downloadBtn.addEventListener('click', () => {
	download(fileName.value, textForPrint.textContent);
});

// обработка текста

const upperCaseBtn = document.querySelector('.edit__upper'),
	lowerCaseBtn = document.querySelector('.edit__lower'),
	properCaseBtn = document.querySelector('.edit__proper'),
	sentenceCaseBtn = document.querySelector('.edit__sentence');

function upperCase(text) {
	if (text.length > 0) {
		return text.toUpperCase();
	} else {
		alert('You need to enter some text!')
		text.value = '';
	}
}

function lowerCase(text) {
	if (text.length > 0) {
		return text.toLowerCase();
	} else {
		alert('You need to enter some text!')
		text.value = '';
	}
}

function properCase(text) {
	if (text.length > 0) {
		let newArrText = text.toLowerCase().split(/\s+/g);
		newArrText = newArrText.map(item => {
			let itemArr = item.split('');
			itemArr[0] = itemArr[0].toUpperCase();
			return itemArr.join('');
		});
		return newArrText.join(' ');
	} else {
		alert('You need to enter some text!')
		text.value = '';
	}
}

function sentenceCase(text) {
	if (text.length > 0) {
		let newArrText = text.toLowerCase().split('. ');
		newArrText = newArrText.map(item => {
			let itemArr = item.split('');
			itemArr[0] = itemArr[0].toUpperCase();
			return itemArr.join('');
		});
		return newArrText.join('. ');
	} else {
		alert('You need to enter some text!')
		text.value = '';
	}
}

lowerCaseBtn.addEventListener('click', () => {
	resultFinal.value = lowerCase(resultFinal.value);
});
upperCaseBtn.addEventListener('click', () => {
	resultFinal.value = upperCase(resultFinal.value);
});
properCaseBtn.addEventListener('click', () => {
	resultFinal.value = properCase(resultFinal.value);
});
sentenceCaseBtn.addEventListener('click', () => {
	resultFinal.value = sentenceCase(resultFinal.value);
});

// правила замены для знаков препинания

const addRuleBtn = document.querySelector('.redact__add__rule'),
	ruleDiv = document.querySelector('.redact__wrapper'),
	enableRule = document.querySelector('.redact__text');

addRuleBtn.addEventListener('click', () => {
	const div = document.createElement('div');
	div.classList.add('redact__wrapper__div');      // сдздаем дополнительное правило
	div.innerHTML = `<label> Символ:
                <input type="text" name="" class="redact__symbol">
            </label>
            <label> Заменит:
                <input type="text" name="" class="redact__rule">
            </label>
            <button class="redact__delete__rule">-</button>`
	ruleDiv.appendChild(div);
});

function filterText(text) {
	const rulesArray = [];
	const rulesSymbols = ruleDiv.querySelectorAll('.redact__symbol'),
		rulesRules = ruleDiv.querySelectorAll('.redact__rule');
	rulesRules.forEach((item, i) => {
		rulesArray.push([item.innerHTML || item.value, rulesSymbols[i].innerHTML || rulesSymbols[i].value]);
	});

	let textCopy = text;
	rulesArray.forEach(item => {
		if (item[1] === '"') {
			let counter = 0;
			while (counter === 0) {
				let reg = new RegExp(`${item[0]} `, 'i');
				textCopy = textCopy.replace(reg, item[1]);
				reg = new RegExp(` ${item[0]}`, 'i');
				textCopy = textCopy.replace(reg, item[1]);
				counter = textCopy.match(reg) ? 0 : 1;
			}
		}
		if (item[1] === '()') {
			let counter = 0;
			while (counter === 0) {
				let reg = new RegExp(`${item[0]} `, 'i');
				textCopy = textCopy.replace(reg, item[1][0]);
				reg = new RegExp(` ${item[0]}`, 'i');
				textCopy = textCopy.replace(reg, item[1][1]);
				counter = textCopy.match(reg) ? 0 : 1;
			}
		}
		let reg = new RegExp(` ${item[0]}`, 'gi');
		textCopy = textCopy.replace(reg, item[1]);
	});

	return textCopy;
}

enableRule.addEventListener('click', () => {
	resultFinal.value = filterText(resultFinal.value);
});

// const standardRules = [
// 	[',', 'запятая'], ['!', 'восклицательный знак'],
// 	['?', 'вопросительный знак'], ['-', 'тире'],
// 	['...', 'многоточие'], [':', 'двоеточие'],
// 	[';', 'точка с запятой'], ['\n', 'перенос строки'],
// 	['  ', 'табуляция'], ['"', 'кавычка']
// ];


// получение набора правил через json - файл
function getRules(url) {
	return fetch(url).then(response => response.json());
}
function createListOfRules(list) {
	ruleDiv.innerHTML = '';
// получение набора правил через json - файл
	const url = `./Rules/${list}.json`;
	getRules(url).then(data => {
		console.log(Object.entries(data));
		Object.entries(data).forEach(item => {

			const div = document.createElement('div');
			div.classList.add('redact__wrapper__div');      // создаем дополнительное правило
			div.innerHTML = `<label> Символ:
                <span class="redact__symbol">${item[0]}</span>
            </label>
            <label> Заменит:
                <span class="redact__rule">${item[1]}</span>
            </label>
            <button class="redact__delete__rule">-</button>`
			ruleDiv.appendChild(div);
		})
	});
}

let listOfRules = document.querySelector('#redact__collection__select');
listOfRules.addEventListener('change', () => {

	createListOfRules(listOfRules.value)
})
createListOfRules(listOfRules.value);


//добавить отредактированный текст в div

const addToDivBtn = document.querySelector('#result-for-print-btn');
const divForPrint = document.querySelector('#result-for-print');

addToDivBtn.addEventListener('click', (e) => {
	console.log(e.target);
	if (resultFinal.value !== '') {
		divForPrint.insertAdjacentHTML('beforeend', `<p class="text-for-print">    ${resultFinal.value}</p>`);
		resultFinal.value = '';
	} else {
		alert('Введите данные с помощью голосового ввода');
	}
});

divForPrint.addEventListener('click', (e) => {

	if (e.target.classList.contains('text-for-print')) {
		console.log(e.target);

	}
})