(function() {

const makeSpans = (words) => {
	let html = '';
	
	words.forEach(function(word) {
		html = `${html}<span>${word} </span>`;
	});
	
	return html;
}

const showFAQ = () => {
	event.preventDefault();
	
	let selected = faqDemo.getAttribute('aria-selected');
	
	if (!selected) {
		faqDemo.setAttribute('aria-selected', 'true');
		faq.hidden = false;
		faq.setAttribute('aria-busy', 'true');
		faq.scrollIntoView();
		
		setTimeout(function() {
			faq.removeAttribute('aria-busy');
		}, 1500);
	}
}

const hideFAQ = () => {
	faq.hidden = true;
	faqDemo.removeAttribute('aria-selected');
	topics.scrollIntoView();
}

const wordspans = document.querySelectorAll('.wordspans');

wordspans.forEach(function(text) {
	const words = text.textContent.trim().split(' ');

	text.innerHTML = makeSpans(words);
});


// FAQ demo

const topics    = document.getElementById('faq-topics');
const faq       = document.getElementById('faq');
const faqDemo   = document.querySelector('[data-demo="faq"]');
const faqClose  = document.querySelector('#faq button');

document.addEventListener('click', function(event) {
	const trigger = event.target;
	
	if ( trigger.matches('[data-demo="faq"]') ) {
		showFAQ();
	}
	
	if ( trigger.matches('[aria-label="Close FAQ"]') ) {
		hideFAQ();
	}
	
	if ( trigger.closest('[href="#"]:not([data-demo])') ) {
		event.preventDefault();
		
		let isTopic = trigger.closest('#faq-topics');
		let type    = isTopic ? 'FAQ link' : 'link';
		let append  = isTopic ? ' Try the ‘Testing’ topic link instead.' : '';
		const msg   = `Just a demo ${type} for now.${append}`;
		
		alert(msg);
	}
	
	if ( trigger.matches('#levels-reset > button') ) {
		event.preventDefault();
		
		progOptions.forEach(function(elem) {
			const scope = elem.name;
			const val   = resetParams[scope];

			updateLength(undefined, elem, val);
			selectDefault(elem);
			totalWeeks.innerHTML = '';
			totalWeeks.className = '';
		});
	}
	
	if ( trigger.matches('.toggle-header') ) {
		toggleHeader();
	}
});


const toggleHeader = () => {
	const elems = document.querySelectorAll('[data-header]');
	
	elems.forEach(function(elem) {
		const state = elem.hidden;
		
		elem.hidden = !state;
	});
}


// Length estimator

const selectDefault= (elem) => {
	const val = elem.querySelector('[data-default]').value;
	
	elem.value = val;
}

const updateOpts = (scope, val) => {
	val   = val ? val : resetParams[scope];
	scope = scope === 'start' ? 'end' : 'start';
	
	const selector = `[name="${scope}"] [data-num]`;
	const options  = document.querySelectorAll(selector);
	
	options.forEach(function(option) {
		const n = option.getAttribute('data-num');
		
		if ( scope === 'end' ) {
			// end options
			option.hidden = n <= val;
		}
		else {
			// start options
			option.hidden = n >= val;
		}
	});
}

const updateLength = (e, elem, val) => {
	elem  = elem ? elem : e.target;
	val   = val  ? val  : elem.value.replace(/^([^0-9]+)?([0-9]+)([^0-9]+)?$/, '$2');
	
	const scope = elem.name;

	progParams[scope] = val ? val : resetParams[scope];

	if ( scope !== 'weeks' ) {
		updateOpts(scope, val);
	}
	
	levels.forEach(function(level, index) {
		const i = index + 1;
		level.hidden = i < progParams.start || i > progParams.end;
	});

	levelsList.setAttribute('data-weeks', progParams.weeks);
	// console.log(progParams);

	const l = progParams.end - progParams.start + 1;
	const s = l > 1 ? 's' : '';
	const t = l * progParams.weeks;
	const testUrl = 'https://share.hsforms.com/1qDYcp4FxSFOdN0WZlRnPhw4n0op?utm_campaign=Free%20Level%20Check&utm_source=facebook&utm_medium=social';
	const confirm = `<span class="line-br">Confirm your current English level with a <a href="${testUrl}">free test</a>.</span>`;
	totalWeeks.innerHTML = `<span class="line-br">You are aiming to progress <strong>${l} level${s} in ${t} weeks</strong>.</span> ${confirm}`;
	totalWeeks.className = 'pad-1r bg-blue-a15 measure';
	
	levelsList.setAttribute('data-levels', l);
}

const progOptions = document.querySelectorAll('[data-scope="proglength"]');
const resetParams = { start: 1, end: 8, weeks: 8};
let   progParams  = { start: 1, end: 8, weeks: 8};
const levelsList  = document.querySelector('.levels');
const levels      = document.querySelectorAll('.levels > li');
const totalWeeks  = document.getElementById('total-weeks');

document.getElementById('levels-submit').hidden = true;
document.getElementById('levels-reset').hidden = false;

progOptions.forEach(function(elem) {
	elem.addEventListener('change', updateLength);
});

document.querySelector('.toggle-header').hidden = false;

})();
