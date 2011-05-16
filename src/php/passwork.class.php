<?php

class Passwork
{
	/*
	 * Author: Ryan Flynn <parseerror+passwork@gmail.com>
	 *
	 * Rate password strength via series of tests.
	 * Encourages better password selection.
	 * Can produce simple aggregate score or run individual tests.
	 * See ../js/passwork.js for frontend real-time password checking
	 */

	// corresponds to number of tests
	const MaxScore = 10;

	// convenience ratings
	const AcceptableScore = 6;
	const OKScore = 7;
	const GoodScore = 8;

	private $MinLen = 7;
	private $StrongLen = 12;

	function __construct($minlen=7, $stronglen=12)
	{
		$this->MinLen = $minlen;
		$this->StrongLen = $stronglen;
	}

	/*
	 * convenience method for lazy programmers
 	 * given password string $pass
 	 * if password is unacceptable
 	 *	return a string description of the reason
 	 * otherwise
 	 *	return an empty string if it's ok
 	 */
	function problem($pass)
	{
		if ($this->tooShort($pass))
			return 'too short';
		else if ($this->tooCommon($pass))
			return 'too common';
		else if ($this->score($pass) < Passwork::AcceptableScore)
			return 'too weak';
		return ''; // no problem
	}

	/*
	 * given password string $s
	 * return integer score in range [0, Passwork::MaxScore]
	 * how you use this is up to you
	 */
	public function score($s)
	{
		$score = Passwork::MaxScore
			- $this->tooShort($s)
			- $this->weakLen($s)
			- $this->noLower($s)
			- $this->noUpper($s)
			- $this->noDigit($s)
			- $this->noPunct($s)
			- $this->aRepeat($s)
			- $this->tooCommon($s)
			- $this->commonEnglishDictionaryVowelAndConsonantPattern($s)
			- $this->ssnPattern($s);
		// scale up score for very short passwords; produces more intuitive
		// and useful output than a raw score at short lengths
		if (strlen($s) <= 4)
			$score = min($score, strlen($s));
		return $score;
	}

	public function test_or_die()
	{
		$p = new Passwork();
		assert( $p->tooShort(''));
		assert( $p->weakLen(''));
		assert( $p->noLower('L'));
		assert(!$p->noLower('l'));
		assert( $p->noUpper('u'));
		assert(!$p->noUpper('U'));
		assert( $p->noDigit('d'));
		assert(!$p->noDigit('1'));
		assert( $p->noPunct('p'));
		assert(!$p->noPunct('!'));
		assert(!$p->aRepeat('r'));
		assert( $p->aRepeat('rr'));
		assert( $p->aRepeat('rere'));
		assert( $p->aRepeat('reprep'));
		assert( $p->tooCommon('1234'));
		assert(!$p->tooCommon('Uncomm0nPassword!@#$%^&'));
		assert(!$p->commonEnglishDictionaryVowelAndConsonantPattern(''));
		assert(!$p->commonEnglishDictionaryVowelAndConsonantPattern('abc'));
		assert( $p->commonEnglishDictionaryVowelAndConsonantPattern('common'));
		assert(!$p->ssnPattern(''));
		assert( $p->ssnPattern('123-45-6789'));
		assert( $p->ssnPattern('123456789'));
	}

	public function tooShort($s)
	{
		return strlen($s) < $this->MinLen;
	}

	public function weakLen($s)
	{
		return strlen($s) < $this->StrongLen;
	}

	public function noLower($s)
	{
		return strtoupper($s) == $s;
	}

	public function noUpper($s)
	{
		return strtolower($s) == $s;
	}

	public function noDigit($s)
	{
		return !preg_match('/\d/', $s);
	}

	public function noPunct($s)
	{
		return !preg_match('/(?:[^\s\w]|_)/', $s);
	}

	public function aRepeat($s)
	{
		return preg_match('/^(.{1,4})\1+$/', $s);
	}

	public function tooCommon($s)
	{
		return array_key_exists(strtolower($s), $this->BrutallyCommon);
	}

	public function commonEnglishDictionaryVowelAndConsonantPattern($s)
	{
		return preg_match('/^[^aeiou\W]{1,2}[aeiou][^aeiou\W]{1,3}[aeiou]?[^aeiou\W]{0,3}$/i', $s);
	}

	public function ssnPattern($s)
	{
		return preg_match('/^\d{3}-?\d{2}-?\d{4}$/', $s);
	}

