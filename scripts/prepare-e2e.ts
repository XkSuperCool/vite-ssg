import path from 'path'
import fse from 'fs-extra'
import * as execa from 'execa'

const root = path.join(__dirname, '../')
const exampleDir = path.resolve(__dirname, '../e2e/playground/basic')
const defaultExecaOpts = {
	stdout: process.stdout,
	stdin: process.stdin,
	stderr: process.stderr
}

async function preareE2E() {
	if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
		execa.execaCommandSync('pnpm build', {
			cwd: root
		})
	}

	execa.execaCommandSync('npx playwright install', {
		cwd: root,
		...defaultExecaOpts
	})

	execa.execaCommandSync('pnpm i', {
		cwd: exampleDir,
		...defaultExecaOpts
	})

	execa.execaCommandSync('pnpm dev', {
		cwd: exampleDir,
		...defaultExecaOpts
	})
}

preareE2E()
