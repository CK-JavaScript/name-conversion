// 模块 'vscode' 包含 VS Code 可扩展性 API
// 导入模块并在下面的代码中使用别名 vscode 引用它
const vscode = require('vscode')

// 指令集合
const commands = {
	camelCase: '小驼峰写法 (驼峰命名法)',
	upperCamelCase: '大驼峰写法 (帕斯卡命名法)',
	snake: '蛇形写法 (下划线命名法)',
	hyphen: '连字符写法 (中划线命名法)',
	constant: '常量名',
	lowercaseBlank: '小写空格写法 (空格命名法)',
	uppercaseBlank: '大写空格写法 (空格命名法)'
}

// 这个方法在你的扩展被激活时被调用，你的扩展在第一次执行命令时被激活
function activate(context) {
	for (const commandId in commands) {
		let id = vscode.commands.registerCommand(`name-conversion.${commandId}`, function () {
			replace(commandId)
		})
		context.subscriptions.push(id)
	}
}


/**
 * @description:
 * @param {*} str
 * @return {*}
 */
function isNoEmpty(str) {
	return str !== ''
}

/**
 * @description: 将名称根据指定的指令转化为指定的名称
 * @param {*} text: 要转化的文本
 * @return {*} 转化后的文本
 */
class Conversion {
	constructor(text) {
		this.text = text
		let nameSplit = [];
		// 如果字符串包含 "-", "_", " " 则按照这些字符分割
		['-', '_', ' '].forEach((splitter) => {
			if (text.indexOf(splitter) > 0) {
				nameSplit = text.split(splitter)
			}
		})
		// 如果不包含以上字符，则按照大小写字母分割
		if (nameSplit.length <= 0) {
			nameSplit = text.match(/(^[A-Z]|^|[A-Z])([a-z]+)?/g)
		}
		this.nameSplit = nameSplit.join('-').toLocaleLowerCase().split('-')
	}
	camelCase() {
		let str = this.nameSplit[0]
		for (let i = 1; i < this.nameSplit.length; i++) {
			let strArr = this.nameSplit[i].split('')
			strArr[0] = strArr[0].toUpperCase()
			str += strArr.join('')
		}
		return str
	}
	upperCamelCase() {
		let str = ''
		for (let i = 0; i < this.nameSplit.length; i++) {
			let strArr = this.nameSplit[i].split('')
			strArr[0] = strArr[0].toLocaleUpperCase()
			str += strArr.join('')
		}
		return str
	}
	snake() {
		return this.nameSplit.join('_')
	}
	hyphen() {
		return this.nameSplit.join('-')
	}
	constant() {
		return this.nameSplit.join('_').toLocaleUpperCase()
	}
	lowercaseBlank() {
		return this.nameSplit.join(' ')
	}
	uppercaseBlank() {
		return this.nameSplit.join(' ').toLocaleUpperCase()
	}
}

/**
 * @description: 替换字符
 * @param {*} commandId: 指令名称
 */
function replace(commandId) {
	const editor = vscode.window.activeTextEditor
	const selection = editor.selection
	const text = editor.document.getText(selection)
	const t = new Conversion(text)[commandId]()
	if (isNoEmpty(t)) {
		editor.edit((edit) => {
			editor.selections.forEach((v) => edit.replace(v, t))
		}).then((success) => {
			if (!success) {
				vscode.window.showInformationMessage(vscode.window.showInformationMessage(`😣 转换失败！`))
			}
		})
	}
}

module.exports = {
	activate
}
