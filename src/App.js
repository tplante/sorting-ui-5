// @flow
import * as React from "react";
import { createRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Redux
import {
  Box,
  BoxBorder,
  Button,
  Label,
  Select,
  Text
} from "@mentimeter/ragnar-web";

const SKIP_VALUE = "skip";
const DEFAULT_OPTION = "Select an option";
const ICON_SIZE = 25;
const GRID_SIZE = 20;
const GUTTER_SIZE = GRID_SIZE / 2;
const ITEM_SIZE = GRID_SIZE * 2;

const options = [
  { label: "Hillary Clinton" },
  { label: "George Washington" },
  { label: "Barack Obama" },
  { label: "Bernie Sanders" },
  { label: "John Adams" },
  { label: "Marco Rubio" },
  { label: "Donald Trump" },
  { label: "Ron Swanson" },
  { label: "Ron Burgandy" },
  { label: "Abraham Lincoln" },
  { label: "Jeb Bush" },
  { label: "Kanye West" }
];

// Reorder the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const getItemStyle = (isDragging, draggableStyle, isLastItem) => ({
  position: "relative",
  userSelect: "none",
  padding: GRID_SIZE,
  margin: `0 0 ${GUTTER_SIZE}px 0`,
  // Change background colour if dragging
  background: isDragging || isLastItem ? "transparent" : "#d8d8d8",
  border: isDragging || isLastItem ? "2px dashed #d8d8d8" : "2px solid #d8d8d8",
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
  margin: `${GUTTER_SIZE}px ${GRID_SIZE}px 0 ${2 * GRID_SIZE}px`,
  padding: `${GUTTER_SIZE}px ${GRID_SIZE}px ${GUTTER_SIZE}px ${GUTTER_SIZE}px`
};

const ArrowIcon = ({ show }) => {
  return (
    <svg
      style={{
        ...iconStyles,
        opacity: show ? 1 : 0
      }}
    >
      <path
        d="M13.7578943,16.6318165 L10.6642975,19.7254012 C10.2981644,20.0915329 9.70460909,20.0915329 9.33847592,19.7254012 L6.24487915,16.6318165 C5.65429263,16.0412323 6.07257429,15.0313915 6.90780948,15.0314306 L8.90632706,15.0314306 L8.90628799,11.0937468 L4.9686279,11.0937468 L4.9686279,13.0922566 C4.9686279,13.9274885 3.95882223,14.3457685 3.36819665,13.7551843 L0.274599878,10.6615996 C-0.0915332925,10.2954679 -0.0915332925,9.70187587 0.274599878,9.3357832 L3.36819665,6.24219851 C3.95878316,5.6516143 4.9686279,6.06989433 4.9686279,6.90512625 L4.9686279,8.9062532 L8.90628799,8.9062532 L8.90628799,4.96860849 L6.90511417,4.96860849 C6.06987897,4.96860849 5.65159732,3.95880676 6.24218383,3.36818349 L9.3357806,0.274598805 C9.70191377,-0.091532935 10.295469,-0.091532935 10.6616022,0.274598805 L13.755199,3.36818349 C14.3457855,3.9587677 13.9275038,4.96860849 13.0922686,4.96860849 L11.0937511,4.96860849 L11.0937511,8.9062532 L15.0314112,8.9062532 L15.0314112,6.90774343 C15.0314112,6.07251151 16.0412168,5.65423148 16.6318034,6.24481569 L19.7254001,9.33840038 C20.0915333,9.70453212 20.0915333,10.2981241 19.7254001,10.6642168 L16.6318034,13.7578015 C16.0412168,14.3483857 15.0313721,13.9301057 15.0314112,13.0948737 L15.0314112,11.0937468 L11.0937901,11.0937468 L11.0937901,15.0313915 L13.094964,15.0313915 C13.9301992,15.0313915 14.3484808,16.0411932 13.7578943,16.6318165 Z"
        id="Path"
      />
    </svg>
  );
};

class App extends React.PureComponent<Props, State> {
  state = {
    items: [],
    options: [],
    submitted: false
  };

  container = createRef();

