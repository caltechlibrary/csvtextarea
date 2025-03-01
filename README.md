

# csvtextarea 0.0.3

CSVTextarea is a web component designed to work with tabular data. When you embed the element in a form or web page the innerHTML of the element was be treated as CSV data and then  displayed in a table structure. If you use the component in a web form you may need to handle encoding and submission through the form's submit event handling. CSVTextarea has many attributes in common with a traditional textarea and a textarea can be used as a fall back if JavaScript or components are not available.

The goal of this web component is to provide a simple mechanism for working with multivalued fields that easily map to a simple column and rows representation.

## Release Notes

- version: 0.0.3
- status: wip
- released: 2025-02-28

Working proof of concept. CSVTextarea now supports change event details for cells and the ability retrieve and set individual cell values. Several key combination can now be used to 
edit the table content. Ctrl-a in a cell will select the cell. Ctrl-Right Arrow will select a row. If you press the backspace key when you have text select the selected text will be 
removed. The added clean up button now responds to shift+delete to cleanup the table.


### Authors

- Doiel, R. S.


### Contributors

- Mistral AI


## Software Requirements

- HTML5-compatible browsers

Uses: web browser

## Related resources

- [Getting Help, Reporting bugs](https://github.com/caltechlibrary/csvtextarea/issues)
- [LICENSE](https://caltechlibrary.github.io/csvtextarea/LICENSE)
- [About](about.md)

