import { useState, useEffect } from "react";
import { google } from "googleapis";
const privatekey = require("./privatekey.json");

const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Successfully authenticated!");
  // Use the jwtClient to make requests to the Google Sheets API
});

function TaskSheetList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load the Google Sheets API client library
    google.auth
      .getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })
      .then((auth) => {
        const sheets = google.sheets({ version: "v4", auth });

        // Read data from the spreadsheet
        sheets.spreadsheets.values
          .get({
            spreadsheetId: "1LBG6PZxUKHHF1aF_74QXzU29MNO7J9rUUh7ZQOp6-Ko",
            range: "Sheet1!A2:B",
          })
          .then((response) => {
            const rows = response.data.values;
            if (rows.length) {
              const storedTasks = rows.map((row) => ({
                name: row[0],
                completed: row[1] === "TRUE",
              }));
              setTasks(storedTasks);
            }
          });
      });
  }, []);

  useEffect(() => {
    // Load the Google Sheets API client library
    google.auth
      .getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })
      .then((auth) => {
        const sheets = google.sheets({ version: "v4", auth });

        // Write data to the spreadsheet
        const data = tasks.map((task) => [
          task.name,
          task.completed ? "TRUE" : "FALSE",
        ]);
        sheets.spreadsheets.values.update({
          spreadsheetId: "1LBG6PZxUKHHF1aF_74QXzU29MNO7J9rUUh7ZQOp6-Ko",
          range: "Sheet1!A2:B",
          valueInputOption: "USER_ENTERED",
          resource: { values: data },
        });
      });
  }, [tasks]);

  function handleAddTask() {
    const taskName = prompt("Enter task name:");
    if (taskName) {
      setTasks([...tasks, { name: taskName, completed: false }]);
    }
  }

  function handleRemoveTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function handleToggleTask(index) {
    setTasks(
      tasks.map((task, i) => {
        if (i === index) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  }

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(index)}
            />
            {task.name}
            <button onClick={() => handleRemoveTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
}

export default TaskSheetList;