	private $BrutallyCommon = array(
		# "1234..."
		'1234'=>1, '12345'=>1, '123456'=>1, '1234567'=>1, '12345678'=>1, '123456789'=>1, '1234567890'=>1, '654321'=>1, 'abc123'=>1, '123abc'=>1,
		# "password"
		'password'=>1, 'password1'=>1, 'passw0rd'=>1, 'drowssap'=>1, 'nopassword'=>1,
		'secret'=>1, 'letmein'=>1, 'testing'=>1, 'test'=>1, 'testest'=>1, 'test123'=>1,
		# keyboard
		'qwerty'=>1, 'qwertyu'=>1, 'qwertyui'=>1, 'qweewq'=>1, 'qazwsx'=>1, 'qweasd'=>1, 'qweasdzxc'=>1,
		'asdsa'=>1, 'asddsa'=>1, 'asdfgh'=>1, 'asdfghj'=>1, 'asdfghjk'=>1, 'asdfghjkl'=>1, '159357'=>1,
		# emo
		'love'=>1, 'iloveyou'=>1, 'lovely'=>1, 'iwantu'=>1, 'fuckyou'=>1, 'biteme'=>1, 'fuckme'=>1, 'blowme'=>1, 'helpme'=>1,
	 	'whatever'=>1, 'whocares'=>1, 'anything'=>1, 'nothing'=>1,
		# first names
		'michael'=>1, 'jordan'=>1,
		'anthony'=>1, 'austin'=>1, 'charlie'=>1, 'daniel'=>1, 'edward'=>1, 'gregory'=>1, 'george'=>1, 'joseph'=>1, 'robert'=>1, 'steven'=>1, 'thomas'=>1, 'william'=>1,
		'ashley'=>1, 'amanda'=>1, 'cameron'=>1, 'chelsea'=>1, 'jennifer'=>1, 'michelle'=>1, 'melissa'=>1, 'nicole'=>1, 'taylor'=>1,
		# last names
		'jackson'=>1, 'johnson'=>1, 'miller'=>1,
		# sports
		'baseball'=>1, 'football'=>1, 'hockey'=>1, 'soccer'=>1,
		# sports teams
		'cowboys'=>1, 'eagles'=>1, 'dolphins'=>1, 'yankees'=>1, 'lakers'=>1, 'giants'=>1, 'redsox'=>1, 'steelers'=>1, 'ranger'=>1, 'arsenal'=>1, 'liverpool'=>1,
		# oddly common
		'sex'=>1, 'god'=>1, 'monkey'=>1, 'jesus'=>1, 'cheese'=>1, 'pepper'=>1,
		# months      
		'january'=>1, 'february'=>1, 'march'=>1, 'april'=>1, 'may'=>1, 'june'=>1, 'july'=>1, 'august'=>1, 'september'=>1, 'october'=>1, 'november'=>1, 'december'=>1,
		# astrology   
		'aries'=>1, 'taurus'=>1, 'gemini'=>1, 'cancer'=>1, 'leo'=>1, 'virgo'=>1, 'libra'=>1, 'scorpio'=>1, 'sagittarius'=>1, 'capricorn'=>1, 'aquarius'=>1, 'pisces'=>1,
		# colors      
		'black'=>1, 'blue'=>1, 'orange'=>1, 'purple'=>1, 'red'=>1, 'white'=>1, 'yellow'=>1,
		# computer    
		'apple'=>1, 'computer'=>1, 'internet'=>1, 'microsoft'=>1, 'windows'=>1,
		# pop culture 
		'batman'=>1, 'superman'=>1, 'bond007'=>1, 'pokemon'=>1, 'hannah'=>1, 'tigger'=>1, 'thx1138'=>1, 'einstein'=>1,
		# nerds       
		'starwars'=>1, 'startrek'=>1, 'ncc1701'=>1, 'voyager'=>1, 'gandalf'=>1, 'merlin'=>1, 'wizard'=>1, 'knight'=>1,
		# boys        
		'master'=>1, 'shadow'=>1, 'killer'=>1, 'dragon'=>1, 'hammer'=>1,
		'bitches'=>1, 'money'=>1, 'bigdick'=>1,
		'horny'=>1, 'teens'=>1, 'amateur'=>1, 'hardcore'=>1, 'hooters'=>1, 'boobs'=>1, 'bigtits'=>1, 'panties'=>1, 'vagina'=>1, 'pussy'=>1, 'blowjob'=>1, 'cumshot'=>1, 'asshole'=>1,
		'corvette'=>1, 'mustang'=>1, 'porsche'=>1, 'camaro'=>1, 'ferrari'=>1, 'diablo'=>1, 'mercedes'=>1,
		'harley'=>1, 'yahama'=>1,
		'topgun'=>1, 'maverick'=>1,
		# girls       
		'princess'=>1, 'sunshine'=>1,
		# rednecks    
		'nascar'=>1,
		# nearby items
		'samsung'=>1, 'intel'=>1, 'dell'=>1, 'linksys'=>1, 'verizon'=>1, 'sony'=>1, 'sprint'=>1,
		'compaq'=>1, 'presario'=>1,
		'gateway'=>1, 'gateway2000'=>1,
		'hewlettpackard'=>1, 'packard'=>1, 'pavilion'=>1,
		'cocacola'=>1, 'pepsi'=>1, 'mountaindew'=>1, 'codered'=>1,
		# pop music   
		'8675309'=>1, 'blink182'=>1, 'ou812'=>1, 'rush2112'=>1,
		# famous passwd
		'joshua'=>1, 'trustno1'=>1, 'z10n0101'=>1, 'hunter'=>1, 'hunter2'=>1,
	);
}

if ($argv == array('passwork.class.php', '--test'))
{
	$p = new Passwork();
	$p->test_or_die();
	$progressivelyStrongerPasswords = array(
		'', 'a', 'aa', 'qwerty', 'abcabc', 'aaaaaaa', 'abcdabcd', 'abc123',
		'123456', '1234567',
		'michael', 'abcd!', 'not$bad', 
		'3venbetter!', 'BetterPassword9', '$str0ngPass!');
	foreach ($progressivelyStrongerPasswords as $t)
	{
		printf("%2d/%2d '%s' : %s\n",
			$p->score($t), Passwork::MaxScore, $t, $p->problem($t));
	}
}

