import Column from "./Column";
import initialData from "./initial-data";
import { DragDropContext } from "react-beautiful-dnd";
import { useState } from "react";
import { renderIntoDocument } from "react-dom/test-utils";

function App() {
  const [state, setState] = useState(initialData);

  const onDragStart = () => {
    document.body.style.color = "orange";
  };
  const onDragEnd = (result) => {
    document.body.style.color = "inherit";
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.draggableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setState(newState);
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

          return <Column key={columnId} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
