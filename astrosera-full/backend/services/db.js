const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'alerts.json');

function read() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch { return []; }
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getAll:    ()       => read(),
  getByEmail:(email)  => read().filter(a => a.email === email),
  findOne:   (q)      => read().find(a => a.asteroidId === q.asteroidId && a.email === q.email),
  insert:    (doc)    => { const all = read(); all.push(doc); write(all); return doc; },
  remove:    (q)      => { const filtered = read().filter(a => !(a.asteroidId === q.asteroidId && a.email === q.email)); write(filtered); },
  updateStatus: (id, status) => {
    const all = read().map(a => a.id === id ? { ...a, status } : a);
    write(all);
  },
};
