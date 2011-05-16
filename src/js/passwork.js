//
// Test potential password for various deficiencies
// Make it easier for developers/websites to encourage users to choose stronger passwords
// Author: Ryan Flynn <parseerror+passwork@gmail.com>

var passwork = {
	min_len  : 7,
	strong_len : 12,
	// tests. each tests a single weakness and returns 1 if weakness exists and 0 otherwise
	tooshort : function(s) { return s.length < passwork.min_len },
	weak_len : function(s) { return s.length < passwork.strong_len },
	no_lcase : function(s) { return s.toLowerCase() == s },
	no_ucase : function(s) { return s.toUpperCase() == s },
	no_digit : function(s) { return s.search(/\d/) == -1 },
	no_punct : function(s) { return s.search(/([^\s\w]|_)/) == -1 },
	a_repeat : function(s) { return s.match(/^(.{1,4})\1+$/) ? 1 : 0 },
	toocommon: function(s) { return passwork.brutally_common[s.toLowerCase()] ? 1 : 0 },
	// ~20% of the english dictionary matches
	common_english_dictionary_vowel_and_consonant_pattern : function(s) { return s.match(/^[^aeiou\W]{1,2}[aeiou][^aeiou\W]{1,3}[aeiou]?[^aeiou\W]{0,3}$/i) ? 1 : 0 },
	ssn_pattern : function(s) { return s.match(/^\d{3}-?\d{2}-?\d{4}$/) ? 1 : 0 },
	// number of tests
	max_score : 10,
	score    : function(s) {
		if (s == '')
			return 0;
		return passwork.max_score
			- passwork.tooshort(s)
			- passwork.weak_len(s)
			- passwork.no_lcase(s)
			- passwork.no_ucase(s)
			- passwork.no_digit(s)
			- passwork.no_punct(s)
			- passwork.a_repeat(s)
			- passwork.toocommon(s)
			- passwork.common_english_dictionary_vowel_and_consonant_pattern(s)
			- passwork.ssn_pattern(s)
	},
	brutally_common : {
		/* "1234..."    */ '123456':1, '1234567':1, '12345678':1, '123456789':1, '654321':1, 'abc123':1, '123abc':1,
		/* "password"   */ 'password':1, 'password1':1, 'passw0rd':1, 'drowssap':1, 'secret':1, 'letmein':1, 'testing':1,
		/* keyboard     */ 'qwerty':1, 'asdfgh':1, 'qazwsx':1, '159357':1,
		/* emo          */ 'love':1, 'iloveyou':1, 'lovely':1, 'fuckyou':1, 'biteme':1, 'fuckme':1, 'helpme':1, 'iwantu':1, 'whatever':1, 'whocares':1,
		/* first names  */ 'michael':1, 'jordan':1, 'michelle':1, 'nicole':1, 'daniel':1, 'ashley':1, 'gregory':1, 'george':1, 'charlie':1, 'thomas':1,
		/* sports       */ 'soccer':1, 'baseball':1, 'football':1,
		/* sports teams */ 'cowboys':1, 'eagles':1, 'dolphins':1, 'yankees':1, 'lakers':1, 'giants':1, 'arsenal':1, 'liverpool':1,
		/* oddly common */ 'monkey':1, 'jesus':1,
		/* computer     */ 'computer':1, 'internet':1, 'microsoft':1, 'windows':1, 'apple':1,
		/* pop culture  */ 'batman':1, 'superman':1, 'bond007':1, 'starwars':1, 'pokemon':1, 'hannah':1, 'tigger':1,
		/* boys         */ 'master':1, 'shadow':1, 'killer':1, 'dragon':1, 'pussy':1, 'vagina':1,
		/* girls        */ 'princess':1,
		/* months       */ 'january':1, 'february':1, 'march':1, 'april':1, 'may':1, 'june':1, 'july':1, 'august':1, 'september':1, 'october':1, 'november':1, 'december':1,
		/* astrology    */ 'aries':1, 'taurus':1, 'gemini':1, 'cancer':1, 'leo':1, 'virgo':1, 'libra':1, 'scorpio':1, 'sagittarius':1, 'capricorn':1, 'aquarius':1, 'pisces':1,
		/* colors       */ 'orange':1, 'yellow':1, 'purple':1,
		/* nearby items */ 'samsung':1, 'intel':1, 'dell':1, 'linksys':1, 'verizon':1, 'sony':1, 'sprint':1,
				   'compaq':1, 'presario':1,
				   'gateway':1, 'gateway2000':1,
				   'hewlettpackard':1, 'packard':1, 'pavilion':1,
				   'cocacola':1, 'pepsi':1, 'mountaindew':1, 'codered':1,
		/* pop music    */ '8675309':1, 'blink182':1, 'ou812':1, 'rush2112':1,
		/* famous passwd*/ 'joshua':1, 'trustno1':1, 'z10n0101':1, 'hunter2':1,
	}
};

// below here are convenience functions for display

//
// build progress bar as a table via DOM
// one cell for each passwork score function
// [ ][ ][ ][ ][ ][ ][ ]
//
passwork.progress_bar = function (bgcolor, padding)
{
	bgcolor = bgcolor || '#ddd'
	padding = padding || 8
	var tbl = document.createElement('table')
	var tblB = document.createElement('tbody')
	var row = document.createElement('tr')
	for (var i = 0; i < passwork.max_score; i++)
	{
		var cell = document.createElement('td')
		cell.setAttribute('id', 'progress' + i)
		cell.style['background-color'] = bgcolor
		row.appendChild(cell)
	}
	tblB.appendChild(row)
	tbl.appendChild(tblB)
	tbl.setAttribute('id', 'passwork_progress_bar')
	tbl.setAttribute('border', '0')
	tbl.setAttribute('cellpadding', padding)
	tbl.setAttribute('cellspacing', '1')
	tbl.setAttribute('style', 'display:inline; vertical-align:middle')
	return tbl
};

// callback. on password change, calculate score and update progressbar as appropriate.
passwork.update_progress = function (pass_string, okcolor, emptycolor, tooshortcolor, progress_bar_id)
{
	// default arguments
	okcolor = okcolor || 'green'
	emptycolor = emptycolor || '#ddd'
	tooshortcolor = tooshortcolor || 'red'
	progress_bar_id = progress_bar_id || 'passwork_progress_bar'
	score = passwork.score(pass_string)
	bar = document.getElementById(progress_bar_id)
	box = bar.rows[0].cells
	tooshort = passwork.tooshort(pass_string)
	for (var i = 0; i < box.length; i++)
	{
		box[i].style['background-color'] = score > i ? tooshort ? tooshortcolor : okcolor : emptycolor
	}
	return score
};

// callback. on password confirmation change, calculate confirmation equality and display
passwork.confirm = function (confirm_string, pass_string, pass_confirm_name, okcolor, badcolor, waitcolor)
{
	pass_confirm_name = pass_confirm_name || 'pass_confirm_name'
	okcolor = okcolor || 'green'
	badcolor = badcolor || 'red'
	waitcolor = waitcolor || '#ccc'
	results = [[ '...', waitcolor ],
		   [ '!!',  badcolor ],
		   [ 'OK',  okcolor ]]
	var idx = (confirm_string.length >= pass_string.length) + (confirm_string == pass_string)
	pc = document.getElementById(pass_confirm_name)
	pc.style['color'] = results[idx][1]
	pc.innerText = results[idx][0]
};
