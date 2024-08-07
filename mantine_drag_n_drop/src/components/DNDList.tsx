import { rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import classes from "./DndList.module.css";

const data = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];

export function DndTable() {
  const [state, handlers] = useListState(data);

  const updatePositionBasedonIndex = () => {
    console.log(state);

    const newData = state.map((s, i) => {
      return { ...s, position: i };
    });

    handlers.setState(newData);
  };

  const items = state.map((item, index) => (
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

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <table>
        <thead>
          <tr>
            <th style={{ width: rem(40) }} />
            <th style={{ width: rem(80) }}>Position</th>
            <th style={{ width: rem(120) }}>Name</th>
            <th style={{ width: rem(40) }}>Symbol</th>
            <th>Mass</th>
          </tr>
        </thead>
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </table>
      <button onClick={updatePositionBasedonIndex}>Click Me</button>
    </DragDropContext>
  );
}
