import Column from "./Column";
import initialData from "./initial-data";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { memo, useState } from "react";
import styled from "styled-components";

const InnerList = memo(({ column, taskMap, index }) => {
  const tasks = column.taskIds.map((taskId) => taskMap[taskId]);

  return <Column column={column} tasks={tasks} index={index} />; // isDropDisabled={isDropDisabled}
});

function App() {
  const [state, setState] = useState(initialData);

  const Container = styled.ul`
    display: flex;
  `;

  const onDragStart = (_, provided) => {
    document.body.style.color = "orange";
    document.body.style.transition = "background-color 0.2s ease";
    provided.announce("test in onDragStart");
  };

  const onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(state.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  };

  const onDragEnd = (result) => {
    document.body.style.color = "inherit";
    document.body.style.transition = "inherit";
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    // columnID가 같고, task의 index도 같다면 이동하지 않은것이니 return
    if (
      destination.droppableId === source.draggableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      };
      setState(newState);
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    // 같은 column내에서 이동한 경우
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
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
      return;
    }

    // 다른 column으로 이동한 경우
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  return (
    <div className="App">
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <Droppable
          droppableId={"all-columns"}
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {state.columnOrder.map((columnId, index) => {
                const column = state.columns[columnId];
                return (
                  <InnerList
                    key={columnId}
                    column={column}
                    taskMap={state.tasks}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
