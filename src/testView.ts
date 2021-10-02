import * as vscode from 'vscode';
import { clickUpDtata, hashmap } from './extension';
export class TestView {
	constructor(context: vscode.ExtensionContext) {
		console.log('aayush', hashmap, clickUpDtata);
		const view = vscode.window.createTreeView('testView', {
			treeDataProvider: aNodeWithIdTreeDataProvider(),
			showCollapseAll: true,
		});
		context.subscriptions.push(view);
	}
}

const nodes = {};

function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
	return {
		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren(element ? element.key : undefined).map((key) => getNode(key));
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.key);
			console.log('this is element', element);
			treeItem.id = element.key;
			return treeItem;
		},
	};
}

function getChildren(key: string): string[] {
	console.log('getChildren-key', key);
	let rootArray = new Array();
	if (!key) {
		clickUpDtata.forEach((el) => {
			rootArray.push(`${el.name}-${el.id}`);
		});
		return rootArray;
	}
	console.log('qwertyuio', key);
	const id = key.slice(key.lastIndexOf('-') + 1);

	if (hashmap[id].length) {
		return hashmap[id];
	}
	return [];
}

function getTreeItem(key: string): vscode.TreeItem {
	const id = key.slice(key.lastIndexOf('-') + 1);

	const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);

	return {
		label: { label: key.slice(0, key.lastIndexOf('-')) },
		tooltip,
		collapsibleState: hashmap[id].length
			? vscode.TreeItemCollapsibleState.Collapsed
			: vscode.TreeItemCollapsibleState.None,
	};
}

function getNode(key: string): { key: string } {
	if (!nodes[key]) {
		nodes[key] = new Key(key);
	}
	console.log('getNode-return-key', key);
	return nodes[key];
}

class Key {
	constructor(readonly key: string) {}
}
