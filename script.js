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

function addToResult() {
	if (resultText.value !== '') {
		if (resultFinal.value === '') {
			resultFinal.value += (resultText.value + '.');
			resultText.value = '';
		} else {
			resultFinal.value += (' ' + resultText.value + '.');
			resultText.value = '';
		}
	} else {
		alert('Введите данные с помощью голосового ввода');
	}

}

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
	fileName = document.querySelector('#download__input-name');

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
	download(fileName.value, resultFinal.value);
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
		rulesArray.push([item.value, rulesSymbols[i].value]);
	});
	console.log(rulesArray);
	let textCopy = text;
	rulesArray.forEach(item => {
		let reg = new RegExp(`${item[0]}`, 'g')
		textCopy = textCopy.replace(reg, item[1]);
	});
	console.log(textCopy);
	return textCopy;
}

enableRule.addEventListener('click', () => {
	resultFinal.value = filterText(resultFinal.value);
});