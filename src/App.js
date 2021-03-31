import Column from "./Column";
import initialData from "./initial-data";
import { DragDropContext } from "react-beautiful-dnd";

function App() {
  const onDragEnd = (result) => {
    // 컬럼 render
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        {initialData.columnOrder.map((columnId) => {
          const column = initialData.columns[columnId];
          const tasks = column.taskIds.map(
            (taskId) => initialData.tasks[taskId]
          );

          return <Column key={columnId} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
