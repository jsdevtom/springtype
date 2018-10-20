import {ExampleAppLayout} from "./ExampleAppLayout";

// TODO: bind={ view.list }
export default (view: ExampleAppLayout) =>

<div>

    <example-todo-list id='todo-list'
                       bind-list={ view }
                       props={ { lol: 123, test: ['asd']} }
                       static-todo-id={ 2 }
                       class='example' />

    <a href="/#/imprint">Imprint</a>
</div>