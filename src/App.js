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
import { CrossIcon } from "@mentimeter/ragnar-visuals";

const SKIP_VALUE = "skip";
const DEFAULT_OPTION = "Select an option";
const ICON_SIZE = 20;
const ICON_MARGIN = 5;
const GRID_SIZE = 20;
const GUTTER_SIZE = GRID_SIZE / 2;
const ITEM_SIZE = GRID_SIZE * 2;
const SHADE_2 = "rgb(195, 200, 213)";
const SHADE_3 = "rgb(37, 43, 54)";

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
  overflow: "visible",
  border:
    isDragging || isLastItem ? `2px dashed ${SHADE_2}` : `2px solid ${SHADE_2}`,
  // Styles to apply on draggables
  ...draggableStyle
});
const moveIconStyles = {
  position: "absolute",
  left: -ICON_SIZE - 2 * ICON_MARGIN,
  padding: `${GRID_SIZE}px ${ICON_MARGIN}px`
};

const ArrowIcon = () => {
  return (
    <svg
      stroke={SHADE_3}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      style={moveIconStyles}
    >
      <polyline points="3.7 7.3 1 10 3.7 12.7" />
      <polyline points="7.3 3.7 10 1 12.7 3.7" />
      <polyline points="12.7 16.3 10 19 7.3 16.3" />
      <polyline points="16.3 7.3 19 10 16.3 12.7" />
      <path d="M1,10 L19,10" />
      <path d="M10,1 L10,19" />
    </svg>
  );
};

const PlusIcon = () => (
  <svg
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={ICON_SIZE}
    height={ICON_SIZE}
    viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
  >
    <path d="M10,1 L10,19" />
    <path d="M1,10 L19,10" />
  </svg>
);

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
    const movedLastItem = menu.value === SKIP_VALUE;
    // Dropped outside the list or an empty option is not last index
    if (!destination || movedLastItem) {
      return;
    }
    const movedPastLastItem = menus.some(
      (m, i) => m.value === SKIP_VALUE && destination.index === i
    );
    const destinationIndex = movedPastLastItem
      ? destination.index - 1
      : destination.index;
    const items = reorder(this.state.items, source.index, destinationIndex);
    this.setState({ items });
  };

  handleChange = event => {
    const {
      target,
      target: { value, id, previousValue }
    } = event;
    const options = [...this.state.options]; // Prevent mutation
    const items = [...this.state.items]; // Prevent mutation
    const menuId = parseInt(id.split("-")[1]); // e.g., "option-10" -> "10"
    const selectedItem = items[menuId];
    // Option was selected before
    if (previousValue) {
      const previousOption = options.find(o => o.id === previousValue);
      previousOption.selected = false;
    }
    // A non-default menu option was selected
    if (value !== SKIP_VALUE) {
      const option = options.find(o => o.id === value);
      option.selected = true;
      selectedItem.val = value;
      const shouldAddItem =
        items.length < options.length && menuId === items.length - 1; // Still menus left to append // Is the last menu item currently rendered
      if (shouldAddItem) {
        const newItem = this.getNewItem(options, menuId);
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

  getNewItem = (options, menuId) => {
    const newItem = { ...options[menuId + 1] }; // Copy of next option, prevent mutation
    newItem.id = `option-${options.length + this.keyGenerationIndex}`;
    this.keyGenerationIndex++;
    return newItem;
  };

  handleDeselect = event => {
    const { id } = event.currentTarget; // Selects "this" element instead of any of its children
    const options = [...this.state.options]; // Prevent mutation
    const items = [...this.state.items]; // Prevent mutation
    const menuId = parseInt(id.split("-")[1]);
    const item = items[menuId];
    const itemId = parseInt(item.val.split("-")[1]);
    const option = options[itemId];
    if (!option) {
      return;
    }
    option.selected = false;
    // Remove any extra deselected items from end of list
    items.forEach((item, i) => {
      if (i !== menuId && item.val === SKIP_VALUE) {
        items.splice(i, 1);
      }
    });
    // Move deselected item to end of list
    const newItem = this.getNewItem(options, menuId);
    newItem.val = SKIP_VALUE;
    newItem.showMovableIcon = false;
    items.splice(menuId, 1);
    items.push(newItem);
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
      <Box ref={this.container} alignItems="center">
        <Box width="80%" maxWidth="350px">
          <Box mt={4}>
            <Text fontSize={4} fontWeight="bold" textAlign="center">
              Choose your favorite candidates
            </Text>
          </Box>
          <Box my={2}>
            <Text
              fontSize={1}
            >{`Select as many as you want in the order you prefer.
              There are ${options.length} options in total.`}</Text>
          </Box>
          <Box width="100%" alignItems="center">
            <DragDropContext onDragEnd={this.handleDragEnd}>
              <Droppable droppableId="droppable">
                {provided => (
                  <Box ref={provided.innerRef} width="100%">
                    {this.state.items.map((item, i) => (
                      <Draggable key={item.id} draggableId={item.id} index={i}>
                        {(provided, snapshot) => (
                          <BoxBorder
                            id={item.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            width="100%"
                            flexDirection="columns"
                            alignItems="center"
                            mb={GUTTER_SIZE}
                            // Change background color if dragging
                            bg={
                              snapshot.isDragging || isLastItem(item, i)
                                ? "transparent"
                                : "shade-2"
                            }
                            borderRadius={1}
                            p={`${GUTTER_SIZE}px 0 ${GUTTER_SIZE}px ${GUTTER_SIZE}px`}
                            style={{
                              ...getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                isLastItem(item, i)
                              )
                            }}
                          >
                            {!isLastItem(item, i) &&
                              item.showMovableIcon && <ArrowIcon />}
                            <Label
                              value={isLastItem(item, i) ? "+" : i + 1}
                              htmlFor={`menu-${i}`}
                              color="white"
                              mt={1}
                              fontWeight="bold"
                            >
                              <BoxBorder
                                alignItems="center"
                                justifyContent="center"
                                width={ITEM_SIZE}
                                height={ITEM_SIZE}
                                bg={isLastItem(item, i) ? "shade-2" : "brand"}
                                mr={GUTTER_SIZE}
                                borderRadius="50%"
                                border="2px solid"
                                borderColor="gray"
                              >
                                {isLastItem(item, i) ? <PlusIcon /> : i + 1}
                              </BoxBorder>
                            </Label>
                            <Box flex={1}>
                              <Select
                                id={`menu-${i}`}
                                name={`menu-${i}`}
                                onChange={this.handleChange}
                                pr="20px"
                              >
                                <Select.Option
                                  id={SKIP_VALUE}
                                  value={SKIP_VALUE}
                                  defaultValue
                                  disabled={item.val !== SKIP_VALUE}
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
                            <Box
                              id={`deselect-${i}`}
                              onClick={this.handleDeselect}
                              px={2}
                            >
                              {!isLastItem(item, i) &&
                                this.state.items.length > 1 && <CrossIcon />}
                            </Box>
                          </BoxBorder>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
            <Box my={3}>
              <Button onClick={this.handleSubmit}>
                {this.state.submitted ? "Nice!" : "Submit"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default App;
