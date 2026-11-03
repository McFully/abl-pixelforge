const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class HistoryManager {
  constructor() {
    this.historyPath = path.join(app.getPath('userData'), 'pixelforge_history.json');
    this.records = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.historyPath)) {
        const raw = fs.readFileSync(this.historyPath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
    return [];
  }

  save() {
    try {
      fs.writeFileSync(this.historyPath, JSON.stringify(this.records.slice(0, 500), null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving history:', e);
    }
  }

  addRecord(record) {
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      fileName: record.fileName,
      originalSize: record.originalSize,
      finalSize: record.finalSize,
      savedBytes: record.savedBytes,
      reductionPercent: record.reductionPercent,
      format: record.format,
      mode: record.mode,
      timeTaken: record.timeTaken,
      outputPath: record.outputPath || null,
      isLossless: record.integrity ? record.integrity.isLossless : false
    };
    this.records.unshift(item);
    this.save();
    return item;
  }

  getRecords() {
    return this.records;
  }

  clear() {
    this.records = [];
    this.save();
    return true;
  }

  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    this.save();
    return true;
  }
}

module.exports = HistoryManager;
