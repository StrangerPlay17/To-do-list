// AI Functions (Simlations) 

// 1. 
// Simulation dictionary of suggestions based on keywords.
// This simulates an AI-like suggestion system by mapping keywords to predefined suggestions.
const keywordMap = {
  clean: "Clean your room or workspace.",
  email: "Respond to important emails.",
  code: "Finish your coding task or project.",
  workout: "Go for a run or hit the gym.",
  buy: "Remember to buy groceries or essentials.",
  study: "Study for exams or read materials.",
  call: "Make important phone calls.",
  read: "Finish reading your book or article.",
};
// Function that suggests a task based on input using simulated AI.
// It looks for known keywords in the user's input and returns a matching suggestion.
export function suggestTask(input) {
  const lower = input.toLowerCase(); // Normalize input to lowercase
  for (const keyword in keywordMap) {
    if (lower.includes(keyword)) {
      return `Suggestion: ${keywordMap[keyword]}`; // Return suggestion if keyword is found
    }
  }
  return "Try adding more context for a better suggestion."; // Default response
}
// ---------------------------------------------------------------------------------------------------------------------------------
// 2.
// Function to classify a task into a category: personal, work, or study.
// It matches input against a list of category-related keywords.
export function classifyTask(input) {
  const categories = {
    personal: ["clean", "gym", "cook", "buy", "read"],
    work: ["email", "report", "meeting", "call", "code"],
    study: ["study", "homework", "exam", "project"],
  };
  const lower = input.toLowerCase();
  for (const category in categories) {
    if (categories[category].some((word) => lower.includes(word))) { // Check if there is a match
      return category; // Return the matched category
    }
  }
  return "general"; // Default if no match
}
// ---------------------------------------------------------------------------------------------------------------------------------
// 3.
// Function to simulate the priority level of a task based on certain keywords.
// Returns a label: "High", "Medium", or "Low".
export function getPriority(task) {
  const lower = task.toLowerCase();
  if (lower.includes("urgent") || lower.includes("asap")) return "High";
  if (lower.includes("today") || lower.includes("soon")) return "Medium";
  return "Low"; // Default priority
}

// ---------------------------------------------------------------------------------------------------------------------------------
// 4.
// List of common tasks used for simple autocomplete functionality.
const commonTasks = [
  "Clean your room",
  "Respond to emails",
  "Buy groceries",
  "Read a book",
  "Do homework",
  "Go to the gym",
];
// Function to suggest a common task that starts with the user's input.
// Returns the first match, or an empty string if none found.
export function autoComplete(input) {
  return (
    commonTasks.find((task) =>
      task.toLowerCase().startsWith(input.toLowerCase())
    ) || ""
  );
}
// ---------------------------------------------------------------------------------------------------------------------------------
// 5.
// Function to simulate tracking frequent tasks using localStorage.
// It counts how many times each task was entered and returns the top 3 most frequent ones.
export function getFrequentTasks() {
  const data = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage
  const count = {};

  data.forEach((taskObj) => {
    const text = typeof taskObj === "string" ? taskObj : taskObj.text;
    const clean = text.toLowerCase();
    count[clean] = (count[clean] || 0) + 1; // Count each occurrence
  });

  // Sort by frequency, take top 3, and return only the task text
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([task]) => task);
}
