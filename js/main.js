/* calculator */
const calc = (price = 100) => { // 100 единиц - цена по умолчанию
	const calcBlock = document.querySelector('.calc-block');
	const calcType = document.querySelector('.calc-type');
	const calcSquare = document.querySelector('.calc-square');
	const calcDay = document.querySelector('.calc-day');
	const calcCount = document.querySelector('.calc-count');
	const totalValue = document.getElementById('total');

	const countSum = () => { // считаем сумму
		let total = 0;
		let // начальная сумма в span
			countValue = 1;
		let // количество помещений изначально
			dayValue = 1; // количество дней, начальное

		const typeValue = calcType.options[calcType.selectedIndex].value; // значение value у options
		const squareValue = +calcSquare.value; // получаем площадь в числах

		if (calcCount.value > 1) {
			countValue += (calcCount.value - 1) / 10; // получ. десятую долю и её прибавляем;отнимаем 1, т.к. за 1 помещение 10-я часть не прибавляется
		}

		if (calcDay.value && calcDay.value < 5) { // если calcDay существует и < 5
			dayValue *= 2; //* на 2, за скорость цена >
		} else if (calcDay.value && calcDay.value < 10) {
			dayValue *= 1.5;
		}

		if (typeValue && squareValue) { // выводим сумму в span если они оба true,при использовании др. полей они будут false
			total = Math.floor(price * typeValue * squareValue * countValue * dayValue); // считается и выводится
		}

		totalValue.textContent = total; // выводим сумму
	};

	calcBlock.addEventListener('change', event => {
		const {
			target,
		} = event;

		if (target.matches('.calc-type, .calc-square, .calc-day, .calc-count')) {
			countSum();
		}
	});

	calcBlock.addEventListener('input', event => {
		const {
			target,
		} = event;
		if (target.matches('.calc-square, .calc-count, .calc-day')) {
			target.value = target.value.replace(/\D/g, ''); // вводятся только цифры, остальные замен. на пустую строку
		}

		if (!target.matches('.calc-square, .calc-count, .calc-day')) { // если кликаем не на эти элем. ничего не происходит

		}
	});
};

calc();

/* counter */

const countTimer = deadline => {
	const timerDays = document.querySelector('#timer-days');
	const timerHours = document.querySelector('#timer-hours');
	const timerMinutes = document.querySelector('#timer-minutes');
	const timerSeconds = document.querySelector('#timer-seconds');

	const getTimeRemaining = () => {
		const addZero = num => {
			if (num < 10) {
				num = `0${num}`;
			}
			return num;
		};


		const dateStop = new Date(deadline).getTime();
		const // дата окончания
			dateNow = new Date().getTime();
		const // текущая дата, миллисекунды
			timeRemaining = (dateStop - dateNow) / 1000;
		const // количество оставшихся секунд
			seconds = addZero(Math.floor(timeRemaining % 60));
		const // получаем секунды
			minutes = addZero(Math.floor((timeRemaining / 60) % 60));
		const // получаем минуты
			hours = addZero(Math.floor(timeRemaining / 60 / 60) % 24);
		const // получаем часы
			days = addZero(Math.floor(timeRemaining / 60 / 60 / 24)); // получаем дни
		return { // возвращение в виде объекта
			timeRemaining,
			days,
			hours,
			minutes,
			seconds,
		};
	};

	const updateClock = () => {
		const timer = getTimeRemaining();

		timerDays.textContent = timer.days;
		timerHours.textContent = timer.hours;
		timerMinutes.textContent = timer.minutes;
		timerSeconds.textContent = timer.seconds;

		if (timer.timeRemaining > 0) {
			setTimeout(updateClock, 1000);
		} else {
			timerDays.textContent = '00';
			timerHours.textContent = '00';
			timerMinutes.textContent = '00';
			timerSeconds.textContent = '00';
			// clearInterval(idInterval);
		}
	};
	updateClock();
};

countTimer('1 january 2021');

/* sendForm */

