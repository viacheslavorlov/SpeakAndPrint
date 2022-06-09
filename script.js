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
	resultFinal.value += (resultText.value + '. ');
	resultText.value = '';
}

function speech() {
	// Начинаем слушать микрофон и распознавать голос
	recognizer.start();
}

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance('How about we say this now? This is quite a long sentence to say.');

function talk() {
	synth.speak(utterance);
}

function stop() {
	synth.pause();
}