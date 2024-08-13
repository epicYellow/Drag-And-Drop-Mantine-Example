import React, { useCallback } from "react";
import { rem, Table } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableLocation,
} from "@hello-pangea/dnd";

import classes from "./DndList.module.css";
import { IconGripVertical } from "@tabler/icons-react";

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
  const [columnOne, handlerColumnOne] = useListState(
    data.filter((s) => s.category === "one")
  );
  const [columnTwo, handlerColumnTwo] = useListState(
    data.filter((s) => s.category === "two")
  );

  const updatePositionBasedOnIndex = () => {
    const newData1 = columnOne.map((s, i) => {
      return { ...s, position: i };
    });
    const newData2 = columnTwo.map((s, i) => {
      return { ...s, position: i };
    });

    handlerColumnOne.setState(newData1);
    handlerColumnTwo.setState(newData2);
  };

  const onDragEnd = ({
    destination,
    source,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (!destination) return;

    const updatedState1 = [...columnOne];
    const updatedState2 = [...columnTwo];

    const [movedItem] =
      source.droppableId === "one"
        ? updatedState1.splice(source.index, 1)
        : updatedState2.splice(source.index, 1);

    if (destination.droppableId === "one") {
      updatedState1.splice(destination.index, 0, movedItem);
      handlerColumnOne.setState(updatedState1);
      handlerColumnTwo.setState(updatedState2);
      return;
    }

    updatedState2.splice(destination.index, 0, movedItem);
    handlerColumnOne.setState(updatedState1);
    handlerColumnTwo.setState(updatedState2);
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
              <div
                style={{ cursor: "grab" }}
                className={classes.dragHandle}
                {...provided.dragHandleProps}
              >
                <IconGripVertical />
              </div>
            </td>
            <td style={{ width: rem(80), height: rem(40) }}>{item.position}</td>
            <td style={{ width: rem(120), height: rem(40) }}>{item.name}</td>
            <td style={{ width: rem(80), height: rem(40) }}>{item.symbol}</td>
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: "4vh",
          padding: "4vh",
          border: "solid",
          borderRadius: "25px",
          borderWidth: "0.5px",
          borderColor: "gray",
        }}
      >
        <Table>
          <thead>
            <tr
              style={{
                borderBottom: "solid",
                borderBottomWidth: "0.5px",
                borderBottomColor: "lightgray",
              }}
            >
              <th style={{ width: rem(40), height: rem(40) }} />
              <th style={{ width: rem(80), height: rem(40) }}>Position</th>
              <th style={{ width: rem(120), height: rem(40) }}>Name</th>
              <th style={{ width: rem(40), height: rem(40) }}>Symbol</th>
              <th>Mass</th>
            </tr>
          </thead>
          <Droppable droppableId="one" direction="vertical">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {renderTableRows(columnOne)}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </Table>
        <div
          style={{ height: "20vh", width: "1px", backgroundColor: "gray" }}
        ></div>
        <Table>
          <thead>
            <tr
              style={{
                borderBottom: "solid",
                borderBottomWidth: "0.5px",
                borderBottomColor: "lightgray",
              }}
            >
              <th style={{ width: rem(40), height: rem(40) }} />
              <th style={{ width: rem(80), height: rem(40) }}>Position</th>
              <th style={{ width: rem(120), height: rem(40) }}>Name</th>
              <th style={{ width: rem(40), height: rem(40) }}>Symbol</th>
              <th>Mass</th>
            </tr>
          </thead>
          <Droppable droppableId="two" direction="vertical">
            {(provided) => (
              <tbody
                // style={{ height: "40vh" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {renderTableRows(columnTwo)}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </Table>
      </div>

      <br />
      <button onClick={updatePositionBasedOnIndex}>
        Click Me To Update Indexes/Positions
      </button>
    </DragDropContext>
  );
}
