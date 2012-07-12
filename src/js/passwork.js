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
	no_lower : function(s) { return s.toLowerCase() == s },
	no_upper : function(s) { return s.toUpperCase() == s },
	no_digit : function(s) { return s.search(/\d/) == -1 },
	no_punct : function(s) { return s.search(/([^\s\w]|_)/) == -1 },
	a_repeat : function(s) { return s.match(/^(.{1,4})\1+$/) ? 1 : 0 },
	toocommon: function(s) { return passwork.brutally_common[s.toLowerCase()] ? 1 : 0 },
	// ~20% of the english dictionary matches
	common_english_dictionary_vowel_and_consonant_pattern : function(s) { return s.match(/^[^aeiou\W]{1,2}[aeiou][^aeiou\W]{1,3}[aeiou]?[^aeiou\W]{0,3}$/i) ? 1 : 0 },
	ssn_pattern : function(s) { return s.match(/^\d{3}-?\d{2}-?\d{4}$/) ? 1 : 0 },
	// number of tests
	Max_Score : 10,
	Good_Score : 8,
	score    : function(s) {
		score = passwork.Max_Score
			- passwork.tooshort(s)
			- passwork.weak_len(s)
			- passwork.no_lower(s)
			- passwork.no_upper(s)
			- passwork.no_digit(s)
			- passwork.no_punct(s)
			- passwork.a_repeat(s)
			- passwork.toocommon(s)
			- passwork.common_english_dictionary_vowel_and_consonant_pattern(s)
			- passwork.ssn_pattern(s)
		// scale up score for very short passwords; produces more intuitive
		// and useful output than a raw score at short lengths
		if (s.length <= 4)
			score = Math.min(score, s.length)
		return score
	},
	// default convenience function which describes why a password is unacceptable
	problem : function(s)
	{
		if (passwork.tooshort(s)) return 'too short'
		if (passwork.toocommon(s)) return 'too common'
		if (passwork.score(s) < passwork.Good_Score) return 'too weak'
		return '' // ok
	},
	brutally_common : {
		/* "1234..."    */ '1234':1, '12345':1, '123456':1, '1234567':1, '12345678':1, '123456789':1, '1234567890':1, '654321':1, 'abc123':1, '123abc':1,
		/* "password"   */ 'password':1, 'password1':1, 'password12':1, 'password123':1, 'passw0rd':1, 'drowssap':1, 'nopassword':1,
				   'secret':1, 'letmein':1, 'testing':1, 'test':1, 'testest':1, 'test123':1,
		/* keyboard     */ 'qwerty':1, 'qwertyu':1, 'qwertyui':1, 'qwerty1':1, 'qweewq':1, 'qazwsx':1, 'qweasd':1, 'qweasdzxc':1,
				   'asdsa':1, 'asddsa':1, 'asdfgh':1, 'asdfghj':1, 'asdfghjk':1, 'asdfghjkl':1, '159357':1,
		/* emo          */ 'love':1, 'iloveyou':1, 'iloveyou1':1, 'lovely':1, 'iwantu':1, 'fuckyou':1, 'biteme':1, 'fuckme':1, 'blowme':1, 'helpme':1,
				   'whatever':1, 'whocares':1, 'anything':1, 'nothing':1,
		/* first names  */ 'anthony':1, 'austin':1, 'charlie':1, 'daniel':1, 'edward':1, 'gregory':1, 'george':1, 'joseph':1, 'robert':1, 'steven':1, 'thomas':1, 'william':1,
				   'ashley':1, 'amanda':1, 'cameron':1, 'chelsea':1, 'jennifer':1, 'michelle':1, 'melissa':1, 'nicole':1, 'taylor':1,
		/* last names   */ 'jackson':1, 'johnson':1, 'miller':1,
		/* sports       */ 'baseball':1, 'football':1, 'hockey':1, 'soccer':1,
				   'michael':1, 'jordan':1, 'jordan23':1,
		/* sports teams */ 'cowboys':1, 'eagles':1, 'dolphins':1, 'yankees':1, 'lakers':1, 'giants':1, 'redsox':1, 'steelers':1, 'ranger':1, 'arsenal':1, 'liverpool':1,
		/* oddly common */ 'sex':1, 'god':1, 'monkey':1, 'jesus':1, 'cheese':1, 'pepper':1,
		/* months       */ 'january':1, 'february':1, 'march':1, 'april':1, 'may':1, 'june':1, 'july':1, 'august':1, 'september':1, 'october':1, 'november':1, 'december':1,
		/* astrology    */ 'aries':1, 'taurus':1, 'gemini':1, 'cancer':1, 'leo':1, 'virgo':1, 'libra':1, 'scorpio':1, 'sagittarius':1, 'capricorn':1, 'aquarius':1, 'pisces':1,
		/* colors       */ 'black':1, 'blue':1, 'orange':1, 'purple':1, 'red':1, 'white':1, 'yellow':1,
		/* computer     */ 'apple':1, 'computer':1, 'internet':1, 'microsoft':1, 'windows':1,
		/* pop culture  */ 'batman':1, 'superman':1, 'bond007':1, 'pokemon':1, 'hannah':1, 'tigger':1, 'thx1138':1, 'einstein':1,
		/* nerds        */ 'starwars':1, 'startrek':1, 'ncc1701':1, 'voyager':1, 'gandalf':1, 'merlin':1, 'wizard':1, 'knight':1,
		/* boys         */ 'master':1, 'shadow':1, 'killer':1, 'dragon':1, 'hammer':1,
				   'bitches':1, 'money':1, 'bigdick':1,
				   'horny':1, 'teens':1, 'amateur':1, 'hardcore':1, 'hooters':1, 'boobs':1, 'bigtits':1, 'panties':1, 'vagina':1, 'pussy':1, 'blowjob':1, 'cumshot':1, 'asshole':1,
				   'corvette':1, 'mustang':1, 'porsche':1, 'camaro':1, 'ferrari':1, 'diablo':1, 'mercedes':1,
				   'harley':1, 'yahama':1,
				   'topgun':1, 'maverick':1,
				   'ninja':1,
		/* girls        */ 'princess':1, 'sunshine':1,
		/* rednecks     */ 'nascar':1,
		/* nearby items */ 'samsung':1, 'intel':1, 'dell':1, 'linksys':1, 'verizon':1, 'sony':1, 'sprint':1,
				   'compaq':1, 'presario':1,
				   'gateway':1, 'gateway2000':1,
				   'hewlettpackard':1, 'packard':1, 'pavilion':1,
				   'cocacola':1, 'pepsi':1, 'mountaindew':1, 'codered':1,
		/* pop music    */ '8675309':1, 'blink182':1, 'ou812':1, 'rush2112':1,
		/* famous passwd*/ 'joshua':1, 'trustno1':1, 'z10n0101':1, 'hunter':1, 'hunter2':1,
		/* other        */ 'welcome':1
	}
};