const sendForm = () => {
	const errorMessage = 'Что-то пошло не так ...';
	const loadMessage = 'Загрузка ...';
	const successMessage = 'Спасибо! Мы скоро с вами свяжемся!';

	const form = document.getElementById('form1');
	const form2 = document.getElementById('form2');
	const form3 = document.getElementById('form3');
	const bodyPage = document.querySelector('body');


	const inputCyrillic = () => { // ввод только кириллицы и пробелов
		const {
			target,
		} = event;
		if (target.matches('.form-name') || target.matches('.mess') || target.matches('#form2-name')) {
			target.value = target.value.replace(/[^а-яё\s]/ig, '');
		}
	};

	const statusMessage = document.createElement('div');
	statusMessage.style.cssText = 'font-size: 2rem; color: #fff'; // применяем стили

	const getForm = (event, form) => {
		event.preventDefault(); // чтобы страница не перезагружалась по умолчанию
		form.appendChild(statusMessage);
		statusMessage.textContent = loadMessage; // идёт загрузка
		const formData = new FormData(form); // получ. данные нашей формы c атрибутом name в объект

		const body = {}; // объект, ко-й отправл. на сервер в формате json

		formData.forEach((val, key) => {
			body[key] = val;
		});

		postData(body)
			.then(response => { // данные, ко-е мы получаем
				if (response.status !== 200) {
					throw new Error('status network not 200'); // обрабатываем как ошибку через конструктор
				}
				statusMessage.textContent = successMessage;
			})
			.catch(error => {
				statusMessage.textContent = errorMessage;
				console.error(error);
			});
	};

	const inputReset = form => {
		setTimeout(() => { // очистка сообщений
			form.removeChild(statusMessage);
			// statusMessage.textContent = '';
		}, 3000);
		for (const elem of form.elements) { // очистка инпутов
			if (elem.tagName.toLowerCase() !== 'button' && elem.type !== 'button') {
				elem.value = '';
			}
		}
	};

	function valid(event, form) {
		const elementsForm = []; // пустой массив для инпутов
		const error = new Set(); // массив для ошибочных инпутов, вмещает уникальные эл., не повторяются

		for (const elem of form.elements) { // вытаскиваем из формы инпуты
			if (elem.tagName.toLowerCase() !== 'button' && elem.type !== 'button') {
				elementsForm.push(elem); // пушим в массив только наши инпуты
			}
		}

		elementsForm.forEach(elem => {
			const patternPhone = /^\+?[78]([-()]*\d){10}$/;
			// const patternText = (/[^а-яё\s]/ig, '');
			const patternEmail = /^[\w-]+@\w+\.\w{1,}\D$/; // после точки больше 1 символа, не цифры

			if (elem.value.trim() === '' || elem.type === 'tel' && !patternPhone.test(elem.value) ||
				elem.type === 'email' && !patternEmail.test(elem.value)) { // если не проходит валидацию
				elem.style.border = 'solid red';
				error.add(elem); // добавл. инпуты с ошибками в Set
				event.preventDefault();
			} else {
				error.delete(elem); // удал. инпуты из Seta
				elem.style.border = '';
			}
		});
		if (!error.size) { // если size не содержит ошибки (в Set);size коли-во эл. в массиве Set
			getForm(event, form);
			inputReset(form);
		}
	}

	bodyPage.addEventListener('input', event => {
		inputCyrillic(event);
	});

	form.addEventListener('submit', event => {
		valid(event, form);
	});

	form2.addEventListener('submit', event => {
		valid(event, form2);
	});

	form3.addEventListener('submit', event => {
		valid(event, form3);
	});

	const postData = body => // ф. отправки запроса
		fetch('./server.php', { // отправка запроса на сервер с по-ю промисов
			method: 'POST', // отправляем и получаем
			headers: { // заголовки
				'Content-Type': 'application/json', // сообщаем серверу, что передаём json
			},
			body: JSON.stringify(body), // преобр. данные (~body) в json(строка) и передаём
			credentials: 'include', // возможна проверка с по-ю cookie на сервере, передача учёт. записи; 'some-origin' - только в нашем домене, 'include' во всех
			cache: 'default', // лучше выставлять, т.к. в браузерах бывает по др.
		});
};

