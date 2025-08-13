import React from "react";

export default function TodoItem(props: any) {
  return (
    <div>
      <>
        <p>{props.todos.todo}</p>
        <section>
          {props.todos.done ? (
            <p>done</p>
          ) : (
            <input
              type="button"
              onClick={() => {
                props.markDone(props.todos.todo);
              }}
              name="sub"
              id=""
              value="done"
            />
          )}
        </section>
      </>
    </div>
  );
}
