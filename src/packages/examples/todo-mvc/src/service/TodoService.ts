import {Bean} from "@springtype/core";
import {Stateful, StatefulLifecycle} from "@springtype/state";
import {IRootState} from "../state/IRootState";
import {ITodoItem} from "../state/ITodoState";

@Stateful
@Bean
export class TodoService implements StatefulLifecycle {

    constructor(
        public state: IRootState,
    ) {}

    getById(id: number): ITodoItem {

        return this.state.TodoModel.todos
            .filter((todo: ITodoItem) => {
                return todo.id === id;
            })[0];
    }
}