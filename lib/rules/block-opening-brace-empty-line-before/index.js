// @ts-nocheck

'use strict';

const addEmptyLineBetween = require('../../utils/addEmptyLineBetween');
const beforeBlockString = require('../../utils/beforeBlockString');
const blockString = require('../../utils/blockString');
const hasBlock = require('../../utils/hasBlock');
const hasEmptyBlock = require('../../utils/hasEmptyBlock');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isSingleLineString = require('../../utils/isSingleLineString');
const optionsMatches = require('../../utils/optionsMatches');
const removeEmptyLinesBetween = require('../../utils/removeEmptyLinesBetween');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'block-opening-brace-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before opening brace',
	rejected: 'Unexpected empty line before opening brace',
});

/**
 * @typedef {import('stylelint').StylelintRule} StylelintRule
 * @typedef {import('postcss').Rule} Rule
 */

/** @type StylelintRule */
function rule(expectation, options, context) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: expectation,
			possible: ['always-multi-line', 'never'],
		});

		if (!validOptions) {
			return;
		}

		// Check both kinds of statements: rules and at-rules
		root.walkRules(check);
		root.walkAtRules(check);

		/**@param {Rule} statement */
		function check(statement) {
			// Return early if blockless or has empty block
			if (!hasBlock(statement) || hasEmptyBlock(statement)) {
				return;
			}

			// Get whitespace before "{"
			const before = beforeBlockString(statement);

			// Calculate index
			const statementLength = statement.toString().length;

			const selectorLength = statementLength - blockString(statement).length;

			// -1 to underline \n before "{"
			let index = selectorLength - 1;

			if (statementLength[index] === '\t') {
				index -= 1;
			}

			// if (statementLength[index] === '\r') {
			// 	index += 1;
			// }

			// Set expectation
			const expectEmptyLineBefore = (() => {
				const childNodeTypes = statement.nodes.map((item) => item.type);

				if (
					optionsMatches(options, 'except', 'after-closing-brace') &&
					statement.type === 'atrule' &&
					!childNodeTypes.includes('decl')
				) {
					return expectation === 'never';
				}

				return Boolean(
					expectation === 'always-multi-line' && !isSingleLineString(blockString(statement)),
				);
			})();

			// Check for at least one empty line
			const hasEmptyLineBefore = hasEmptyLine(before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			if (context.fix) {
				if (expectEmptyLineBefore) {
					addEmptyLineBetween(statement, context.newline);
				} else {
					removeEmptyLinesBetween(statement, context.newline);
				}

				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;

			report({
				message,
				result,
				ruleName,
				node: statement,
				index,
			});
		}
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
