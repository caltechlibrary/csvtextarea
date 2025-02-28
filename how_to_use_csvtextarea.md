
CSVTextarea
===========

CSVTextarea is a web component. It allows you to enter tabular data directly into a table and submit the results as CSV encoded content. The CSV encoded content is maintained in the innerHTML of the CSVTextarea. You can use a plain textarea embedded in noscript elements as a simple fallback. A "Add Row" button is include to add a row to the bottom of the element. When content is saved to the innerHTML all empty rows are ignored. Due to quirkness of froms if you use the web component you should create an event handler to handle the submission. This can make sure the CSV content in the element is properly obtained and available to be added with the form submission. When each cell looses focus the element will be checked for changes. If the cell change then a change event will be emitted. You can then get the current state of the CSV content.

Features
--------

- Direct table entry with configurable columns and optional maximum rows
- View CSV-encoded content with add row button click
- You can add a row with shift+enter key
- When a new row is added the focus is set to the first cell in the row
- Fallback to a plain textarea if JavaScript is unavailable

Setup
-----

1. Include the Component JavaScript file and make it available to your HTML document
2. Create an HTML file and include the web component in the markup
3. If you're use it in a web form make sure you add a "submit" handle for the form to package up the CSV data to submit along with the rest of the form data.

The web component is contained in a file calleed [csvtextarea.js](csvtextarea.js).

Here is an example of the HTML markup.

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSV Textarea</title>
  <script src="csvtextarea.js" defer></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const csvTextarea = document.querySelector('csv-textarea');

      // Listen for change events on the csv-textarea
      csvTextarea.addEventListener('change', () => {
        console.log('CSV content changed:', csvTextarea.innerHTML);
      });

      // Listen for form submission
      document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        console.log('Form submitted with CSV content:', csvTextarea.innerHTML);
        // Here you can add code to handle the form submission, e.g., send data to a server
      });
    });
  </script>
</head>
<body>
  <form>
    <csv-textarea name="csvData" rows="2" column-headings="Name,Age,City">
      John,30,New York
      Jane,25,Los Angeles
    </csv-textarea>
    <p></p>
    <button type="submit">Submit</button>
  </form>
</body>
</html>
~~~

The web component can be configured using following.

rows
: sets the number of rows used in the table

columns
: sets the number of columns in the table

readonly
: disable data entry

column-headings
: holds a comma separate list of headings

show-headings
: if set to false the column headings are not shown

max-rows
: this sets a limit on the number of rows available

Example:

~~~html
<csv-textarea name="csvData" rows="3" column-headings="Name,Age,City" max-rows="5">
      John,30,New York
      Jane,25,Los Angeles
</csv-textarea>
~~~

Using the Component:

- tabbing should let you step through each cell in each row
- shift+enter key will add a row, the focus will then be set to the first cell of the added row
- empty rows are ignored when updating the innerHTML of the element
- click the "Add Row" button to add a row, focus will be the first cell in the added row

Submitted data:

The Web Component tends to be ignored if you rely on the web browser to assemble the form data for submition to the action URL.  You should add an event handle for the enter form listening for "submit".  When "submit" is fired your handle then can assemble the data in the form and use fetch to submit using the form's method and action.  The csv-textarea also has a "toJSON()" function. This will take the CSV data and turn it into an array of objects where attribute names correspond to the column headings. The can be more convient to work with server side.
