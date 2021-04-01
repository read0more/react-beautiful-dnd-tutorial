import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const List = styled.li`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
  display: flex;
`;

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 8px;
`;

const Task = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided, snapshot) => {
      if (snapshot.draggingOver) {
        console.log(snapshot);
      }

      return (
        <List
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Handle {...provided.dragHandleProps} />
          {task.content}
        </List>
      );
    }}
  </Draggable>
);

export default Task;
