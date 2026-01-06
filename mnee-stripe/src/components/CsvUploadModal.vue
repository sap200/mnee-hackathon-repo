<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <!-- Close button -->
      <button class="close-btn" @click="closeModal">×</button>
      <h2>Upload Product CSV</h2>

      <!-- File input -->
    <label class="file-btn">
        choose file
        <input type="file" @change="handleFileUpload" accept=".csv" />
    </label>

    <span v-if="fileName">{{ fileName }}</span>


      <!-- Drag & drop -->
      <div 
        class="drop-area"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        Drag & Drop CSV here
      </div>

      <!-- Optional: show number of rows parsed -->
      <p v-if="jsonData.length">{{ jsonData.length }} product(s) ready to upload</p>

      <!-- Upload button -->
      <button class="upload-btn" :disabled="!jsonData.length" @click="uploadCsv">
        Upload
      </button>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      jsonData: [],
      fileName: ''

    };
  },
  methods: {
    closeModal() {
      this.jsonData = [];
      this.$emit('close');
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      this.parseCSV(file);
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.parseCSV(file);
    },
    parseCSV(file) {
      if (!file) return;

      this.fileName = file.name;

      const merchantId = localStorage.getItem('merchantId') || '';

      Papa.parse(file, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results) => {
          this.jsonData = results.data.map(row => ({
            merchantId: merchantId,
            productId: row['Product ID'] || '',
            name: row['Name'] || '',
            description: row['Reference'] || '',
            priceAmount: parseFloat(row['Price (tax incl.)'].replace('$', '').trim()) || 0,
            imageURL: row['Image'] || ''
          }));
        },
        error: (err) => console.error('CSV parse error:', err)
      });
    },
    uploadCsv() {
      if (!this.jsonData.length) return;

      // Emit event with JSON data
      this.$emit('csv-loaded', this.jsonData);

      // Clear data and close modal
      this.jsonData = [];
      this.fileName = '';
    }
  }
};
</script>

<style scoped>

.file-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  overflow: hidden;
}

.file-btn:hover {
  background-color: #0069d9;
}

.file-btn input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;   /* hide default input */
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.6);
  display:flex; justify-content:center; align-items:center;
  z-index: 1000;
}
.modal-content {
  background:#fff;
  padding:30px 40px;
  border-radius:12px;
  width:500px;
  max-width:90%;
  position:relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  display:flex;
  flex-direction: column;
  gap:15px;
  align-items: center;
}
.close-btn {
  position:absolute;
  top:10px;
  right:15px;
  border:none;
  background:transparent;
  font-size:28px;
  cursor:pointer;
  color:#555;
  transition: color 0.2s;
}
.close-btn:hover {
  color:red;
}
.drop-area {
  border: 2px dashed #ccc;
  padding: 25px;
  width:100%;
  text-align: center;
  color: #666;
  cursor: pointer;
  border-radius: 8px;
  transition: border 0.2s, background 0.2s;
}
.drop-area:hover {
  border-color: #999;
  background: #f9f9f9;
}
.upload-btn {
  padding: 10px 20px;
  background: #28a745;
  color:#fff;
  border:none;
  border-radius:8px;
  cursor:pointer;
  font-size:16px;
  font-weight:bold;
  transition: background 0.2s;
}
.upload-btn:disabled {
  background:#aaa;
  cursor:not-allowed;
}
.upload-btn:hover:not(:disabled) {
  background:#218838;
}
</style>
