'use strict';

import * as vscode from 'vscode';

import { TestView } from './testView';
import axios, { AxiosResponse } from 'axios';

const listDataApi = async () =>{
	let listData = await axios.get(`https://api.clickup.com/api/v2/team`,
	{ headers: {'Authorization': 'pk_3344635_OKQECX1X18DADHGYTS13GY1UI8C8SCH7'}});
	return listData.data.teams
}

const spaceDataApi = async (id) =>{
	let spaceData = await axios.get(`https://api.clickup.com/api/v2/team/3381588/space?archived=false`,
	{ headers: {'Authorization': 'pk_3344635_OKQECX1X18DADHGYTS13GY1UI8C8SCH7'}});
	return spaceData.data.spaces
}
const tree = {}
export async function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
		
	const listData = await listDataApi()
	const spaceData = await Promise.all(listData.map(async (el)=> {
		const res = await spaceDataApi(el.id)
		res.forEach(element => {
			element.parent_id = el.id
		});
		return res;
	}));
	listData.forEach(element => {
		tree[element.name] = {id: {}}
	});
	console.log("list,space",listData,spaceData)
	// Test View
	new TestView(context);

	

}


export {tree}