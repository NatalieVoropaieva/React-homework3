import './ToDoList.scss';
import React from "react";
import editIcon from './edit.svg';
import deleteIcon from './recycle-bin.png'

const formatDate = (date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

class ToDoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterStatuses: [],
            isCreate: false,
            updateDateSortState: '',
            creationDateSortState: '',
            toDoList: []
        };
        this.addNew = this.addNew.bind(this);
        this.saveNew = this.saveNew.bind(this);
        this.cancelAddNew = this.cancelAddNew.bind(this);
        this.onItemUpdate = this.onItemUpdate.bind(this);
        this.onItemDelete = this.onItemDelete.bind(this);
        this.filterToDo = this.filterToDo.bind(this);
        this.onUpdateSortClick = this.onUpdateSortClick.bind(this);
        this.onCreationSortClick = this.onCreationSortClick.bind(this);
        this.sortToDo = this.sortToDo.bind(this);
    }

    componentDidMount() {
        const toDoListStr = localStorage.getItem('toDoList');
        if (toDoListStr) {
            const toDoList = JSON.parse(toDoListStr);
            if (Array.isArray(toDoList)) {
                this.setState({ toDoList });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.toDoList !== this.state.toDoList) {
            localStorage.setItem("toDoList", JSON.stringify(this.state.toDoList));
        }
    }

    toggleStatusFilter(statusFilter) {
        let newFilter = [];
        if (this.isFilterStatusActive(statusFilter)) {
            newFilter = this.state.filterStatuses.filter((status) => status !== statusFilter);
        } else {
            newFilter = [...this.state.filterStatuses, statusFilter];
        }
        this.setState({filterStatuses: newFilter});
    }

    isFilterStatusActive(statusFilter) {
        return this.state.filterStatuses.includes(statusFilter);
    }
    filterToDo(toDoItem){
        if(this.state.filterStatuses.length > 0){
            return this.state.filterStatuses.includes(toDoItem.status);
        }
        return true;
    }

    getNextSortState(currentState) {
        switch (currentState) {
            case '':
                return 'asc';
            case 'asc':
                return 'desc';
            case 'desc':
                return '';
            default:
                return currentState;
        }
    }
    onCreationSortClick(){
        const nextState = this.getNextSortState(this.state.creationDateSortState);
        this.setState({creationDateSortState: nextState, updateDateSortState: ''})
    }
    onUpdateSortClick(){
        const nextState = this.getNextSortState(this.state.updateDateSortState);
        this.setState({updateDateSortState: nextState,  creationDateSortState: ''})
    }

    sortToDo(toDoItemA, toDoItemB) {
        if (this.state.creationDateSortState) {
            if (this.state.creationDateSortState === 'asc') {
                return toDoItemA.creationDate < toDoItemB.creationDate ? -1 : 1;
            } else if (this.state.creationDateSortState === 'desc') {
                return toDoItemA.creationDate < toDoItemB.creationDate ? 1 : -1;
            }
            return 0;
        }
        if (this.state.updateDateSortState) {
            if (this.state.updateDateSortState === 'asc') {
                return toDoItemA.updateDate < toDoItemB.updateDate ? -1 : 1;
            } else if (this.state.updateDateSortState === 'desc') {
                return toDoItemA.updateDate < toDoItemB.updateDate ? 1 : -1;
            }
            return 0;
        }
        return 0;
    }

    addNew() {
        this.setState({isCreate: true});
    }

    saveNew(event) {
        event.preventDefault();
        const title = event.target.title.value;
        const description = event.target.description.value;
        const newToDo = {
            id: Date.now(),
            title: title,
            description: description,
            status: 'open',
            updateDate: formatDate(new Date()),
            creationDate: formatDate(new Date())
        }
        const newToDoList = [newToDo, ...this.state.toDoList]
        this.setState({isCreate: false, toDoList: newToDoList});
    }

    onItemUpdate(updatedToDoItem) {
        const newList = this.state.toDoList.map(item => {
            if (item.id === updatedToDoItem.id) {
                return updatedToDoItem;
            }
            return item;
        })
        this.setState({toDoList: newList});
    }
    onItemDelete(id) {
        const newList = this.state.toDoList.filter(item => item.id !== id);
        this.setState({ toDoList: newList });
    }

    cancelAddNew() {
        this.setState({isCreate: false});
    }

    render() {
        return (
            <div className="ToDoListContainer">
                <div className='FilterContainer'>
                    <div className='FilterByStatus'>
                        <div className={`open ${this.isFilterStatusActive('open') ? 'active' : 'inactive'}`}
                             onClick={() => this.toggleStatusFilter('open')}>
                            Open
                        </div>
                        <div className={`pending ${this.isFilterStatusActive('pending') ? 'active' : 'inactive'}`}
                             onClick={() => this.toggleStatusFilter('pending')}>
                            In Progress
                        </div>
                        <div className={`done ${this.isFilterStatusActive('done') ? 'active' : 'inactive'}`}
                             onClick={() => this.toggleStatusFilter('done')}>
                            Done
                        </div>
                    </div>
                    <div className='FilterByTime'>
                        <div className={`EditTime ${this.state.updateDateSortState}`} onClick={this.onUpdateSortClick}>
                            Edit time
                        </div>
                        <div className={`CreateTime ${this.state.creationDateSortState}`} onClick={this.onCreationSortClick}>
                            Create time
                        </div>
                    </div>
                </div>
                {
                    this.state.isCreate && <div>
                        <form className='form' onSubmit={this.saveNew}>
                            <input className='input' name="title" required/>
                            <textarea className='input' name="description"/>
                            <button className='save-button' type="submit"> Save</button>
                            <button className='cancel-button' onClick={this.cancelAddNew}>Cancel</button>
                        </form>

                    </div>
                }
                <ul className='ToDoList'>
                    {this.state.toDoList
                        .filter(this.filterToDo)
                        .sort(this.sortToDo)
                        .map(toDoItem => {
                            return <li key={toDoItem.id}>
                                <ToDoItem id={toDoItem.id}
                                          title={toDoItem.title}
                                          description={toDoItem.description}
                                          creationDate={toDoItem.creationDate}
                                          updateDate={toDoItem.updateDate}
                                          status={toDoItem.status}
                                          onUpdate={this.onItemUpdate}
                                          onDelete={this.onItemDelete}
                                />
                            </li>
                        })}
                </ul>
                <div className='AddNew' onClick={this.addNew}>
                    +
                </div>
            </div>
        );
    }
}

class ToDoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isUpdate: false, isOpen: false};
        this.setUpdating = this.setUpdating.bind(this);
        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.update = this.update.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    toggleOpen() {
        this.setState({isOpen: !this.state.isOpen})

    }

    setUpdating() {
        this.setState({isUpdate: true});
    }

    cancelUpdate() {
        this.setState({isUpdate: false});
    }

    update(event) {
        event.preventDefault();
        const title = event.target.title.value;
        const description = event.target.description.value;
        const updatedToDo = {
            id: this.props.id,
            title: title,
            description: description,
            status: this.props.status,
            updateDate: formatDate(new Date()),
            creationDate: this.props.creationDate
        }
        this.props.onUpdate(updatedToDo);
        this.setState({isUpdate: false})
    }

    getNextStatus(currentStatus) {
        switch (currentStatus) {
            case 'open':
                return 'pending';
            case 'pending':
                return 'done';
            case 'done':
                return 'open';
            default:
                return currentStatus
        }
    }

    onStatusChange() {
        const nextStatus = this.getNextStatus(this.props.status);
        const updatedToDo = {
            id: this.props.id,
            title: this.props.title,
            description: this.props.description,
            status: nextStatus,
            updateDate: formatDate(new Date()),
            creationDate: this.props.creationDate
        }
        this.props.onUpdate(updatedToDo);

    }

    render() {
        const {title, description, id, creationDate, updateDate, status} = this.props;
        if (this.state.isUpdate) {
            return (
                <form className='form' onSubmit={this.update}>
                    <input className='input' name="title" defaultValue={title} required/>
                    <textarea className='input' name="description" defaultValue={description}/>
                    <button className='save-button' type="submit"> Save</button>
                    <button className='cancel-button' onClick={this.cancelUpdate}>Cancel</button>
                </form>
            )
        }
        return (
            <div className={`todo-item-container ${this.state.isOpen ? 'open' : 'close'}`}>
                <div className="todo-item-main">
                    <div className={`status ${status}`} onClick={this.onStatusChange}>
                        <div className='figure'></div>
                    </div>
                    <p className='title' onClick={this.toggleOpen}>{title}</p>
                    <div className='creation-date'>{creationDate}</div>
                    <div className='update-date'>{updateDate}</div>
                    <div className='edit-btn' onClick={this.setUpdating}><img src={editIcon} alt="edit icon"/></div>
                    <div className='delete-btn' onClick={() => this.props.onDelete(id)}><img src={deleteIcon} alt="edit icon"/></div>
                </div>
                <div className='description'>
                    {description}
                </div>
            </div>
        );
    }
}

export default ToDoList;
