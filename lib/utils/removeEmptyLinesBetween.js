'use strict';

/**
 * Remove empty lines between a node. Mutates the node.
 *
 * @param {import('postcss').Node} node
 * @param {'\n' | '\r\n'} newline
 */
function removeEmptyLinesBetween(node, newline) {
	node.raws.between = node.raws.between
		? node.raws.between.replace(/(\r?\n\s*\r?\n)+/g, newline)
		: '';

	return node;
}

module.exports = removeEmptyLinesBetween;
