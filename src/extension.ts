'use strict';

import * as vscode from 'vscode';

import { TestView } from './testView';
import axios, { AxiosResponse } from 'axios';





let clickUpDtata: any = 1

let hashmap = {}
export async function activate(context: vscode.ExtensionContext) {
	const teamDataApi = async () => {
		let teamData = await axios.get(`https://api.clickup.com/api/v2/team`, {
		  headers: { Authorization: "" },
		});
		return teamData.data.teams;
	  };
	
	  const spaceDataApi = async (id) => {
		let spaceData = await axios.get(
		  `https://api.clickup.com/api/v2/team/${id}/space?archived=false`,
		  {
			headers: {
			  Authorization: "",
			},
		  }
		);
		return spaceData.data.spaces;
	  };
	
	  const listDataApi = async (id) => {
		  
		let listData = await axios.get(
		  `https://api.clickup.com/api/v2/space/${id}/list?archived=false`,
		  {
			headers: {
			  Authorization: "",
			},
		  }
		);
		return listData.data.lists
	  
	  };
	
	  const teamData = await teamDataApi();
	  teamData.forEach(element => {
		  element.parent_id = "0"
	  });
	  const spaceData = new Array()
	  const listData = new Array()
	
		await Promise.all(
	
		teamData.map(async (el) => {
		  const res = await spaceDataApi(el.id);
	  
		  await Promise.all(
			res.map(async (element) => {
			element.parent_id = el.id;
			spaceData.push(element)
			const resList = await listDataApi(element.id);
	
			resList.map((listItem)=>{
				listItem.parent_id = element.id;
				listData.push(listItem)
			})
		  }))
		  
		})
	  );
	
	//   console.log("teamDataApi", teamData);
	//   console.log("spaceDataApi", spaceData);
	//   console.log("listDataApi", listData);
	  console.log("--------",[...teamData, ...spaceData, ...listData].length)
	
	  function list_to_tree(list) {
		var map = {}, node, roots = [], i;
		
		for (i = 0; i < list.length; i += 1) {
		  map[list[i].id] = i; // initialize the map
		  list[i].children = []; // initialize the children
		//   console.log(map)
		}
		console.log(map)
		for (i = 0; i < list.length; i += 1) {
		  node = list[i];
		  if (node.parent_id !== "0") {
			// if you have dangling branches check that map[node.parentId] exists
			list[map[node.parent_id]].children.push(node);
		  } else {
			roots.push(node);
		  }
		}
		return roots;
	  }
	const allArray = [...teamData, ...spaceData, ...listData]
	clickUpDtata = list_to_tree(allArray);	

	allArray.forEach((el)=>{
		hashmap[el.id] = []
	})
	Object.keys(hashmap).forEach((key)=>{
		allArray.forEach((el)=>{
			if(el.parent_id === key)
			hashmap[key].push(`${el.name}-${el.id}`)
		})
	})

	new TestView(context);




}




export {clickUpDtata}
export {hashmap}
