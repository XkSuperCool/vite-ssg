import { expect, it, describe } from 'vitest'
import babelPluginIsland from '../babel-plugin-island'
import { transformAsync } from '@babel/core'
import { MASK_SPLITTER } from '../constants'
import type { TransformOptions } from '@babel/core'

describe('babel-plugin-island', () => {
	const ISLAND_PATH = '../Com/index'
	const IMPORT_PATH = '/User/project/test.tsx'
	const babelOption: TransformOptions = {
		filename: IMPORT_PATH,
		presets: ['@babel/preset-react'],
		plugins: [babelPluginIsland]
	}

	it('Should compile jsx identifier', async () => {
		const code = `import Aside from '${ISLAND_PATH}'; export default function App() { return <Aside __island />; }`
    const result = await transformAsync(code, babelOption)
		expect(result.code).toMatchInlineSnapshot(`
			"import Aside from '../Com/index';
			export default function App() {
			  return /*#__PURE__*/React.createElement(Aside, {
			    __island: \\"../Com/index!!ISLAND!!/User/project/test.tsx\\"
			  });
			}"
		`)
	})

	it('Should compile jsx member expression', async () => {
    const code = `import A from '${ISLAND_PATH}'; export default function App() { return <A.B __island />; }`;

    const result = await transformAsync(code, babelOption);

    expect(result?.code).toContain(
      `__island: "${ISLAND_PATH}${MASK_SPLITTER}${IMPORT_PATH}"`
    );
  });
})