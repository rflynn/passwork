#!/usr/bin/env python

"""
Author: Ryan Flynn <parseerror+passwork@gmail.com>

Score password strength. Encourage people to use better passwords.
"""

import os, re

class Passwork:
	MaxScore = 10
	GoodScore = 8
	
	def __init__(self, minlen=7, stronglen=12):
		self.MinLen = minlen
		self.StrongLen = stronglen
	def tooshort(self, s): return len(s) < self.MinLen
	def weak_len(self, s): return len(s) < self.StrongLen
	def no_lower(self, s): return s.upper() == s
	def no_upper(self, s): return s.lower() == s
	def no_digit(self, s): return not bool(re.search('\d', s))
	def no_punct(self, s): return not bool(re.search('([^\s\w]|_)', s))
	def a_repeat(self, s): return bool(re.match(r'^(.{1,4})\1+$', s))
	def toocommon(self, s): return s.lower() in Passwork.BrutallyCommon
	def common_english_dictionary_vowel_and_consonant_pattern(self, s):
		return bool(re.match(r'^[^aeiou\W]{1,2}[aeiou][^aeiou\W]{1,3}[aeiou]?[^aeiou\W]{0,3}$', s, re.I))
	def ssn_pattern(self, s): return bool(re.match(r'^\d{3}-?\d{2}-?\d{4}$', s, re.I))

	def score(self, s):
		score = Passwork.MaxScore \
			- self.tooshort(s) \
			- self.weak_len(s) \
			- self.no_lower(s) \
			- self.no_upper(s) \
			- self.no_digit(s) \
			- self.no_punct(s) \
			- self.a_repeat(s) \
			- self.toocommon(s) \
			- self.common_english_dictionary_vowel_and_consonant_pattern(s) \
			- self.ssn_pattern(s)
		if len(s) <= 4:
			score = min(score, len(s))
		return score

	# given password s
	# return a string description of the reason the password is unacceptable
	# otherwise, return an empty string
	def problem(self, s):
		if self.tooshort(s):
			return 'too short'
		elif self.toocommon(s):
			return 'too common';
		elif self.score(s) < Passwork.GoodScore:
			return 'too weak';
		return '' # no problem

	def test_or_die(self):
		assert     self.tooshort('')
		assert     self.weak_len('')
		assert     self.no_lower('L')
		assert not self.no_lower('l')
		assert     self.no_upper('u')
		assert not self.no_upper('U')
		assert     self.no_digit('d')
		assert not self.no_digit('9')
		assert     self.no_punct('p')
		assert not self.no_punct('!')
		assert not self.a_repeat('r')
		assert     self.a_repeat('rr')
		assert     self.a_repeat('rere')
		assert     self.a_repeat('reprep')
		assert     self.toocommon('123456')
		assert not self.toocommon('Uncomm0nPassword!@#$%^&')
		assert not self.common_english_dictionary_vowel_and_consonant_pattern('')
		assert not self.common_english_dictionary_vowel_and_consonant_pattern('abc')
		assert     self.common_english_dictionary_vowel_and_consonant_pattern('common')
		assert not self.ssn_pattern('')
		assert     self.ssn_pattern('123-45-6789')
		assert     self.ssn_pattern('123456789')

	BrutallyCommon = {
		# "1234..."
		'1234':1, '12345':1, '123456':1, '1234567':1, '12345678':1, '123456789':1, '1234567890':1, '654321':1, 'abc123':1, '123abc':1,
		# "password"
		'password':1, 'password1':1, 'password12':1, 'password123':1, 'passw0rd':1, 'drowssap':1, 'nopassword':1,
		'secret':1, 'letmein':1, 'testing':1, 'test':1, 'testest':1, 'test123':1,
		# keyboard
		'qwerty':1, 'qwertyu':1, 'qwertyui':1, 'qwerty1':1, 'qweewq':1, 'qazwsx':1, 'qweasd':1, 'qweasdzxc':1,
		'asdsa':1, 'asddsa':1, 'asdfgh':1, 'asdfghj':1, 'asdfghjk':1, 'asdfghjkl':1, '159357':1,
		# emo
		'love':1, 'iloveyou':1, 'iloveyou1':1, 'lovely':1, 'iwantu':1, 'fuckyou':1, 'biteme':1, 'fuckme':1, 'blowme':1, 'helpme':1,
	 	'whatever':1, 'whocares':1, 'anything':1, 'nothing':1,
		# first names
		'anthony':1, 'austin':1, 'charlie':1, 'daniel':1, 'edward':1, 'gregory':1, 'george':1, 'joseph':1, 'robert':1, 'steven':1, 'thomas':1, 'william':1,
		'ashley':1, 'amanda':1, 'cameron':1, 'chelsea':1, 'jennifer':1, 'michelle':1, 'melissa':1, 'nicole':1, 'taylor':1,
		# last names
		'jackson':1, 'johnson':1, 'miller':1,
		# sports
		'baseball':1, 'football':1, 'hockey':1, 'soccer':1,
		'michael':1, 'jordan':1, 'jordan23':1,
		# sports teams
		'cowboys':1, 'eagles':1, 'dolphins':1, 'yankees':1, 'lakers':1, 'giants':1, 'redsox':1, 'steelers':1, 'ranger':1, 'arsenal':1, 'liverpool':1,
		# oddly common
		'sex':1, 'god':1, 'monkey':1, 'jesus':1, 'cheese':1, 'pepper':1,
		# months      
		'january':1, 'february':1, 'march':1, 'april':1, 'may':1, 'june':1, 'july':1, 'august':1, 'september':1, 'october':1, 'november':1, 'december':1,
		# astrology   
		'aries':1, 'taurus':1, 'gemini':1, 'cancer':1, 'leo':1, 'virgo':1, 'libra':1, 'scorpio':1, 'sagittarius':1, 'capricorn':1, 'aquarius':1, 'pisces':1,
		# colors      
		'black':1, 'blue':1, 'orange':1, 'purple':1, 'red':1, 'white':1, 'yellow':1,
		# computer    
		'apple':1, 'computer':1, 'internet':1, 'microsoft':1, 'windows':1,
		# pop culture 
		'batman':1, 'superman':1, 'bond007':1, 'pokemon':1, 'hannah':1, 'tigger':1, 'thx1138':1, 'einstein':1,
		# nerds       
		'starwars':1, 'startrek':1, 'ncc1701':1, 'voyager':1, 'gandalf':1, 'merlin':1, 'wizard':1, 'knight':1,
		# boys        
		'master':1, 'shadow':1, 'killer':1, 'dragon':1, 'hammer':1,
		'bitches':1, 'money':1, 'bigdick':1,
		'horny':1, 'teens':1, 'amateur':1, 'hardcore':1, 'hooters':1, 'boobs':1, 'bigtits':1, 'panties':1, 'vagina':1, 'pussy':1, 'blowjob':1, 'cumshot':1, 'asshole':1,
		'corvette':1, 'mustang':1, 'porsche':1, 'camaro':1, 'ferrari':1, 'diablo':1, 'mercedes':1,
		'harley':1, 'yahama':1,
		'topgun':1, 'maverick':1,
		# girls       
		'princess':1, 'sunshine':1,
		# rednecks    
		'nascar':1,
		# nearby items
		'samsung':1, 'intel':1, 'dell':1, 'linksys':1, 'verizon':1, 'sony':1, 'sprint':1,
		'compaq':1, 'presario':1,
		'gateway':1, 'gateway2000':1,
		'hewlettpackard':1, 'packard':1, 'pavilion':1,
		'cocacola':1, 'pepsi':1, 'mountaindew':1, 'codered':1,
		# pop music   
		'8675309':1, 'blink182':1, 'ou812':1, 'rush2112':1,
		# famous passwd
		'joshua':1, 'trustno1':1, 'z10n0101':1, 'hunter':1, 'hunter2':1,
	}

if __name__ == '__main__':

	p = Passwork()
	p.test_or_die()
	progressivelyStrongerPasswords = [
		'', 'a', 'aa', 'qwerty', 'abcabc', 'aaaaaaa', 'abcdabcd', 'abc123',
		'123456', '1234567',
		'michael', 'abcd!', 'not$bad', 
		'3venbetter!', 'BetterPassword9', '$str0ngPass!'
	]
	for t in progressivelyStrongerPasswords:
		print "%2d/%2d '%s' : %s" % \
			(p.score(t), Passwork.MaxScore, t, p.problem(t))

	import sys

	if '--interactive' in sys.argv:
		try:
			p = Passwork()
			while True:
				s = raw_input('password: ')
				print '%d/%u %s %s' % (p.score(s), p.MaxScore, s, p.problem(s))
		except EOFError:
			pass

