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
	a_repeat : function(s) { return s.match(/^(.+)\1+$/) ? 1 : 0 },
	toocommon: function(s) { return passwork.brutally_common[s] ? 1 : 0 },
	max_score : 8,
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
	},
	brutally_common : {
		/* "1234..."    */ '123456':1, '1234567':1, '12345678':1, '123456789':1,
				   '654321':1, 'abc123':1, '123abc':1,
		/* "password"   */ 'password':1, 'Password':1, 'password1':1, 'secret':1, 'letmein':1,
		/* keyboard     */ 'qwerty':1,
		/* love/hate    */ 'love':1, 'iloveyou':1, 'lovely':1, 'fuckyou':1, 'biteme':1, 'fuckme':1,
		/* names        */ 'michelle':1, 'jordan':1, 'michael':1, 'nicole':1, 'daniel':1, 'ashley':1,
		/* sports       */ 'soccer':1, 'baseball':1, 'football':1,
		/* oddly common */ 'monkey':1, 'jesus':1,
		/* computer     */ 'computer':1, 'internet':1,
		/* superheros   */ 'batman':1, 'superman':1, 
		/* boys         */ 'master':1, 'shadow':1, 'killer':1, 'dragon':1, 'pussy':1,
		/* girls        */ 'princess':1,
		/* war games    */ 'joshua':1,
		/* x-files      */ 'trustno1':1,
		/* irc/bash     */ 'hunter2':1,
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
