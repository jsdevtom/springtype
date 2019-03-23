import {ActiveRoute, UseElement, Element, WebComponentLifecycle, Attribute} from "../../../../src/package/core/index";
import {TodoModel} from "../model/TodoModel";
import {ListInnerPartial} from "../component/list/ListInnerPartial";
import {AppLayout} from "../component/layout/AppLayout";

interface TodoListLocalState {
    newTodoItemText: string;
}

@Element('example-todo-list')
@UseElement(AppLayout)
@UseElement(ListInnerPartial)
export class TodoListPage extends HTMLElement implements WebComponentLifecycle {

    constructor(
        public localState: TodoListLocalState,
        protected todoModel: TodoModel,
        public textInputEl: HTMLInputElement
    ) {
        super();
    }

    onAddItem = () => {

        console.log('onAddItem');

        if (this.textInputEl.value !== '') {
            this.todoModel.addTodo({
                text: this.localState.newTodoItemText,
                id: Date.now(),
                done: false
            });

            this.textInputEl.value = '';
        }
        this.textInputEl.focus();
    };

    onNewTodoTextChange = (evt: any) => {

        if (evt.key === "Enter") {
            this.onAddItem();
        } else {
            this.localState.newTodoItemText = evt.target.value;
        }
        evt.preventDefault();
    };

    render() {

        return <app-layout>
            <div slot="children">

                <app-list-inner-partial />

                <input bind={{textInputEl: this}}
                       type="text"
                       id="newTodoText"
                       placeholder="What's TODO next?"
                       onKeyUp={this.onNewTodoTextChange}/>

                <a className="waves-effect waves-light btn" onClick={this.onAddItem}>Add</a>
            </div>
        </app-layout>
    }
}