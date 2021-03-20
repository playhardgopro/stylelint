'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a\r\n\r\n{\r\ncolor: pink;\r\n}',
		},
		{
			code: 'a\n \n{ \ncolor: pink; \n }',
		},
		{
			code: 'a\n \n { \ncolor: pink; \n }',
		},
		{
			code: 'a\r\n \r\n { \r\ncolor: pink; \r\n }',
		},
		{
			code: 'a\n\t\n { \ncolor: pink; \n }',
		},
		{
			code: 'a\n\t \n{ \ncolor: pink; \n }',
		},
		{
			code: 'a \n{ color: pink; }',
		},
		{
			code: 'a \r\n{color: pink;}\r\n',
		},
		{
			code: 'a \n{ color: pink;}b { color: red;}',
		},
		{
			code: 'a \n\n\n\n{color: pink;\n}',
			description: 'one *or more* empty lines are allowed',
		},
		{
			code: '@media print \n\n{\n  a \n\n  {\n     color: pink;}}',
			description: 'indentation after the newline before the opening braces',
		},
		{
			code:
				'@media print \n\n{\n\ta \n\n\t\t{\n\t\tcolor: pink;\n\t\t&:hover\n\n\t\t\t{\n\t\t\tcolor: red;}}}',
			description:
				'3 level deep nesting with indentation after the newline before the opening braces',
		},
	],
	reject: [
		{
			code: 'a {\ncolor: pink;\n}',
			fixed: 'a \n\n{\ncolor: pink;\n}',
			message: messages.expected,
			line: 1,
			column: 1,
		},
		{
			code: 'a\n{\ncolor: pink;\n}',
			fixed: 'a\n\n{\ncolor: pink;\n}',
			message: messages.expected,
			line: 1,
			column: 1,
		},
		{
			code: 'a\r\n{\r\ncolor: pink;\r\n}',
			fixed: 'a\r\n\r\n{\r\ncolor: pink;\r\n}',
			message: messages.expected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \n { \ncolor: pink; \n }',
			fixed: 'a \n\n { \ncolor: pink; \n }',
			message: messages.expected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \r\n { \r\ncolor: pink; \r\n }',
			fixed: 'a \r\n\r\n { \r\ncolor: pink; \r\n }',
			message: messages.expected,
			line: 1,
			column: 1,
		},
		{
			code: 'a\t\n { \ncolor: pink; \n }',
			fixed: 'a\t\n\n { \ncolor: pink; \n }',
			message: messages.expected,
			line: 1,
			column: 1,
		},
		{
			code: 'a\n\t { \ncolor: pink; \n }',
			fixed: 'a\n\n\t { \ncolor: pink; \n }',
			message: messages.expected,
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: 'a \n{ color: pink; }',
		},
		{
			code: 'a \r\n{ color: pink;\n}',
		},
		{
			code: 'a { color: pink;}',
		},
		{
			code: 'a \n{ color: pink;}b \n{ color: red;}',
		},
		{
			code: '@media print \n{\n  a {\n     color: pink;\n  }\n}',
			description: 'indentation after the newline before the opening braces',
		},
		{
			code:
				'@media print {\n\ta {\n\t\tcolor: pink;\n\t\t&:hover{\n\t\t\tcolor: red;\n\t\t\t}\n\t\t}\n}',
			description:
				'3 level deep nesting with indentation after the newline before the opening braces',
		},
	],

	reject: [
		{
			code: 'a \n\n{ color: pink;}',
			fixed: 'a \n{ color: pink;}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \r\n\r\n{ color: pink;}',
			fixed: 'a \r\n{ color: pink;}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \n\n\t{ color: pink;}',
			fixed: 'a \n\t{ color: pink;}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \r\n\r\n  { color: pink;}',
			fixed: 'a \r\n  { color: pink;}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \n\n { color: pink;}',
			fixed: 'a \n { color: pink;}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \n\n\n\n {\ncolor: pink;\n}',
			fixed: 'a \n {\ncolor: pink;\n}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a \t\n\n{\n\ncolor: pink;\n\n}',
			fixed: 'a \t\n{\n\ncolor: pink;\n\n}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media print \r\n\r\n{\n  a \r\n\r\n{\n     color: pink;\n  }\n}',
			fixed: '@media print \r\n{\n  a \r\n{\n     color: pink;\n  }\n}',
			warnings: [
				{
					message: messages.rejected,
					line: 4,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 1,
				},
			],
		},
		{
			code: 'a \n\n\t{\n\ncolor: pink;\n\n/* comment here */\n}',
			fixed: 'a \n\t{\n\ncolor: pink;\n\n/* comment here */\n}',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});
