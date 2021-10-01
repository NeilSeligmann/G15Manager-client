module.exports = {
	transpileDependencies: [
		'vuetify'
	],
	devServer: {
		port: 8081
	},
	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = 'G15 Manager';
				return args;
			})
	}
}