// below here are convenience functions for display

//
// build progress bar as a table via DOM
// one cell for each passwork score function
// [ ][ ][ ][ ][ ][ ][ ]
//
passwork.progress_bar = function (progress_bar_id, bgcolor, padding)
{
	progress_bar_id = progress_bar_id || 'passwork_progress_bar'
	bgcolor = bgcolor || '#ddd'
	padding = padding || 8
	var tbl = document.createElement('table')
	var tblB = document.createElement('tbody')
	var row = document.createElement('tr')
	for (var i = 0; i < passwork.Max_Score; i++)
	{
		var cell = document.createElement('td')
		cell.setAttribute('id', 'progress' + i)
		cell.style['background-color'] = bgcolor
		row.appendChild(cell)
	}
	tblB.appendChild(row)
	tbl.appendChild(tblB)
	tbl.setAttribute('id', progress_bar_id)
	tbl.setAttribute('border', '0')
	tbl.setAttribute('cellpadding', padding)
	tbl.setAttribute('cellspacing', '1')
	tbl.setAttribute('style', 'display:inline; vertical-align:middle')
	return tbl
};

// callback. on password change, calculate score and update progressbar as appropriate.
passwork.update_progress = function (pass_string, progress_bar_id, okcolor, emptycolor, failcolor)
{
	// default arguments
	progress_bar_id = progress_bar_id || 'passwork_progress_bar'
	okcolor = okcolor || 'green'
	emptycolor = emptycolor || '#ddd'
	failcolor = failcolor || 'red'
	score = passwork.score(pass_string)
	bar = document.getElementById(progress_bar_id)
	box = bar.rows[0].cells
	tooshort = passwork.tooshort(pass_string)
	toocommon = passwork.toocommon(pass_string)
	tooweak = score < passwork.Good_Score
	for (var i = 0; i < box.length; i++)
	{
		box[i].style['background-color'] = score > i ? tooshort || toocommon || tooweak ? failcolor : okcolor : emptycolor
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
	var idx = (confirm_string != '' && confirm_string.length >= pass_string.length) +
		  (confirm_string != '' && confirm_string == pass_string)
	pc = document.getElementById(pass_confirm_name)
	pc.style['color'] = results[idx][1]
	pc.innerText = results[idx][0]
};
