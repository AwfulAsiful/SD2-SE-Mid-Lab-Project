const shapeSelect = document.getElementById("shapeSelect");
const shapeCard = document.getElementById("shapeCard");
const resultDiv = document.getElementById("result");
const historyList = document.getElementById("historyList");

const shapeData = {
  triangle: {
    label: "Triangle",
    image: "/assests/triangle.png",
    inputs: [
      { label: "Base", id: "base" },
      { label: "Height", id: "height" }
    ],
    calculate: ({ base, height }) => 0.5 * base * height,
    formula: ({ base, height }) => `0.5 × ${base} × ${height}`
  },
  rectangle: {
    label: "Rectangle",
    image: "/assests/rectangle.png",
    inputs: [
      { label: "Length", id: "length" },
      { label: "Width", id: "width" }
    ],
    calculate: ({ length, width }) => length * width,
    formula: ({ length, width }) => `${length} × ${width}`
  },
  square: {
    label: "Square",
    image: "/assests/square.png",
    inputs: [{ label: "Side", id: "side" }],
    calculate: ({ side }) => side * side,
    formula: ({ side }) => `${side} × ${side}`
  },
  pentagon: {
    label: "Pentagon",
    image: "/assests/pentagon.png",
    inputs: [
      { label: "Side Length", id: "side" },
      { label: "Apothem", id: "apothem" }
    ],
    calculate: ({ side, apothem }) => (5 * side * apothem) / 2,
    formula: ({ side, apothem }) => `(5 × ${side} × ${apothem}) / 2`
  },
  circle: {
    label: "Circle",
    image: "/assests/circle.png",
    inputs: [{ label: "Radius", id: "radius" }],
    calculate: ({ radius }) => Math.PI * radius * radius,
    formula: ({ radius }) => `π × ${radius}²`
  }
};

shapeSelect.addEventListener("change", () => {
  const shape = shapeSelect.value;
  resultDiv.textContent = "";
  if (!shape) return (shapeCard.innerHTML = "", shapeCard.style.opacity = 0);

  const data = shapeData[shape];

  shapeCard.innerHTML = `
    <div class="bg-white shadow rounded p-10 animate-fadeIn">
      <h3 class="text-xl font-semibold mb-2">${data.label}</h3>
      <img src="${data.image}" alt="${data.label}" class="w-48 mb-4 rounded" />
      <div id="inputFields" class="space-y-2 mb-4">
        ${data.inputs
      .map(
        (input) => `
          <div>
            <label>${input.label}</label>
            <input type="number" id="${input.id}" class="w-1/3 p-2 border rounded ml-4" />
          </div>`
      )
      .join("")}
      </div>
      <button onclick="calculate('${shape}')" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
        Calculate
      </button>
    </div>
  `;
  shapeCard.style.opacity = 1;
});

function calculate(shape) {
  const data = shapeData[shape];
  const inputValues = {};

  for (const input of data.inputs) {
    const val = parseFloat(document.getElementById(input.id).value);
    if (isNaN(val) || val <= 0) return alert(`Please enter a valid ${input.label}`);
    inputValues[input.id] = val;
  }

  const area = data.calculate(inputValues).toFixed(2);
  const formula = data.formula(inputValues);

  resultDiv.textContent = `Area: ${area} units²`;

  const record = {
    shape: data.label,
    formula,
    result: area,
    timestamp: new Date().toLocaleString()
  };

  saveHistory(record);
  renderHistory();
}

function saveHistory(record) {
  let history = JSON.parse(localStorage.getItem("geoHistory")) || [];
  history.unshift(record);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem("geoHistory", JSON.stringify(history));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("geoHistory")) || [];
  historyList.innerHTML = "";

  history.forEach((item, index) => {
    historyList.innerHTML += `
      <li class="bg-gray-200 rounded p-4 flex justify-between items-start gap-4">
        <div>
          <b>${item.shape}</b>: ${item.result} (${item.formula})
          <br><small>${item.timestamp}</small>
        </div>
        <button onclick="deleteRecord(${index})" class="text-red-600 hover:underline">Delete</button>
      </li>
    `;
  });

  // Show Clear All button only if there are records
  const clearBtn = document.getElementById("clearAllBtn");
  if (clearBtn) {
    clearBtn.style.display = history.length ? "block" : "none";
  }
}
function deleteRecord(index) {
  let history = JSON.parse(localStorage.getItem("geoHistory")) || [];
  history.splice(index, 1);
  localStorage.setItem("geoHistory", JSON.stringify(history));
  renderHistory();
}

function clearAllHistory() {
  localStorage.removeItem("geoHistory");
  renderHistory();
}


renderHistory();
