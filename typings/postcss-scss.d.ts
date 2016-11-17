declare module 'postcss-scss' {

	interface IOptions {
		syntax?: string[];
	}

	interface IPostcssScss {
		(options?: IOptions): NodeJS.ReadWriteStream;
	}

	const postcssScss: IPostcssScss;
	export = postcssScss;

}
