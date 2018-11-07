//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Graph class
// contains all the objects
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import {MpgCollection} from './mpgCollection'
import {MpgItem, MpgItemType} from './mpgitem';
import {MpgData} from './mpgdata'
export class MpgGraph {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // data 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    coreValues: MpgCollection
    goals: MpgCollection
    data: MpgData
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor () {
        this.coreValues = new MpgCollection(MpgItemType.coreValue)
        this.goals = new MpgCollection(MpgItemType.goal)
        this.data = new MpgData()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createItem = (type: MpgItemType, name: string, pri: number): void => {
        // create different item types
        switch (type){
            case MpgItemType.coreValue:
                this.coreValues.createItem(name,pri)
                break
            case MpgItemType.goal:
                this.goals.createItem(name,pri)
                break
            default:
                console.log("MpgGraph:createItem: unexpected item type: ",type) // need a way to report and log errors
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateItem = (id: number, type: MpgItemType, name: string, pri: number): void => {
        switch (type){
            case MpgItemType.coreValue:
                this.coreValues.updateItem(id, name, pri)
                break
            case MpgItemType.goal:
                this.goals.updateItem(id, name, pri)
                break
            default:
                console.log("MpgGraph:createItem: unexpected item type: ",type) // need a way to report and log errors
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // save data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveData = () => {
        // aggreagte data from collections
        let items: MpgItem[] = []
        items = items.concat(this.coreValues.getItems())
        items = items.concat(this.goals.getItems())
        this.data.saveData(items)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get items with type
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemsWithType = (type: MpgItemType): MpgItem[] => {
        switch (type){
            case MpgItemType.coreValue:
                return this.coreValues.getItems()
                break
            case MpgItemType.goal:
                return this.goals.getItems()
                break
            default:
                console.log("MpgGraph:getItemsWithType: unexpected item type: ",type) // need a way to report and log errors
                return []
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getSumOfSiblingPri(itemType)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getSumOfItemPri = (type: MpgItemType): number => {
        switch (type){
            case MpgItemType.coreValue:
                return this.coreValues.getSumOfItemPri()
                break
            case MpgItemType.goal:
                return this.goals.getSumOfItemPri()
                break
            default:
                console.log("MpgGraph:getSumOfItemPri: unexpected item type: ",type) // need a way to report and log errors
                return 0
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item with type and id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemByTypeAndId = (type: MpgItemType, id: number): MpgItem | undefined => {
        switch (type){
            case MpgItemType.coreValue:
                return this.coreValues.getItemById(id)
                break
            case MpgItemType.goal:
                return this.goals.getItemById(id)
                break
            default:
                console.log("MpgGraph:getItemByTypeAndId: unexpected item type: ",type) // need a way to report and log errors
                return undefined
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // increate item pri
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    increaseItemPriority = (type: MpgItemType, id: number): void => {
        switch (type){
            case MpgItemType.coreValue:
                this.coreValues.increaseItemPriority(id)
                break
            case MpgItemType.goal:
                this.goals.increaseItemPriority(id)
                break
            default:
                console.log("MpgGraph:increaseItemPriority: unexpected item type: ",type) // use exception!!!
                return undefined
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // decreate item pri
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    decreaseItemPriority = (type: MpgItemType, id: number): void => {
        switch (type){
            case MpgItemType.coreValue:
                this.coreValues.decreaseItemPriority(id)
                break
            case MpgItemType.goal:
                this.goals.decreaseItemPriority(id)
                break
            default:
                console.log("MpgGraph:increaseItemPriority: unexpected item type: ",type) // use exception!!!
                return undefined
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteItem = (type: MpgItemType, id: number): void => {
        switch (type){
            case MpgItemType.coreValue:
                this.coreValues.deleteItem(id)
                break
            case MpgItemType.goal:
                this.goals.deleteItem(id)
                break
            default:
                console.log("MpgGraph:deleteItem: unexpected item type: ",type) // use exception!!!
                return undefined
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // data has been loaded function
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    dataHasBeenLoaded = (items: MpgItem[]) : void => {
        this.populateItemCollections(items)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // populate item collections
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    populateItemCollections = (items: MpgItem[]): void => {
        for(let item of items){
            switch (item.type){
                case MpgItemType.coreValue:
                    this.coreValues.addItem(item)
                    break
                case MpgItemType.goal:
                    this.goals.addItem(item)
                    break
                default:
                    console.log("MpgGraph:populateItemCollections: unexpected item type: ",item.type) // use exception!!!
                    return undefined
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadData = () : void => {
        this.data.loadData(this.dataHasBeenLoaded)
    }
}