//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data class that deals with all things data           
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import {MpgItem, IItemData, MpgItemType} from "./mpgitem"
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// All items json object
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IItems {
    items: IItemData[]
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// class Mpg Data
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgData {
    private items: MpgItem[]
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor () {
        this.items = []
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadData = (dataHasBeenLoadedFun: Function) => {
        fetch('/items')
        .then(res => res.json())
        .then(items => {
            this.setItems(items)
            dataHasBeenLoadedFun(this.items)})
        .catch((reason: any)=>{console.log("reason:",reason)})
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Set Items
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    private setItems(fetchedItems: IItems){
        let itemsData: IItemData[] = fetchedItems.items
        let items: MpgItem[] = []
        itemsData.map(itemsData => {
            let newItemType = this.getMpgItemType(itemsData.type)
            //todo: investigate: should use create item
            items.push(new MpgItem(itemsData.id, newItemType, itemsData.name, itemsData.priority))
        })
        this.items = items
      }    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // save data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveData = (items: MpgItem[]) => {
        // create items data
        let itemsData: IItemData[] = []
        let itemData: IItemData
        for(let item of items){
            let itemTypeString = this.getItemTypeString(item.getType())
            itemData = {id: item.getId(), type: itemTypeString, name: item.getName(), priority: item.getPriority()}
            itemsData.push(itemData)
        }
        let allItems: IItems = {items: itemsData}
        // console.log("allItems:",JSON.stringify(allItems));
        
        fetch('/items',{
          method: 'post',
          headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
          body: JSON.stringify(allItems)
        })
        .then(res => { res.json()})
        .catch((reason: any)=>{console.log("reason:",reason)})
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item type as a string
    // todo: consider a better implementation
    // todo: consider moving to item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemTypeString = (typeEnum: MpgItemType): string =>{
        switch (typeEnum){
            case MpgItemType.item:
                return 'item'
            case MpgItemType.coreValue:
                return 'corevalue'
            case MpgItemType.goal:
                return 'goal'
            case MpgItemType.project:
                return 'project'
            case MpgItemType.task:
                return 'task'
            default:
                console.log("MpgData:getItemTypeString: unknow MpgItemType",typeEnum);
                return 'item'
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getMpgItemType
    // maps from the string of type type enum
    // todo: should consider a better implementation with dictionary with symbols keys
    // todo: consider moving to MpgItem class
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getMpgItemType = (typeString: string): MpgItemType =>{
        switch (typeString){
            case 'item':
                return MpgItemType.item
            case 'corevalue':
                return MpgItemType.coreValue
            case 'goal':
                return MpgItemType.goal
            case 'project':
                return MpgItemType.project
            case 'task':
                return MpgItemType.task
            default:
                console.log("MpgData:ggetMpgItemType: unknow item type string",typeString);
                return MpgItemType.coreValue
        }
    }
}