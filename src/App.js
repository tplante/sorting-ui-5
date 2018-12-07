// @flow
import * as React from "react";
import { createRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Redux
import { Box, BoxBorder, Select, Label } from "@mentimeter/ragnar-web";

const SKIP_VALUE = "skip";
const ICON_SIZE = 25;
const GRID_SIZE = 20;
const GUTTER_SIZE = GRID_SIZE / 2;
const ITEM_SIZE = GRID_SIZE * 2;

const options = [
  { label: "Hillary Clinton" },
  { label: "George Washington" },
  { label: "Barack Obama" }
];

// Reorder the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const getItemStyle = (isDragging, draggableStyle) => ({
  position: "relative",
  userSelect: "none",
  padding: GRID_SIZE,
  margin: `0 0 ${GUTTER_SIZE}px 0`,
  // Change background colour if dragging
  background: isDragging ? "lightgreen" : "#d8d8d8",
  // Styles to apply on draggables
  ...draggableStyle
});

const iconStyles = {
  opacity: 0,
  transition: "0.2s ease-in-out",
  position: "absolute",
  left: -ICON_SIZE,
  top: GRID_SIZE,
  width: ICON_SIZE,
  height: ICON_SIZE,
  viewBox: `0 0 ${ICON_SIZE} ${ICON_SIZE}`,
  fill: "#2c5c6c"
};
const optionStyles = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: 3,
  margin: `${GUTTER_SIZE}px ${GRID_SIZE}px 0 ${GRID_SIZE}px`,
  padding: `${GUTTER_SIZE}px ${GRID_SIZE}px ${GUTTER_SIZE}px ${GUTTER_SIZE}px`
};

class App extends React.PureComponent<Props, State> {
  state = {
    items: [],
    options: [],
    submitted: false
  };

  container = createRef();

  componentDidMount() {
    this.setOptions(options);
  }

  setOptions = choices => {
    const options = choices.map((c, i) => ({
      id: `option-${i}`,
      label: c.label,
      selected: false,
      showIcon: false,
      val: SKIP_VALUE
    }));
    this.setState({
      items: [options[0]],
      options
    });
  };

  handleDragEnd = dragEvent => {
    const {
      container: { current: container }
    } = this;
    const { destination, source, draggableId } = dragEvent;
    const menu = container.querySelector(`#${draggableId} select`);
    // Convert NodeList to array
    const menus = Array.from(container.querySelectorAll("select"));
    const preventReorder =
      menu.value === SKIP_VALUE ||
      menus.some(
        (m, i) =>
          m.value === SKIP_VALUE && destination && destination.index === i
      );
    // Dropped outside the list or an empty option is not last index
    if (!destination || preventReorder) {
      return;
    }
    const items = reorder(this.state.items, source.index, destination.index);
    this.setState({ items });
  };

  handleChange = event => {
    const {
      target,
      target: { value, previousValue, id }
    } = event;
    const {
      container: { current: container }
    } = this;
    const newOptions = [...this.state.options];
    const newItems = [...this.state.items];
    const menus = container.querySelectorAll("select");
    const menuId = parseInt(id.split("-")[1]);
    const hasPreviousValue = previousValue && previousValue !== SKIP_VALUE;
    if (hasPreviousValue) {
      const previousOptionIndex = newOptions.findIndex(
        o => o.id === previousValue
      );
      newOptions[previousOptionIndex].selected = false;
    }
    if (value !== SKIP_VALUE) {
      const optionIndex = newOptions.findIndex(o => o.id === value);
      newOptions[optionIndex].selected = true;
      newItems[menuId].showIcon = true;
      newItems[menuId].val = value;
      if (!hasPreviousValue && menus.length < newOptions.length) {
        newItems.push(newOptions[menuId + 1]);
      }
    } else if (hasPreviousValue) {
      newItems[menuId].showIcon = false;
      newItems[menuId].val = SKIP_VALUE;
      menus.forEach((menu, i) => {
        const { value: menuValue } = menu;
        if (i > menuId) {
          newItems.pop();
          const option = newOptions.find(o => o.id === menuValue);
          if (option) {
            option.selected = false;
          }
        }
      });
    }
    target.previousValue = value;
    this.setState({ options: newOptions, items: newItems });
  };

