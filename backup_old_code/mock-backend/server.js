const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// Mock data
let facilities = [
  { id: 1, name: "Newton Auditorium", type: "LECTURE_HALL", capacity: 500, location: "Block A", availabilityWindows: "08:00-20:00", status: "ACTIVE", description: "Large hall for main lectures." },
  { id: 2, name: "Edison Lab", type: "LAB", capacity: 40, location: "Block B, Room 204", availabilityWindows: "09:00-18:00", status: "ACTIVE", description: "Advanced electrical engineering lab." },
  { id: 3, name: "Einstein Room", type: "MEETING_ROOM", capacity: 12, location: "Block C, 3rd Floor", availabilityWindows: "08:00-22:00", status: "ACTIVE", description: "Small room for group meetings." },
  { id: 4, name: "Projector P-001", type: "EQUIPMENT", capacity: 0, location: "Inventory Room", availabilityWindows: "Always", status: "ACTIVE", description: "Portable Epson 4K Projector." },
  { id: 5, name: "Main Hall Cinema", type: "LECTURE_HALL", capacity: 300, location: "Block A, Basement", availabilityWindows: "08:00-18:00", status: "OUT_OF_SERVICE", description: "Currently under renovation." }
];

// GET /api/facilities
app.get('/api/facilities', (req, res) => {
  const { type, location, minCapacity } = req.query;
  let filtered = [...facilities];

  if (type && type !== 'ALL') {
    filtered = filtered.filter(f => f.type === type);
  }
  if (location) {
    filtered = filtered.filter(f => f.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (minCapacity) {
    filtered = filtered.filter(f => f.capacity >= parseInt(minCapacity));
  }

  res.json(filtered);
});

// GET /api/facilities/:id
app.get('/api/facilities/:id', (req, res) => {
  const facility = facilities.find(f => f.id === parseInt(req.params.id));
  if (facility) res.json(facility);
  else res.status(404).send('Not found');
});

// POST /api/facilities
app.post('/api/facilities', (req, res) => {
  const newFacility = { ...req.body, id: facilities.length + 1 };
  facilities.push(newFacility);
  res.status(201).json(newFacility);
});

// PUT /api/facilities/:id
app.put('/api/facilities/:id', (req, res) => {
  const index = facilities.findIndex(f => f.id === parseInt(req.params.id));
  if (index !== -1) {
    facilities[index] = { ...facilities[index], ...req.body, id: parseInt(req.params.id) };
    res.json(facilities[index]);
  } else {
    res.status(404).send('Not found');
  }
});

// DELETE /api/facilities/:id
app.delete('/api/facilities/:id', (req, res) => {
  facilities = facilities.filter(f => f.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Backend running on http://localhost:${PORT}`);
});
