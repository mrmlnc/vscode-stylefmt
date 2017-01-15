declare module "stylefmt" {

	import postcss = require('postcss');

	interface IOptions {
		rules?: Object;
	}

	interface IStylefmt {
		(options?: IOptions): typeof postcss.default.acceptedPlugin;
	}

	const stylefmt: IStylefmt;
	export = stylefmt;

}
