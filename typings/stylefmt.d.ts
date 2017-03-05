declare module "stylefmt" {

	import postcss = require('postcss');

	interface IOptions {
		rules?: Object;
	}

	interface IStylefmt {
		(options?: IOptions): postcss.AcceptedPlugin;
	}

	const stylefmt: IStylefmt;
	export = stylefmt;

}