  handleSubmit = () => {
    this.setState({ submitted: !this.state.submitted });
  };

  render() {
    return (
      <div ref={this.container}>
        <form onSubmit={this.handleSubmit}>
          <DragDropContext onDragEnd={this.handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {this.state.items.map((item, i) => (
                    <Draggable key={item.id} draggableId={item.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          id={item.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            ),
                            ...optionStyles
                          }}
                          key={item.id}
                        >
                          {i < this.state.items.length && (
                            <svg
                              style={{
                                ...iconStyles,
                                opacity: item.showIcon ? 1 : 0
                              }}
                            >
                              <path
                                d="M13.7578943,16.6318165 L10.6642975,19.7254012 C10.2981644,20.0915329 9.70460909,20.0915329 9.33847592,19.7254012 L6.24487915,16.6318165 C5.65429263,16.0412323 6.07257429,15.0313915 6.90780948,15.0314306 L8.90632706,15.0314306 L8.90628799,11.0937468 L4.9686279,11.0937468 L4.9686279,13.0922566 C4.9686279,13.9274885 3.95882223,14.3457685 3.36819665,13.7551843 L0.274599878,10.6615996 C-0.0915332925,10.2954679 -0.0915332925,9.70187587 0.274599878,9.3357832 L3.36819665,6.24219851 C3.95878316,5.6516143 4.9686279,6.06989433 4.9686279,6.90512625 L4.9686279,8.9062532 L8.90628799,8.9062532 L8.90628799,4.96860849 L6.90511417,4.96860849 C6.06987897,4.96860849 5.65159732,3.95880676 6.24218383,3.36818349 L9.3357806,0.274598805 C9.70191377,-0.091532935 10.295469,-0.091532935 10.6616022,0.274598805 L13.755199,3.36818349 C14.3457855,3.9587677 13.9275038,4.96860849 13.0922686,4.96860849 L11.0937511,4.96860849 L11.0937511,8.9062532 L15.0314112,8.9062532 L15.0314112,6.90774343 C15.0314112,6.07251151 16.0412168,5.65423148 16.6318034,6.24481569 L19.7254001,9.33840038 C20.0915333,9.70453212 20.0915333,10.2981241 19.7254001,10.6642168 L16.6318034,13.7578015 C16.0412168,14.3483857 15.0313721,13.9301057 15.0314112,13.0948737 L15.0314112,11.0937468 L11.0937901,11.0937468 L11.0937901,15.0313915 L13.094964,15.0313915 C13.9301992,15.0313915 14.3484808,16.0411932 13.7578943,16.6318165 Z"
                                id="Path"
                              />
                            </svg>
                          )}
                          <BoxBorder
                            alignItems="center"
                            justifyContent="center"
                            width={ITEM_SIZE}
                            height={ITEM_SIZE}
                            bg="brand"
                            mr={GUTTER_SIZE}
                            borderRadius="50%"
                          >
                            <Label value={i + 1} htmlFor={`menu-${i}`}>
                              {i + 1}
                            </Label>
                          </BoxBorder>
                          <Box
                            flex={1}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Select
                              id={`menu-${i}`}
                              name={`menu-${i}`}
                              onChange={this.handleChange}
                            >
                              <Select.Option
                                key={SKIP_VALUE}
                                id={SKIP_VALUE}
                                value={SKIP_VALUE}
                                defaultValue
                              >
                                Select an option
                              </Select.Option>
                              {this.state.options.map(
                                ({ label, id, selected }) =>
                                  (!selected || item.val === id) && (
                                    <Select.Option key={id} id={id} value={id}>
                                      {label}
                                    </Select.Option>
                                  )
                              )}
                            </Select>
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </form>
      </div>
    );
  }
}

export default App;
