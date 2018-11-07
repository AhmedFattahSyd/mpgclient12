import * as React from 'react';
import { WithStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import {Theme} from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import {CssBaseline} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import {IconButton} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
// import MenuIcon from '@material-ui/icons/Menu'
// import {Paper} from '@material-ui/core'
import {List, ListItem, ListItemText} from '@material-ui/core'
import {Card, CardContent, CardActionArea} from '@material-ui/core'
// import {Button} from '@material-ui/core'
import {MpgItemType} from './mpgitem'
// import {IconButton} from '@material-ui/core'
import {TextField} from '@material-ui/core'
import {MpgGraph} from './mpggraph'
import {ListItemIcon} from '@material-ui/core'
///////////////////////////////////////////////////////////////////////////////////////////////
// define styles
// consider moving these to a seaparte file
///////////////////////////////////////////////////////////////////////////////////////////////
const drawerWidth = 240;    // find a better place to initialise and maintain this and other constants!
const styles = ({ zIndex, spacing, mixins }: Theme) => createStyles({
  root: {
  },
  appBar: {
    zIndex: zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
  toolbar: mixins.toolbar,
  menuButton: {
    marginLeft: -2,
    marginRight: 2,
  },
  iconLeft: {
    margin: spacing.unit * 2,
    marginLeft: 'auto',
  },
  iconRight: {
    margin: spacing.unit * 2,
    marginRight: 'auto',
  },
  iconHover: {
    margin: spacing.unit * 2,
    '&:hover': {
      color: red[800],
    },
  },
  item: {
    backgroundColor: '#E8E8E8',
    margin: '2px'
  },
  bodyDiv: {
    display: 'flex',
  },
  nameTextField: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit,
    width: "90%",
  },
  priorityTextField: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit,
    width: "5%",
  },
  appStatus: {
    position: 'absolute',
    bottom: 0,
    margin: spacing.unit,
    width: '80  %',
  },
  card: {
    minWidth: 275,
  },
});
///////////////////////////////////////////////////////////////////////////////////////////////
// enum for current page
///////////////////////////////////////////////////////////////////////////////////////////////
enum CurrentPage {
  home,
  list,
  details
}
///////////////////////////////////////////////////////////////////////////////////////////////
// enum for menuSelection
///////////////////////////////////////////////////////////////////////////////////////////////
enum MenuSelection {
  values,
  goals,
  projects
}
///////////////////////////////////////////////////////////////////////////////////////////////
// editing action
///////////////////////////////////////////////////////////////////////////////////////////////
enum EditAction {
  create,
  edit
}
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IAppProps extends WithStyles<typeof styles> {}
interface IAppState {
  currentPage: CurrentPage,
  currentMenuSelection: MenuSelection,
  editAction: EditAction,
  newItemName: string,
  editCreatePageTitle: string,
  itemPriority: number,
  graph: MpgGraph,
  selectedItemId: number, //is it possible thta the selected index can be undefined? investigate
}
class MpgApp extends React.Component<IAppProps,IAppState> {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: IAppProps){
    super(props)
    this.state = {
      currentPage: CurrentPage.home,
      currentMenuSelection: MenuSelection.values,
      editAction: EditAction.create,
      newItemName: "New item name",
      editCreatePageTitle: "Add New Item",
      itemPriority: 1,
      graph: new MpgGraph(),
      selectedItemId: -1,
      }
    }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // rendering code
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render() {
    const {classes} = this.props as IAppProps
    return (
      <div className={classes.root}>
      <CssBaseline />
        {this.getCurrentPage()}
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // getCurrentpage
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentPage = () => {
    switch (this.state.currentPage){
      case CurrentPage.home:
        return this.getHomePage()
      case CurrentPage.list:
        return this.getListPage()
      case CurrentPage.details:
        return this.getDetailsPage()
      default:
      return this.getHomePage()
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get home page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getHomePage = () => {
    const {classes} = this.props as IAppProps
    // todo: define data structure for card data and use map to display
    
    const cardWidth = 150

    return (
      <div>
         <AppBar position="fixed" className={classes.appBar}>
         <Toolbar style={{display: 'flex', justifyContent:'space-between'}}>
            <Icon>
                settings
            </Icon>
            <Typography variant="title" color="inherit">
              My Personal Graph
            </Typography>
            <Icon>
              search
            </Icon>
        </Toolbar>
        </AppBar>
        <div style={{paddingTop:59}}>
        <div style={{display: 'flex', justifyContent:'space-around', padding:10,
        flexWrap: 'wrap'}}>
        
        <Card style={{maxWidth: cardWidth, minWidth: cardWidth, margin:10}}>
          <CardActionArea onClick={this.handleCoreValuesClick}>
            <CardContent>
                <Icon >
                  my_location
                  </Icon>
                <Typography variant="h6" component="h2">
                  Core Values
                </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card style={{maxWidth:cardWidth, minWidth: cardWidth, margin:10}}>
          <CardActionArea onClick={this.handleGoalsClick}>
          <CardContent>
          <Icon >
                navigation
                </Icon>
              <Typography variant="h6" component="h2">
                Goals
              </Typography>
          </CardContent>
          </CardActionArea>
        </Card>

        </div>
        </div>
        </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // list page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getListPage = () => {
    const {classes} = this.props as IAppProps
    let itemType = this.getCurrentItemType()
    return(
      <div>
         <AppBar position="fixed" className={classes.appBar}>
         <Toolbar style={{display: 'flex', justifyContent:'space-between'}}>
            <Icon onClick={this.handleHomeClick}>
                home
            </Icon>
            <Typography variant="title" color="inherit">
              {this.getCurrentListPageTitle()}
            </Typography>
            <Icon onClick={this.handleAddClick}>
              add_circle
            </Icon>
        </Toolbar>
        </AppBar>
        <div>
          <List style={{paddingTop:60}}>
            {this.state.graph.getItemsWithType(itemType).map((item)=>(
              <ListItem button key = {item.getId()} className={classes.item}
                selected={this.state.selectedItemId === item.getId()}
                onClick={() => this.setState({selectedItemId: item.getId()})}>
                <ListItemText primary={item.getName()} 
                  secondary={"Priority: "+item.getAllPriorityText(this.state.graph.getSumOfItemPri(itemType))}/>
                <ListItemIcon>
                  <Icon onClick={event => this.handleEditItemEvent(event,item.getId())}>
                  edit
                  </Icon>
                </ListItemIcon>
                <ListItemIcon>
                  <Icon onClick={event => this.handleIncreasePriority(event,item.getId())}>
                  keyboard_arrow_up
                  </Icon>
                </ListItemIcon>
                <ListItemIcon>
                  <Icon onClick={event => this.handleDecreasePriority(event,item.getId())}>
                  keyboard_arrow_down
                  </Icon>
                </ListItemIcon><ListItemIcon>
                  <Icon onClick={event => this.handleItemDelete(event,item.getId())}>
                  delete
                  </Icon>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // details page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getDetailsPage = () => {
    const {classes} = this.props as IAppProps
    // set title according to the selected item type
    return(
      <div>
         <AppBar position="fixed" className={classes.appBar}>
         <Toolbar style={{display: 'flex', justifyContent:'space-between'}}>
            <Icon onClick={this.handleDetailsCancel}>
                cancel
            </Icon>
            <Typography variant="title" color="inherit">
              {this.state.editCreatePageTitle}
            </Typography>
            <Icon onClick={this.handleSave}>
              save
            </Icon>
        </Toolbar>
        </AppBar>
        <div style={{paddingTop:59}}>
          <div>
            <TextField
              id="itemName"
              label="Name"
              className={classes.nameTextField}
              value={this.state.newItemName}
              onChange={this.handleNewTaskChange}
              margin="normal"
            />
            <TextField
            id="itemPriority"
            label="Priority"
            className={classes.priorityTextField}
            value={this.state.itemPriority}
            onChange={this.handleItemPriorityChange}
            margin="normal"
            />
          </div>
        </div>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // utitility methos
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get current item type
  ///////////////////////////////////////////////////////////////////////////////////////////////
  private getCurrentItemType = (): MpgItemType => {
    switch (this.state.currentMenuSelection){
      case MenuSelection.values:
        return MpgItemType.coreValue
      case MenuSelection.goals:
        return MpgItemType.goal
      default:
        console.log('MpgApp:getCurrentItemType: unexpected currentMenuSelection:',this.state.currentMenuSelection);
        
        return MpgItemType.item
    }
  }   
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get current selection in a string (to be used in titles, etc)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentSelectionText = () => {
    switch (this.state.currentMenuSelection){
      case MenuSelection.values:
        return "Core Value"
      case MenuSelection.goals:
        return "Goal"
      default:
        //todo: throw exception here
        return "Item"
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get current list page title
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentListPageTitle = () : string => {
    switch (this.state.currentMenuSelection){
      case MenuSelection.values:
        return "My Core Value"
      case MenuSelection.goals:
        return "My Goals"
      default:
        return "Items"
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // event handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle core value click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCoreValuesClick = () => {
    this.setState({currentMenuSelection: MenuSelection.values})
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle goals click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleGoalsClick = () => {
    this.setState({currentMenuSelection: MenuSelection.goals})
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle home buttom click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleHomeClick = () => {
    this.setState({currentPage: CurrentPage.home})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle add item click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddClick = () => {
    this.setState({editAction: EditAction.create})
    this.setState({currentPage: CurrentPage.details})
    // set new item name according to the current selection 
    this.setState({newItemName: "New " + this.getCurrentSelectionText()})
    this.setState({editCreatePageTitle: "New " + this.getCurrentSelectionText()})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle cancel buttom in details page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleDetailsCancel = () => {
    //the type of selection of value, goals, etc should be still valid
    // we may have to do some other cleaning actions such as reset new item name
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // hanndle save buttom
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSave = () => {
    let itemType = this.getCurrentItemType()
    switch (this.state.editAction){
      case EditAction.create:
        // add new item
        // this should be delegated to mpgData
        //this.state.data.items.push(new Item(-1, this.state.newItemName, this.state.itemPriority))
        this.state.graph.createItem(itemType, this.state.newItemName, this.state.itemPriority)
        this.state.graph.saveData()
        break

      case EditAction.edit:
        console.log("Saving updates. idex, name and pri:",this.state.selectedItemId, this.state.newItemName,
        this.state.itemPriority)
        this.state.graph.updateItem(this.state.selectedItemId, itemType, this.state.newItemName,
          this.state.itemPriority)
        this.state.graph.saveData()
        break

      default:
        //should not happen
        // decide if you should handle things that cannot happend
        break
    }
    // set current page to list
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item name change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleNewTaskChange = (event: React.ChangeEvent ) =>{
    this.setState({newItemName: (event.target as HTMLInputElement).value})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item priority change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemPriorityChange = (event: React.ChangeEvent ) =>{
    const newPriority = parseInt((event.target as HTMLInputElement).value)
    if((newPriority != NaN) && newPriority > 0){
     this.setState({itemPriority: newPriority})
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle listItem click event
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleEditItemEvent = (event: React.MouseEvent, id: number) => {
    // set new item name to the currently selected item 
    const currentItem = this.state.graph.getItemByTypeAndId(this.getCurrentItemType(),id)
    if(currentItem != undefined){
      this.setState({newItemName: currentItem.getName()})
      this.setState({itemPriority: currentItem.getPriority()})
      this.setState({editCreatePageTitle: "Edit " + this.getCurrentSelectionText()})
      this.setState({editAction: EditAction.edit})
      this.setState({currentPage: CurrentPage.details})
      // record the id so we know which which item to update
      this.setState({selectedItemId: id})
    } else {
      console.log('MpgApp:handleEditItemEvent: item is undefined. Id:',id);
      
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle increase priority icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleIncreasePriority = (event: React.MouseEvent, index: number) => {
    this.state.graph.increaseItemPriority(this.getCurrentItemType(),index)
    this.state.graph.saveData()
  } 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle decrease priority icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleDecreasePriority = (event: React.MouseEvent, index: number) => {
    this.state.graph.decreaseItemPriority(this.getCurrentItemType(),index)
    this.state.graph.saveData()
  } 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemDelete = (event: React.MouseEvent, id: number) => {
    this.state.graph.deleteItem(this.getCurrentItemType(),id)
    this.state.graph.saveData()
  }
   ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount (do some initialisation)
  // is this the write time (versus constructor or component did mount?)
  ///////////////////////////////////////////////////////////////////////////////////////////////=
  componentWillMount(){
    this.state.graph.loadData()
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will unmount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillUnmount() {
    this.state.graph.saveData()
  } 
}
export default withStyles(styles)(MpgApp)
