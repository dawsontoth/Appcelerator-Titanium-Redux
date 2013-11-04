#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import os, re

def compile(config):
	print "[INFO] Redux :: Plugin Loaded :: ", config
	if 'app_dir' in config:
		findRJSS(config['app_dir'])
	else:
		findRJSS(os.path.join(config['project_dir'], "Resources"))

def findRJSS(currentDirectory):
	if os.path.exists(currentDirectory) == False:
		print "[INFO] Redux :: Directory Not Found, Skipping :: ", currentDirectory
		return
	for i in os.listdir(currentDirectory):
		path = os.path.join(currentDirectory, i)
		if os.path.isfile(path):
			if path.endswith('.rjss'):
				compileRJSS(path)
		else:
			findRJSS(path)

def compileRJSS(path):
	rjss = re.sub('[\r\t\n]', ' ', open(path, 'r').read())
	compileRJSS.result = ''
	compileRJSS.braceDepth = 0
	compileRJSS.inComment = False
	compileRJSS.inVariable = False
	compileRJSS.inSelector = False
	compileRJSS.inAttributeBrace = False
	compileRJSS.canStartSelector = True
	compileRJSS.canBeAttributeBrace = False
	
	for i in range(0, len(rjss)):
		if (compileRJSS.inComment):
			if (rjss[i] == '/' and rjss[i - 1] == '*'):
				compileRJSS.inComment = False
			continue
		
		def dollar():
			if (compileRJSS.braceDepth > 0):
				compileRJSS.result += '$'
			else:
				compileRJSS.canStartSelector = False
				compileRJSS.inVariable = True
				compileRJSS.result += 'var $'
		
		def semiColon():
			if (compileRJSS.inVariable):
				compileRJSS.canStartSelector = True
				compileRJSS.inVariable = False
			compileRJSS.result += ';'
		
		def space():
			compileRJSS.result += ' '
		
		def slash():
			compileRJSS.inComment = rjss[i+1] == '*'
			compileRJSS.result += '' if compileRJSS.inComment else '/'
		
		def leftBracket():
			if (compileRJSS.braceDepth > 0):
				compileRJSS.result += '['
			else:
				compileRJSS.canStartSelector = False
				compileRJSS.result += 'if ('
		
		def equals():
			if (compileRJSS.inVariable):
				compileRJSS.result += ';'
			else:
				compileRJSS.result += '==' if (rjss[i - 1] != '!' and rjss[i - 1] != '<' and rjss[i - 1] != '>') else '='
		
		def rightBracket():
			if (compileRJSS.braceDepth > 0):
				compileRJSS.result += ']'
			else:
				compileRJSS.canStartSelector = True
				compileRJSS.result += ')'
				compileRJSS.canBeAttributeBrace = True
		
		def leftBlock():
			if (compileRJSS.canBeAttributeBrace):
				compileRJSS.canBeAttributeBrace = False
				compileRJSS.inAttributeBrace = True
			else:
				if (compileRJSS.inSelector):
					compileRJSS.inSelector = False
					compileRJSS.result += '",'
				compileRJSS.braceDepth += 1
			compileRJSS.result += '{'
		
		def rightBlock():
			compileRJSS.braceDepth -= 1
			compileRJSS.result += '}'
			if compileRJSS.braceDepth == 0:
				compileRJSS.result += ');'
				compileRJSS.canStartSelector = True
			elif compileRJSS.braceDepth == -1:
				compileRJSS.inAttributeBrace = False
				compileRJSS.braceDepth = 0
		
		def default():
			compileRJSS.canBeAttributeBrace = False
			if (compileRJSS.braceDepth == 0 and compileRJSS.canStartSelector):
				compileRJSS.canStartSelector = False
				compileRJSS.inSelector = True
				compileRJSS.result += '\nredux.fn.setDefault("'
			compileRJSS.result += rjss[i]
		
		switch = {
			'$': dollar,
			';': semiColon,
			' ': space,
			'/': slash,
			'[': leftBracket,
			'=': equals,
			']': rightBracket,
			'{': leftBlock,
			'}': rightBlock
		}
		
		if rjss[i] in switch:
			switch[rjss[i]]()
		else:
			default()
	
	print "[INFO] Redux :: Successfully Compiled RJSS ::  %s.compiled" % path
	open("%s.compiled" % path, 'w').write(compileRJSS.result)