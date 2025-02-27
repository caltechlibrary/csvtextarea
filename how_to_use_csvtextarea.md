
CSVTextarea
===========

CSVTextarea is a web component. It allows you to enter tabular data directly into a table and submit the results as CSV encoded content. You can use a plain textarea as a simple fallback. A button is included to allow you to view the entered content as CSV before your press submit.

Features
--------

- Direct table entry with configurable columns and optional maximum rows
- View CSV-encoded content with a button click
- Fallback to a plain textarea if JavaScript is unavailable
- Accessible and follows W3C recommendations

Setup
-----

1. Include the Component JavaScript file and make it available to your HTML document
2. Create an HTML file and include the web component module at the bottom using a script element.
3. In your web form in your HTML file include the component markup

The web component is contained in a file calleed "csv-textarea.js".

Here is an example of the HTML markup.

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSV Textarea Test</title>
  <script type="module" src="csv-textarea.js"></script>
</head>
<body>
  <h1>CSV Textarea Test</h1>
  <form>
    <label for="csv-component">Enter CSV Data:</label>
    <csv-textarea id="csv-component" columns="4" max-rows="10"></csv-textarea>
  </form>
</body>
</html>
~~~

The web component can be configured using "columns" and "max-rows".

- Columns: Set the number of columns using the columns attribute.
- Max Rows: Optionally set the maximum number of rows using the max-rows attribute.

Example:

~~~html
<csv-textarea columns="5" max-rows="15"></csv-textarea>
~~~

Using the Component:

Adding Rows: Click the "Add Row" button to add additional rows to the table.
Viewing CSV: Click the "View CSV" button to see the table data as CSV-encoded content in a textarea.
Submitting Data: Fill out the table and submit the form to send the CSV data to the server.

Testing the web compent
-----------------------

An easy way to test the component is to use a local host web server. If you don't have one you can easily create one using [Deno](https://deno.com).

### Server Setup (Optional)

If you want to handle form submissions and view the CSV data on the server side, set up a simple server using Deno:

~~~TypeScript
// server.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const contentTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
};

serve(async (req) => {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);

  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
      console.log("A client connected!");
    });

    socket.addEventListener("message", (event) => {
      if (event.data === "ping") {
        socket.send("pong");
      }
    });

    return response;
  }

  if (url.pathname === "/submit" && req.method === "POST") {
    const formData = await req.formData();
    const csvData = formData.get("csv-data");
    console.log("Received CSV Data:", csvData);
    return new Response("CSV data received", { status: 200 });
  }

  let filePath;
  if (url.pathname === "/") {
    filePath = "index.html";
  } else {
    filePath = url.pathname.substring(1);
  }

  try {
    const file = await Deno.readFile(filePath);
    const contentType = contentTypes[filePath.match(/\.[^.]+$/)[0]] || "text/plain";
    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response("File not found", { status: 404 });
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
});

console.log("Server running on http://localhost:8000");
~~~

Run the server using:

~~~
deno run --allow-net --allow-read server.ts
~~~

Open your browser and navigate to http://localhost:8000.
Interact with the CSVTextarea component to ensure it functions as expected.
