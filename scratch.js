// function search (tree, value, key = 'id', reverse = false) {
// 	console.log("search", value)
// 	const stack = tree
// 	while (stack.length) {
// 	  const node = stack[reverse ? 'pop' : 'shift']()
// 	  if (node[key] === value) return node
// 	  node.children && stack.push(...node.children)
// 	}
// 	return null
// }