'use strict';

/** @typedef {import('postcss').ChildNode} ChildNode */

/**
 * Add an empty line between a node. Mutates the node.
 *
 * @param {ChildNode} node
 * @param {'\n' | '\r\n'} newline
 * @returns {ChildNode}
 */
function addEmptyLineBetween(node, newline) {
	if (node.raws.between === undefined) {
		return node;
	}

	if (!/\r?\n/.test(node.raws.between)) {
		node.raws.between += newline.repeat(2);
	} else {
		node.raws.between = node.raws.between.replace(/(\r?\n)/, `${newline}$1`);
	}

	return node;
}

module.exports = addEmptyLineBetween;
