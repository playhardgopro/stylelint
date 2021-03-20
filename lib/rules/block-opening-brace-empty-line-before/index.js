// @ts-nocheck

'use strict';

const addEmptyLineBetween = require('../../utils/addEmptyLineBetween');
const beforeBlockString = require('../../utils/beforeBlockString');
const blockString = require('../../utils/blockString');
const hasBlock = require('../../utils/hasBlock');
const hasEmptyBlock = require('../../utils/hasEmptyBlock');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isSingleLineString = require('../../utils/isSingleLineString');
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
			const statementString = statement.toString();

			let index = statementString - blockString(statement).toString().length;

			// if (statementString[index - 1] === '\r') {
			// 	index -= 1;
			// }

			// Set expectation
			const expectEmptyLineBefore = (() => {
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
