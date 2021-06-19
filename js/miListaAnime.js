import { crearDB, removerAnimeDB, animes } from "./DB.js";

const d = document;
const $form = d.querySelector(".form");
const $form__selects = d.querySelectorAll(".form__select");
const $tbody = d.querySelector(".animes tbody");

const objFiltro = {
	estado: "todos",
};

const llenarObjFiltro = (e) => {
	objFiltro[e.target.name] = e.target.value;
};

$form__selects.forEach((el) => {
	el.addEventListener("change", llenarObjFiltro);
});

const limpiarHTML = () => {
	while ($tbody.firstChild) {
		$tbody.removeChild($tbody.firstChild);
	}
};

const mostrarAnimes = (animes) => {
	limpiarHTML();
	const $fragment = d.createDocumentFragment();
	const $template = d.getElementById("templateRow").content;
	animes.forEach((anime) => {
		const { title, image_url, url, mal_id, synopsis, airing } = anime;
		if (airing) {
			$template.querySelector(
				".anime__title"
			).textContent = `${title} - En emision`;
		} else {
			$template.querySelector(
				".anime__title"
			).textContent = `${title} - Finalizado`;
		}
		$template.querySelector(".anime__title").setAttribute("href", url);
		$template
			.querySelector(".anime__title")
			.setAttribute("data-airing", airing);
		$template.querySelector(".anime__description").textContent = synopsis;
		$template.querySelector(".anime__img").src = image_url;
		$template.querySelector(".anime__delete").dataset.id = mal_id;
		const $clone = $template.cloneNode(true);
		$fragment.appendChild($clone);
	});
	$tbody.append($fragment);
};

const filtrarAnimes = (e) => {
	e.preventDefault();
	const { estado } = objFiltro;
	const $animes__th = d.querySelector(".animes__th");
	let texto;
	if (estado === "todos") texto = `Animes agregados`;
	if (estado === "emision") texto = `Animes en emisión`;
	if (estado === "finalizado") texto = `Animes finalizados`;
	$animes__th.textContent = texto;

	const porEstado = (el) => {
		if (estado === "emision") {
			return el.airing === true;
		}
		if (estado === "finalizado") {
			return el.airing === false;
		}
		if (estado === "todos") {
			return el;
		}
	};
	const resultado = animes.filter(porEstado);
	mostrarAnimes(resultado);
};

$form.addEventListener("submit", filtrarAnimes);
d.addEventListener("click", (e) => {
	if (e.target.classList.contains("anime__delete")) {
		const result = confirm("Eliminar anime?");
		if (result) {
			const animeID = Number(e.target.dataset.id);
			removerAnimeDB(animeID);
		}
	}
});
d.addEventListener("DOMContentLoaded", crearDB);
