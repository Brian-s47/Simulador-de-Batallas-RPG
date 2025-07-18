const inquirer = require('inquirer');
const { v4: uuidv4 } = require('uuid');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

console.log("✅ Inquirer, UUID y LowDB funcionan correctamente");