  componentDidMount() {
    this.keyGenerationIndex = 1;
    this.setOptions(options);
  }

  setOptions = choices => {
    const options = choices.map((c, i) => ({
      id: `option-${i}`,
      label: c.label,
      selected: false,
      showMovableIcon: false,
      val: SKIP_VALUE
    }));
    this.setState({
      items: [options[0]], // Start with one option (select menu)
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
    const options = [...this.state.options]; // Prevent mutation
    const items = [...this.state.items]; // Prevent mutation
    const menus = container.querySelectorAll("select");
    const menuId = parseInt(id.split("-")[1]); // e.g., "option-10" -> "10"
    const selectedItem = items[menuId];
    const hasPreviousValue = previousValue && previousValue !== SKIP_VALUE;
    // Menu was selected before
    if (hasPreviousValue) {
      const previousOption = options.find(o => o.id === previousValue);
      previousOption.selected = false;
      // Option was deselected
      if (value === SKIP_VALUE) {
        selectedItem.showMovableIcon = false;
        selectedItem.val = SKIP_VALUE;
        // Remove any extra deselected items from end of list
        items.forEach((item, i) => {
          if (i !== menuId && item.val === SKIP_VALUE) {
            items.splice(i, 1);
          }
        });
        // Move deselected item to end of list
        items.splice(menuId, 1);
        items.push(selectedItem);
      }
    }
    // A non-default menu option was selected
    if (value !== SKIP_VALUE) {
      const option = options.find(o => o.id === value);
      option.selected = true;
      selectedItem.val = value;
      const shouldAddItem =
        !hasPreviousValue && // Was not selected before
        menus.length < options.length && // Still menus left to append
        menuId === items.length - 1; // Is the last menu item currently rendered
      if (shouldAddItem) {
        const newItem = { ...options[menuId + 1] }; // Copy of next option, prevent mutation
        newItem.id = `option-${options.length + this.keyGenerationIndex}`;
        this.keyGenerationIndex++;
        items.push(newItem);
      }
      const itemsAreMoveable = items.length > 2;
      if (itemsAreMoveable) {
        items.forEach(item => (item.showMovableIcon = item.val !== SKIP_VALUE));
      }
    }
    target.previousValue = value;
    this.setState({ options, items });
  };

  handleSubmit = () => {
    this.setState({ submitted: !this.state.submitted });
  };

  render() {
    const isLastItem = (item, index) =>
      !item.showMovableIcon && // Not selected
      index === this.state.items.length - 1 && // Last item
      this.state.items.length !== 1; // More than one available option
    return (
      <div ref={this.container}>
        <Box width="100%" height="100%" maxWidth="450px" m="0 auto">
          <Box my={2} alignItems="center">
            <Text
              color="#2C5C6C"
              fontSize={5}
              fontWeight="bold"
              textAlign="center"
            >
              Choose your favorite candidates
            </Text>
          </Box>
          <Box width="100%" alignItems="center">
            <DragDropContext onDragEnd={this.handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
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
                                provided.draggableProps.style,
                                isLastItem(item, i)
                              ),
                              ...optionStyles
                            }}
                          >
                            {!isLastItem(item, i) && (
                              <ArrowIcon show={item.showMovableIcon} />
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
                              <Label
                                value={isLastItem(item, i) ? "+" : i + 1}
                                htmlFor={`menu-${i}`}
                                color="white"
                                mt={1}
                              >
                                {isLastItem(item, i) ? "+" : i + 1}
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
                                  id={SKIP_VALUE}
                                  value={SKIP_VALUE}
                                  defaultValue
                                >
                                  {DEFAULT_OPTION}
                                </Select.Option>
                                {this.state.options.map(
                                  ({ label, id, selected }) =>
                                    (!selected || item.val === id) && (
                                      <Select.Option
                                        key={id}
                                        id={id}
                                        value={id}
                                      >
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
            <Box mt={GRID_SIZE}>
              <Button onSubmit={this.handleSubmit}>Submit</Button>
            </Box>
          </Box>
        </Box>
      </div>
    );
  }
}

export default App;
