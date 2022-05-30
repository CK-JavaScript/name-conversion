const assert = require('assert');

// 您可以从“vscode”模块导入和使用所有 API
// 以及导入你的扩展来测试它
const vscode = require('vscode');
// const myExtension = require('../extension');

suite('扩展测试套件', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('范例测试', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
