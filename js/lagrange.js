const boton = document.getElementById('btn-calcular');

boton.addEventListener('click', () => {
  const input_y = document.getElementById('valores-y');
  const input_x = document.getElementById('valores-x');
  const input_inter = document.getElementById('valor-inter');
  const span_resultado = document.getElementById('resultado');
  const res = document.getElementById('res');
  const base = document.getElementById('base');
  const formula = document.getElementById('formula');

  if (validar(input_x, input_y, input_inter)) {
    res.classList.add('d-none');
    base.classList.add('d-none');
    formula.classList.add('d-none');
    return;
  }

  let coordX = input_x.value.split(' ');
  let coordY = input_y.value.split(' ');
  let x = input_inter.value;

  let resultado = lagrange(coordX, coordY, x);
  span_resultado.innerHTML = resultado;

  draw(coordX, coordY, x);

  res.classList.remove('d-none');
  base.classList.remove('d-none');
  formula.classList.remove('d-none');
});

function lagrange(coordX, coordY, x) {
  let suma = 0;
  let prod;

  for (let j = 0; j < coordX.length; j++) {
    prod = 1;
    for (let i = 0; i < coordX.length; i++)
      if (i != j) {
        prod *= (x - coordX[i]) / (coordX[j] - coordX[i]);
      }
    suma += prod * coordY[j];
  }
  return suma;
}

async function draw(cx, cy, x) {
  const base = document.getElementById('base-polinomica');
  const formula = document.getElementById('formula-lagrange');

  base.textContent = '';
  formula.textContent = '';

  base_polinomica(cx, cy, x);
  formula_lagrange(cx, cy, x);

  await MathJax.typesetPromise();
}

function base_polinomica(cx, cy, x) {
  const resultado = document.getElementById('base-polinomica');
  let string;
  let l = '';
  let text;
  let p;
  for (let j = 0; j < cx.length; j++) {
    string = '';
    for (let i = 0; i < cx.length; i++) {
      if (j != i) {
        string += `\\left ( {{x - x_${i}} \\over {x_${j} - x_${i}}}  \\right )`;
      }
    }
    l = `$$ l_${j}(x) = ${string} $$`;
    text = document.createTextNode(l);
    p = document.createElement('p');
    p.appendChild(text);
    resultado.appendChild(p);
  }
}

function formula_lagrange(cx, cy, x) {
  const resultado = document.getElementById('formula-lagrange');
  let string;
  let l = '';
  let text;
  let output;
  let p;
  for (let j = 0; j < cx.length; j++) {
    string = '';
    for (let i = 0; i < cx.length; i++) {
      if (j != i) {
        string += `\\left ( {{x - x_${i}} \\over {x_${j} - x_${i}}}  \\right )`;
      }
    }
    l += `f(x_${j})${string}+`;
  }

  output = `$$ \\begin{aligned} F(x) = ${l.slice(0, -1)} \\end{aligned} $$`;
  text = document.createTextNode(output);
  p = document.createElement('p');
  p.appendChild(text);
  resultado.appendChild(p);

  formula_lagrange_evaluada(cx, cy, x);

  output = `$$ F(${x}) = ${lagrange(cx, cy, x)} $$`;
  text = document.createTextNode(output);
  p = document.createElement('p');
  p.appendChild(text);
  resultado.appendChild(p);
}

function formula_lagrange_evaluada(cx, cy, x) {
  const resultado = document.getElementById('formula-lagrange');
  let string;
  let l = '';
  let text;
  let output;
  let p;
  for (let j = 0; j < cx.length; j++) {
    string = '';
    for (let i = 0; i < cx.length; i++) {
      if (j != i) {
        string += `\\left ( {{${x} - ${cx[i]}} \\over {${cx[j]} - ${cx[i]}}}  \\right )`;
      }
    }
    l += `(${cy[j]})${string}+`;
  }
  output = `$$ F(${x}) = ${l.slice(0, -1)} $$`;
  text = document.createTextNode(output);
  p = document.createElement('p');
  p.appendChild(text);
  resultado.appendChild(p);
}

function validar(input_x, input_y, input_inter) {
  error = document.getElementById('error');
  regex_valores = /^-?(\d+)?(.\d+)?(?:[ ]-?(\d+)?(.\d+)?)*$/;
  regex_inter = /^-?\d+(.\d+)?$/;
  error.innerText = '';
  error.classList.add('d-none');

  if (!regex_valores.test(input_x.value)) {
    error.innerText = 'Valores incorrectos de x ';
    error.classList.remove('d-none');
    return true;
  }
  if (!regex_valores.test(input_y.value)) {
    error.innerText = 'Valores incorrectos de y';
    error.classList.remove('d-none');
    return true;
  }
  if (!regex_inter.test(input_inter.value)) {
    error.innerText = 'Valor incorrecto de interpolacion';
    error.classList.remove('d-none');
    return true;
  }
}

// Mathjax Config
MathJax = {
  chtml: { displayAlign: 'left' },
};