sendForm();

/* slider */

const slider = () => {
	const slide = document.querySelectorAll('.portfolio-item');
	const slider2 = document.querySelector('.portfolio-content');
	const allProgects = document.getElementById('all-progects');
	const img = allProgects.querySelectorAll('img');
	const dots = document.querySelectorAll('.portfolio-dots');


	const cloneDot = () => { // создание новые точек, равных коли-ву картинок
		let dot = document.createElement('li');
		dot.classList.add('dot', 'dot-active');
		dots[0].appendChild(dot);

		for (let i = 1; i < img.length; i++) {
			dot = dot.cloneNode();
			dot.classList.remove('dot-active');
			dots[0].appendChild(dot);
		}
	};
	cloneDot();

	const newDot = document.querySelectorAll('.dot'); // коллекция "новых точек"
	let currentSlide = 0; // индекс текущего слайда
	let interval; // для идентификатора setInterval

	const prevSlide = (elem, index, strClass) => {
		elem[index].classList.remove(strClass); // удаляем active
	};

	const nextSlide = (elem, index, strClass) => {
		elem[index].classList.add(strClass);
	};

	const autoPlaySlide = () => { // автоматическое перелистывание
		prevSlide(slide, currentSlide, 'portfolio-item-active'); // передаём значение и класс
		prevSlide(newDot, currentSlide, 'dot-active'); // передаём значение и класс, чтобы менялись точки

		currentSlide++;
		if (currentSlide >= slide.length) { // начин. с начала
			currentSlide = 0;
		}
		nextSlide(slide, currentSlide, 'portfolio-item-active');
		nextSlide(newDot, currentSlide, 'dot-active');
	};

	const startSlide = (time = 1500) => { // запуск слайда, по умолч. 3с
		interval = setInterval(autoPlaySlide, time); // запуск слайда через каждые 2с
	};

	const stopSlide = () => { // остановка слайда
		clearInterval(interval); // остановка интервала через идентификатор
	};

	slider2.addEventListener('click', event => {
		event.preventDefault(); // сбрасываем знач. по умолч, заглушки #

		const {
			target,
		} = event; // цель события, на что нажимаем ~

		if (!target.matches('.portfolio-btn, .dot')) { // если кликаем не на эти элем. ничего не происходит
			return;
		}

		prevSlide(slide, currentSlide, 'portfolio-item-active');
		prevSlide(newDot, currentSlide, 'dot-active');


		if (target.matches('#arrow-right')) { // при нажатии на правую кнопку > slide
			currentSlide++;
		} else if (target.matches('#arrow-left')) {
			currentSlide--;
		} else if (target.matches('.dot')) {
			newDot.forEach((elem, index) => { // для сравнения точки и нажатого таргета
				if (elem === target) {
					currentSlide = index; // присваиваем акт. индекс слайду
				}
			});
		}
		if (currentSlide >= slide.length) { // начин. с начала
			currentSlide = 0;
		}
		if (currentSlide < 0) { // возврат на предыдущий слайд
			currentSlide = slide.length - 1; // длина массива > на 1, поэтому -1
		}

		nextSlide(slide, currentSlide, 'portfolio-item-active');
		nextSlide(newDot, currentSlide, 'dot-active');
	});

	slider2.addEventListener('mouseover', event => {
		if (event.target.matches('.portfolio-btn') || event.target.matches('.dot')) {
			stopSlide();
		}
	});

	slider2.addEventListener('mouseout', event => {
		if (event.target.matches('.portfolio-btn') || event.target.matches('.dot')) {
			startSlide();
		}
	});

	startSlide();
};

slider();

/* tabs */

