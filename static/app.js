import { html, render } from './src/html.js'

import Home from './src/home.js'

const App = (props) => {
  return html`
    <${Home} />
  `
}

render(html`<${App} />`, document.body)
