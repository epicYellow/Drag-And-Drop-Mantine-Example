import { rem, Table } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableLocation,
} from "@hello-pangea/dnd";
import classes from "./DndList.module.css";
import React, { useCallback } from "react";

type DataItem = {
  position: number;
  mass: number;
  symbol: string;
  name: string;
  category: "one" | "two";
};

const data: DataItem[] = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon", category: "one" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen", category: "one" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium", category: "one" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium", category: "two" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium", category: "two" },
];

export function DndTable() {
  const [state1, handlers1] = useListState(
    data.filter((s) => s.category === "one")
  );
  const [state2, handlers2] = useListState(
    data.filter((s) => s.category === "two")
  );

  const updatePositionBasedOnIndex = () => {
    const newData1 = state1.map((s, i) => {
      return { ...s, position: i };
    });
    const newData2 = state1.map((s, i) => {
      return { ...s, position: i };
    });

    handlers1.setState(newData1);
    handlers2.setState(newData2);
  };

  const onDragEnd = ({
    destination,
    source,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (!destination) return;

    const updatedState1 = [...state1];
    const updatedState2 = [...state2];

    const [movedItem] =
      source.droppableId === "one"
        ? updatedState1.splice(source.index, 1)
        : updatedState2.splice(source.index, 1);

    if (destination.droppableId === "one") {
      updatedState1.splice(destination.index, 0, {
        ...movedItem,
        // position: updatedState1.length + 1,
      });
      console.log(updatedState1);

      handlers1.setState(updatedState1);
      handlers2.setState(updatedState2);
    } else {
      updatedState2.splice(destination.index, 0, {
        ...movedItem,
        position: updatedState2.length + 1,
      });
      handlers1.setState(updatedState1);
      handlers2.setState(updatedState2);
    }
  };

  const renderTableRows = useCallback((state: DataItem[]) => {
    return state.map((item, index) => (
      <Draggable key={item.symbol} index={index} draggableId={item.symbol}>
        {(provided) => (
          <tr
            className={classes.item}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <td>
              <div className={classes.dragHandle} {...provided.dragHandleProps}>
                <div>lol</div>
              </div>
            </td>
            <td style={{ width: rem(80) }}>{item.position}</td>
            <td style={{ width: rem(120) }}>{item.name}</td>
            <td style={{ width: rem(80) }}>{item.symbol}</td>
            <td>{item.mass}</td>
          </tr>
        )}
      </Draggable>
    ));
  }, []);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        onDragEnd({ destination, source })
      }
    >
      <div>
        <Table>
          <thead>
            <tr>
              <th style={{ width: rem(40) }} />
              <th style={{ width: rem(80) }}>Position</th>
              <th style={{ width: rem(120) }}>Name</th>
              <th style={{ width: rem(40) }}>Symbol</th>
              <th>Mass</th>
            </tr>
          </thead>
          <Droppable droppableId="one" direction="vertical">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {renderTableRows(state1)}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </Table>
        <Table>
          <thead>
            <tr>
              <th style={{ width: rem(40) }} />
              <th style={{ width: rem(80) }}>Position</th>
              <th style={{ width: rem(120) }}>Name</th>
              <th style={{ width: rem(40) }}>Symbol</th>
              <th>Mass</th>
            </tr>
          </thead>
          <Droppable droppableId="two" direction="vertical">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {renderTableRows(state2)}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </Table>
      </div>

      <button onClick={updatePositionBasedOnIndex}>Click Me</button>
    </DragDropContext>
  );
}
