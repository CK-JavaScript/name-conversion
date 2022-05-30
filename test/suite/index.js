const path = require('path');
const Mocha = require('mocha');
const glob = require('glob');

function run() {
	// 创建 mocha 测试
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			// 将文件添加到测试套件
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// 运行 mocha 测试
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}

module.exports = {
	run
};
