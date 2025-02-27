class CSVTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.columns = parseInt(this.getAttribute('cols')) || 3;
    this.maxRows = parseInt(this.getAttribute('maxlength')) || Infinity;
    this.rowsCount = parseInt(this.getAttribute('rows')) || 1; // Configurable initial rows
    this.columnNames = this.getAttribute('column-names')?.split(',') || [];
    this.showHeader = this.getAttribute('show-header') !== 'false';
    this.placeholder = this.getAttribute('placeholder') || '';
    this.readonly = this.hasAttribute('readonly');
    this.disabled = this.hasAttribute('disabled');
    this.rows = Array.from({ length: this.rowsCount }, () => Array(this.columns).fill('')); // Initialize with initial rows
    this.csvVisible = false; // Track visibility state
  }

  connectedCallback() {
    this.render();
    if (this.placeholder && this.rows.length > 0 && this.columns > 0) {
      this.rows[0][0] = this.placeholder;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .csv-table {
          width: 100%;
          border-collapse: collapse;
        }
        .csv-table th, .csv-table td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .csv-table th {
          text-align: left;
          background-color: #f2f2f2;
        }
        .csv-table input {
          width: 100%;
          box-sizing: border-box;
        }
        .csv-button {
          margin-top: 10px;
        }
        #csv-output {
          width: 100%;
          height: 100px;
          margin-top: 10px;
          display: none; /* Initially hidden */
        }
        #fallback-textarea {
          display: none; /* Hidden fallback textarea */
        }
      </style>
      <table class="csv-table">
        <thead id="csv-header" class="csv-header"></thead>
        <tbody id="csv-body" class="csv-body"></tbody>
      </table>
      <button id="add-row" class="csv-button" type="button" ${this.disabled ? 'disabled' : ''}>Add Row</button>
      <button id="view-csv" class="csv-button" type="button" ${this.disabled ? 'disabled' : ''}>View as CSV</button>
      <textarea id="csv-output" readonly placeholder="CSV output will appear here..."></textarea>
      <textarea id="fallback-textarea" name="csv-data"></textarea>
      <noscript>
        <textarea name="csv-data-noscript" placeholder="Enter CSV data here..."></textarea>
      </noscript>
    `;

    this.initializeTable();
    this.setupEventListeners();
  }

  initializeTable() {
    const headerRow = this.shadowRoot.getElementById('csv-header');
    if (this.showHeader) {
      const tr = document.createElement('tr');
      for (let i = 0; i < this.columns; i++) {
        const th = document.createElement('th');
        th.textContent = this.columnNames[i] || `Column ${i + 1}`;
        tr.appendChild(th);
      }
      headerRow.appendChild(tr);
    }
    this.renderTable();
  }

  setupEventListeners() {
    if (this.disabled) return;

    const addRowButton = this.shadowRoot.getElementById('add-row');
    addRowButton.addEventListener('click', () => this.addRow());

    const viewCSVButton = this.shadowRoot.getElementById('view-csv');
    viewCSVButton.addEventListener('click', () => this.toggleCSVView());
  }

  addRow() {
    if (this.rows.length >= this.maxRows) {
      alert('Maximum number of rows reached.');
      return;
    }
    const row = Array(this.columns).fill('');
    this.rows.push(row);
    this.renderTable();
    this.updateFallbackTextarea();

    // Focus the first column of the new row
    const lastRowIndex = this.rows.length - 1;
    const firstCellInput = this.shadowRoot.querySelector(`#csv-body tr:nth-child(${lastRowIndex + 1}) td:first-child input`);
    if (firstCellInput) {
      firstCellInput.focus();
    }
  }

  renderTable() {
    const tbody = this.shadowRoot.getElementById('csv-body');
    tbody.innerHTML = '';
    this.rows.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((cell, colIndex) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell;
        input.readOnly = this.readonly;
        input.disabled = this.disabled;
        input.addEventListener('input', (event) => this.updateCell(rowIndex, colIndex, event.target.value));
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  updateCell(rowIndex, colIndex, value) {
    if (this.readonly || this.disabled) return;
    this.rows[rowIndex][colIndex] = value;
    this.updateFallbackTextarea();
  }

  updateFallbackTextarea() {
    const fallbackTextarea = this.shadowRoot.getElementById('fallback-textarea');
    fallbackTextarea.value = this.serializeToCSV();
  }

  serializeToCSV() {
    const header = this.showHeader ? this.columnNames.join(',') + '\n' : '';
    const rows = this.rows
      .filter(row => row.some(cell => cell.trim() !== '')) // Filter out empty rows
      .map(row =>
        row.map(cell => {
          if (/[,"\n]/.test(cell)) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      ).join('\n');
    return header + rows;
  }

  toggleCSVView() {
    const csvOutput = this.shadowRoot.getElementById('csv-output');
    csvOutput.value = this.serializeToCSV();
    csvOutput.style.display = this.csvVisible ? 'none' : 'block';
    this.csvVisible = !this.csvVisible; // Toggle visibility state
  }

  getCSVData() {
    return this.serializeToCSV();
  }
}

customElements.define('csv-textarea', CSVTextarea);
