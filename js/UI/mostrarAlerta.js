const d = document;
const main = d.querySelector(".main");
export const mostrarAlerta = (msj, type) => {
	const divAlerta = d.createElement("div");
	divAlerta.classList.add("alerta");
	divAlerta.textContent = msj;
	if (type === "error") {
		divAlerta.classList.add("error");
	} else {
		divAlerta.classList.add("correcto");
	}
	if (!main.querySelector(".alerta")) {
		main.appendChild(divAlerta);
		setTimeout(() => {
			main.querySelector(".alerta").remove();
		}, 3000);
	}
};
