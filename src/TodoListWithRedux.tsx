import React, {ChangeEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskType} from "./Todolist";
import {Dispatch} from "redux";
import {FilterValuesType} from "./App";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {AddItemForm} from "./AddItemForm";
import {Button, Checkbox} from "@mui/material";


type PropsType = {
    id: string
    title: string
    filter: FilterValuesType
}

const TodoListWithRedux = (props: PropsType) => {
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])
    const dispatch = useDispatch<Dispatch>()

    let allTodoListTasls = tasks
    let tasksforTodoList = allTodoListTasls

    if (props.filter === 'active') {
        tasksforTodoList = allTodoListTasls.filter(t => !t.isDone)
    }

    if (props.filter === 'completed') {
        tasksforTodoList = allTodoListTasls.filter(t => t.isDone)
    }

    function addTask(title: string) {
        dispatch(addTaskAC(title, props.id))
    }

    function removeTodolist() {
        const action = removeTodolistAC(props.id)
        dispatch(action)
    }

    function changeTodolistTitle( title: string) {
        dispatch(changeTodolistTitleAC(props.id, title))
    }

    const onAllClickHandler = () => dispatch(changeTodolistFilterAC(props.id, 'all'))
    const onActiveClickHandler = () => dispatch(changeTodolistFilterAC(props.id, 'active'))
    const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC(props.id, 'completed'));

    return <div>
        <h3> <EditableSpan value={props.title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksforTodoList.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, props.id))
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                       dispatch(changeTaskStatusAC(t.id, newIsDoneValue, props.id));
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                       dispatch(changeTaskTitleAC(t.id, newValue, props.id));
                    }


                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            checked={t.isDone}
                            color="primary"
                            onChange={onChangeHandler}
                        />

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler} />
                        <IconButton onClick={onClickHandler}>
                            <Delete />
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
};

export default TodoListWithRedux;