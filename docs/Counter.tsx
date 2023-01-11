import React from 'react'

export default function Counter() {
	const [counter, setCounter] = React.useState(0)

	return <div>
		{counter}
		<div>
			<button onClick={() => setCounter(counter + 1)}>++</button> 
		</div>
	</div>
}