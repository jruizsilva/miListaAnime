import { agregarAnimeDB, removerAnimeDB, crearDB } from "./DB.js";

const d = document;

const $result = d.getElementById("result");
const $form = d.getElementById("form");
let paginaActual;
let animesBusqueda = [];

const mostrarPaginador = () => {
	if (d.getElementById("paginador")) {
		d.getElementById("paginador").remove();
	}
	const $template = d.getElementById("templatePaginador").content;
	const $clone = $template.cloneNode(true);
	const $paginadorDiv = $clone.getElementById("paginador");
	$result.insertAdjacentElement("afterend", $paginadorDiv);
};

const mostrarBusqueda = (animes) => {
	animesBusqueda = [...animes];
	const $fragment = d.createDocumentFragment();
	const $template = d.getElementById("templateItem").content;
	animes.forEach((anime) => {
		const { title, image_url, mal_id } = anime;
		$template
			.querySelector(".busqueda__img")
			.setAttribute("src", image_url);
		$template.querySelector(".busqueda__anime").textContent = title;
		$template.querySelector(".busqueda__favorite").dataset.id = mal_id;
		const $clone = $template.cloneNode(true);
		$fragment.appendChild($clone);
	});
	$result.appendChild($fragment);
	$result.querySelector(".spinner").remove();
};

const mostrarSpinner = () => {
	const divSpinner = d.createElement("div");
	divSpinner.classList.add("spinner");
	$result.appendChild(divSpinner);
};

const limpiarHTML = () => {
	while ($result.firstChild) {
		$result.removeChild($result.firstChild);
	}
};

const obtenerAnimes = async () => {
	limpiarHTML();
	mostrarSpinner();
	const anime = $form.anime.value;
	const url = `https://api.jikan.moe/v3/search/anime?page=${paginaActual}&limit=12&q=${anime}`;
	try {
		const result = await fetch(url);
		const listaAnimes = await result.json();
		mostrarBusqueda(listaAnimes.results);
	} catch (err) {
		console.log(err);
	}
};

const buscarAnime = (e) => {
	e.preventDefault();
	paginaActual = 1;
	obtenerAnimes();
	mostrarPaginador();
};

$form.addEventListener("submit", buscarAnime);

d.addEventListener("click", (e) => {
	if (e.target.classList.contains("paginador__link")) {
		const links = d.querySelectorAll(".paginador__link");
		links.forEach((link) => {
			link.classList.remove("paginador__link--active");
		});
		e.target.classList.add("paginador__link--active");
		paginaActual = Number(e.target.dataset.page);
		obtenerAnimes();
	}
	if (e.target.classList.contains("busqueda__favorite")) {
		e.preventDefault();
		const animeID = Number(e.target.dataset.id);
		const anime = animesBusqueda.find((anime) => anime.mal_id === animeID);
		if (e.target.classList.contains("busqueda__favorite--active")) {
			e.target.classList.remove("busqueda__favorite--active");
			removerAnimeDB(anime.mal_id);
		} else {
			e.target.classList.add("busqueda__favorite--active");
			agregarAnimeDB(anime);
		}
	}
});
d.addEventListener("DOMContentLoaded", crearDB);
