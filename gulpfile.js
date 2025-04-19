const path = require('path');
const { task, src, dest, series } = require('gulp');

function copyNodeIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');
	return src(nodeSource).pipe(dest(nodeDestination));
}

function copyCredentialIcons() {
	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');
	return src(credSource).pipe(dest(credDestination));
}

function copyAssetIcons() {
	const assetSource = path.resolve('assets', 'icons', '**', '*.{png,svg}');
	const assetDestination = path.resolve('dist', 'assets', 'icons');
	return src(assetSource).pipe(dest(assetDestination));
}

task('build:icons', series(copyNodeIcons, copyCredentialIcons, copyAssetIcons));