const tabs = () => {
	const tabHeader = document.querySelector('.service-header');
	const tab = tabHeader.querySelectorAll('.service-header-tab');
	const tabContent = document.querySelectorAll('.service-tab');

	const toggleTabContent = index => {
		for (let i = 0; i < tabContent.length; i++) {
			if (index === i) { // если индексы совпадают, контент появляется
				tab[i].classList.add('active'); // добавл. активный класс
				tabContent[i].classList.remove('d-none');
			} else { // исчезает
				tab[i].classList.remove('active'); // убираем активный класс
				tabContent[i].classList.add('d-none');
			}
		}
	};

	tabHeader.addEventListener('click', event => {
		let {
			target,
		} = event; // элем. на котором произошло событие
		target = target.closest('.service-header-tab'); // проверка наличия селектора, его привязка

		if (target) { // есть ли у таргета что-то
			tab.forEach((item, i) => { // перебор
				if (item === target) { // если совп. с service-header-tab перед. индекс элемента в F.
					toggleTabContent(i);
				}
			});
		}
	});
};

tabs();

/* team */

const team = () => {
	const command = document.querySelector('#command');

	command.addEventListener('mouseover', event => { // при наведении
		const {
			target,
		} = event;

		if (target.matches('.command__photo')) { // если навели на этот элемент
			const attributeData = target.dataset.img;
			const attributeSrc = target.src;

			target.dataset.img = attributeSrc; // присваиваем значения
			target.src = attributeData;
		}

		if (!target.matches('.command__photo')) { // если кликаем не на эти элем. ничего не происходит

		}
	});

	command.addEventListener('mouseout', event => { // при уходе с элемента
		const {
			target,
		} = event;
		if (target.matches('.command__photo')) {
			const attributeData = target.getAttribute('data-img');
			const attributeSrc = target.getAttribute('src');

			target.dataset.img = attributeSrc;

			target.src = attributeData;
		}
		if (!target.matches('.command__photo')) { // если кликаем не на эти элем. ничего не происходит

		}
	});
};

team();

/* toggleMenu */

const toggleMenu = () => {
	const btnMenu = document.querySelector('.menu');
	const menu = document.querySelector('menu');

	const handlerMenu = () => {
		menu.classList.toggle('active-menu'); // с помощью css
	};
	btnMenu.addEventListener('click', handlerMenu);
	menu.addEventListener('click', event => {
		const {
			target,
		} = event;

		if (target.classList.contains('close-btn') || target.closest('ul > li')) { // при клике на крестик или пункт меню м. окно исчезает
			handlerMenu();
		}
	});
};

toggleMenu();

/* togglePopUp */
const togglePopUp = () => {
	const popUp = document.querySelector('.popup'),
		popupBtn = document.querySelectorAll('.popup-btn'),
		popupContent = document.querySelector('.popup-content');
	let count = 0; //счётчик


	popupBtn.forEach((elem) => {
		elem.addEventListener('click', () => {
			popUp.style.display = 'block'; //вызываем модальное окно
			let popupInterval;
			const popupDown = function () {
				popupInterval = requestAnimationFrame(popupDown); //записываем идентификатор
				count++;
				if (count < 100) {
					popupContent.style.top = count + 'px'; //двигаем
				} else {
					cancelAnimationFrame(popupInterval); //конец работы счётчика
				}
			};
			const width = document.documentElement.clientWidth;

			if (width >= 768) { //если ширина экрана >= 768px
				popupInterval = requestAnimationFrame(popupDown); //запуск при клике на кнопку
			}
		});
	});

	popUp.addEventListener('click', (event) => {
		const countPopUpNone = () => {
			popUp.style.display = 'none'; //убираем м. окно
			count = 0; //обнуляем счётчик
		};

		let target = event.target;

		if (target.classList.contains('popup-close')) { //при клике на крестик м. окно исчезает
			countPopUpNone();

		} else {
			target = target.closest('.popup-content');

			if (!target) { //если не получили popup-content, т.е. получили null при клике за пределами окна
				countPopUpNone();

			}
		}
	});

};

togglePopUp();