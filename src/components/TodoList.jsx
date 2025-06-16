import React, { useState, useEffect } from "react";
import {
  suggestTask,
  classifyTask,
  getPriority,
  autoComplete,
  getFrequentTasks,
} from "../ai/suggestTask";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Chip,
  Divider,
  Alert,
  AlertTitle
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Update as UpdateIcon,
  PriorityHigh as HighPriorityIcon,
  Star as MediumPriorityIcon,
  LowPriority as LowPriorityIcon,
  PsychologyAlt as PsychologyAltIcon,
  Assignment as AssignmentIcon,
  Repeat as RepeatIcon
} from "@mui/icons-material";

function TodoList() {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState([]);

  // State for user input
  const [input, setInput] = useState("");

  // State to show an AI-based suggestion based on input
  const [suggestion, setSuggestion] = useState("");

  // State to store autocompletion result based on input
  const [auto, setAuto] = useState("");

  // State to store the most frequently added tasks
  const [frequent, setFrequent] = useState([]);

  // State to track which task is being edited
  const [editIndex, setEditIndex] = useState(null);

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
    setFrequent(getFrequentTasks());
  }, []);

  // Save tasks to localStorage and update frequent tasks
  const saveToLocalStorage = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setFrequent(getFrequentTasks());
  };

  // Add or update a task
  const addTask = () => {
    if (!input.trim()) return; // Don't add if input is empty

    const newTask = {
      text: input,
      category: classifyTask(input), // Classify the task
      priority: getPriority(input),  // Assign a simulated priority
    };

    let updatedTasks;
    if (editIndex !== null) {
      // If editing, update the existing task
      updatedTasks = [...tasks];
      updatedTasks[editIndex] = newTask;
      setEditIndex(null);
    } else {
      // Otherwise, add new task to list
      updatedTasks = [...tasks, newTask];
    }

    // Save updated list and reset inputs
    saveToLocalStorage(updatedTasks);
    setInput("");
    setSuggestion("");
    setAuto("");
  };

  // Handle input changes and generate suggestion/autocomplete
  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setSuggestion(suggestTask(val));    // Show suggestion
    setAuto(autoComplete(val));         // Show autocomplete
  };

  // Add task if Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Sort tasks by priority (High → Medium → Low)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = {
      "High": 1,
      "Medium": 2,
      "Low": 3,
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Remove a task by index
  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    saveToLocalStorage(updatedTasks);
  };

  // Prepare a task for editing
  const handleEdit = (index) => {
    const taskToEdit = tasks[index];
    setInput(taskToEdit.text);
    setEditIndex(index);
    setSuggestion(suggestTask(taskToEdit.text));
    setAuto(autoComplete(taskToEdit.text));
  };

  // Return an icon based on the task's priority
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <HighPriorityIcon color="error" />;
      case "Medium":
        return <MediumPriorityIcon color="warning" />;
      case "Low":
        return <LowPriorityIcon color="success" />;
      default:
        return null;
    }
  };

  return (
      // Main container 
      <Container maxWidth="sm" sx={{ py: 4, margin: '0 auto' }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 9 }}>
          {/* Header section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              <PsychologyAltIcon sx={{ fontSize: 55, color: 'purple' }} />
              To-Do List with AI
            </Typography>
          </Box>
          {/* Input section for entering tasks */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {/* Input field for typing a task */}
            <TextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your task..."
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  textAlign: 'center'
                }
              }}
            />
            {/* Autocomplete suggestion message if available */}
            {auto && (
              <Alert severity="info" sx={{ py: 0 }}>
                <AlertTitle>Autocomplete</AlertTitle>
                <em>{auto}</em>
              </Alert>
            )}

            {/* AI-based suggestion message if available */}
            {suggestion && (
              <Alert severity="warning" sx={{ py: 0 }}>
                <AlertTitle>Suggestion</AlertTitle>
                {suggestion}
              </Alert>
            )}

            {/* Add or update task button */}
            <Button
              variant="contained"
              color={editIndex !== null ? "warning" : "primary"}
              onClick={addTask}
              startIcon={editIndex !== null ? <UpdateIcon /> : <AddIcon />}
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {editIndex !== null ? "Update Task" : "Add Task"}
            </Button>
          </Box>

          {/* List of existing tasks */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AssignmentIcon />
              Tasks
              <Chip label={`${tasks.length} items`} size="small" />
            </Typography>

            {/* If no tasks, show an info alert */}
            {tasks.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No tasks yet. Add your first task above!
              </Alert>
            ) : (
              // If tasks exist, render them sorted by priority
              <List sx={{ width: '100%' }}>
                {sortedTasks.map((task, i) => (
                  <React.Fragment key={i}>
                    {/* Each individual task item */}
                    <ListItem
                      sx={{
                        py: 2,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText
                        primary={task.text}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            {/* Show task category */}
                            <Chip
                              label={`Category: ${task.category}`}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                            {/* Show task priority with colored icon */}
                            <Chip
                              label={`Priority: ${task.priority}`}
                              size="small"
                              icon={getPriorityIcon(task.priority)}
                              color={
                                task.priority === "High" ? "error" :
                                task.priority === "Medium" ? "warning" : "success"
                              }
                            />
                          </Box>
                        }
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      {/* Edit and delete task buttons */}
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(i)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(i)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {/* Divider between tasks */}
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Frequently added tasks section */}
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <RepeatIcon />
              Frequent Tasks
            </Typography>

            {/* Show most frequent tasks if available */}
            {frequent.length > 0 ? (
              <List dense>
                {frequent.map((task, i) => (
                  <ListItem
                    key={i}
                    button
                    onClick={() => setInput(task)} // Autofill input when clicked
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText primary={task} />
                  </ListItem>
                ))}
              </List>
            ) : (
              // If no frequent tasks yet
              <Alert severity="info">
                No frequent tasks yet
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>

  );
}

export default TodoList;